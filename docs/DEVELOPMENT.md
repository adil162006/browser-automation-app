# Development

## Prerequisites

- Node.js 22
- npm
- External service projects for Clerk, Neon, Liveblocks, Trigger.dev,
  Browserbase, and Resend

## Setup

```bash
npm ci
```

Create `.env.local` from `.env.example`. The file is gitignored.

Apply the database migration:

```bash
npm run db:migrate
```

Start the web application:

```bash
npm run dev
```

Start a Trigger.dev development worker separately when exercising Run. The
current repository does not define a Trigger.dev npm script or include its CLI
binary as a direct dependency.

## External Service Setup

### Clerk

- Configure the publishable and secret keys.
- Enable Organizations; the UI hides personal accounts.
- Configure sign-in and sign-up routes.
- Enable Clerk Billing for organizations.
- Create a plan with slug `pro`.
- Ensure the choose-organization task resolves to `/choose-organization`.

### Neon and Drizzle

- Put the pooled/serverless URL in `DATABASE_URL`.
- Put a direct URL in `DATABASE_URL_UNPOOLED` for migration commands when
  available.
- Run `npm run db:migrate`.

### Liveblocks

- Configure `LIVEBLOCKS_SECRET_KEY`.
- The app uses ID-token auth, not a public client key.
- Rooms are created lazily when a workflow page loads.

### Browserbase

- Configure `BROWSERBASE_API_KEY`.
- The same key initializes the SDK, Stagehand session, and Browserbase Model
  Gateway.
- Stagehand uses `google/gemini-2.5-flash`.

### Resend

- Configure `RESEND_API_KEY`.
- The executor sends from `onboarding@resend.dev`; Resend account restrictions
  may limit recipients until a domain is configured.

### Trigger.dev

- Configure `TRIGGER_SECRET_KEY`.
- The project ref is hardcoded in `trigger.config.ts`.
- Production tasks are discovered under `features/`.
- `trigger/example.ts` is not included by the current `dirs` setting.

## Common Commands

```bash
npm run typecheck
npm run lint
npm run format
npm run build
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:studio
```

## Adding Features

For a workflow node, follow [CONTRIBUTING.md](../CONTRIBUTING.md). For database
changes, update the schema, generate a migration, review SQL, apply it, and
update database documentation.

## Local Data Behavior

- Creating a workflow writes Postgres immediately.
- Editing writes Liveblocks, not Postgres.
- Running writes the graph snapshot and invokes Trigger.dev.
- Deleting writes Postgres first and Liveblocks second.

## Repository-Specific Guidance

- Use the installed Next.js docs under `node_modules/next/dist/docs/`.
- Promise-based route `params` are the expected Next.js 16 convention.
- Escape literal apostrophes/quotes in JSX text.
- Do not hand-write database row shapes.
- Keep Trigger.dev changes aligned with installed project skills.

