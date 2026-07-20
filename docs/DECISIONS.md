# Decisions

This record captures decisions visible in the implementation, not proposed
future architecture.

## D-001: App Router and Server Components

**Decision:** Use Next.js App Router with Server Components by default.

**Reason:** Authenticated data access, route protection, and external SDK calls
remain server-side while interactive editing stays in explicit client
boundaries.

**Evidence:** `app/`, `proxy.ts`, `app/layout.tsx`, workflow client components.

## D-002: Organization ID as Tenant Key

**Decision:** Use Clerk's active `orgId` as the workflow tenant identifier.

**Reason:** The product is organization-oriented and Clerk already owns
identity/membership.

**Evidence:** `features/workflows/data.ts`, Liveblocks group access, sidebar
organization switcher.

## D-003: Liveblocks for Editing, Postgres for Run Snapshots

**Decision:** Keep collaborative editing in Liveblocks and save a canonical JSON
graph to Postgres when Run is selected.

**Reason:** Collaboration needs realtime synchronization; the task needs a
server-readable stable snapshot.

**Trade-off:** Editing is not autosaved to Postgres and there is no revision
history.

## D-004: Trigger.dev for Execution

**Decision:** Execute workflows as a durable Trigger.dev task.

**Reason:** Browser automation and email delivery can exceed a request lifetime;
the task provides retries, metadata, tags, and realtime run state.

**Trade-off:** Whole-task retries can repeat side effects.

## D-005: One Browserbase Session per Run

**Decision:** Initialize Stagehand lazily and reuse one session through a run.

**Reason:** Preserve browser state between nodes and create a single replay.

## D-006: Registry-Driven Nodes

**Decision:** Store node type metadata in `node-registry.ts` and pair each action
with a registry-checked executor.

**Reason:** Palette, inspector, node rendering, output interpolation, and task
execution share one contract.

## D-007: Pro Plan Gates

**Decision:** Gate Agent and replay with Clerk Billing plan slug `pro`.

**Reason:** These capabilities are treated as higher-cost features.

**Trade-off:** Plan slug and feature mapping are hardcoded.

## D-008: Standalone Docker Output

**Decision:** Build a self-contained Node deployment using Next standalone
output.

**Reason:** The app can run as a small non-root container without shipping the
full source/dependency tree.

## D-009: No Application Run Tables

**Decision:** Read run history from Trigger.dev realtime data instead of
duplicating runs in Postgres.

**Reason:** Reduce initial schema scope.

**Trade-off:** Application reporting, audit history, and durable cross-run
ownership lookups are unavailable.

