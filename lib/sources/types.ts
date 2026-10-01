import type { Oportunidad } from "@/types";

/**
 * Contrato común que implementa cada conector de fuente externa.
 * Cada conector sabe cómo hablar con UNA plataforma y devolver sus
 * oportunidades ya normalizadas al tipo Oportunidad del dominio.
 */
export interface SourceConnector {
  /** Id corto y estable de la fuente (prefijo del id externo, p. ej. "grantsgov"). */
  id: string;
  /** Nombre legible para mostrar en el dashboard / logs. */
  nombre: string;
  /** Trae las oportunidades más recientes, normalizadas. Debe lanzar en caso de error de red/formato. */
  fetchOportunidades(): Promise<Oportunidad[]>;
}

/** Resultado de correr un conector dentro del agregador — nunca lanza, captura el error. */
export interface ResultadoConector {
  fuente: string;
  ok: boolean;
  cantidad: number;
  error?: string;
}
