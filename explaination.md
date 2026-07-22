# Project Explanation

## 1. Project Overview

### What problem does this application solve?
This application is a browser automation workflow builder and runner. It lets authenticated organization users compose automation tasks visually, collaborate on workflow graphs, execute them via browser automation, inspect step-level output, and replay recorded browser sessions.

### Who are the users?
- Organization users and teams who need a visual automation builder.
- QA engineers or product teams building browser automation flows.
- Admins who manage organization billing and plan access.
- Developers verifying workflow execution and replay.

### Main features
- Node-based workflow editor.
- Live collaborative editing via Liveblocks.
- Persistent workflow storage in Neon/Postgres.
- Background workflow execution through Trigger.dev.
- Browser automation using Browserbase Stagehand.
- Step logs and realtime run status.
- Session replay playback.
- Authenticated org access with Clerk.
- Pro-plan gating for premium features.

### Overall architecture
The app uses Next.js App Router with a mix of server and client components.

- `app/`: page routes, layouts, and API endpoints.
- `components/`: shared UI, theme provider, and sidebar.
- `features/workflows/`: workflow builder UI, graph persistence, runtime node execution, and task orchestration.
- `lib/`: backend clients for Liveblocks, Browserbase, Resend, and database access.
- `hooks/`: reusable custom hooks.
- `app/api/`: runtime server routes for Liveblocks auth/users and replay proxy.
- `lib/db/`: Drizzle schema and Neon client.

### Request flow from frontend to backend
1. User visits the workflow editor page.
2. The page authenticates with Clerk and loads workflow metadata from the database.
3. The server ensures a Liveblocks room exists for the workflow.
4. The server issues a Trigger.dev public token for realtime run state.
5. The client connects to Liveblocks for collaborative graph state.
6. When the user runs a workflow, a server action persist the graph and triggers a Trigger.dev task.
7. The task loads the graph and executes it in dependency order.
8. Node outputs are published to run metadata, which the UI subscribes to.
9. When finished, the workflow run can expose a Browserbase replay.

### Data flow
- Persistent data: workflow metadata and graph JSON in the `workflows` table.
- Collaborative state: shared graph nodes and edges in Liveblocks.
- Execution state: Trigger.dev run metadata and output.
- Replay data: Browserbase session manifest proxied through an API route.

### State management
- Local UI state: component state and form values.
- Shared graph state: React Flow store and Liveblocks collaboration.
- Server state: database rows and Trigger.dev run subscriptions.
- Auth state: Clerk React and server auth state.

### Authentication flow
- Clerk handles sign-in, sign-up, and organization selection.
- `app/layout.tsx` wraps the app in `ClerkProvider`.
- Server code uses Clerk `auth()` to validate the org and user.
- Liveblocks routes require org-scoped auth and issue user identity tokens.
- Billing and plan gating use Clerk `has({ plan: 'pro' })`.

### Folder structure explanation
- `app/`: Next.js route files and page layouts.
- `components/`: shared UI components and theme management.
- `features/workflows/`: workflow editor and runtime logic.
- `lib/`: external SDK clients, database config, and helpers.
- `hooks/`: reusable custom React hooks.
- `app/api/`: server endpoint handlers.
- `lib/db/`: database schema and connection.
- `docs/`: project documentation and diagrams.
- `Design/`: design images and product references.
- `specs/`, `templates/`: reference or scaffolding assets.

### Technologies used and why they were chosen
- **Next.js 16**: modern app router and server components.
- **React 19**: latest React capabilities.
- **Clerk**: org-based authentication and billing.
- **Liveblocks**: collaborative realtime editing.
- **React Flow / @xyflow/react**: node-based graph editing.
- **Trigger.dev**: task execution and realtime run state.
- **Browserbase Stagehand**: browser automation and replay.
- **Neon/Postgres**: serverless database persistence.
- **Drizzle ORM**: typed database access.
- **Resend**: transactional email sending.
- **Tailwind + shadcn UI**: consistent styling and reusable primitives.

---

## 2. Folder Documentation

### `app/`
Purpose: Next.js pages, route groups, and API endpoints.
Why it exists: This is the main application entry point.
What belongs there: layouts, page components, route-handling files, and server API route handlers.
How it interacts with other folders: imports UI from `components/`, workflow logic from `features/workflows/`, and backend helpers from `lib/`.

### `components/`
Purpose: shared presentational components and utilities.
Why it exists: centralize UI building blocks.
What belongs there: app shell components and UI primitives.
How it interacts with other folders: used by `app/` pages and `features/workflows/` components.

### `features/workflows/`
Purpose: implement the core workflow product.
Why it exists: this folder contains the workflow editor, graph persistence, and execution logic.
What belongs there: workflow actions, data persistence, components, hooks, node definitions, and task code.
How it interacts with other folders: ties UI from `components/` to backend `lib/` clients and database storage.

### `lib/`
Purpose: reusable backend libraries.
Why it exists: separate external client configuration and utility helpers from app logic.
What belongs there: database config, SDK clients, and utility functions.
How it interacts with other folders: used by routes, workflows, and API handlers.

### `hooks/`
Purpose: reusable custom hook implementations.
Why it exists: share logic across components.
What belongs there: hook utilities such as theme detection or shared state helpers.
How it interacts with other folders: imported by UI components.

### `app/api/`
Purpose: runtime server endpoints.
Why it exists: proxy secure operations and external API calls.
What belongs there: route handlers for auth, user resolution, and replay manifests.
How it interacts with other folders: used by client UI to authenticate Liveblocks or play replays.

### `lib/db/`
Purpose: database schema and connection.
Why it exists: define and access persistent data.
What belongs there: Drizzle schema, Neon client config, and migrations.
How it interacts with other folders: used by workflow data functions and server actions.

### `features/workflows/nodes/`
Purpose: define workflow node metadata and runtime operations.
Why it exists: separate node registry from execution logic.
What belongs there: node definitions, field metadata, outputs, and executor functions.
How it interacts with other folders: used by the workflow runner task and UI inventory.

### `features/workflows/tasks/`
Purpose: background workflow execution.
Why it exists: encapsulate the Trigger.dev task.
What belongs there: the `run-workflow` task.
How it interacts with other folders: pulls workflow data from persistence and calls node executors.

### `docs/`
Purpose: human-readable project documentation.
Why it exists: store architecture, API, deployment, and design docs.
What belongs there: markdown docs and Mermaid diagrams.
How it interacts with other folders: reference material for contributors.

---

## 3. File Documentation

### File: `package.json`
Purpose: app dependency and script management.
Responsibilities:
- Lists runtime and dev dependencies.
- Defines npm scripts for dev/build/lint/typecheck and database migration.
Imports: none.
Exports: none.

### File: `tsconfig.json`
Purpose: TypeScript compiler configuration.
Responsibilities:
- Enables strict checking.
- Configures module resolution for Next.js.
- Adds `@/*` alias mapping.
Imports: none.
Exports: none.

### File: `next.config.ts`
Purpose: Next.js runtime configuration.
Responsibilities:
- Sets the output format to `standalone` for production.
Imports: type `NextConfig`.
Exports: default Next.js config.

### File: `app/layout.tsx`
Purpose: root application layout.
Responsibilities:
- Provides Clerk auth context.
- Adds theme provider and tooltip provider.
- Loads global fonts and CSS.
- Renders app children.
Imports:
- `ClerkProvider` from `@clerk/nextjs`
- `ThemeProvider` from local theme provider
- `TooltipProvider` and `Toaster` UI components
- `cn` helper
Exports: `RootLayout` component.

### File: `app/(dashboard)/layout.tsx`
Purpose: dashboard layout wrapper.
Responsibilities:
- Wraps dashboard pages in sidebar providers.
- Renders the sidebar and page content inset.
Imports:
- `AppSidebar`
- `SidebarProvider`, `SidebarInset`
Exports: `DashboardLayout` component.

### File: `app/(dashboard)/page.tsx`
Purpose: empty dashboard landing page.
Responsibilities:
- Renders an empty workflow state and prompt to create a workflow.
Imports:
- `WorkflowIcon`
- `Empty` UI components
- `NewWorkflowButton`
Exports: default page component.

### File: `app/(dashboard)/billing/page.tsx`
Purpose: billing page.
Responsibilities:
- Renders Clerk PricingTable for org billing.
Imports:
- `PricingTable` from Clerk.
Exports: `BillingPage`.

### File: `app/(dashboard)/workflows/[id]/page.tsx`
Purpose: workflow editor page.
Responsibilities:
- Authenticates organization user.
- Loads workflow data.
- Creates/ensures Liveblocks room.
- Issues Trigger.dev public token.
- Renders `Room`, `ReactFlowProvider`, and `WorkflowShell`.
Imports:
- Clerk auth
- Liveblocks client
- workflow data helper
- Room and workflow UI providers
Exports: default page component.

### File: `app/(dashboard)/workflows/[id]/loading.tsx`
Purpose: loading state for workflow page.
Responsibilities:
- Displays a loading spinner.
Imports: `Spinner`.
Exports: default `Loading`.

### File: `app/(dashboard)/workflows/[id]/error.tsx`
Purpose: workflow page error boundary.
Responsibilities:
- Displays a user-facing error state.
- Provides retry button.
Imports:
- `Button`, `Empty` UI.
Exports: default `Error`.

### File: `app/(dashboard)/workflows/[id]/not-found.tsx`
Purpose: workflow not found page.
Responsibilities:
- Informs user when workflow ID is invalid.
- Links back to workflows.
Imports: `Button`, `Empty` UI.
Exports: default `NotFound`.

### File: `app/(auth)/sign-in/[[...sign-in]]/page.tsx`
Purpose: sign-in page.
Responsibilities:
- Renders Clerk `SignIn` component.
Exports: default page.

### File: `app/(auth)/sign-up/[[...sign-up]]/page.tsx`
Purpose: sign-up page.
Responsibilities:
- Renders Clerk `SignUp` component.
Exports: default page.

### File: `app/(auth)/choose-organization/page.tsx`
Purpose: org selection page.
Responsibilities:
- Renders Clerk `TaskChooseOrganization`.
Exports: default page.

### File: `app/api/liveblocks/auth/route.ts`
Purpose: Liveblocks user authentication route.
Responsibilities:
- Validates Clerk session.
- Calls Liveblocks identifyUser.
- Returns Liveblocks identity response.

### File: `app/api/liveblocks/users/route.ts`
Purpose: Resolve user metadata for Liveblocks.
Responsibilities:
- Validates Clerk auth.
- Accepts `userIds` array.
- Resolves users only within org.
- Returns display name/avatar info.

### File: `app/api/replays/[sessionId]/route.ts`
Purpose: Browserbase replay proxy.
Responsibilities:
- Validates Clerk auth and Pro plan.
- Retrieves Browserbase replay pages.
- Returns 202 until recording ready.
- Returns HLS manifest with no-store cache.

### File: `features/workflows/actions.ts`
Purpose: server actions for workflow operations.
Responsibilities:
- Create workflow.
- Delete workflow and cleanup Liveblocks room.
- Run workflow with Trigger.dev.
- Cancel workflow run.
Imports:
- Clerk server auth
- Trigger.dev SDK
- Liveblocks client
- workflow data helpers
- `validateGraph` and graph types.
Exports:
- `createWorkflowAction`
- `deleteWorkflowAction`
- `runWorkflowAction`
- `cancelWorkflowRunAction`

### File: `features/workflows/data.ts`
Purpose: workflow persistence.
Responsibilities:
- Save workflow graph.
- List workflows by org.
- Get single workflow.
- Create workflow row.
- Delete workflow row.
Imports:
- Drizzle ORM helpers.
- `db` and schema.
- `validateGraph` helper.
Exports: CRUD functions.

### File: `features/workflows/components/workflow-shell.tsx`
Purpose: editor shell layout.
Responsibilities:
- Arrange canvas, console, and sidebar in resizable panels.
Imports:
- `ResizablePanelGroup` and `ResizablePanel`
- `Canvas`, `ConsolePanel`, `RightSidebar`
Exports: `WorkflowShell`.

### File: `features/workflows/components/room.tsx`
Purpose: client-side Liveblocks room provider.
Responsibilities:
- Provide Liveblocks room context.
- Wrap children in providers.
Imports:
- `liveblocks` client package.
- `RoomProvider` likely from Liveblocks (not shown but implied).
Exports: `Room` component.

### File: `features/workflows/components/workflow-nav.tsx`
Purpose: workflow navigation list.
Responsibilities:
- Show workflow items.
- Create new workflows.
- Handle sidebar collapsed state.
- Use `useTransition` for actions.
Imports:
- `Link`, `usePathname`, `generateSlug`, `WorkflowNav` UI.
Exports: `WorkflowNav`.

### File: `features/workflows/components/canvas.tsx`
Purpose: workflow graph canvas.
Responsibilities:
- Initialize React Flow with `StepNode`.
- Use `useLiveblocksFlow` for realtime nodes and edges.
- Manage color mode based on theme.
Imports:
- Liveblocks flow hooks and styles.
- custom node type.
Exports: `Canvas`.

### File: `features/workflows/components/right-sidebar.tsx`
Purpose: workflow sidebar.
Responsibilities:
- Render action menu, run button, toolbar, and inspector tabs.
- Allow adding nodes and editing selected node fields.
- Gate premium nodes.
Imports:
- React Flow helpers.
- UI primitives.
- `useProPlan`, `useUpstreamConnections`, `validateGraph`, node registry.
Exports: `RightSidebar`.

### File: `features/workflows/components/step-node.tsx`
Purpose: custom node renderer.
Responsibilities:
- Display node title, icon, selected state.
- Show running/failure state.
- Render field values.
Imports:
- `Handle`, `Position`, `memo`.
- `useLatestRunSteps` for live status.
Exports: `StepNode`.

### File: `features/workflows/components/workflow-runs-provider.tsx`
Purpose: provide realtime run state.
Responsibilities:
- Subscribe to Trigger.dev runs tagged by workflow ID.
- Expose hooks to read latest run steps and live runs.
Imports:
- `useRealtimeRunsWithTag`.
Exports:
- `WorkflowRunsProvider`
- `useLatestRunSteps`
- `useLiveRun`
- `useConsoleRuns`

### File: `features/workflows/components/console-panel.tsx`
Purpose: workflow run console layout.
Responsibilities:
- Render logs panel and inspector panel.
- Own selection state.
Imports:
- `ResizablePanelGroup`
- `LogsPanel`, `InspectorPanel`
Exports: `ConsolePanel`.

### File: `features/workflows/components/inspector-panel.tsx`
Purpose: step/run output inspector.
Responsibilities:
- Show selected step error/output.
- Show replay player if a replay is selected.
Imports:
- `useConsoleRuns`, `SessionReplay`, `NodeIcon`
Exports: `InspectorPanel`.

### File: `features/workflows/components/logs-panel.tsx`
Purpose: run log list.
Responsibilities:
- List run steps and replay rows.
- Support selection toggling.
- Show run status and duration.
Imports:
- `useConsoleRuns`, `useProPlan`, `NodeIcon`, UI primitives.
Exports: `LogsPanel`.

### File: `features/workflows/components/session-replay.tsx`
Purpose: replay browser session.
Responsibilities:
- Poll `/api/replays/[sessionId]` until manifest is ready.
- Attach HLS manifest to `video` element.
- Handle browser HLS support and errors.
Imports:
- `Hls` library and icons.
Exports: `SessionReplay`.

### File: `features/workflows/hooks/use-pro-plan.ts`
Purpose: plan gating hook.
Responsibilities:
- Expose whether org is on Pro plan.
- Provide upgrade navigation callback.
Imports:
- `useAuth` from Clerk.
- `useRouter`.
Exports: `useProPlan`.

### File: `features/workflows/hooks/use-upstream-connections.ts`
Purpose: compute upstream node outputs for token insertion.
Responsibilities:
- Walk upstream graph edges to collect ancestor outputs.
- Return token metadata for insertion into node fields.
Imports:
- React Flow store utilities.
- node registry.
Exports: `useUpstreamConnections`.

### File: `features/workflows/lib/generate-slug.ts`
Purpose: generate workflow names.
Responsibilities:
- Create a unique slug for new workflows.

### File: `features/workflows/lib/interpolate.ts`
Purpose: runtime placeholder interpolation.
Responsibilities:
- Replace `{{ nodeId.path }}` placeholders with actual node outputs.
- Handle nested object/array paths.
Exports: `interpolate`.

### File: `features/workflows/lib/validate-graph.ts`
Purpose: validate workflow graph structure.
Responsibilities:
- Enforce exactly one start trigger.
- Confirm workflow has edges.
- Detect cycles.
Exports: `validateGraph`.

### File: `features/workflows/nodes/node-registry.ts`
Purpose: define workflow nodes.
Responsibilities:
- Declare node metadata, input fields, outputs.
- Provide type-safe registry and node type definitions.
Exports: `nodeRegistry`, `StepNodeType`, `NodeField`, `NodeDefinition`.

### File: `features/workflows/nodes/node-executors.ts`
Purpose: map nodes to runtime executors.
Responsibilities:
- Define executor signatures.
- Convert node values to actual runtime calls.
Exports: `nodeExecutors`, `NodeContext`, `NodeExecutor`.

### File: `features/workflows/nodes/open-url.ts`
Purpose: open a URL in browser session.
Responsibilities:
- Use Browserbase `Stagehand` to navigate page.
- Return URL and title.

### File: `features/workflows/nodes/act.ts`
Purpose: perform an instruction in browser.
Responsibilities:
- Use Stagehand `act()`.
- Return success, message, and current page URL.

### File: `features/workflows/nodes/extract.ts`
Purpose: extract data from page.
Responsibilities:
- Use Stagehand `extract()`.
- Return extraction result.

### File: `features/workflows/nodes/observe.ts`
Purpose: observe page elements.
Responsibilities:
- Use Stagehand `observe()`.
- Return selector matches.

### File: `features/workflows/nodes/agent.ts`
Purpose: run an autonomous agent.
Responsibilities:
- Use Stagehand `agent().execute()`.
- Return success, message, and completion status.

### File: `features/workflows/nodes/send-email.ts`
Purpose: send email node.
Responsibilities:
- Use Resend SDK to send an email.
- Return email ID.

### File: `features/workflows/tasks/run-workflow.ts`
Purpose: execute workflow graph.
Responsibilities:
- Load workflow graph from DB.
- Sort connected nodes with `toposort`.
- Manage step metadata and publish run state.
- Create Browserbase `Stagehand` session lazily.
- Execute each node executor and capture outputs.
- Handle failures and close browser session.
Exports: `runWorkflowTask`.

### File: `lib/utils.ts`
Purpose: helper utilities.
Responsibilities:
- Provide `cn()` class merge helper.
Exports: `cn`.

### File: `lib/browserbase.ts`
Purpose: server-side Browserbase client.
Responsibilities:
- Construct Browserbase SDK with secret API key.
Exports: `browserbase`.

### File: `lib/liveblocks.ts`
Purpose: server-side Liveblocks client.
Responsibilities:
- Construct Liveblocks SDK with secret key.
Exports: `liveblocks`.

### File: `lib/resend.ts`
Purpose: server-side Resend client.
Responsibilities:
- Construct Resend SDK with secret key.
Exports: `resend`.

### File: `lib/db/index.ts`
Purpose: database client initialization.
Responsibilities:
- Validate `DATABASE_URL`.
- Create Neon client.
- Initialize Drizzle ORM.
Exports: `db`, `schema`.

### File: `lib/db/schema.ts`
Purpose: define database schema and types.
Responsibilities:
- Defines `workflows` table.
- Defines `WorkflowGraph` JSON type.
Exports: `workflows`, `Workflow`, `WorkflowGraph`.

### File: `drizzle.config.ts`
Purpose: Drizzle ORM migration config.
Responsibilities:
- Configures migration folder.
- Reports schema location.

### File: `trigger.config.ts`
Purpose: Trigger.dev runtime config.
Responsibilities:
- Configure task directories and runtime options.

### File: `liveblocks.config.ts`
Purpose: Liveblocks type declaration configuration.
Responsibilities:
- Provide global `Liveblocks` metadata types for TypeScript.

### File: `Dockerfile`
Purpose: production container build.
Responsibilities:
- Build Next.js standalone app.
- Install dependencies and output deployable image.

### File: `postcss.config.mjs`
Purpose: PostCSS plugin config.
Responsibilities:
- Use Tailwind CSS plugin.

### File: `eslint.config.mjs`
Purpose: ESLint configuration.
Responsibilities:
- Enforce linting rules for the repo.

### File: `.prettierrc`
Purpose: Prettier formatting rules.
Responsibilities:
- Define formatting options and Tailwind plugin.

---

## 4. Component Walkthrough

### `Canvas` component
- Props: none.
- State: uses mounted check to avoid hydration mismatch.
- Hooks:
  - `useTheme()` to read theme mode.
  - `useSyncExternalStore()` to keep server/client render stable.
  - `useLiveblocksFlow()` to subscribe to collaborative nodes and edges.
- Rendering:
  - `ReactFlow` with custom `StepNode` type.
  - `Controls`, `Cursors`, and avatar stack.
- Why it exists: the central graph editor interface.
- Important details:
  - Uses `initialNodes` with a start trigger.
  - `fitView` for good layout.
  - `maxZoom` limit.

### `RightSidebar` component
- Props: `workflowId`.
- State:
  - selected tab (`toolbar` or `editor`).
  - selected React Flow node.
  - previously selected node id for auto switching.
- Hooks:
  - `useReactFlow()` to modify graph nodes and edges.
  - `useStore()` to read React Flow store.
  - `useProPlan()` for gated nodes.
  - `useUpstreamConnections()` for output insertion.
- Rendering:
  - Header with actions and run/cancel button.
  - Tabs for node palette and node editor.
- Why it exists: let users add nodes and edit properties.
- Important behavior:
  - Premium node gating for `agent`.
  - Adds nodes centered in current viewport.
  - Updates node values on field change.

### `StepNode` component
- Props: React Flow node props.
- State: none local; derives status from run state.
- Hooks:
  - `useLatestRunSteps()` for step run status.
- Rendering:
  - Node decoration with icon and title.
  - Running/failure border states.
  - Source and target handles.
- Why it exists: custom node presentation for the workflow canvas.
- Important details:
  - Memoized to avoid rerenders.
  - Shows node inputs if available.

### `LogsPanel` component
- Props: `selected`, `onSelect`.
- Hooks:
  - `useConsoleRuns()` to access run history.
  - `useProPlan()` to gate replay access.
- Rendering:
  - Lists runs with step rows.
  - Adds replay row when available.
- Important details:
  - Uses selection toggling.
  - Applies pro gating for replay.

### `SessionReplay` component
- Props: `sessionId`.
- State:
  - `status`: loading/ready/error/unsupported.
  - `renderedSessionId`: resets when session changes.
- Hooks:
  - `useEffect()` to poll replay manifest.
- Rendering:
  - Video player when ready.
  - Loading / error / unsupported messages.
- Why it exists: play back recordings safely through server proxy.
- Important details:
  - Polls `/api/replays/[sessionId]` until ready.
  - Uses hls.js fallback for Safari.

---

## 5. Explain Every Function

### `createWorkflowAction(name)`
- Purpose: create a new workflow and redirect to it.
- Parameters: `name` string.
- Returns: redirects to a new workflow page.
- Execution:
  1. Authenticates org via Clerk.
  2. Creates workflow row.
  3. Revalidates workflow list path.
  4. Redirects.
- Complexity: O(1) DB insert.
- Edge cases: throws if org missing.

### `deleteWorkflowAction(id)`
- Purpose: delete workflow and Liveblocks room.
- Parameters: workflow `id`.
- Returns: redirect to home.
- Execution:
  1. Auth validate org.
  2. Delete workflow row.
  3. Delete Liveblocks room.
  4. Revalidate and redirect.
- Complexity: O(1).
- Edge cases: workflow not found.

### `runWorkflowAction({id, graph})`
- Purpose: save graph and trigger a workflow run.
- Parameters: workflow `id`, `graph`.
- Returns: Trigger.dev handle.
- Execution:
  1. Auth validate org and plan.
  2. Validate agent node gating.
  3. Save graph.
  4. Trigger Trigger.dev task with tags.
- Complexity: O(n) where n is graph size.
- Edge cases: non-pro org uses agent node.

### `cancelWorkflowRunAction(runId)`
- Purpose: cancel live run.
- Parameters: run id.
- Returns: none.
- Execution: calls Trigger.dev `runs.cancel()`.

### `getWorkflow(orgId, id)`
- Purpose: load workflow.
- Parameters: org and id.
- Returns: workflow row.
- Complexity: O(1) query.

### `saveWorkflowGraph({orgId,id,graph})`
- Purpose: persist graph snapshot.
- Parameters: orgId, workflow id, graph.
- Returns: none.
- Execution:
  1. Validate graph.
  2. Update DB row.
- Complexity: O(n) for graph validation.

### `interpolate({text, outputs})`
- Purpose: resolve placeholder tokens.
- Parameters: field text and outputs map.
- Returns: string with replacements.
- Execution:
  1. Match `{{ ... }}` placeholders.
  2. Resolve dotted/bracketed path.
  3. Convert objects to JSON.
- Complexity: O(m * p) where m placeholders, p path length.
- Edge cases: missing path returns empty string.

### `validateGraph({nodes, edges})`
- Purpose: preflight graph validity.
- Parameters: workflow graph.
- Returns: list of problem strings.
- Execution:
  1. Count trigger nodes.
  2. Ensure edges exist.
  3. Detect cycles with `toposort`.
- Complexity: O(n + e).

### `runWorkflowTask.run({workflowId, orgId})`
- Purpose: orchestrate workflow execution.
- Parameters: workflowId, orgId.
- Returns: run output with steps and session id.
- Execution:
  1. Load workflow graph.
  2. Build node map and order.
  3. Publish pending steps.
  4. Lazily init Browserbase Stagehand.
  5. Execute each node.
  6. Update metadata status.
  7. Close browser session.
- Complexity: O(n + e) execution order plus node costs.
- Edge cases: cycles are prevented by validation, failed node throws and marks step failed.

---

## 6. Explain Every Custom Hook

### `useProPlan()`
- Why it exists: gate UI behavior by organization subscription.
- Problem solved: abstract Clerk plan checks.
- Internal state:
  - `isLoaded` from Clerk.
  - `isPro` boolean.
- Effects: none.
- Returns:
  - `isLoaded`
  - `isPro`
  - `goToUpgrade`
- Consumers:
  - `RightSidebar` palette and replay gating.

### `useUpstreamConnections()`
- Why it exists: build a list of available upstream output tokens.
- Problem solved: let node editors insert references to prior node results.
- Internal state:
  - uses React Flow store for `nodes`, `edges`, `selected`.
- Effects: memoized output list.
- Returns: array of token metadata.
- Consumers:
  - `Inspector` in the sidebar.

### `useLatestRunSteps()`
- Why it exists: read the most recent run steps.
- Problem solved: show live status in node UI.
- Returns: latest steps and `isLive` flag.
- Consumers:
  - `StepNode`

### `useLiveRun()`
- Why it exists: determine if a workflow has an in-flight run.
- Problem solved: toggle Run/Stop button.
- Returns: the live run or undefined.
- Consumers:
  - `RunButton`.

---

## 7. Explain State Management

### Where state lives
- Local component state in React UI.
- Graph state in React Flow store.
- Realtime shared state in Liveblocks.
- Workflow persistence in DB.
- Run state in Trigger.dev.
- Auth state in Clerk contexts.

### Global state
- Auth and org membership via Clerk.
- Theme with `ThemeProvider`.
- Sidebar open/collapse state via `SidebarProvider`.

### Local state
- Selected UI tab in `RightSidebar`.
- Selected step or replay in console panel.
- Input field values for node editing.

### Server state
- Workflow rows in database.
- Liveblocks room metadata.
- Trigger.dev run data.

### How updates propagate
- Liveblocks flow updates node/edge state instantly across clients.
- React Flow store reflects current graph.
- Server action writes graph snapshots to DB.
- Trigger.dev run metadata updates are pushed to subscribed clients.
- Replay availability is polled by the client.

### Re-render behavior
- `StepNode` uses `memo` to reduce rerenders.
- `useMemo` is used in run selection hooks and upstream connection lists.
- React Flow manages internal updates for node/edge changes.

---

## 8. Explain API Layer

### Liveblocks auth route
- Endpoint: `POST /api/liveblocks/auth`
- Request: none body.
- Response: Liveblocks identify token.
- Error handling: returns 401 if auth missing.
- Who calls it: client Liveblocks initialization.
- Lifecycle: called when the client connects to a Liveblocks room.

### Liveblocks users route
- Endpoint: `POST /api/liveblocks/users`
- Request: JSON `{ userIds: string[] }`.
- Response: list of user info or null.
- Error handling: 401 unauthorized, 400 invalid JSON.
- Who calls it: Liveblocks user resolver.

### Replay proxy route
- Endpoint: `GET /api/replays/[sessionId]`
- Request: session id path param.
- Response: 202 while processing, 200 HLS playlist, 403 if not Pro.
- Error handling: 401 unauthorized, 403 plan required, 202 not ready.
- Who calls it: `SessionReplay` component.
- Caching: `Cache-Control: no-store`.

---

## 9. Explain Database Layer

### Model: `workflows`
- Purpose: persist workflow metadata and execution graph.
- Fields:
  - `id` UUID primary key.
  - `orgId` owning organization.
  - `name` workflow display name.
  - `graph` JSON workflow graph.
  - `createdAt`, `updatedAt` timestamps.
- Relationships: no foreign keys in current schema beyond org ID string.
- CRUD operations:
  - Create with `createWorkflow()`.
  - Read with `getWorkflow()` and `listWorkflows()`.
  - Update graph with `saveWorkflowGraph()`.
  - Delete with `deleteWorkflow()`.

### How data flows into it
- New workflows are inserted by server actions.
- Graph snapshots are updated when the user runs or saves.
- Workflow pages load graph data from DB for editor initialization.

---

## 10. Explain Utility Files

### `lib/utils.ts`
- Problem solved: class name merging and Tailwind conflict resolution.
- Inputs: `ClassValue[]`.
- Outputs: merged string.
- Example: `cn('text-sm', isActive && 'text-bold')`.
- Why not inside components: reused across UI components.

---

## 11. Explain Configuration

### `package.json`
- Contains dependencies for Next.js, React, Clerk, Liveblocks, Trigger.dev, Browserbase, Neon, Drizzle, and UI libraries.
- Scripts include `dev`, `build`, `start`, `lint`, `format`, `typecheck`, and Drizzle DB commands.

### `tsconfig.json`
- Enables strict TypeScript and bundler resolution.
- Includes `next` plugin and alias `@/*`.

### `next.config.ts`
- Sets Next.js output to `standalone` for portable deployment.

### `drizzle.config.ts`
- Configures Drizzle migrations and schema generation.

### `trigger.config.ts`
- Configures Trigger.dev runtime options and task directories.

### `liveblocks.config.ts`
- Provides Liveblocks global type declarations.

### `postcss.config.mjs`
- Enables Tailwind CSS plugin.

### `eslint.config.mjs`
- Provides linting rules for the repo.

### `.prettierrc`
- Controls code formatting and Tailwind class order.

### `Dockerfile`
- Builds a standalone Next.js app image.
- Installs dependencies and generates production output.

---

## 12. Build Execution Flow

### `npm install`
Installs all dependencies, including Next.js, React, Clerk, Liveblocks, Trigger.dev, Browserbase, Neon, Drizzle, Tailwind, and TypeScript.

### `npm run dev`
Starts `next dev`.
Next.js compiles server and client bundles, starts the dev server, and watches files.

### Next.js starts
- Loads `app/layout.tsx`.
- Applies global CSS and providers.
- Routes requests to matching `app/` page or API route.

### React renders
- Server renders page shells and passes props to client components.
- Client hydrates with Clerk auth, Liveblocks session, and React Flow store.

### A user opens the homepage
- `app/(dashboard)/page.tsx` renders the empty workflow state and `NewWorkflowButton`.

### A button is clicked
- UI handlers update local or shared state.
- `NewWorkflowButton` triggers a server action to create a workflow.
- `Run` triggers `runWorkflowAction`.

### An API request is made
- Calls to `/api/liveblocks/*` or `/api/replays/[sessionId]` happen from client components.
- Server routes validate auth and forward requests to external SDKs.

### Data is stored
- Workflows are persisted to the `workflows` table.
- Graph snapshots are JSON saved via Drizzle.

### The page re-renders
- React Flow updates preserve canvas state.
- Liveblocks updates propagate graph changes to other clients.
- Trigger.dev run metadata updates refresh console panels.

---

## 13. Dependency Graph

### High-level dependency tree

- App
  - Page
    - Layout
      - Theme provider
      - Clerk provider
    - Feature
      - Workflow shell
        - Canvas
          - StepNode
        - Console panel
          - Logs panel
          - Inspector panel
            - Session replay
        - Right sidebar
          - Palette
          - Inspector
      - Workflow runs provider
    - API
      - Liveblocks auth
      - Liveblocks users
      - Replay proxy
    - Database
      - Workflow data queries
      - Drizzle/Neon connection

### Which files depend on which
- `app/(dashboard)/workflows/[id]/page.tsx` depends on workflow data, Liveblocks, and UI providers.
- `features/workflows/actions.ts` depends on Clerk auth, Liveblocks, `run-workflow` task, and workflow data.
- `features/workflows/tasks/run-workflow.ts` depends on node executors, workflow data, and Browserbase Stagehand.
- `features/workflows/components/canvas.tsx` depends on Liveblocks flow and custom nodes.
- `features/workflows/components/right-sidebar.tsx` depends on React Flow store, UI primitives, and plan gating.
- `lib/db/index.ts` depends on `process.env.DATABASE_URL` and sets up Neon/Drizzle.

---

## 14. Interview Questions

### For `app/(dashboard)/workflows/[id]/page.tsx`
- Why is Liveblocks room creation done server-side?
- Why does this page issue a public Trigger.dev token?
- Why use `notFound()` instead of redirect?

### For `runWorkflowAction()`
- Why gate the `agent` node at the server action level?
- Why save the graph before triggering the task?
- How does `runWorkflowAction` handle plan-based feature gating?

### For `run-workflow.ts`
- Why use `toposort` for node ordering?
- Why does the task open one shared Browserbase session lazily?
- How does the task publish live step state?

### For `Canvas` and `RightSidebar`
- Why wrap the canvas and sidebar in the same `ReactFlowProvider`?
- Why use `useLiveblocksFlow` instead of local React state?
- What happens when the sidebar adds a node?

### For `useUpstreamConnections()`
- Why traverse upstream nodes instead of only direct parents?
- How is the output token format chosen?

### For `SessionReplay`
- Why proxy the HLS manifest through a server route?
- What does status `202` mean in this context?

### For `lib/db/schema.ts`
- Why store the workflow graph as JSON instead of normalized tables?
- What are the tradeoffs of `jsonb` for workflow graphs?

---

## 15. Design Patterns

- **Composition:** `WorkflowShell` composes canvas, console, and sidebar.
- **Provider pattern:** `WorkflowRunsProvider`, `ThemeProvider`, `SidebarProvider`.
- **Custom hooks:** `useProPlan`, `useUpstreamConnections`, `useLatestRunSteps`, `useLiveRun`.
- **Server Actions:** `createWorkflowAction`, `runWorkflowAction`, `deleteWorkflowAction`.
- **Repository-like layer:** `features/workflows/data.ts` abstracts DB access.
- **Adapter pattern:** `node-executors.ts` adapts node metadata into runnable executor calls.
- **Observer pattern:** Liveblocks and Trigger.dev realtime subscriptions watch graph and run state.
- **Feature-based architecture:** `features/workflows` isolates the product feature.

---

## 16. Performance Analysis

### Memoization
- `StepNode` is memoized with `memo()`.
- `useMemo` is used in workflow run hooks and connection calculation.

### React.memo
- Used for `StepNode` to reduce rerenders as run state updates.

### Suspense
- `useLiveblocksFlow({ suspense: true })` may rely on suspense during initial load.

### Lazy loading
- Not explicitly shown; routes are loaded by Next.js when requested.

### Code splitting
- Next.js automatically code-splits by route.

### Caching
- Replay API sets `Cache-Control: no-store` because HLS manifests expire.

### Server Components
- Many `app/` pages and layout files are server components.
- Server-side layout loads data and auth before rendering.

### Potential bottlenecks
- Browserbase session creation on every run.
- Large workflow graphs in Liveblocks or DB JSON.
- Realtime updates on many concurrent clients.
- `SessionReplay` polling while waiting for replay availability.

---

## 17. How to Explain in an Interview

### 30-second explanation
This is a collaborative browser automation workflow editor built with Next.js, Clerk auth, Liveblocks collaboration, and Trigger.dev execution. Users build node graphs, run them in Browserbase browser sessions, and inspect live step state and replay.

### 2-minute explanation
The app provides a visual workflow canvas where teams add nodes like open URL, act, extract, observe, agent, and send email. Workflows are stored in Postgres, edited together in realtime with Liveblocks, and executed by a Trigger.dev task. Runtime steps publish metadata to the UI, and Browserbase records the session so users can replay it. Clerk handles organization auth and billing, and Pro-plan gating protects premium nodes and replay access.

### Deep technical explanation
A workflow is persisted as JSON in a stateful `workflows` table. The editor uses React Flow and Liveblocks to keep node and edge state synchronized across collaborators. When a workflow is run, a server action saves the current graph and triggers a Trigger.dev task tagged by workflow ID. The task loads the graph, resolves dependencies using topological sorting, and executes node handlers against a Browserbase Stagehand browser session. Each step publishes metadata via Trigger.dev so the UI can render live status and outputs. Completed runs optionally expose a session replay manifest served through a protected API route. All plan-based gating is enforced both client-side and server-side with Clerk.

### Common interviewer follow-up questions
- Why choose Liveblocks over a custom WebSocket backend?
- Why does the workflow persist graph JSON instead of a normalized schema?
- How would you scale this to many concurrent workflows?
- How does the app keep the canvas in sync with persisted state?
- How would you add versioning or undo/redo?

### Best answers
- Use Liveblocks for real-time graph sync because it avoids custom socket logic and provides presence and room ACLs.
- JSON persistence is simpler for flexible workflow graphs and avoids a complex schema for node configs.
- To scale, separate real-time collaboration from execution, shard rooms, and use task queue autoscaling.
- The canvas uses Liveblocks for real-time edits and persists snapshots only on save/run.
- Versioning could be layered by storing workflow commits or snapshots with metadata.

---

## 18. Beginner Notes

### What is happening?
The app shows a visual editor where each box is a workflow step. When you run it, the app saves your graph and executes the steps in order, much like a flowchart. The app also records the browser session so you can watch it later.

### Why is it written like this?
The shape of the workflow graph is flexible, so the app stores it as JSON and edits it in a canvas. Real-time collaboration is handled by Liveblocks because it avoids writing custom sync logic. Execution is handled by a task runner so it can run outside the browser and keep state safe.

### What would happen if this line were removed?
- If `WorkflowShell` did not wrap with `ReactFlowProvider`, the canvas and sidebar would not share graph state.
- If `saveWorkflowGraph` did not validate the graph, invalid cycles or missing triggers could break runs.
- If `runWorkflowAction` did not gate the `agent` node, a non-pro org might accidentally trigger a premium feature.
- If replay API route did not validate the Pro plan, users could access protected replays.

---

## 19. File Index

### Top-level files
- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `drizzle.config.ts`
- `trigger.config.ts`
- `liveblocks.config.ts`
- `Dockerfile`
- `.prettierrc`
- `postcss.config.mjs`
- `eslint.config.mjs`
- `README.md`
- `SECURITY.md`
- `CHANGELOG.md`
- `components.json`
- `proxy.ts`
- `specs/workflow-shell.md`
- `templates/node-registry.ts`
- `templates/step-node.tsx`
- `trigger/example.ts`
- `skills-lock.json`

### `app/`
- `layout.tsx`
- `globals.css`
- `favicon.ico`
- `test/page.tsx`
- `(auth)/sign-in/[[...sign-in]]/page.tsx`
- `(auth)/sign-up/[[...sign-up]]/page.tsx`
- `(auth)/choose-organization/page.tsx`
- `(dashboard)/layout.tsx`
- `(dashboard)/page.tsx`
- `(dashboard)/billing/page.tsx`
- `(dashboard)/workflows/[id]/page.tsx`
- `(dashboard)/workflows/[id]/loading.tsx`
- `(dashboard)/workflows/[id]/error.tsx`
- `(dashboard)/workflows/[id]/not-found.tsx`
- `api/liveblocks/auth/route.ts`
- `api/liveblocks/users/route.ts`
- `api/replays/[sessionId]/route.ts`

### `components/`
- `app-sidebar.tsx`
- `theme-provider.tsx`
- `ui/accordion.tsx`
- `ui/alert.tsx`
- `ui/alert-dialog.tsx`
- `ui/aspect-ratio.tsx`
- `ui/attachment.tsx`
- `ui/avatar.tsx`
- `ui/badge.tsx`
- `ui/breadcrumb.tsx`
- `ui/bubble.tsx`
- `ui/button.tsx`
- `ui/button-group.tsx`
- `ui/calendar.tsx`
- `ui/card.tsx`
- `ui/carousel.tsx`
- `ui/chart.tsx`
- `ui/checkbox.tsx`
- `ui/collapsible.tsx`
- `ui/combobox.tsx`
- `ui/command.tsx`
- `ui/context-menu.tsx`
- `ui/dialog.tsx`
- `ui/direction.tsx`
- `ui/drawer.tsx`
- `ui/dropdown-menu.tsx`
- `ui/empty.tsx`
- `ui/field.tsx`
- `ui/hover-card.tsx`
- `ui/input.tsx`
- `ui/input-group.tsx`
- `ui/input-otp.tsx`
- `ui/item.tsx`
- `ui/label.tsx`
- `ui/kbd.tsx`
- `ui/marker.tsx`
- `ui/menubar.tsx`
- `ui/message.tsx`
- `ui/message-scroller.tsx`
- `ui/native-select.tsx`
- `ui/navigation-menu.tsx`
- `ui/pagination.tsx`
- `ui/popover.tsx`
- `ui/progress.tsx`
- `ui/radio-group.tsx`
- `ui/resizable.tsx`
- `ui/scroll-area.tsx`
- `ui/select.tsx`
- `ui/separator.tsx`
- `ui/sheet.tsx`
- `ui/sidebar.tsx`
- `ui/skeleton.tsx`
- `ui/slider.tsx`
- `ui/spinner.tsx`
- `ui/sonner.tsx`
- `ui/switch.tsx`
- `ui/tabs.tsx`
- `ui/textarea.tsx`
- `ui/toggle.tsx`
- `ui/toggle-group.tsx`
- `ui/tooltip.tsx`

### `features/workflows/`
- `actions.ts`
- `data.ts`
- `data.ts` (workflow persistence and queries)
- `tasks/run-workflow.ts`
- `hooks/use-pro-plan.ts`
- `hooks/use-upstream-connections.ts`
- `lib/generate-slug.ts`
- `lib/interpolate.ts`
- `lib/validate-graph.ts`
- `nodes/node-registry.ts`
- `nodes/node-executors.ts`
- `nodes/open-url.ts`
- `nodes/act.ts`
- `nodes/extract.ts`
- `nodes/observe.ts`
- `nodes/agent.ts`
- `nodes/send-email.ts`
- `components/workflow-shell.tsx`
- `components/canvas.tsx`
- `components/right-sidebar.tsx`
- `components/step-node.tsx`
- `components/workflow-nav.tsx`
- `components/new-workflow-button.tsx`
- `components/workflow-runs-provider.tsx`
- `components/console-panel.tsx`
- `components/logs-panel.tsx`
- `components/inspector-panel.tsx`
- `components/session-replay.tsx`
- `components/room.tsx`

### `hooks/`
- `use-mobile.ts`

### `lib/`
- `utils.ts`
- `browserbase.ts`
- `liveblocks.ts`
- `resend.ts`
- `db/index.ts`
- `db/schema.ts`
- `db/migrations/0000_third_reaper.sql`
- `db/migrations/meta/_journal.json`
- `db/migrations/meta/0000_snapshot.json`

---

## 20. Summary

This repository is a fully-featured browser automation workflow editor and executor. It combines modern Next.js patterns, server actions, realtime collaboration, and external task/runtime services to deliver a product where non-engineers can build, run, and replay automated browsing workflows.

If you want, I can also create a second file with a strict per-source-file documentation format or generate separate documentation files in `docs/`.
