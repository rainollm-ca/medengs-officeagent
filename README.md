# Flowgent by MedEngs / MedEngs OfficeAgent

Production-oriented Next.js demo for a Canadian dental-clinic AI front desk: receptionist-first phone/web/WhatsApp workflows, forms, PDFs, branded patient links, dental note drafts, employee admin, clinic cloud files, patient admin memory, task/follow-up flags, and compliance-first auditability.

## Start
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Quality gate
```bash
npm run verify
```

`verify` runs typecheck, ESLint, Vitest, production build, and `npm audit --audit-level=moderate`.

## Production endpoints
- App: `/`
- Demo clinic dashboard: `/dashboard`
- Clinic setup/control screen: `/setup`
- Dentist/hygienist notes copilot: `/clinical-notes`
- Coolify health/readiness: `/api/health`
- Tenant-scoped clinic profile: `GET /api/clinic/profile` and `POST /api/clinic/profile`
- Interactive staff-review task queue demo: `GET /api/agent/tasks` and `POST /api/agent/tasks`
- Provider-review clinical note drafts: `GET /api/clinical-notes/drafts` and `POST /api/clinical-notes/drafts`

Use the `x-clinic-slug` request header to read/write a specific tenant profile. Profile persistence is file-backed through `CLINIC_PROFILE_STORE_PATH` and is intended for non-PHI clinic setup data only until the database/encryption layer is promoted.
Clinic profile APIs also require `x-flawgent-session`, an HMAC-signed session token containing tenant slug, user email, role, and expiry. Profile writes are limited to `owner` and `manager` roles.

## Deploy with Docker / Coolify
```bash
docker build -t medengs-officeagent .
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  -e DATABASE_URL=postgresql://officeagent:officeagent@db:5432/officeagent \
  -e CLINIC_PROFILE_STORE_PATH=/app/data/clinic-profiles.json \
  -e ENCRYPTION_KMS_KEY_REF='op://Shared – DevOps/medengs-officeagent-kms/key' \
  -e APP_ACCESS_TOKEN='replace-with-deployment-secret' \
  -e SESSION_SECRET='replace-with-deployment-secret' \
  medengs-officeagent
```

Coolify should use port `3000` and health path `/api/health`.

## Production posture added from agent-skills workflow
- Security headers and CSP in `next.config.ts`.
- Health/readiness checks in `lib/production-readiness.ts`.
- Boundary validation with Zod in `lib/validation.ts` and `/api/agent/tasks`.
- Clinic operating profiles are tenant-scoped and reject mismatched tenant writes.
- Clinic profile reads/writes require signed tenant/user sessions; writes require owner or manager role.
- Production access guard fails closed unless `APP_ACCESS_TOKEN` is configured and sent as a Bearer token.
- Staff approval remains the default for outbound communication.
- Provider approval remains mandatory for clinical note drafts.
- Prisma schema has tenant-scoped relations, indexes, audit events, and PHI encryption placeholders.
- CI workflow runs the full quality gate.

## Docs
- `docs/PRODUCT_SPEC.md`
- `docs/PRODUCTION_READINESS.md`
- `docs/COMPLIANCE_SECURITY.md`
- `docs/PMS_INTEGRATION.md`
- `docs/TUTORIAL.md`
- `docs/PRICING.md`
