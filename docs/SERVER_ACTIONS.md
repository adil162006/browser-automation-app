# Server Actions

All actions are defined in `features/workflows/actions.ts` under `"use server"`.
They use the active Clerk organization as the tenant context.

## `createWorkflowAction(name)`

### Purpose

Create a workflow and navigate to its editor.

### Input

| Field | Type | Runtime validation |
| --- | --- | --- |
| `name` | `string` | None |

The UI supplies a two-word slug from `unique-names-generator`.

### Behavior

1. Require active `orgId`.
2. Insert `{ orgId, name }`.
3. Revalidate `/workflows` at layout scope.
4. Redirect to `/workflows/{id}`.

### Errors

- `No active organization`
- Database/redirect framework errors

## `deleteWorkflowAction(id)`

### Purpose

Delete a tenant-owned workflow and its Liveblocks room.

### Input

`id: string`; UUID format is not validated.

### Authorization

The delete query requires both the supplied ID and active organization ID.

### Behavior

1. Delete and return the workflow row.
2. Throw if no row matched.
3. Delete Liveblocks room with the workflow ID.
4. Revalidate the workflow layout.
5. Redirect to `/`.

### Errors

- `No active organization`
- `Workflow not found`
- Database or Liveblocks SDK errors

The database and Liveblocks operations are not atomic.

## `runWorkflowAction({ id, graph })`

### Purpose

Persist the current graph and start durable execution.

### Input

```ts
{
  id: string
  graph: WorkflowGraph
}
```

### Validation

- Requires active organization.
- Rejects an Agent node when the active organization is not Pro.
- `saveWorkflowGraph` requires exactly one trigger, at least one edge, and no
  cycle.

Required fields, URL/email formats, node IDs/types, edge endpoints, duplicate
IDs, graph size, and unknown keys are not validated at runtime.

### Output

Returns the Trigger.dev task handle from `tasks.trigger`.

### Side Effects

- Updates `workflows.graph` and `updated_at`.
- Triggers task ID `run-workflow`.
- Tags the run `workflow:{id}`.

### Errors

- `No active organization`
- `The Agent node requires the Pro plan.`
- Combined graph validation messages
- Database or Trigger.dev SDK errors

The update does not check how many rows were modified before triggering the
task.

## `cancelWorkflowRunAction(runId)`

### Purpose

Cancel a Trigger.dev run.

### Input

`runId: string`; no runtime format validation.

### Authorization

Requires an active organization, but does not verify that the run belongs to
that organization. See [Authorization](AUTHORIZATION.md).

### Output

No explicit return value.

### Errors

- `No active organization`
- Trigger.dev cancellation errors

## Client Error Handling

- Stop catches errors and shows a generic toast.
- Run does client graph validation but does not catch action failures.
- Create and delete transitions do not add custom error UI.
- Route-level `error.tsx` handles workflow page rendering failures, not all
  action failures.

