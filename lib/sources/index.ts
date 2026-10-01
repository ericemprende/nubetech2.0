import type { Oportunidad } from "@/types";
import type { ResultadoConector, SourceConnector } from "./types";
import { deduplicarOportunidades } from "./dedupe";
import { grantsGovConnector } from "./grants-gov";
import { secopConnector } from "./secop";
import { tedConnector } from "./ted";
import { iadbConnector } from "./iadb";
import { globalGivingConnector } from "./globalgiving";

export * from "./types";
export * from "./dedupe";
export * from "./grants-gov";
export * from "./secop";
export * from "./ted";
export * from "./iadb";
export * from "./globalgiving";

/**
 * Todos los conectores gratuitos disponibles hoy. GlobalGiving requiere
 * GLOBALGIVING_API_KEY configurada (ver .env.example); sin ella, ese
 * conector simplemente reporta error y los demás siguen funcionando.
 */
export const CONECTORES: SourceConnector[] = [
  grantsGovConnector,
  secopConnector,
  tedConnector,
  iadbConnector,
  globalGivingConnector,
];

export interface ResultadoSincronizacion {
  oportunidades: Oportunidad[];
  resultados: ResultadoConector[];
}

/**
 * Corre todos los conectores en paralelo. Un conector que falla (red caída,
 * cambio de esquema, falta de API key) no tumba a los demás — su error queda
 * reportado en `resultados` para mostrarlo en el dashboard o en logs.
 */
export async function sincronizarOportunidades(
  conectores: SourceConnector[] = CONECTORES
): Promise<ResultadoSincronizacion> {
  const corridas = await Promise.allSettled(
    conectores.map((c) => c.fetchOportunidades())
  );

  const oportunidades: Oportunidad[] = [];
  const resultados: ResultadoConector[] = [];

  corridas.forEach((resultado, i) => {
    const conector = conectores[i];
    if (resultado.status === "fulfilled") {
      oportunidades.push(...resultado.value);
      resultados.push({ fuente: conector.id, ok: true, cantidad: resultado.value.length });
    } else {
      const error =
        resultado.reason instanceof Error ? resultado.reason.message : String(resultado.reason);
      resultados.push({ fuente: conector.id, ok: false, cantidad: 0, error });
    }
  });

  return { oportunidades: deduplicarOportunidades(oportunidades), resultados };
}
