# MedEngs OfficeAgent — Saved Progress Checkpoint

Last updated: 2026-07-06 14:10 MDT

## Current state
The app is technically healthy and now has the first real clinic onboarding foundation: signed tenant/user clinic sessions, role-gated profile management, tenant-scoped dental operating profile API, file-backed profile persistence, and a setup screen that surfaces whether the profile is saved or still default. It is still **not usable with real patient/clinic data yet**.

Live URL: https://officeagent.rainomotion.com
Coolify app UUID: `mej514vvroeqs867055bgter`
Coolify project UUID: `viyq2soh79fgsffwtmxiuehy`
Deploy repo: https://github.com/rainollm-ca/medengs-officeagent
Workspace project path: `projects/medengs-officeagent`

## Completed
- Next.js app foundation exists.
- Production readiness scaffold added:
  - security headers/CSP
  - `/api/health`
  - interactive staff-review task queue demo via `/api/agent/tasks`
  - Zod validation
  - Vitest tests
  - flat ESLint config
  - Dockerfile + `.dockerignore`
  - CI workflow
  - production/security docs
  - Prisma schema draft
- Clinic operating profile foundation:
  - `/setup` control screen
  - `GET /api/clinic/profile`
  - `POST /api/clinic/profile`
  - tenant scoping with `x-clinic-slug`
  - signed clinic session enforcement with `x-flawgent-session`
  - profile write access limited to `owner` and `manager`
  - file-backed non-PHI profile persistence through `CLINIC_PROFILE_STORE_PATH`
  - enforced approval boundaries for patient messages, clinical notes, and PMS writes
- `npm run verify` passes locally.
- Deployed to Coolify and verified externally:
  - `/` returns HTTP 200
  - `/dashboard` returns HTTP 200
  - `/api/health` returns HTTP 200 / status `pass`
- Docker runtime image includes `curl` so Coolify health checks pass.

## Important caveat
The current deployment uses scaffold/demo functionality plus durable non-PHI clinic setup data. It does **not** yet provide a functional clinic back-office agent.

## Not usable yet because
- No real authentication/session provider is implemented.
- No external user login provider is implemented yet; current clinic API auth uses signed internal tenant/user session tokens plus the production Bearer-token access gate.
- Clinic profile persistence is file-backed and tenant-scoped, but task/workflow persistence is not database-backed.
- `/api/agent/tasks` now supports a validated GET/POST runtime demo queue, but it is not database-backed persistence.
- Prisma was intentionally removed from dependencies after Prisma 7 introduced a moderate audit advisory through `@prisma/dev`; schema draft is retained for later migration.
- No real encrypted PHI persistence/KMS envelope encryption is implemented.
- No cloud storage connector authorization exists yet for Drive/OneDrive/SharePoint.
- No billing/subscription activation exists yet.
- No real AI agent orchestration or clinic workflow execution is wired.
- No full self-serve onboarding flow exists yet beyond the operating profile foundation.

## Deployment notes
- First Coolify deployment built but rolled back because the runtime image lacked `curl` for health checks.
- Fixed by adding `apk add --no-cache curl` in the final Dockerfile image.
- Successful deploy commit in workspace: `47f164b9`.
- Successful deploy commit in deploy repo: `7fb0ab8c`.
- Deployment id: `s2mryxz1bezw932ts55lhvs3`.

## Resume plan
1. Add external login provider/OIDC around the signed clinic session boundary.
2. Re-add database layer with a safe Prisma version or alternate ORM once audit gate is clean.
3. Replace `/api/agent/tasks` runtime demo queue with database-backed CRUD and audit events.
4. Promote the clinic profile store into the selected database layer.
5. Add tenant/role boundaries.
6. Add encrypted document/task storage model before any PHI-like usage.
7. Wire one real agent action behind human approval.
8. Re-run `npm run verify`, deploy to Coolify, and verify `/api/health` + actual user flow.

## Safety reminder
Do not treat the current deployment as production-usable for patient/clinic data. It is a hosted scaffold only.
