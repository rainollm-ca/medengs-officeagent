# Compliance & Security Plan — MedEngs OfficeAgent

## Positioning
MedEngs OfficeAgent is an administrative/document automation platform for dental clinics. Clinics remain the health information custodian/controller. MedEngs is the service provider/processor.

## Canadian privacy baseline
- PHIPA/PIPEDA-conscious design.
- Prefer Canadian data residency for app database, backups, object storage, and logs.
- Business/privacy agreement per clinic before live PHI.
- No model training on clinic/patient data.
- Human approval for patient-facing communication by default.

## Safest storage model
- Store files in clinic-controlled Google Drive, OneDrive, SharePoint, or S3-compatible storage.
- Store only encrypted metadata/indexes in MedEngs DB.
- Field-level encryption for PHI: patient name, contact, identifiers, flags.
- Per-clinic encryption key envelope model.
- Encrypted backups and tested restore process.

## Access control
- Roles: owner, manager, receptionist, clinician, billing/admin, read-only auditor.
- MFA required for clinic owners/managers.
- Least-privilege permissions by feature.
- Session timeout and device/session management.

## Audit events
Log: login, patient viewed, file opened, form sent, form submitted, PDF generated, task assigned, cloud sync, user permission changed.

## Patient links
- Cryptographically random token.
- Expiration date.
- Optional DOB/phone verification.
- Single-form scoped access.
- No patient portal account required for MVP.

## AI guardrails
- Tool-based agent; every action is explicit and auditable.
- Redact/minimize patient context in prompts when possible.
- Disable provider training/retention when supported.
- Never let the agent make clinical decisions.
- Agent can draft/flag/organize; clinic staff approves external messages.


## Implemented scaffold controls
- Security headers and CSP are configured in `next.config.ts`.
- Request validation starts at `/api/agent/tasks` with Zod schemas in `lib/validation.ts`.
- `/api/health` exposes deployment readiness checks without leaking secrets.
- Prisma schema models tenant isolation, audit events, staff approval gates, and encrypted PHI placeholders.
- CI/verification gate runs typecheck, lint, tests, build, and dependency audit.

## Compliance requirements checklist
- Clinic/dentist remains custodian/controller; MedEngs is service provider/processor.
- Privacy/security addendum per clinic: permitted use, subcontractors, breach notice, audit rights, export/deletion, AI no-training clause.
- Assess HINP obligations if MedEngs becomes shared electronic health infrastructure for multiple clinics.
- Canadian-region hosting by default where available; disclose and approve any cross-border processing.
- AI vendor use only with no-training terms, minimized retention, disclosed subprocessors, and minimized/de-identified prompts where practical.
- Audit every PHI access/use/export with actor, action, patient/link, timestamp, and source details where practical.
- Keep audit logs tamper-resistant and exportable; target retention long enough for clinic privacy investigations.
- Maintain privacy policy, security policy, incident response plan, subprocessor list, data flow diagram, retention/deletion schedule, and clinic onboarding checklist.
- Run lightweight PIA/security review before pilot launch.
