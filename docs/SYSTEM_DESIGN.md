# System Design

## Goals Represented by the Code

- Let organization members build a directed browser automation workflow.
- Keep concurrent editors synchronized.
- Execute long-running work outside the web request.
- Surface live status and final outputs in the editor.
- Keep service secrets on the server.
- Gate expensive Agent and replay capabilities behind an organization plan.

## Runtime Components

| Component | State owned | Availability role |
| --- | --- | --- |
| Next.js service | Request/session context and UI composition | User-facing control plane |
| Neon Postgres | Workflow identity, tenant owner, name, run snapshot | Durable system of record for execution |
| Liveblocks | Editable nodes/edges and presence | Realtime collaboration plane |
| Trigger.dev | Run queue, retries, metadata, result | Durable execution plane |
| Browserbase | Remote browser session and recording | Browser execution/observability |
| Stagehand | Browser actions and model-assisted operations | Node execution engine |
| Clerk | Users, sessions, organizations, plan entitlements | Identity and billing |
| Resend | Email delivery | Side-effect provider |

## Consistency Model

The editing graph and execution graph are intentionally separate:

- Liveblocks is the latest collaborative editing state.
- Postgres `workflows.graph` is updated only when Run is selected.
- Trigger.dev reads the saved Postgres snapshot, not live Liveblocks storage.

This produces a clear run snapshot but means edits are not durably persisted to
Postgres until a run. Closing a room before running relies on Liveblocks
retaining the editing state. There is no explicit autosave/export path to
Postgres.

## Workflow Model

Nodes have:

- a React Flow identity and position;
- a registry `type`;
- denormalized `kind` and title;
- string-valued fields.

Edges define dependencies. The runner executes only nodes that touch an edge.
Every field supports textual interpolation from upstream output paths.

The runner is sequential even when independent branches could run in parallel.
This favors deterministic browser session use and simple output dependencies.

## Failure Model

- Route and Server Action failures use thrown errors or status responses.
- A node failure marks the step failed, flushes metadata, closes Stagehand, and
  fails the task.
- Later nodes do not run after a failure.
- Trigger.dev globally retries tasks up to three attempts with exponential
  backoff.
- No node-level checkpointing or idempotency key is implemented.

The whole-task retry model can repeat successful earlier side effects. This is
especially important for Send Email.

## Scaling Characteristics

- Next.js and Neon HTTP are compatible with stateless horizontal web scaling.
- Liveblocks and Trigger.dev externalize realtime and task state.
- Browserbase externalizes browser compute.
- The workflow list currently lacks an `org_id` index.
- Each workflow page request calls Liveblocks `getOrCreateRoom`.
- Each run executes nodes sequentially in one task and one browser session.

## Boundaries Not Implemented

- Webhooks: **Not implemented in the current codebase.**
- Workflow schedules/triggers other than manual Start: **Not implemented in the
  current codebase.**
- Workflow rename, duplicate, versioning, import, or export: **Not implemented
  in the current codebase.**
- Durable run records in the application database: **Not implemented in the
  current codebase.**
- Role-based workflow permissions beyond organization membership: **Not
  implemented in the current codebase.**
- Multi-environment infrastructure definitions: **Not implemented in the
  current codebase.**

## Related Documents

- [Architecture](ARCHITECTURE.md)
- [Data Flow](DATA_FLOW.md)
- [Database](DATABASE.md)
- [Performance](PERFORMANCE.md)
- [Security Guide](SECURITY_GUIDE.md)

