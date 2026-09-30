import { Card, CardContent } from "@/components/ui/card";
import { NOTIFICACIONES } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

/** Centro de notificaciones — puerto inicial de `NotificationsView`. */
export default function NotificacionesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Notificaciones</h1>
        <p className="text-sm text-muted-foreground">
          Alertas del sistema, recordatorios, avisos de IA y actividad del equipo.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {NOTIFICACIONES.map((n) => (
          <Card key={n.id}>
            <CardContent className="flex items-center justify-between p-4 text-sm">
              <div>
                <p className="font-medium">{n.titulo}</p>
                <p className="text-muted-foreground">{n.detalle}</p>
              </div>
              <span className="text-xs text-muted-foreground">{formatDate(n.fecha)}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
