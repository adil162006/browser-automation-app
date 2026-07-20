# Contributing

Thank you for improving the Browser Automation Workflow Builder. This repository
is an early-stage Next.js application, so changes should stay narrowly scoped,
typed, tenant-aware, and documented.

## Setup

1. Install Node.js 22 and npm.
2. Run `npm ci`.
3. Copy `.env.example` to `.env.local` and configure your own service accounts.
4. Run `npm run db:migrate`.
5. Start Next.js with `npm run dev`.
6. Start a Trigger.dev development worker for the project in
   `trigger.config.ts` when testing workflow runs.

Never commit local credentials, Clerk CLI state, Trigger.dev state, database
URLs, or generated build output.

## Before Changing Code

- Read `AGENTS.md`.
- For Next.js behavior, use the guides installed in
  `node_modules/next/dist/docs/`; this project runs Next.js 16.
- For React Flow changes, consult the current official React Flow documentation.
- For Trigger.dev changes, load the relevant installed skill under
  `.agents/skills/`.
- Derive database row types from `lib/db/schema.ts`.

## Development Standards

- Preserve organization scoping on every workflow read and mutation.
- Keep Server Components as the default and add `"use client"` only where
  browser APIs, state, or hooks require it.
- Validate untrusted values at runtime; TypeScript types are not request
  validation.
- Keep secrets in server-only modules and environment variables.
- Use the existing feature-based layout under `features/workflows/`.
- Add succinct comments only where the reasoning is not obvious.

## Adding a Workflow Node

Add all three files/registrations under `features/workflows/nodes/`:

1. Implement the executor, for example `open-url.ts`.
2. Register it in `node-executors.ts`. The `satisfies` contract requires an
   executor for every action node.
3. Add the node manifest to `node-registry.ts`, including fields and outputs.

The canvas, inspector, and run task are registry-driven and should not need
node-specific changes.

Consider retries and idempotency before adding side effects. Trigger.dev retries
the whole task by default, so email, payment, or mutation nodes need explicit
protection against duplicate execution.

## Database Changes

1. Update `lib/db/schema.ts`.
2. Generate a migration with `npm run db:generate`.
3. Review the generated SQL.
4. Apply it with `npm run db:migrate`.
5. Update `docs/DATABASE.md` and `docs/diagrams/database.mmd`.

Do not edit an already-applied migration to represent a new schema change.

## Verification

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Automated unit, integration, and end-to-end test suites are not implemented in
the current codebase. New behavior should add focused tests when a test
framework is introduced.

## Pull Requests

Describe:

- the behavior changed;
- tenant, authorization, security, and retry implications;
- database or environment changes;
- manual verification performed;
- screenshots for user-facing changes.

Keep unrelated refactors out of the same pull request.

## Documentation

Update the relevant page under `docs/` whenever behavior, configuration,
architecture, routes, actions, schema, or deployment requirements change.

