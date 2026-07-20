# Configuration

## Next.js

`next.config.ts` enables standalone output:

```ts
const nextConfig: NextConfig = {
  output: "standalone",
}
```

No redirects, rewrites, headers, image domains, experimental flags, or runtime
segment overrides are configured.

## TypeScript

`tsconfig.json` uses:

- strict type checking;
- ES2017 target with DOM and ESNext libraries;
- bundler module resolution;
- JSX automatic runtime;
- incremental compilation;
- Next TypeScript plugin;
- `@/*` mapped to the repository root.

## ESLint and Formatting

ESLint uses Next core web vitals and TypeScript configs. It ignores `.next`,
`out`, `build`, and generated `next-env.d.ts`.

Prettier uses no semicolons, double quotes, two-space indentation, LF endings,
80-column print width, and Tailwind class sorting.

## Tailwind and UI

Tailwind CSS 4 is loaded through `@tailwindcss/postcss`. Theme variables and
dark mode are defined in `app/globals.css`. shadcn is configured for:

- `radix-nova` style;
- neutral base color;
- CSS variables;
- Lucide icons;
- React Server Components;
- `@/components`, `@/lib`, `@/hooks` aliases.

## Database

`drizzle.config.ts`:

- loads `.env.local`;
- uses `DATABASE_URL_UNPOOLED ?? DATABASE_URL`;
- reads `lib/db/schema.ts`;
- writes migrations to `lib/db/migrations`;
- targets PostgreSQL;
- uses snake_case casing;
- enables verbose and strict mode.

## Trigger.dev

`trigger.config.ts`:

| Setting | Value |
| --- | --- |
| Project | `proj_obahqirvbjiataxtqyd` |
| Runtime | Node |
| Log level | `log` |
| Max duration | 3600 seconds |
| Dev retries | Enabled |
| Default attempts | 3 |
| Backoff | 1,000 to 10,000 ms, factor 2, randomized |
| Task directories | `features` |

## Clerk

`proxy.ts` contains the public route matcher. `app/layout.tsx` configures
Clerk's shadcn appearance and organization task URL. Clerk Billing is rendered
by the billing page; the application assumes a plan slug `pro`.

## Liveblocks

`liveblocks.config.ts` declares `UserMeta` with:

```ts
{
  id: string
  info: {
    name: string
    avatar?: string
  }
}
```

The client provider uses 16 ms throttling and server auth endpoints.

## Docker

The Dockerfile uses Node 22, standalone output, public Clerk build arguments,
runtime port 3000, and a non-root user. See [Deployment](DEPLOYMENT.md).

## Configuration Not Present

- no `.env.production` or staging templates;
- no `docker-compose.yml`;
- no CI configuration;
- no host-specific deployment manifest;
- no application logging/telemetry config;
- no feature flag file;
- no test runner config.

