# Security Guide

## Security Model

Clerk authenticates users and identifies the active organization. The
organization ID is the tenant key for database access, Liveblocks rooms, and
premium billing checks. External service secrets remain in server modules and
environment variables.

## Authentication and Sessions

- `proxy.ts` protects application and API routes.
- Server code uses Clerk `auth()` and `currentUser()`.
- Client plan UI uses `useAuth()`.
- Clerk owns session cookies/tokens.
- No custom JWT or session database exists.

The local `sidebar_state` cookie is not security-sensitive and is not marked
HttpOnly, Secure, or SameSite in source.

## Authorization

Strengths:

- Tenant predicates on workflow reads, writes, and deletes.
- Task repeats tenant-scoped workflow read.
- Liveblocks rooms default to no access and grant the owning org group write.
- Clerk user resolution restricts results to the active organization.
- Agent and replay have server-side Pro checks.

Gaps:

- Cancellation does not verify run ownership.
- Replay does not verify Browserbase session ownership.
- No role/permission checks within an organization.
- Graph payloads lack complete runtime validation.

## Secrets Management

Required secrets are gitignored and represented by placeholders in
`.env.example`. `.clerk/`, `.trigger/`, and `.env.local` are ignored. Server
clients import secret values only in server paths.

Risks:

- SDK clients use non-null assertions rather than centralized validation.
- Trigger project ID, Stagehand model, Pro plan slug, and Resend sender are
  hardcoded.
- No secret rotation procedure or deployment secret manager is defined.

## CSRF

No application-level CSRF token or custom Origin validation is implemented.
Server Actions and Clerk session middleware provide framework/provider
boundaries, but this repository does not configure additional allowed origins
or CSRF defenses.

## XSS

- React escapes rendered text by default.
- Step outputs are rendered inside `<pre>` as text.
- Node field values are rendered as text.
- The Send Email node forwards its body as `html` to Resend. It is not injected
  into this web application, but email HTML is user-controlled and should be
  treated as untrusted content.
- No Content Security Policy is configured.

## SQL Injection

Drizzle query builders parameterize current database operations. No raw SQL is
constructed from user input at runtime. Migration SQL is static.

## Browser Automation Risks

Workflow authors can navigate to arbitrary URLs and instruct an AI browser
agent. There is no URL scheme/host allowlist, egress policy, target ownership
verification, or content policy in application code. Browserbase isolates
browser execution from the Next.js process, but abuse and data-access controls
still need explicit product policy.

## Input Validation

Implemented:

- Liveblocks users JSON shape.
- Basic graph trigger/edge/cycle rules.
- Clerk auth and Pro checks.

Missing:

- Runtime schemas for Server Actions and task payloads.
- UUID/run/session ID validation.
- Required node fields and URL/email validation.
- Node/edge count and field-size limits.
- Registry membership and edge endpoint checks.
- Liveblocks user ID batch limit.

## Retry and Side Effects

Trigger.dev retries are enabled in development and production, with three
attempts. The task retries as a whole. Successful earlier steps can run again
after a later failure. Send Email has no idempotency key, so duplicate email is
a production risk.

## Headers and Network Controls

**Not implemented in the current codebase:**

- Content Security Policy;
- custom HSTS, frame, referrer, or permissions headers;
- application rate limiting;
- CORS configuration;
- WAF or bot protection;
- webhook signature verification;
- audit logging;
- data retention/deletion policy.

## Priority Hardening

1. Bind Trigger.dev run and Browserbase session ownership to org/workflow.
2. Add runtime schemas and request size limits.
3. Add idempotency/checkpointing for side effects.
4. Add CSP and other production security headers.
5. Add rate limiting for API routes and expensive actions.
6. Add database index, audit records, and security tests.
7. Add URL/egress controls appropriate to the browser automation product.

