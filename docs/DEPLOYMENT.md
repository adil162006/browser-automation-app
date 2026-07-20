# Deployment

## Build Output

`next.config.ts` sets:

```ts
{
  output: "standalone"
}
```

`npm run build` uses Next.js 16.2.6/Turbopack and produces a standalone Node
server plus static assets.

## Docker Image

The Dockerfile has three stages:

1. `deps`: `npm ci` from `package-lock.json`.
2. `builder`: copy source, expose public Clerk build arguments, run
   `npm run build`.
3. `runner`: copy standalone output and static assets, run as UID/GID 1001.

Runtime:

```text
Base: node:22-bookworm-slim
NODE_ENV: production
HOSTNAME: 0.0.0.0
PORT: 3000
User: nextjs (non-root)
Command: node server.js
```

Example:

```bash
docker build \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_replace_me \
  -t browser-automation-app .

docker run --rm -p 3000:3000 --env-file .env.production \
  browser-automation-app
```

The build arguments also define Clerk sign-in/sign-up URLs and fallback
redirects, with the same defaults as `.env.example`.

## Required Deployment Units

### Next.js web service

Runs pages, route handlers, Server Actions, and server-side SDK calls.

### Trigger.dev worker

`features/workflows/tasks/run-workflow.ts` must be deployed to the Trigger.dev
project in `trigger.config.ts`. The repository does not provide an npm deploy
script or deployment workflow.

### Neon database

Apply `npm run db:migrate` against the target database before serving traffic.

### External configuration

- Clerk: users, organizations, organization task, Billing plan slug `pro`.
- Liveblocks: secret key and private room support.
- Browserbase: API key and Model Gateway access for the hardcoded Stagehand
  model.
- Resend: API key and permitted sender/recipient behavior.

## Environment Separation

No staging/production config files are checked in. Use the hosting platform's
secret manager and distinct service projects/databases per environment.

## CI/CD

**Not implemented in the current codebase.** There are no files under
`.github/workflows/`.

A production pipeline should:

1. install with `npm ci`;
2. run typecheck, lint, and tests;
3. build the Next.js app;
4. apply reviewed migrations;
5. deploy Trigger.dev tasks;
6. deploy the web image;
7. perform authenticated smoke checks.

## Hosting

No hosting provider is declared. The standalone image can run on any platform
that supports a long-lived Node.js container and streaming responses.

## Docker Risks

- `.env.*` files are excluded from the Docker context.
- Only public Clerk values are provided to the builder.
- Server modules contain top-level environment-dependent clients; verify the
  container build in CI with the intended build environment.
- No health endpoint or container `HEALTHCHECK` exists.
- No resource limits, replicas, ingress, TLS, or autoscaling config exists.

See [Configuration](CONFIGURATION.md) and
[Environment Variables](ENVIRONMENT_VARIABLES.md).

