# MedEngs OfficeAgent for Dental

Production-oriented Next.js MVP for a Canadian dental-clinic AI back office: forms, PDFs, branded patient links, clinic cloud files, patient admin memory, task/follow-up flags, and compliance-first auditability.

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
- Coolify health/readiness: `/api/health`
- Validated staff-review task API: `POST /api/agent/tasks`

## Deploy with Docker / Coolify
```bash
docker build -t medengs-officeagent .
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  -e DATABASE_URL=postgresql://officeagent:officeagent@db:5432/officeagent \
  -e ENCRYPTION_KMS_KEY_REF='op://Shared – DevOps/medengs-officeagent-kms/key' \
  medengs-officeagent
```

Coolify should use port `3000` and health path `/api/health`.

## Production posture added from agent-skills workflow
- Security headers and CSP in `next.config.ts`.
- Health/readiness checks in `lib/production-readiness.ts`.
- Boundary validation with Zod in `lib/validation.ts` and `/api/agent/tasks`.
- Staff approval remains the default for outbound communication.
- Prisma schema has tenant-scoped relations, indexes, audit events, and PHI encryption placeholders.
- CI workflow runs the full quality gate.

## Docs
- `docs/PRODUCT_SPEC.md`
- `docs/PRODUCTION_READINESS.md`
- `docs/COMPLIANCE_SECURITY.md`
- `docs/PMS_INTEGRATION.md`
- `docs/TUTORIAL.md`
- `docs/PRICING.md`
