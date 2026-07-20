# Project Structure

## Application Tree

```text
.
|-- app/
|   |-- (auth)/                 Public Clerk UI routes
|   |-- (dashboard)/            Protected dashboard and workflow editor
|   |-- api/                    Liveblocks and replay route handlers
|   |-- globals.css             Tailwind theme and global styles
|   `-- layout.tsx              Root providers and fonts
|-- components/
|   |-- app-sidebar.tsx         Server-rendered organization/workflow sidebar
|   |-- theme-provider.tsx      Theme state and keyboard toggle
|   `-- ui/                     shadcn/Base UI/Radix primitives
|-- features/workflows/
|   |-- actions.ts              Authenticated workflow Server Actions
|   |-- data.ts                 Drizzle workflow queries
|   |-- components/             Editor, console, replay, and providers
|   |-- hooks/                  Plan and graph-derived hooks
|   |-- lib/                    Pure graph/interpolation/name helpers
|   |-- nodes/                  Registry and node executors
|   `-- tasks/                  Trigger.dev production task
|-- hooks/                      Shared hooks
|-- lib/
|   |-- db/                     Neon client, Drizzle schema, migrations
|   |-- browserbase.ts          Server-side Browserbase SDK client
|   |-- liveblocks.ts           Server-side Liveblocks SDK client
|   |-- resend.ts               Server-side Resend client
|   `-- utils.ts                Tailwind class merge helper
|-- Design/                     Product screenshots/reference designs
|-- docs/                       Project documentation and Mermaid sources
|-- trigger/example.ts          Sample task outside configured task dirs
|-- Dockerfile                  Standalone production image
|-- proxy.ts                    Clerk route protection
|-- trigger.config.ts           Trigger.dev runtime configuration
`-- drizzle.config.ts           Migration configuration
```

See [`diagrams/folder-structure.mmd`](diagrams/folder-structure.mmd).

## Route Structure

| Route | Source | Notes |
| --- | --- | --- |
| `/` | `app/(dashboard)/page.tsx` | Empty state and create workflow action |
| `/billing` | `app/(dashboard)/billing/page.tsx` | Organization Clerk PricingTable |
| `/workflows/[id]` | `app/(dashboard)/workflows/[id]/page.tsx` | Collaborative editor |
| `/sign-in/*` | `app/(auth)/sign-in/[[...sign-in]]/page.tsx` | Clerk SignIn |
| `/sign-up/*` | `app/(auth)/sign-up/[[...sign-up]]/page.tsx` | Clerk SignUp |
| `/choose-organization` | `app/(auth)/choose-organization/page.tsx` | Clerk task UI |
| `/test` | `app/test/page.tsx` | Protected authentication smoke page |
| `/api/liveblocks/auth` | route handler | Liveblocks identity |
| `/api/liveblocks/users` | route handler | User metadata resolution |
| `/api/replays/[sessionId]` | route handler | HLS replay manifest proxy |

Route groups organize auth and dashboard concerns without adding URL segments.

## Workflow Components

`features/workflows/components/` contains the product-specific UI:

- `workflow-shell.tsx`: resizable editor composition.
- `canvas.tsx`: Liveblocks-backed React Flow canvas.
- `right-sidebar.tsx`: workflow actions, node palette, and field editor.
- `console-panel.tsx`: logs/output split and selection owner.
- `logs-panel.tsx`: run and step history.
- `inspector-panel.tsx`: selected output/error/replay.
- `session-replay.tsx`: Browserbase HLS polling/player.
- `workflow-runs-provider.tsx`: one Trigger.dev realtime subscription.
- `room.tsx`: Liveblocks providers and user resolution.
- `step-node.tsx` and `node-icon.tsx`: node rendering.
- `workflow-nav.tsx` and `new-workflow-button.tsx`: workflow creation/navigation.

## UI Primitive Library

`components/ui/` contains a broad generated primitive catalog, including
accordion, alerts, dialogs, forms, menus, navigation, sidebar, tables, tabs,
tooltips, charts, carousel, and message components. The product currently uses a
subset directly; unused primitives remain available for future UI work.

The sidebar implementation is locally modified: `isMobile` is hardcoded to
`false`, so the mobile sheet branch is unreachable despite `hooks/use-mobile.ts`
existing.

## Tooling and Reference Folders

- `.agents/skills/` and `.github/skills/` contain installed agent guidance, not
  application runtime code.
- `.clerk/` is ignored Clerk CLI state and can contain secrets.
- `.trigger/` is ignored local Trigger.dev state.
- `specs/` and `templates/` are ignored implementation references.
- `doc/` exists but contains no files.
- `public/` contains only `.gitkeep`; screenshots are in `Design/`.

## Configuration Files

| File | Purpose |
| --- | --- |
| `package.json` | Dependencies and npm scripts |
| `next.config.ts` | Standalone output |
| `tsconfig.json` | Strict TypeScript, bundler resolution, `@/*` alias |
| `eslint.config.mjs` | Next core web vitals and TypeScript linting |
| `.prettierrc` | Formatting and Tailwind class sorting |
| `components.json` | shadcn configuration |
| `drizzle.config.ts` | Postgres schema and migration output |
| `trigger.config.ts` | Node runtime, retries, duration, task directories |
| `liveblocks.config.ts` | Global Liveblocks user metadata type |
| `postcss.config.mjs` | Tailwind PostCSS plugin |
| `Dockerfile` | Multi-stage production image |

