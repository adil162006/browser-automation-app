# Error Handling

## Pages

The workflow route defines:

- `loading.tsx`: spinner while the route streams/loads;
- `not-found.tsx`: missing, deleted, unauthorized-as-not-found, or no active org;
- `error.tsx`: client error boundary with message and `reset()`.

The error boundary displays `error.message`, which can expose internal service
details to authenticated users.

## Route Handlers

| Route | Explicit handling |
| --- | --- |
| Liveblocks auth | `401` for missing identity/org/user |
| Liveblocks users | `400` invalid JSON/shape, `401` missing identity/org |
| Replay | `401`, `403`, `202` not ready, `200` playlist |

Unexpected Clerk, Liveblocks, or Browserbase errors are generally thrown to
Next.js and become `500` responses.

## Server Actions

Actions throw plain `Error` values for missing organization, missing workflow,
plan gate, and graph problems. Create/delete/run callers do not consistently
catch these errors. Stop catches and shows a generic toast.

There are no structured error codes or discriminated result types.

## Workflow Task

The task:

1. throws when a graph is unavailable;
2. publishes pending steps;
3. marks each executable step running;
4. records output on success;
5. records duration/error, flushes metadata, closes Stagehand, and rethrows on
   failure;
6. stops later nodes from executing.

Trigger.dev retries the task according to global config. There is no
application-specific non-retryable error classification.

## Client Integrations

- Liveblocks user resolution catches network/response failures and returns
  `undefined`.
- Replay converts failed fetches to an error state and unsupported HLS to a
  separate state.
- Replay polling has no timeout or maximum attempts.
- Theme and canvas mounting avoid hydration mismatch through
  `useSyncExternalStore`.

## Logging

Trigger.dev `logger.log` records workflow and step starts. Next.js route/action
code has no structured application logger. Browserbase observability is exposed
only through replay, not logs/live view.

## Recommended Error Contract

- Define runtime schemas and stable error codes at public boundaries.
- Return user-safe messages while logging full causes server-side.
- Add retry classification and idempotency.
- Add bounded replay polling.
- Add compensating/retry behavior for Postgres/Liveblocks delete divergence.
- Add telemetry correlation IDs across workflow, Trigger.dev run, and
  Browserbase session.

