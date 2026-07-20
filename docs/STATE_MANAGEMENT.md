# State Management

The app uses several purpose-specific state owners rather than one global store.

## State Map

| State | Owner | Persistence | Consumers |
| --- | --- | --- | --- |
| Clerk user/session/org/plan | Clerk | Clerk-managed | Server auth, UI, billing gates |
| Workflow row/graph snapshot | Neon Postgres | Durable | Sidebar, page, task |
| Editable nodes and edges | Liveblocks React Flow | Liveblocks room | Canvas, sidebar, Run |
| Presence/cursors/users | Liveblocks | Realtime room | Canvas |
| Viewport and selected node | React Flow store | In-memory | Canvas, Palette, Inspector |
| Run history/status/output | Trigger.dev | Trigger.dev | Run button, nodes, console |
| Theme | `next-themes` | Browser preference/storage | Root UI and canvas |
| Sidebar expanded state | React context | `sidebar_state` cookie | Sidebar components |
| Sidebar tab | `useState` | In-memory | `RightSidebar` |
| Console selection | `useState` | In-memory | Console logs/inspector |
| Transition pending state | `useTransition` | In-memory | Create/delete/run/stop controls |

## Liveblocks and React Flow

`useLiveblocksFlow` replaces local React Flow node/edge change handlers with
Liveblocks-backed handlers. React Flow still supplies viewport dimensions,
selection, graph traversal helpers, and node updates through its provider/store.

The React Flow provider is above both canvas and right sidebar so the palette and
editor can interact with the same store.

## Run State

`WorkflowRunsProvider` is an application context layered over Trigger.dev's
realtime hook. It prevents each node/console component from opening a separate
subscription.

Derived hooks use `useMemo`:

- latest run steps;
- current live run;
- normalized console run history.

## Server State and Caching

Server data is queried directly with Drizzle. There is no React Query, SWR,
Redux, Zustand, or Next.js function cache.

## Persistence Caveat

Liveblocks editing state and Postgres run state are separate. There is no
Postgres autosave during editing. The Postgres graph changes only on Run.

## Not Implemented

- Offline editing.
- Undo/redo history owned by the application.
- Persisted viewport, selected node, panel sizes, tab, or console selection.
- Optimistic workflow database mutations.
- Central event bus.

