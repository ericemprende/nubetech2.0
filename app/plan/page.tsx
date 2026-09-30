import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PLANES } from "@/lib/mock-data";

/**
 * Plan y facturación — puerto inicial de `BillingView` (modelo de negocio SaaS).
 * Integración futura de cobro: Stripe / PayPal / Mercado Pago.
 */
export default function PlanPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Plan y facturación</h1>
        <p className="text-sm text-muted-foreground">
          Elige el plan que mejor se ajuste a tu volumen de convocatorias.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PLANES.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.nombre}</CardTitle>
              <p className="font-display text-2xl font-semibold">
                {plan.precioMensual === 0 ? "Gratis" : `US$${plan.precioMensual}/mes`}
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                {plan.caracteristicas.map((c) => (
                  <li key={c}>• {c}</li>
                ))}
              </ul>
              <Button variant="outline">Elegir {plan.nombre}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
