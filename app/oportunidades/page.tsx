import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OPORTUNIDADES } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

/**
 * Oportunidades — listado filtrable de convocatorias disponibles para aplicar.
 * Puerto inicial de `OpportunitiesView` de la demo. Los filtros por categoría,
 * país, monto, etc. (FILTER_GROUPS en la demo) quedan como TODO.
 */
export default function OportunidadesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Oportunidades</h1>
        <p className="text-sm text-muted-foreground">
          Explora convocatorias de financiamiento disponibles.
        </p>
      </div>

      {/* TODO: portar FilterGroup / FILTER_GROUPS de la demo */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {OPORTUNIDADES.map((op) => (
          <Card key={op.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="leading-snug">{op.titulo}</CardTitle>
                <Badge variant={op.estado === "Cierra pronto" ? "default" : "muted"}>
                  {op.estado}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{op.entidad}</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <p className="text-muted-foreground">{op.descripcion}</p>
              <div className="flex items-center justify-between text-xs">
                <span>
                  {formatCurrency(op.montoMin, op.moneda)} – {formatCurrency(op.montoMax, op.moneda)}
                </span>
                <span>Cierra: {formatDate(op.cierre)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
