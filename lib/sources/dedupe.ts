import type { Oportunidad } from "@/types";

/**
 * Quita duplicados entre varias corridas/fuentes. Como cada conector ya
 * genera un id estable con prefijo de fuente (p. ej. "grantsgov:219999"),
 * basta con quedarnos con la primera ocurrencia de cada id. Si una misma
 * oportunidad llegara a aparecer bajo dos fuentes distintas (poco común,
 * pero posible si dos plataformas listan la misma licitación), un segundo
 * paso agrupa por título + entidad + fecha de cierre normalizados.
 */
export function deduplicarOportunidades(oportunidades: Oportunidad[]): Oportunidad[] {
  const porId = new Map<string, Oportunidad>();
  for (const op of oportunidades) {
    if (!porId.has(op.id)) porId.set(op.id, op);
  }

  const vistos = new Set<string>();
  const resultado: Oportunidad[] = [];
  for (const op of porId.values()) {
    const clave = `${op.titulo.trim().toLowerCase()}|${op.entidad.trim().toLowerCase()}|${op.cierre}`;
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    resultado.push(op);
  }

  return resultado;
}
