# Troubleshooting

## Sign-in Redirect Loop

Check:

1. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` belong to the same
   Clerk instance.
2. Sign-in/sign-up URLs are `/sign-in` and `/sign-up`.
3. Clerk allows the local origin.
4. The active organization exists; the dashboard hides personal accounts.

## No Workflows Visible

`AppSidebar` lists workflows only when Clerk returns an active `orgId`.
Select or create an organization, then refresh. Verify `DATABASE_URL` points to
the expected Neon database and run `npm run db:migrate`.

## Workflow Shows Not Found

The workflow page calls `notFound()` when:

- no active organization exists;
- the ID does not exist;
- the row belongs to another organization.

This is intentional tenant isolation.

## Database Client Fails at Startup

`lib/db/index.ts` throws when `DATABASE_URL` is absent. For migrations,
`drizzle.config.ts` accepts `DATABASE_URL_UNPOOLED` or `DATABASE_URL`.

Check:

```powershell
$env:DATABASE_URL
$env:DATABASE_URL_UNPOOLED
```

Do not print the full values into logs or issue trackers.

## Run Button Does Nothing or Fails

Check:

- graph has exactly one Start node;
- graph has at least one edge;
- graph has no cycle;
- `TRIGGER_SECRET_KEY` is configured;
- a Trigger.dev development worker is running locally;
- the task is deployed/discovered under `features/`;
- the saved workflow row has a graph.

The UI validates the graph before the action, but action errors are not always
shown in a custom toast.

## Run Stays Queued

Verify Trigger.dev project configuration and credentials. The client receives a
read-only token scoped to `workflow:<id>`; confirm the task tags the run with the
same value.

## Nodes Stay Pending

The task publishes all connected steps as pending, then flushes the running
state before each executor. If the run failed before metadata was available,
inspect the Trigger.dev run logs.

## Browser Node Fails

Check:

- `BROWSERBASE_API_KEY`;
- Browserbase account access to the configured model;
- target URL reachability;
- Stagehand session startup;
- task runtime logs.

The first browser executor creates the session. Later browser nodes reuse it.

## Replay Shows Preparing Forever

The client polls every two seconds and the route returns `202` while the
recording is unavailable. Check:

- run completed and returned `browserbaseSessionId`;
- organization is Pro;
- Browserbase replay is available;
- `/api/replays/{sessionId}` is authenticated;
- the route is not blocked by a missing `BROWSERBASE_API_KEY`.

There is no client timeout or maximum polling count.

## Email Node Fails

Check `RESEND_API_KEY` and Resend sender/recipient restrictions. The sender is
hardcoded as `onboarding@resend.dev`, and the executor converts Resend's
returned error object into a thrown step failure.

## Collaboration Does Not Connect

Check `LIVEBLOCKS_SECRET_KEY`, `/api/liveblocks/auth`, active organization, and
room ID. The room ID is the workflow ID, and only the owning organization group
receives write access.

## Lint Fails

The known current failures are in:

- `components/ui/carousel.tsx`;
- `hooks/use-mobile.ts`.

They are synchronous state updates inside effects under the current React ESLint
rule.

## Docker Build Fails

Check that all public Clerk build arguments are provided and that the intended
build environment can resolve modules that construct server SDK clients. The
Docker context excludes `.env.*`, and the Dockerfile does not provide server
secrets during the builder stage.

