# Data Flow

## Workflow Creation

```mermaid
sequenceDiagram
  participant UI as New workflow UI
  participant SA as createWorkflowAction
  participant Clerk
  participant DB as Neon Postgres
  UI->>SA: generated two-word name
  SA->>Clerk: auth()
  Clerk-->>SA: active orgId
  SA->>DB: INSERT workflow(orgId, name)
  SA->>SA: revalidate dashboard layout
  SA-->>UI: redirect /workflows/{id}
```

The graph is null after creation.

## Editing

1. The workflow page loads the database row with an organization predicate.
2. The page creates/updates a private Liveblocks room using the workflow ID.
3. `Room` authenticates the client through the Liveblocks auth route.
4. `useLiveblocksFlow` initializes a Start node for a new room and synchronizes
   nodes and edges.
5. React Flow selection/viewport state stays client-side.
6. Node field updates mutate React Flow/Liveblocks state.

Postgres is not updated during editing.

## Output Connections

`useUpstreamConnections` traverses all incoming ancestors breadth-first.
Registry output definitions become insertable tokens:

```text
{{ node-id.output.path }}
```

At run time, `interpolate` resolves dotted and bracket paths from already
completed node outputs. Missing/null values become an empty string; object and
array values become JSON text.

## Run

```mermaid
sequenceDiagram
  participant UI as Workflow editor
  participant SA as runWorkflowAction
  participant DB as Neon Postgres
  participant T as Trigger.dev
  participant S as Stagehand
  participant B as Browserbase
  participant R as Resend

  UI->>SA: workflow id + current graph
  SA->>SA: auth, plan check, graph validation
  SA->>DB: UPDATE graph snapshot
  SA->>T: trigger run-workflow with tenant payload/tag
  T->>DB: load saved tenant-scoped graph
  T->>T: topological sort connected nodes
  loop each node
    T-->>UI: publish pending/running/done/failed metadata
    alt browser node
      T->>S: execute with shared Stagehand instance
      S->>B: remote browser/model operation
    else send email
      T->>R: send email
    end
  end
  T-->>UI: final steps and Browserbase session ID
```

Source: [`diagrams/sequence.mmd`](diagrams/sequence.mmd).

## Replay

1. Successful run output exposes `browserbaseSessionId`.
2. Pro user selects Replay.
3. `SessionReplay` polls `/api/replays/{sessionId}` every two seconds.
4. The route returns `202` until Browserbase exposes replay pages.
5. The route proxies the first page's HLS playlist with `no-store`.
6. hls.js loads the route URL; Safari can use native HLS.

## Deletion

1. Delete action verifies an active organization.
2. Database deletion includes organization and workflow IDs.
3. If a row was deleted, the action deletes the same ID from Liveblocks.
4. The dashboard layout is revalidated and the user is redirected home.

If Liveblocks deletion fails, the database row is already gone.

## Data Stores

| Data | Store |
| --- | --- |
| User/session/org/plan | Clerk |
| Workflow identity/name/run snapshot | Postgres |
| Editable graph and presence | Liveblocks |
| Run status, metadata, output | Trigger.dev |
| Browser state and recording | Browserbase |
| Email delivery record | Resend |

