# Demo interactivo

Este archivo (`index.html`) es una demo autocontenida y totalmente interactiva de Nubeletech 2.0, construida con React 18 + Babel Standalone + Tailwind CSS (todo cargado vía CDN, sin build step). Usa datos de ejemplo (mock data) para representar el alcance completo del MVP:

- Dashboard
- Oportunidades
- Mis convocatorias (workspace con 10 módulos: info, cronograma, documentos, checklist, equipo, tareas, presupuesto, evidencias, evaluación IA, historial)
- Copiloto Inteligente IA
- Biblioteca de Agentes IA
- Calendario y recordatorios
- Centro de notificaciones
- Gestión de usuarios
- Plan / facturación (modelo SaaS)

Incluye modo claro/oscuro y es responsive (funciona en móvil).

## Cómo verlo

**Opción rápida:** ábrelo directamente en tu navegador. GitHub no ejecuta HTML con JS en la vista previa del repo, así que:

1. Descarga o clona el repo.
2. Abre `demo/index.html` con doble clic (o `open demo/index.html` / `start demo/index.html`), o sírvelo con cualquier servidor estático, por ejemplo:
   ```bash
   npx serve demo
   ```

También puedes verlo publicado como Claude Artifact aquí: https://claude.ai/artifact/BjMuvHAjbox9gehTrctH7x

## Por qué es solo un HTML

Esta demo es intencionalmente un solo archivo sin dependencias instaladas (todo vía CDN) para que cualquiera pueda abrirla sin configurar nada. El código "real" del producto — con TypeScript, componentes reutilizables, backend, autenticación, etc. — vive en `/app` en la raíz del repo, como el esqueleto del proyecto Next.js que reemplazará esta demo.
