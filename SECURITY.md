# Security Policy

## Supported Versions

The project is in initial development and has no published release line. Only
the current `main` branch receives security fixes.

## Reporting a Vulnerability

Do not open a public issue for an unpatched vulnerability.

Use GitHub private vulnerability reporting if it is enabled for the repository.
Otherwise, contact the repository owner privately through the contact
information on the GitHub profile. No dedicated security email is configured in
the current codebase.

Include:

- affected route, action, component, or dependency;
- reproduction steps or a minimal proof of concept;
- expected impact and tenant boundary implications;
- suggested remediation, if known.

Do not access data that is not yours, disrupt external services, or retain
credentials or personal data while researching a report.

## Security-Sensitive Areas

- Clerk session and organization checks in `proxy.ts` and Server Actions
- Tenant filters in `features/workflows/data.ts`
- Liveblocks room identity and access configuration
- Trigger.dev public tokens and run cancellation
- Browserbase replay authorization
- Workflow graph validation and Stagehand navigation targets
- Resend side effects and Trigger.dev retries
- Database and service credentials

See [docs/SECURITY_GUIDE.md](docs/SECURITY_GUIDE.md) for the implementation audit
and known hardening work.
