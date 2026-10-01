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
  sources/              Conectores a APIs externas de convocatorias (ver sección abajo)
types/
  index.ts              Tipos del dominio (Oportunidad, Convocatoria, etc.)
demo/
  index.html            Demo interactiva autocontenida (ver arriba)
scripts/
  test-sources.ts       Prueba de humo de los conectores con fetch simulado (sin red real)
```

Este es un **esqueleto**: las rutas existen, compilan y renderizan con los datos mock, pero varios módulos (Copiloto, Calendario, los 10 sub-módulos del workspace de convocatoria, etc.) están marcados con `TODO` señalando qué falta portar desde la demo. La demo (`/demo/index.html`) es la referencia visual y funcional completa de cada vista.

### Cómo correrlo

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

### Conectores de fuentes externas (`lib/sources`)

Cinco conectores gratuitos que traen oportunidades automáticamente, normalizadas al tipo `Oportunidad`:

| Conector | Fuente | Requiere key |
|---|---|---|
| `grants-gov.ts` | [Grants.gov](https://www.grants.gov/api/api-guide) — subvenciones federales de EE.UU. | No |
| `secop.ts` | [SECOP II / Colombia Compra Eficiente](https://www.colombiacompra.gov.co/transparencia/datos-abiertos) | No (token opcional para más rate) |
| `ted.ts` | [TED](https://docs.ted.europa.eu/api/latest/index.html) — licitaciones públicas de la UE | No |
| `iadb.ts` | [Dataset de proyectos del BID](https://data.iadb.org/dataset/idb-projects-dataset) (histórico, informativo) | No |
| `globalgiving.ts` | [GlobalGiving](https://www.globalgiving.org/api/) | Sí — `GLOBALGIVING_API_KEY` (gratis, registrarse en su web) |

Probarlos:

```bash
npm run test:sources   # corre los 5 conectores contra respuestas simuladas (sin red real)
curl http://localhost:3000/api/oportunidades/sync   # con `npm run dev` corriendo, trae datos reales
```

**Importante — límite de este entorno de desarrollo:** el sandbox donde se escribió este código no tiene salida de red hacia estas APIs (solo npm/GitHub), así que los conectores se validaron con `test:sources` usando respuestas simuladas fieles a la documentación oficial de cada API, pero **no se probaron contra el servidor real**. Antes de confiar en ellos en producción:

- Correr `npm run dev` y pegarle a `/api/oportunidades/sync` desde una máquina con red abierta.
- Revisar especialmente `secop.ts` e `iadb.ts`: no se pudo confirmar el nombre exacto de cada columna de sus datasets (Socrata/CKAN) desde este entorno. Ambos conectores loggean en consola los nombres de columna reales de la primera fila que reciban — usarlos para ajustar la lista de "claves candidatas" en el archivo si no calzan.
- `globalgiving.ts` también usa nombres de campo no verificados en vivo (`title`, `summary`, `organization.name`, `goal`) — ajustar igual tras la primera llamada real.
- `grants-gov.ts` y `ted.ts` sí están verificados contra ejemplos reales de la documentación oficial, con mayor confianza.

Todas las oportunidades nuevas quedan pensadas para entrar como `estado: "Por revisar"` (o el estado que el propio conector infiera) antes de mostrarse como "Abierta" en el dashboard — ver `lib/sources/dedupe.ts` para la lógica de deduplicación entre corridas.

**Pendiente (siguiente paso lógico):** conectar `sincronizarOportunidades()` a un cron real (Vercel Cron o una Supabase Edge Function programada) que llame `/api/oportunidades/sync` periódicamente y persista el resultado en la base de datos, en vez de solo devolverlo como JSON (hoy no hay backend conectado, así que no se guarda nada todavía).

La investigación completa de qué otras plataformas evaluamos (incluyendo las de pago como DevelopmentAid) está documentada en el proyecto de Claude ("convocatorias" → `investigacion-integraciones-fuentes.md`).

### Próximas integraciones (no incluidas aún)

- Backend / base de datos: Supabase (PostgreSQL) — incluyendo persistir lo que traen los conectores de arriba
- IA: OpenAI / Claude / Gemini (para el Copiloto y los Agentes)
- Calendario: Google Calendar
- Pagos: Stripe / PayPal / Mercado Pago
- Autenticación y multiusuario real
