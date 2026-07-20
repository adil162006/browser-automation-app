# Authorization

## Tenant Boundary

The active Clerk organization ID is the tenant key. Workflow data access uses
both the workflow ID and `org_id` for fetch, update, and delete operations.
Workflow lists filter solely by the active `org_id`.

| Operation | Enforcement |
| --- | --- |
| List workflows | `WHERE org_id = activeOrg` |
| Read workflow | `WHERE id = input AND org_id = activeOrg` |
| Save graph | Same compound predicate |
| Delete workflow | Same compound predicate |
| Create workflow | Writes active `orgId` |
| Trigger task | Passes active `orgId`; task repeats scoped read |
| Liveblocks room | Owning org receives `room:write`; defaults empty |
| Resolve users | Clerk query restricted to active organization |

## Plan Authorization

The Clerk organization plan slug is hardcoded as `pro`.

| Capability | Client gate | Server gate |
| --- | --- | --- |
| Add Agent node | Yes | Run action rejects graphs containing Agent |
| Watch replay | Yes | Replay route returns `403` |
| Other nodes | No | No plan check |

Client gates improve UX; server gates are the security boundary.

## Roles and Permissions

The app treats all active organization members equivalently. Clerk organization
roles and custom permissions are not inspected.

**Not implemented in the current codebase:** owner/admin/editor/viewer workflow
roles, per-workflow ACLs, or read-only collaboration.

## Known Gaps

### Run cancellation ownership

`cancelWorkflowRunAction(runId)` verifies only that a caller has an active
organization. It does not prove that the supplied Trigger.dev run belongs to
that organization or workflow.

### Replay ownership

The replay route requires an authenticated Pro organization but does not map the
Browserbase session ID back to an authorized workflow/run. A known session ID
could therefore cross the intended tenant boundary.

### Liveblocks room deletion

Room deletion follows a successful tenant-scoped database delete, which proves
workflow ownership. This path is scoped correctly, but Postgres and Liveblocks
are not transactional.

### Runtime graph shape

The run action accepts a TypeScript `WorkflowGraph`, but client-supplied Server
Action arguments still require runtime validation. Current validation checks
only trigger count, edge presence, and cycles.

## Recommended Enforcement

1. Store Trigger.dev run IDs and Browserbase session IDs with `workflow_id` and
   `org_id`, or retrieve trusted task metadata before cancellation/replay.
2. Authorize cancel and replay through that ownership record.
3. Add a runtime schema for IDs, nodes, edges, registry types, required fields,
   and edge endpoints.
4. Introduce Clerk role/permission checks if organization members need
   differentiated access.

