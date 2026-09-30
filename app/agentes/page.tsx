import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AGENTES } from "@/lib/mock-data";

/** Biblioteca de Agentes IA — puerto inicial de `AgentsView`. */
export default function AgentesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Agentes IA</h1>
        <p className="text-sm text-muted-foreground">
          Agentes especializados disponibles para ayudarte en cada etapa de la propuesta.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {AGENTES.map((agente) => (
          <Card key={agente.id}>
            <CardHeader>
              <CardTitle>{agente.nombre}</CardTitle>
              <p className="text-xs text-muted-foreground">{agente.especialidad}</p>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {agente.descripcion}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
