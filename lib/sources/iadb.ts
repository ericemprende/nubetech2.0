import type { Oportunidad } from "@/types";
import type { SourceConnector } from "./types";
import { pick, pickNumber, toIsoDate, avisarUnaVez } from "./normalize";

/**
 * Conector del dataset de Proyectos del BID (Banco Interamericano de
 * Desarrollo), publicado en su portal de datos abiertos vía la API estándar
 * de CKAN (datastore_search).
 * https://data.iadb.org/dataset/idb-projects-dataset
 *
 * Endpoint confirmado:
 * GET https://data.iadb.org/api/action/datastore_search?resource_id=...&limit=N
 *
 * IMPORTANTE — naturaleza distinta a los demás conectores: este dataset lista
 * proyectos ya aprobados/en ejecución del BID (histórico 1960-2025), no
 * convocatorias abiertas para aplicar. Se incluye como fuente de inteligencia
 * (saber qué financia el BID y en qué países/sectores) y todas sus oportunidades
 * entran marcadas como "Por revisar" — no deberían pasar a "Abierta"
 * automáticamente. Las licitaciones activas del BID viven en
 * projectprocurement.iadb.org, que no tiene API confirmada (candidato a
 * scraping en una iteración futura).
 *
 * Tampoco se pudieron confirmar los nombres exactos de columna del dataset
 * desde este entorno (sin salida de red). El conector intenta varias claves
 * candidatas y loggea las columnas reales de la primera fila la primera vez
 * que corre, para ajustar la lista rápidamente una vez se pruebe en un
 * entorno con red (local o ya desplegado).
 */

const RESOURCE_ID_INGLES = "814b7b54-477a-4c25-b3bf-6be05412069d";

export interface IadbOpciones {
  resourceId?: string;
  limit?: number;
}

export const iadbConnector: SourceConnector = {
  id: "iadb",
  nombre: "BID — Dataset de proyectos",
  async fetchOportunidades() {
    return fetchIadb();
  },
};

interface CkanDatastoreResponse {
  success: boolean;
  result?: {
    records: Record<string, unknown>[];
    fields: { id: string; type: string }[];
  };
}

export async function fetchIadb(opciones: IadbOpciones = {}): Promise<Oportunidad[]> {
  const { resourceId = RESOURCE_ID_INGLES, limit = 50 } = opciones;

  const url = new URL("https://data.iadb.org/api/action/datastore_search");
  url.searchParams.set("resource_id", resourceId);
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`BID datastore_search respondió ${res.status} ${res.statusText}`);
  }

  const json: CkanDatastoreResponse = await res.json();
  if (!json.success || !json.result) {
    throw new Error("BID datastore_search no devolvió resultados utilizables.");
  }

  if (json.result.records.length > 0) {
    avisarUnaVez(
      `iadb:${resourceId}`,
      `Columnas reales del dataset BID: ${json.result.fields.map((f) => f.id).join(", ")}`
    );
  }

  return json.result.records.map(mapOportunidad);
}

function mapOportunidad(record: Record<string, unknown>): Oportunidad {
  const numeroProyecto = pick(record, ["Project Number", "project_number", "ProjectNumber"]);
  const nombre = pick(record, ["Project Name", "project_name", "ProjectName"], "Proyecto del BID");
  const pais = pick(record, ["Country", "country"], "Regional (LatAm)");
  const sector = pick(record, ["Sector", "sector"]);
  const monto = pickNumber(record, ["Total Cost", "total_cost", "Approved Amount", "approved_amount"]);
  const fechaAprobacion = pick(record, ["Approval Date", "approval_date"]);
  const estadoProyecto = pick(record, ["Project Status", "project_status", "Status"]);

  return {
    id: `iadb:${numeroProyecto || nombre}`,
    titulo: nombre,
    entidad: "Banco Interamericano de Desarrollo (BID)",
    categoria: sector || "Proyecto de desarrollo (BID)",
    pais,
    montoMin: 0,
    montoMax: monto,
    moneda: "USD",
    apertura: toIsoDate(fechaAprobacion),
    cierre: "",
    // Informativo/histórico, no un llamado abierto — siempre entra a revisión manual.
    estado: "Por revisar",
    descripcion: `Proyecto ${estadoProyecto ? `(${estadoProyecto}) ` : ""}financiado por el BID en ${pais}${
      sector ? `, sector ${sector}` : ""
    }. Dato informativo del histórico de proyectos, no una convocatoria abierta.`,
    requisitos: [],
    fuenteUrl: "https://www.iadb.org/en/project-search",
    fuente: "iadb",
  };
}
