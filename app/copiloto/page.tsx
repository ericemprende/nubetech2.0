/**
 * Copiloto Inteligente IA — chat asistido para formular propuestas ganadoras.
 * Puerto pendiente de `CopilotView` / `COPILOT_SCRIPT` de la demo.
 * Aquí conectará con el proveedor de IA real (OpenAI/Claude/Gemini) vía una
 * API route (app/api/copiloto/route.ts) en vez del guion simulado de la demo.
 */
export default function CopilotoPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-display text-2xl font-semibold">Copiloto IA</h1>
      <p className="text-sm text-muted-foreground">
        TODO: portar la interfaz de chat de la demo y conectarla a un proveedor de IA real.
      </p>
    </div>
  );
}
