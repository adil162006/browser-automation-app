# API Reference

All custom route handlers are protected by Clerk middleware and also perform
their own auth checks. No public application API is implemented.

## `POST /api/liveblocks/auth`

Creates Liveblocks ID-token authentication for the active Clerk user and
organization.

### Input

No request body is read.

### Authorization

- Requires `userId`.
- Requires an active `orgId`.
- Adds the user to Liveblocks group `orgId`.
- Includes `organizationId: orgId`.

### Success

Returns the status and body produced by `liveblocks.identifyUser`. The exact
token response is owned by the Liveblocks SDK.

### Errors

| Status | Body | Condition |
| --- | --- | --- |
| `401` | `Unauthorized` | Missing user, organization, or current Clerk user |

```bash
curl -X POST http://localhost:3000/api/liveblocks/auth \
  -H "Cookie: <Clerk session cookie>"
```

## `POST /api/liveblocks/users`

Resolves Liveblocks user display information through Clerk while preventing
cross-organization user discovery.

### Request

```json
{
  "userIds": ["user_123", "user_456"]
}
```

Validation requires an array containing only strings. An empty array returns an
empty array without calling Clerk.

### Response

Entries preserve request order. Unknown or out-of-organization IDs return
`null`.

```json
[
  {
    "name": "Ada Lovelace",
    "avatar": "https://example.invalid/avatar.png"
  },
  null
]
```

### Errors

| Status | Body | Condition |
| --- | --- | --- |
| `400` | `Invalid JSON body` | JSON parsing failed |
| `400` | `Expected { userIds: string[] }` | Invalid shape |
| `401` | `Unauthorized` | Missing user or active organization |

No explicit maximum array length is enforced before forwarding `limit:
ids.length` to Clerk.

## `GET /api/replays/{sessionId}`

Proxies the first page's Browserbase HLS playlist. Segment URLs remain
pre-signed Browserbase/CDN URLs and are fetched directly by the video player.

### Path Input

`sessionId` is accepted as a string. No format validation is implemented.

### Authorization

- Requires a Clerk user and active organization.
- Requires `has({ plan: "pro" })`.

The route does not verify that the Browserbase session belongs to the active
organization or workflow.

### Responses

| Status | Content | Condition |
| --- | --- | --- |
| `200` | HLS `.m3u8` text | First replay page is ready |
| `202` | Empty | Replay is still processing or Browserbase returns not found |
| `401` | `Unauthorized` | Missing user or organization |
| `403` | `Pro plan required` | Organization is not Pro |
| `500` | Framework error response | Unexpected Browserbase/SDK failure |

Success headers:

```http
Content-Type: application/vnd.apple.mpegurl
Cache-Control: no-store
```

```bash
curl http://localhost:3000/api/replays/session_123 \
  -H "Cookie: <Clerk session cookie>"
```

## Server Actions

Workflow mutations are implemented as Next.js Server Actions rather than HTTP
route handlers. See [Server Actions](SERVER_ACTIONS.md).

## Background Task Interface

### `run-workflow`

Internal Trigger.dev task.

Request payload:

```json
{
  "workflowId": "uuid",
  "orgId": "org_123"
}
```

Success output:

```json
{
  "steps": [
    {
      "nodeId": "node-id",
      "type": "open-url",
      "title": "Open URL 1",
      "status": "done",
      "durationMs": 10500,
      "output": {
        "url": "https://example.com/",
        "title": "Example"
      }
    }
  ],
  "browserbaseSessionId": "session-id"
}
```

It fails if the workflow is missing, has no saved graph, graph sorting fails, or
a node executor throws.

## Not Implemented

- REST/GraphQL CRUD API for workflows.
- OpenAPI schema.
- API versioning.
- CORS policy.
- Rate limiting.
- Webhooks.

