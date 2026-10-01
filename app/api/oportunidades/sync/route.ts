import { NextResponse } from "next/server";
import { sincronizarOportunidades } from "@/lib/sources";

/**
 * Dispara manualmente la sincronización con todas las fuentes externas
 * configuradas y devuelve lo encontrado. Pensado para:
 *   - probarlo a mano durante desarrollo (GET /api/oportunidades/sync),
 *   - conectarlo más adelante a un cron real (Vercel Cron / Supabase Edge
 *     Function) que llame esta misma ruta y persista el resultado en la base
 *     de datos en vez de solo devolverlo.
 *
 * Todavía NO persiste nada (no hay backend conectado en este esqueleto) — por
 * ahora solo agrega, normaliza y deduplica en memoria. El TODO de guardar en
 * Supabase (con las oportunidades nuevas entrando en estado "Por revisar")
 * queda documentado en README.md.
 */
export async function GET() {
  const { oportunidades, resultados } = await sincronizarOportunidades();

  return NextResponse.json({
    sincronizadoEn: new Date().toISOString(),
    totalOportunidades: oportunidades.length,
    resultadosPorFuente: resultados,
    oportunidades,
  });
}
