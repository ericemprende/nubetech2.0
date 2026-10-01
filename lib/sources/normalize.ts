/**
 * Helpers compartidos por los conectores: normalización defensiva de campos
 * cuyo nombre exacto puede variar entre respuestas reales de la fuente (muy
 * común en datasets de datos abiertos, donde el nombre de columna depende de
 * cómo lo tituló cada entidad publicadora).
 */

/** Devuelve el primer valor no vacío entre varias claves candidatas de un objeto. */
export function pick(
  record: Record<string, unknown>,
  candidates: string[],
  fallback: string = ""
): string {
  for (const key of candidates) {
    const value = record[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return fallback;
}

/** Igual que pick, pero intenta convertir a número (quitando separadores de miles). */
export function pickNumber(
  record: Record<string, unknown>,
  candidates: string[],
  fallback: number = 0
): number {
  const raw = pick(record, candidates, "");
  if (!raw) return fallback;
  const cleaned = raw.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/** Convierte una fecha en varios formatos comunes (MM/DD/YYYY, YYYY-MM-DD, etc.) a ISO (YYYY-MM-DD). */
export function toIsoDate(value: string | undefined | null): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  // YYYY-MM-DD ya viene bien formado (o con hora, la recortamos).
  const isoMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) return isoMatch[1];

  // MM/DD/YYYY (formato típico de Grants.gov).
  const usMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (usMatch) {
    const [, mm, dd, yyyy] = usMatch;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return "";
}

/** Log de una sola vez por clave — útil para avisar en consola de campos sin mapear sin saturar el log. */
const avisosYaEmitidos = new Set<string>();
export function avisarUnaVez(clave: string, mensaje: string) {
  if (avisosYaEmitidos.has(clave)) return;
  avisosYaEmitidos.add(clave);
  console.warn(`[conectores] ${mensaje}`);
}
