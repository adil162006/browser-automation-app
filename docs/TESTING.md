# Testing

## Current Status

Automated unit, integration, component, and end-to-end tests are **not
implemented in the current codebase**. No Jest, Vitest, Playwright, or Cypress
configuration exists, and there is no `test` npm script.

## Existing Verification Commands

| Command | Current result on July 20, 2026 |
| --- | --- |
| `npm run typecheck` | Passes |
| `npm run lint` | Fails with two errors |
| `npm run build` | Passes; Next.js reports 9 generated route entries plus Proxy |

Known lint errors:

1. `components/ui/carousel.tsx`: synchronous state update through `onSelect(api)`
   inside an effect.
2. `hooks/use-mobile.ts`: synchronous `setIsMobile` inside an effect.

The application-specific workflow files did not produce lint errors in the
observed run.

## Manual Smoke Checklist

### Authentication and tenant isolation

- Unauthenticated protected routes redirect to sign-in.
- Sign-up and organization selection complete.
- Switching organizations changes the workflow list.
- A workflow ID from another organization returns not found.

### Workflow editing

- A new room initializes with one Start node.
- Adding a second Start is rejected.
- Nodes and edges synchronize between two organization members.
- User cursors and display information resolve.
- Editor field changes appear on the node.
- Upstream connection tokens insert into the intended field.

### Execution

- No-edge and cyclic graphs are rejected.
- Connected nodes execute in dependency order.
- Unconnected nodes do not execute.
- Browser nodes share one Browserbase session.
- Node status, time, output, and failure appear in realtime.
- Stop cancels the live run.
- A failed node prevents later nodes from running.

### Billing and replay

- Non-Pro organizations cannot add/run Agent.
- Non-Pro organizations cannot retrieve replay.
- Pro replay polls while processing and then plays HLS.

### Email

- Successful Resend delivery returns an email ID.
- Resend API errors fail the step.
- Trigger.dev retry behavior is tested to prevent duplicate sends before
  production use.

## Recommended Test Layers

1. Unit tests for `validateGraph`, `interpolate`, slug generation, and run
   normalization.
2. Data tests against disposable Postgres for tenant predicates and graph save
   behavior.
3. Server Action tests with mocked Clerk, Trigger.dev, and Liveblocks.
4. Task tests with fake executors and explicit retry/idempotency cases.
5. Route handler tests for validation/status/authorization.
6. Playwright tests for auth, collaborative editing, run UX, and plan gates.

## High-Priority Cases

- Canceling a run owned by another organization must fail.
- Replaying a Browserbase session owned by another organization must fail.
- Malformed graph payloads must be rejected.
- Retried workflows must not duplicate side effects.
- Deleting a workflow must handle Liveblocks failure consistently.
