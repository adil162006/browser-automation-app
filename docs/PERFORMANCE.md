# Performance

## Rendering

- App Router Server Components keep database and auth work on the server.
- Interactive workflow features form a client boundary beneath the workflow
  page.
- Route `loading.tsx` and Liveblocks `ClientSideSuspense` provide progressive
  loading states.
- `next/font` handles Geist font loading.
- Next.js performs route/component code splitting automatically.

No dynamic imports or explicit lazy-loaded feature modules are implemented.

## Realtime

- `LiveblocksProvider` uses a 16 ms throttle.
- One `WorkflowRunsProvider` subscription is shared by all run consumers.
- Derived run arrays use `useMemo`.
- React Flow node types are declared outside render.

## Browser Execution

- Stagehand is initialized lazily only when a browser node executes.
- One session is reused across browser nodes, preserving state and producing one
  recording.
- Send Email avoids creating Stagehand.
- Nodes execute sequentially; independent branches are not parallelized.

## Caching

- No application data cache is configured.
- Database reads occur per request/task.
- Replay manifests use `Cache-Control: no-store`.
- Creation/deletion revalidate the dashboard layout path.
- Liveblocks and Trigger.dev use their own realtime/service storage.

## Database

The table has only a primary-key index. The common workflow list query filters
`org_id` and orders `created_at DESC`; it should receive a composite index as
data volume grows.

The entire graph is read/written as one JSONB value. This is simple and atomic
for snapshots but rewrites the full graph and does not support indexed node
queries.

## Images and Assets

The runtime UI does not use `next/image`. `public/` is empty; checked-in design
screenshots are documentation/reference assets and are not rendered by product
routes.

## Current Bottlenecks and Risks

- Liveblocks `getOrCreateRoom` runs on every workflow page request.
- Clerk user resolution has no explicit batch limit beyond input length and no
  app cache.
- Replay polls every two seconds until ready with no maximum attempts.
- Workflow list has no tenant/time index.
- All connected node IDs are included in topological sorting; graph size is
  unbounded.
- Run metadata republishes the full steps array after each state change.
- A whole-task retry repeats earlier work.

## Recommended Improvements

1. Add `(org_id, created_at DESC)` database index.
2. Add graph and user-resolution size limits.
3. Persist room provisioning state or avoid redundant setup calls.
4. Add replay timeout/backoff and cancellation visibility.
5. Add task checkpoints/idempotency before parallelism.
6. Measure route, database, Liveblocks, Trigger.dev, Browserbase, and replay
   latency before adding caches.

