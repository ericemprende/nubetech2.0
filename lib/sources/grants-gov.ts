import type { Oportunidad } from "@/types";
import type { SourceConnector } from "./types";
import { toIsoDate } from "./normalize";

/**
 * Conector de Grants.gov (subvenciones del gobierno federal de EE.UU.).
 * API pública, sin autenticación, documentada en https://www.grants.gov/api/api-guide
 *
 * Endpoint y esquema verificados contra la documentación oficial:
 * - POST https://api.grants.gov/v1/api/search2
 * - Respuesta: { errorcode, msg, data: { hitCount, oppHits: [...] } }
 *
 * Nota: search2 NO trae descripción completa ni montos (awardCeiling/awardFloor);
 * esos solo están disponibles vía fetchOpportunity (ver fetchOpportunityDetalle
 * más abajo), que conviene llamar bajo demanda (p. ej. al abrir el detalle en el
 * dashboard) en vez de una vez por cada resultado de búsqueda.
 */

const SEARCH_URL = "https://api.grants.gov/v1/api/search2";
const FETCH_OPPORTUNITY_URL = "https://api.grants.gov/v1/api/fetchOpportunity";

interface GrantsGovOppHit {
  id: string;
  number: string;
  title: string;
  agencyCode?: string;
  agencyName?: string;
  openDate?: string; // MM/DD/YYYY
  closeDate?: string; // MM/DD/YYYY o "" si no aplica (p. ej. forecasted)
  oppStatus?: "posted" | "forecasted" | "closed" | string;
  docType?: string;
  alnist?: string[];
}

interface GrantsGovSearchResponse {
  errorcode: number;
  msg: string;
  data?: {
    hitCount: number;
    oppHits: GrantsGovOppHit[];
  };
}

function mapEstado(oppStatus: string | undefined): Oportunidad["estado"] {
  switch (oppStatus) {
    case "posted":
      return "Abierta";
    case "forecasted":
      return "Próxima";
    case "closed":
      return "Cerrada";
    default:
      return "Por revisar";
  }
}

function mapOportunidad(hit: GrantsGovOppHit): Oportunidad {
  return {
    id: `grantsgov:${hit.id}`,
    titulo: hit.title,
    entidad: hit.agencyName || hit.agencyCode || "Agencia federal de EE.UU.",
    categoria: "Subvención federal (EE.UU.)",
    pais: "Estados Unidos",
    // search2 no trae montos — se completan si se enriquece con fetchOpportunityDetalle.
    montoMin: 0,
    montoMax: 0,
    moneda: "USD",
    apertura: toIsoDate(hit.openDate),
    cierre: toIsoDate(hit.closeDate),
    estado: mapEstado(hit.oppStatus),
    descripcion: `${hit.title} — publicada por ${hit.agencyName || hit.agencyCode || "una agencia federal"}. Ver detalle completo en Grants.gov.`,
    requisitos: [],
    fuenteUrl: `https://www.grants.gov/search-results-detail/${hit.id}`,
    fuente: "grants.gov",
  };
}

export interface GrantsGovOpciones {
  /** Texto libre a buscar (opcional). */
  keyword?: string;
  /** Cuántos resultados traer (Grants.gov pagina de a `rows`). */
  rows?: number;
  /** "forecasted|posted" trae próximas + abiertas; usa "posted" para solo abiertas. */
  oppStatuses?: string;
}

export const grantsGovConnector: SourceConnector = {
  id: "grants.gov",
  nombre: "Grants.gov (EE.UU.)",
  async fetchOportunidades() {
    return fetchGrantsGov();
  },
};

export async function fetchGrantsGov(
  opciones: GrantsGovOpciones = {}
): Promise<Oportunidad[]> {
  const { keyword = "", rows = 50, oppStatuses = "forecasted|posted" } = opciones;

  const res = await fetch(SEARCH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      keyword,
      rows,
      oppStatuses,
      startRecordNum: 0,
    }),
    // Esta API es pública/sin auth; no se necesitan credenciales.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Grants.gov search2 respondió ${res.status} ${res.statusText}`);
  }

  const json: GrantsGovSearchResponse = await res.json();
  if (json.errorcode !== 0 || !json.data) {
    throw new Error(`Grants.gov search2 devolvió error: ${json.msg}`);
  }

  return json.data.oppHits.map(mapOportunidad);
}

/**
 * Enriquece una oportunidad puntual con los datos que search2 no trae
 * (descripción completa, awardCeiling/awardFloor). Pensado para llamarse
 * bajo demanda, no en bulk, dado el costo de una llamada por oportunidad.
 */
export async function fetchOpportunityDetalle(opportunityId: string | number) {
  const res = await fetch(FETCH_OPPORTUNITY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ opportunityId: Number(opportunityId) }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Grants.gov fetchOpportunity respondió ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errorcode !== 0 || !json.data) {
    throw new Error(`Grants.gov fetchOpportunity devolvió error: ${json.msg}`);
  }

  const synopsis = json.data.synopsis ?? {};
  return {
    descripcionCompleta: synopsis.synopsisDesc as string | undefined,
    montoMin: Number(synopsis.awardFloor) || 0,
    montoMax: Number(synopsis.awardCeiling) || 0,
  };
}
