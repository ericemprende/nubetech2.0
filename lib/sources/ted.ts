import type { Oportunidad } from "@/types";
import type { SourceConnector } from "./types";
import { pick, toIsoDate } from "./normalize";

/**
 * Conector de TED (Tenders Electronic Daily) — licitaciones de contratación
 * pública de la Unión Europea. API pública, sin autenticación, confirmada en
 * https://docs.ted.europa.eu/ODS/latest/reuse/search-api.html
 *
 * IMPORTANTE: TED cubre licitaciones/contratación pública general (obras,
 * suministros, servicios), NO las convocatorias de subvención de programas
 * como Horizon Europe — esas viven en el EU Funding & Tenders Portal, que
 * requiere EU Login + PIC para acceso autenticado y cuyo esquema exacto no se
 * pudo confirmar desde este entorno (sin salida de red). Este conector es
 * para licitaciones públicas, no para "becas" o "grants" europeos.
 *
 * Endpoint: POST https://api.ted.europa.eu/v3/notices/search
 * Esquema de request/response verificado contra documentación oficial y un
 * ejemplo de referencia de terceros; aun así, revisar con una llamada real
 * antes de depender de él en producción (algunos nombres de campo de eForms
 * pueden variar según el tipo de aviso).
 */

const SEARCH_URL = "https://api.ted.europa.eu/v3/notices/search";

interface TedNotice {
  "publication-number"?: string;
  "notice-title"?: Record<string, string> | string;
  "buyer-name"?: Record<string, string> | string;
  "buyer-country"?: string;
  "publication-date"?: string;
  deadline?: string;
  "total-value"?: number | string;
  "total-value-cur"?: string;
  [key: string]: unknown;
}

interface TedSearchResponse {
  notices?: TedNotice[];
  totalNoticeCount?: number;
}

export interface TedOpciones {
  /** Sintaxis de búsqueda experta de TED, p. ej. 'FT~"innovación" AND PD>=20260101'. */
  query?: string;
  limit?: number;
}

export const tedConnector: SourceConnector = {
  id: "ted",
  nombre: "TED — Licitaciones públicas de la UE",
  async fetchOportunidades() {
    return fetchTed();
  },
};

function textoMultilingue(valor: Record<string, string> | string | undefined, fallback: string): string {
  if (!valor) return fallback;
  if (typeof valor === "string") return valor;
  return valor.eng || valor.en || Object.values(valor)[0] || fallback;
}

export async function fetchTed(opciones: TedOpciones = {}): Promise<Oportunidad[]> {
  const { query = "PD>=20260101 SORT BY publication-date DESC", limit = 50 } = opciones;

  const res = await fetch(SEARCH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      fields: [
        "publication-number",
        "notice-title",
        "buyer-name",
        "buyer-country",
        "publication-date",
        "deadline",
        "total-value",
        "total-value-cur",
      ],
      limit,
      scope: "ACTIVE",
      paginationMode: "ITERATION",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`TED /v3/notices/search respondió ${res.status} ${res.statusText}`);
  }

  const json: TedSearchResponse = await res.json();
  return (json.notices ?? []).map(mapOportunidad);
}

function mapOportunidad(notice: TedNotice): Oportunidad {
  const id = pick(notice, ["publication-number"]) || JSON.stringify(notice).slice(0, 24);
  const titulo = textoMultilingue(notice["notice-title"], "Licitación pública (UE)");
  const entidad = textoMultilingue(notice["buyer-name"], "Entidad contratante (UE)");
  const cierre = toIsoDate(notice.deadline as string | undefined);
  const monto = Number(notice["total-value"]) || 0;

  return {
    id: `ted:${id}`,
    titulo,
    entidad,
    categoria: "Licitación pública (Unión Europea)",
    pais: (notice["buyer-country"] as string) || "UE",
    montoMin: 0,
    montoMax: monto,
    moneda: (notice["total-value-cur"] as string) || "EUR",
    apertura: toIsoDate(notice["publication-date"] as string | undefined),
    cierre,
    estado: cierre ? (new Date(cierre) > new Date() ? "Abierta" : "Cerrada") : "Por revisar",
    descripcion: `${titulo} — ${entidad}. Ver detalle completo en TED.`,
    requisitos: [],
    fuenteUrl: id ? `https://ted.europa.eu/en/notice/-/detail/${id}` : undefined,
    fuente: "ted",
  };
}
