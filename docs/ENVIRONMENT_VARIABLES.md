# Environment Variables

Values below are names and scopes only. Use secret managers or local ignored
files for real values.

## Required Variables

| Variable | Scope | Used by | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Browser/build | Clerk provider, Docker build | Clerk public client key |
| `CLERK_SECRET_KEY` | Server | Clerk server SDK | Clerk server authentication and user queries |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Browser/build | Clerk conventions | Sign-in route |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Browser/build | Clerk conventions | Sign-up route |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Browser/build | Clerk conventions | Sign-in fallback |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | Browser/build | Clerk conventions | Sign-up fallback |
| `DATABASE_URL` | Server | `lib/db/index.ts` | Pooled Neon runtime connection |
| `DATABASE_URL_UNPOOLED` | Migration tooling | `drizzle.config.ts` | Direct migration connection; falls back to `DATABASE_URL` |
| `TRIGGER_SECRET_KEY` | Server/Trigger CLI | Trigger.dev SDK | Trigger task dispatch and public tokens |
| `LIVEBLOCKS_SECRET_KEY` | Server | `lib/liveblocks.ts` | Liveblocks server authentication and rooms |
| `BROWSERBASE_API_KEY` | Server/Trigger | Browserbase SDK and task | Browser sessions, model gateway, replay metadata |
| `RESEND_API_KEY` | Server/Trigger | `lib/resend.ts` | Email node delivery |

## Present Locally but Not Referenced

`NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY` exists in the local environment inventory but
is not read by application source. The current Liveblocks integration uses the
server `authEndpoint` and `LIVEBLOCKS_SECRET_KEY` instead. It is omitted from
`.env.example` because it is not required by the implementation.

## Docker-Provided Values

The Dockerfile sets or accepts:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` build argument;
- Clerk public sign-in/sign-up route arguments;
- `NODE_ENV=production`;
- `HOSTNAME=0.0.0.0`;
- `PORT=3000`;
- `NEXT_TELEMETRY_DISABLED=1`.

Server secrets are expected at container runtime, not checked into the image.

## Validation

The current source validates only `DATABASE_URL` explicitly at module load.
Other service clients use non-null assertions and may fail later or produce
provider-specific errors if a secret is absent.

## Local Setup

```powershell
Copy-Item .env.example .env.local
```

Then replace every placeholder. `.env.local` is ignored by Git.

