import type { Oportunidad } from "@/types";
import type { SourceConnector } from "./types";
import { pick, pickNumber, toIsoDate, avisarUnaVez } from "./normalize";

/**
 * Conector de SECOP II (procesos de contratación pública en Colombia), vía la
 * plataforma de datos abiertos Socrata en datos.gov.co.
 * https://www.colombiacompra.gov.co/transparencia/datos-abiertos
 *
 * Mecánica de la API (SODA/Socrata) confirmada y estándar en todo datos.gov.co:
 * GET https://www.datos.gov.co/resource/{dataset-id}.json?$limit=N&$order=campo DESC
 * Token de aplicación opcional vía header X-App-Token (sube el límite de rate,
 * no es obligatorio para volúmenes bajos). Ver https://dev.socrata.com/docs/app-tokens.html
 *
 * IMPORTANTE — a verificar antes de usar en producción: los nombres exactos de
 * columna de este dataset (p. ej. si el campo se llama "nombre_entidad" o
 * "entidad", "fecha_de_publicacion_del" o "fecha_publicacion", etc.) NO se
 * pudieron confirmar desde este entorno porque no tiene salida de red hacia
 * datos.gov.co. Socrata convierte el encabezado humano de cada columna a
 * snake_case automáticamente, así que puede variar. Este conector:
 *   1. intenta varias claves candidatas razonables por campo,
 *   2. si ninguna coincide, deja el campo vacío/0 y loggea una sola vez los
 *      nombres de columna reales de la primera fila para poder ajustar la
 *      lista de candidatos rápidamente.
 * Dataset usado por defecto: "PROCESOS SECOP II" (id isgz-hpk3). Cambiarlo es
 * tan simple como pasar otro `datasetId` (p. ej. el de SECOP I si se necesita).
 */

const DATASET_PROCESOS_SECOP_II = "isgz-hpk3";

export interface SecopOpciones {
  datasetId?: string;
  limit?: number;
  /** Token de aplicación Socrata opcional (sube el límite de peticiones). */
  appToken?: string;
}

export const secopConnector: SourceConnector = {
  id: "secop",
  nombre: "SECOP II — Colombia Compra Eficiente",
  async fetchOportunidades() {
    return fetchSecop();
  },
};

export async function fetchSecop(opciones: SecopOpciones = {}): Promise<Oportunidad[]> {
  const {
    datasetId = DATASET_PROCESOS_SECOP_II,
    limit = 50,
    appToken = process.env.SOCRATA_APP_TOKEN,
  } = opciones;

  const url = new URL(`https://www.datos.gov.co/resource/${datasetId}.json`);
  url.searchParams.set("$limit", String(limit));
  url.searchParams.set("$order", ":id DESC"); // más recientes primero, sin asumir nombre de columna de fecha

  const headers: Record<string, string> = {};
  if (appToken) headers["X-App-Token"] = appToken;

  const res = await fetch(url.toString(), { headers, cache: "no-store" });
  if (!res.ok) {
    throw new Error(`SECOP (datos.gov.co) respondió ${res.status} ${res.statusText}`);
  }

  const rows: Record<string, unknown>[] = await res.json();

  if (rows.length > 0) {
    avisarUnaVez(
      `secop:${datasetId}`,
      `Columnas reales del dataset ${datasetId}: ${Object.keys(rows[0]).join(", ")}`
    );
  }

  return rows.map((row) => mapOportunidad(row, datasetId));
}

function mapOportunidad(row: Record<string, unknown>, datasetId: string): Oportunidad {
  const idProceso = pick(row, ["id_del_proceso", "proceso_de_compra", "id_proceso", ":id"]);
  const entidad = pick(
    row,
    ["nombre_entidad", "entidad", "nombre_de_la_entidad"],
    "Entidad pública (Colombia)"
  );
  const descripcion = pick(row, [
    "descripci_n_del_procedimiento",
    "descripcion_del_procedimiento",
    "objeto_del_proceso",
    "descripcion",
  ]);
  const fechaPublicacion = pick(row, [
    "fecha_de_publicacion_del",
    "fecha_de_publicacion",
    "fecha_publicacion",
  ]);
  const fechaCierre = pick(row, [
    "fecha_de_recepcion_de",
    "fecha_de_recepcion_de_respuestas",
    "fecha_cierre",
    "fecha_de_cierre_del_proceso",
  ]);
  const valor = pickNumber(row, [
    "precio_base",
    "valor_total_adjudicacion",
    "valor_del_contrato",
  ]);
  const urlProceso = pick(row, ["urlproceso", "url_proceso", "urlproceso.url"]);
  const estadoRaw = pick(row, ["estado_del_procedimiento", "estado_proceso", "fase"]);

  return {
    id: `secop:${idProceso || `${datasetId}:${JSON.stringify(row).slice(0, 40)}`}`,
    titulo: descripcion || "Proceso de contratación SECOP II",
    entidad,
    categoria: "Contratación pública (Colombia)",
    pais: "Colombia",
    montoMin: 0,
    montoMax: valor,
    moneda: "COP",
    apertura: toIsoDate(fechaPublicacion),
    cierre: toIsoDate(fechaCierre),
    estado: mapEstado(estadoRaw),
    descripcion: descripcion || "Ver detalle completo en SECOP II.",
    requisitos: [],
    fuenteUrl: urlProceso || "https://www.colombiacompra.gov.co/",
    fuente: "secop",
  };
}

function mapEstado(estadoRaw: string): Oportunidad["estado"] {
  const normalizado = estadoRaw.toLowerCase();
  if (!normalizado) return "Por revisar";
  if (normalizado.includes("convocad") || normalizado.includes("public") || normalizado.includes("abiert")) {
    return "Abierta";
  }
  if (normalizado.includes("cerrad") || normalizado.includes("adjudicad") || normalizado.includes("liquidad")) {
    return "Cerrada";
  }
  return "Por revisar";
}
