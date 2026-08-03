# Production Readiness Checklist

This checklist adapts the `addyosmani/agent-skills` production-grade flow to MedEngs OfficeAgent.

## Current launch gate
Run before every deployment:

```bash
npm run verify
```

Gate coverage:
- TypeScript strict mode.
- ESLint with Next.js Core Web Vitals rules.
- Vitest tests for validation and readiness logic.
- Next.js production build.
- Moderate-or-higher npm audit gate.

## Security baseline
- Security headers configured in `next.config.ts`.
- `/api/agent/tasks` validates all request bodies with Zod.
- `/api/clinic/profile` validates operating profiles with Zod and rejects mismatched `x-clinic-slug` tenant writes.
- `/api/clinic/profile` requires a signed `x-flawgent-session`; write access is limited to `owner` and `manager`.
- Clinic profile persistence is limited to non-PHI setup data until database-backed encryption is implemented.
- Human approval is required by default for patient-facing/outbound actions.
- Raw PHI and prompts must not be logged.
- Secrets must stay in 1Password/env vars; never in repo.
- Prisma schema separates tenant (`ClinicAccount`) and patient-scoped records.

## Deployment baseline
- Dockerfile uses a multi-stage standalone Next.js build.
- Runtime process runs as a non-root user.
- Coolify health endpoint: `/api/health`.
- Required production env vars:
  - `NEXT_PUBLIC_APP_URL`
  - `DATABASE_URL`
  - `CLINIC_PROFILE_STORE_PATH`
  - `ENCRYPTION_KMS_KEY_REF`
  - `APP_ACCESS_TOKEN`
  - `SESSION_SECRET`

## Beta launch blockers still requiring real integration work
- External authentication/session provider selection and implementation; current clinic API sessions are signed internal tokens.
- Real encrypted PHI persistence and KMS/envelope encryption implementation.
- Promotion of tenant profile persistence from file-backed setup data into the selected database layer.
- Cloud storage connector authorization for clinic-owned Drive/OneDrive/SharePoint.
- Billing/KYC/Stripe activation.
- Real patient-link token hashing and PDF generation pipeline.
- Error reporting provider and production monitoring dashboard.
- Legal review of clinic service agreement, DPA/BAA-style processor terms, privacy policy, and incident response policy.

## Rollback plan
- Keep deployments immutable by Git SHA/image tag.
- Deploy with new patient messaging disabled until staff validates a clinic account.
- If health endpoint fails in production, roll back to previous image and keep the database untouched.
- Never run destructive migrations without a backup and explicit approval.
