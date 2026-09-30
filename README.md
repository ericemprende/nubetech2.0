# Nubeletech 2.0

Plataforma para descubrir convocatorias de financiamiento (subvenciones, fondos, concursos), organizar el ciclo de vida completo de cada aplicación, y usar agentes de IA como copiloto para formular propuestas ganadoras.

Este repositorio tiene dos partes:

## 1. `/demo` — Demo interactiva (lista para ver ahora)

Un archivo HTML autocontenido con una demo completamente funcional del MVP (con datos de ejemplo), sin necesidad de instalar nada. Cubre las 9 áreas del blueprint: Dashboard, Oportunidades, Gestión de Convocatorias (10 módulos), Copiloto IA, Biblioteca de Agentes IA, Calendario, Notificaciones, Usuarios y Plan/Facturación.

Ábrela con doble clic en `demo/index.html`, o mira la versión publicada aquí: https://claude.ai/artifact/BjMuvHAjbox9gehTrctH7x

Ver `demo/README.md` para más detalle.

## 2. Raíz del repo — Esqueleto del proyecto real (Next.js)

El resto del repositorio es el esqueleto del producto real, siguiendo el stack definido en el blueprint:

- **Next.js 14 (App Router)** + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix UI + `class-variance-authority`)
- **Lucide React** para iconografía
- **React Hook Form** + **Zod** para formularios y validación
- **TanStack Query** para estado de datos remotos
- **Framer Motion** para animaciones
- **Recharts** para gráficos

### Estructura

```
app/                    Rutas (App Router), una carpeta por módulo del blueprint
  page.tsx              Dashboard
  oportunidades/        Buscador de convocatorias
  convocatorias/        Mis convocatorias (lista + [id] = workspace de una convocatoria)
  copiloto/             Copiloto Inteligente IA
  agentes/              Biblioteca de Agentes IA
  calendario/           Calendario y recordatorios
  notificaciones/       Centro de notificaciones
  usuarios/             Gestión de usuarios
  plan/                 Plan y facturación (modelo SaaS)
components/
  ui/                   Primitivos estilo shadcn/ui (Button, Card, Badge, ...)
  layout/               AppShell, Sidebar/nav (NAV_ITEMS)
  providers.tsx         TanStack Query provider
lib/
  mock-data.ts          Datos de ejemplo (reemplazar por backend real)
  utils.ts              Helpers (cn, formatCurrency, formatDate, daysUntil)
types/
  index.ts              Tipos del dominio (Oportunidad, Convocatoria, etc.)
demo/
  index.html            Demo interactiva autocontenida (ver arriba)
```

Este es un **esqueleto**: las rutas existen, compilan y renderizan con los datos mock, pero varios módulos (Copiloto, Calendario, los 10 sub-módulos del workspace de convocatoria, etc.) están marcados con `TODO` señalando qué falta portar desde la demo. La demo (`/demo/index.html`) es la referencia visual y funcional completa de cada vista.

### Cómo correrlo

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

### Próximas integraciones (no incluidas aún)

- Backend / base de datos: Supabase (PostgreSQL)
- IA: OpenAI / Claude / Gemini (para el Copiloto y los Agentes)
- Calendario: Google Calendar
- Pagos: Stripe / PayPal / Mercado Pago
- Autenticación y multiusuario real
