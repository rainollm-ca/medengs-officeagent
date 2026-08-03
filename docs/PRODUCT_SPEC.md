# Spec: MedEngs OfficeAgent for Dental

## Objective
Build a web-first, account-based subscription SaaS for dental clinics: a comprehensive AI office agent that manages clinic forms, branded patient links, PDF creation/editing, patient admin memory, task/follow-up flags, and clinic-controlled cloud storage.

This is not a generic ChatGPT wrapper. The product is a clinic workspace with tools, audit logs, templates, and task execution.

## Assumptions
1. MVP is web SaaS first; mobile app/native wrappers come later.
2. MVP is PMS-agnostic; Paradigm/Open Dental/ClearDent integrations are future connectors.
3. Clinic is the health information custodian/controller; MedEngs is a service provider/processor.
4. Canadian privacy posture is required from day one: PHIPA/PIPEDA-conscious, Canada-hosted preference, no AI training on patient data.
5. Patient-facing communication starts with human approval gates.
6. Clinic-owned cloud storage integration starts with Google Drive / Microsoft OneDrive / SharePoint; local MedEngs DB stores metadata and encrypted patient index.

## BMAD Framing
- Business: recurring dental admin pain; clinics pay monthly to reduce paper/forms/PDF/reception workload.
- Market: Ontario/Canada dental clinics, especially clinics still using paper forms or fragmented PDFs.
- Architecture: multi-tenant SaaS with encrypted data, role-based access, agent tools, clinic cloud storage connectors.
- Delivery: MVP as a minimal-maintenance Next.js app deployable on Coolify with Postgres and object storage/cloud connectors.

## MVP Scope
### Included
- Marketing landing page.
- Clinic subscription/account model placeholder.
- Clinic onboarding: clinic name, logo, colors, destination email.
- Patient index: patient number, name, contact, flags.
- Form library: intake, medical history update, consent, referral, financial policy.
- Patient link workflow: secure token concept, completion status, PDF output routing.
- Detailed new-patient intake module spec: `docs/NEW_PATIENT_INTAKE_SPEC.md`.
- AI agent workspace mock: task-oriented commands for forms/PDFs/follow-ups.
- Clinic inbox: incomplete forms, urgent flags, missing signatures, follow-ups.
- Security/compliance documentation and implementation hooks.
- Tutorial/runbook for setup and maintenance.

### Excluded from MVP
- Direct PMS database access.
- Automated patient messaging without staff approval.
- Clinical diagnosis/advice.
- Payment/live Stripe until account/KYC is ready.
- Native iOS/Android apps.

## Tech Stack
- Framework: Next.js App Router + TypeScript.
- Styling: plain CSS modules/global CSS for minimal dependency maintenance.
- Database target: PostgreSQL with future Prisma/Drizzle layer.
- Auth target: Auth.js/Clerk/Supabase Auth; MVP scaffold uses interfaces/placeholders.
- Billing target: Stripe Checkout + Customer Portal.
- Storage target: clinic-owned Google Drive / OneDrive / SharePoint; S3-compatible storage optional.
- AI target: provider-abstracted agent tools; no patient data model training.
- Hosting: Coolify container deployment.

## Commands
- Install: `npm install`
- Dev: `npm run dev`
- Typecheck: `npm run typecheck`
- Build: `npm run build`
- Lint: `npm run lint`

## Project Structure
```text
projects/medengs-officeagent/
  app/                    Next.js routes/pages
  components/             UI components
  lib/                    Domain models, sample data, security helpers
  docs/                   Product, compliance, integration, maintenance docs
  prisma/                 Future database schema
  public/                 Static assets
```

## Core Data Model
- ClinicAccount: plan, branding, cloud connection, configured emails.
- ClinicUser: role, permissions, MFA status.
- PatientRecord: clinic-scoped patient number, demographics, flags, metadata.
- FormTemplate: canonical and clinic-custom forms.
- FormSubmission: patient link, completion status, PDF/cloud references.
- AgentTask: follow-up, communication flag, document edit, assignment.
- AuditEvent: immutable activity log.

## Safety Boundaries
- Always: encrypt PHI, log access, minimize stored data, isolate tenants, validate patient links, require human approval for outbound patient communication.
- Ask first: production billing activation, real patient data import, live patient messaging, external clinic outreach.
- Never: train models on clinic/patient data, direct-write PMS databases, expose PHI in logs, store secrets in repo, bypass clinic approval.

## Acceptance Criteria
- App builds successfully.
- Landing page explains product and pricing.
- Dashboard mock demonstrates clinic inbox, patient memory, forms, AI agent tasks, compliance posture.
- Docs include BMAD product spec, Canadian privacy/security approach, PMS integration approach, and maintenance tutorial.
- Scaffold is minimal-maintenance and deployable later through Coolify.
