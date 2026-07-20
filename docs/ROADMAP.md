# Roadmap

This is a source-grounded improvement list, not a promise of scheduled work.

## Highest Priority

- Bind run cancellation and replay access to organization/workflow ownership.
- Add runtime schemas for Server Actions, task payloads, graph nodes, edges,
  IDs, and required fields.
- Add idempotency/checkpointing for side-effecting nodes, especially email.
- Add automated tests and CI checks.
- Add the `(org_id, created_at DESC)` workflow index.

## Product Completeness

- Autosave or explicit save separate from Run.
- Workflow rename, duplicate, import, and export.
- Workflow revisions and change history.
- Durable run/step/audit tables.
- Schedules and event/webhook triggers.
- Per-workflow roles and read-only collaborators.
- Run history retention and pagination.
- Better error/result contracts and in-app action error states.

## Execution

- Node-level checkpoints and retry policies.
- Idempotency keys for external side effects.
- Parallel execution for independent branches.
- Browser URL/egress allowlists and execution quotas.
- Maximum graph/node/output sizes.
- Configurable Stagehand model and Browserbase settings.

## Operations

- GitHub Actions CI/CD.
- Trigger.dev deployment script and documented release process.
- Health/readiness endpoints.
- Structured logs, tracing, and correlation IDs.
- Production security headers and rate limiting.
- Staging environment and infrastructure definitions.
- Database backup/restore and retention documentation.

## UI and Accessibility

- Fix current lint errors.
- Implement real mobile sidebar behavior; the primitive currently hardcodes
  `isMobile = false`.
- Remove duplicated resizable panel ownership in `WorkflowShell`/`RightSidebar`.
- Add keyboard/accessibility coverage for canvas, node palette, and run console.

