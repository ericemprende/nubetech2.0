import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CONVOCATORIAS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

/**
 * Workspace de una convocatoria — puerto inicial de `WorkspaceDetailView`.
 * Los 10 módulos de la demo (info, cronograma, documentos, checklist, equipo,
 * tareas, presupuesto, evidencias, evaluación IA, historial) se implementan
 * como pestañas/componentes bajo components/convocatoria/* — quedan como TODO,
 * salvo un resumen mínimo aquí para dejar la ruta funcional.
 */
export default function ConvocatoriaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const convocatoria = CONVOCATORIAS.find((c) => c.id === params.id);
  if (!convocatoria) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-semibold">{convocatoria.titulo}</h1>
          <p className="text-sm text-muted-foreground">{convocatoria.entidad}</p>
        </div>
        <Badge variant="muted">{convocatoria.estado}</Badge>
      </div>

      <div className="text-sm text-muted-foreground">
        Progreso: {convocatoria.progreso}% · Vence: {formatDate(convocatoria.fechaLimite)}
      </div>

      {/*
        TODO: módulos como pestañas —
        Info | Cronograma | Documentos | Checklist | Equipo | Tareas |
        Presupuesto | Evidencias | Evaluación IA | Historial
        Cada uno como components/convocatoria/module-*.tsx, portado desde
        Module* en /demo/index.html (app-part2.jsx).
      */}
    </div>
  );
}
