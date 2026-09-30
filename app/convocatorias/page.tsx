import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONVOCATORIAS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

/**
 * Mis convocatorias — listado de proyectos en gestión (workspaces).
 * Puerto inicial de `WorkspaceListView` de la demo.
 */
export default function ConvocatoriasPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Mis convocatorias</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona el ciclo de vida completo de cada convocatoria a la que aplicas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CONVOCATORIAS.map((c) => (
          <Link key={c.id} href={`/convocatorias/${c.id}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="leading-snug">{c.titulo}</CardTitle>
                  <Badge variant="muted">{c.estado}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{c.entidad}</p>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${c.progreso}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{c.progreso}% completado</span>
                  <span>Vence: {formatDate(c.fechaLimite)}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
