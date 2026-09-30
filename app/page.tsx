import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONVOCATORIAS, OPORTUNIDADES } from "@/lib/mock-data";

/**
 * Dashboard — vista general con KPIs, próximos vencimientos y actividad reciente.
 * Puerto inicial del `DashboardView` de la demo (ver /demo/index.html), usando
 * los mismos datos mock a través de lib/mock-data.ts en vez de estar embebidos.
 */
export default function DashboardPage() {
  const activas = CONVOCATORIAS.length;
  const abiertas = OPORTUNIDADES.filter((o) => o.estado === "Abierta").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Panel principal</h1>
        <p className="text-sm text-muted-foreground">
          Resumen de tus convocatorias y oportunidades activas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Convocatorias en curso</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-display font-semibold">
            {activas}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Oportunidades abiertas</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-display font-semibold">
            {abiertas}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Próximo cierre</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            TODO: calcular a partir de CONVOCATORIAS/OPORTUNIDADES
          </CardContent>
        </Card>
      </div>

      {/* TODO: portar MiniCalendar, ActivityFeed y TasksPanel de la demo */}
    </div>
  );
}
