# Product Spec: Dental New-Patient Intake Web App

## Purpose
Turn the current Wafa/Arak n8n intake-form proof of concept into a MedEngs OfficeAgent module that clinics can configure, share with new patients, review safely, and archive as branded PDF records.

The module should reduce front-desk paper/PDF work without becoming a clinical decision tool or direct PMS writer.

## Current validated prototype
- Live n8n workflows exist for two clinics:
  - Wafa Dental Center: `https://n8n.rainomotion.com/webhook/wafa-new-patient`
  - Arak Dental: `https://n8n.rainomotion.com/webhook/arak-new-patient`
- Each form already supports clinic branding, demographics/contact fields, dental concern fields, insurance, medical checklist sections, pregnancy/status checklist, typed name, drawn signature canvas, consent checkboxes, one-page PDF generation, and signature PNG attachment.
- Current delivery is Gmail from `medengs.ca@gmail.com` to clinic email; future preferred option is clinic/MedEngs Zoho Mail SMTP.

## Target users
- New patient: completes a mobile-friendly intake form before an appointment.
- Receptionist: sends or copies a secure link, tracks completion, and reviews missing items.
- Dentist/clinical reviewer: sees high-risk medical answers flagged for human review.
- Clinic owner/manager: configures branding, recipient email, form fields, consent wording, and storage destination.

## MVP workflow
1. Clinic admin configures clinic profile: name, logo, brand color, recipient email, storage destination, and optional custom disclaimer text.
2. Staff creates a new-patient intake link from OfficeAgent, optionally tied to patient name/chart number/appointment date.
3. Patient opens the tokenized link without an account, completes the form, draws a signature, accepts required acknowledgements, and submits.
4. System validates required fields, creates a branded PDF summary, stores encrypted submission metadata, and delivers PDF/signature attachments to the clinic inbox/email/cloud folder.
5. OfficeAgent adds review tasks for incomplete answers, missing signatures, medical-risk checklist hits, allergies/medications, insurance missing, or patient-requested urgent care.
6. Staff manually attaches the PDF to the PMS for MVP.

## Form content scope
### Required MVP sections
- Patient identity: legal name, preferred name, DOB, phone, email, address.
- Emergency contact: name, relationship, phone.
- Visit context: chief concern, appointment reason, last dental visit, pain/urgent concern flag.
- Insurance: provider, policy/member IDs, subscriber, employer, optional notes.
- Medical: medications, allergies, physician/contact, checklist for heart/valve, blood pressure, diabetes, asthma/breathing, blood thinners/bleeding, seizures, kidney/liver disease, immune disorder/chemo, artificial joint/device, osteoporosis/bisphosphonate meds, antibiotic premedication, smoking/vaping, pregnancy/nursing/trying-pregnancy.
- Dental consent/acknowledgements: accuracy confirmation, privacy/contact consent, financial/insurance responsibility acknowledgement.
- Signature: drawn signature required; typed name/date captured as metadata.

### Nice-to-have after MVP
- Bilingual English/Arabic versions.
- Conditional follow-up questions for positive medical checklist answers.
- Parent/guardian signing mode for minors.
- Photo/file upload for insurance cards.
- QR-code poster/link for clinic front desk.

## Product requirements
- Mobile-first responsive form that works well on patient phones.
- Clinic-branded theme using configured logo/colors; default to Wafa blue / Arak green for seeded demos.
- Tokenized patient links with expiration and optional DOB/phone verification.
- Draft-save or clear recovery message if a session expires.
- PDF output should fit one page when possible; overflow must remain readable rather than clipped.
- Attach original signature image separately from the PDF for audit/review.
- Clinic inbox must show submission state: sent, opened, submitted, needs review, archived.
- Staff approval gate for any outbound patient message beyond the initial clinic-approved link.

## Data and integrations
- MVP is PMS-agnostic: no direct writes to Paradigm, Open Dental, ClearDent, Tracker, ABELDent, Dentrix, or Curve.
- Store PHI minimally: encrypted submission metadata/index in MedEngs DB; files in clinic-controlled Google Drive, OneDrive/SharePoint, S3-compatible storage, or approved email routing.
- Email delivery starts with clinic-configured recipient(s); Zoho SMTP is the planned replacement for the current Gmail prototype.
- Future connectors can read patient/appointment lists and write documents only through official APIs after clinic/vendor approval.

## AI agent behavior
Allowed:
- Summarize submitted intake for staff.
- Flag checklist answers that need human review.
- Draft follow-up tasks or internal notes.
- Convert clinic paper/PDF intake forms into editable templates.

Not allowed:
- Diagnose, triage clinically, or tell a patient what treatment they need.
- Hide or downgrade patient answers.
- Send patient-facing advice/messages without clinic approval.
- Train AI models on clinic/patient data.

## Security, privacy, and compliance
- Design for PHIPA/PIPEDA-conscious Canadian clinics.
- Clinic remains health information custodian/controller; MedEngs is service provider/processor.
- Use TLS, field-level encryption for PHI, tenant isolation, least-privilege roles, MFA for owners/managers, tamper-resistant audit logs, and no PHI in logs.
- Audit events: link created, link opened, form submitted, PDF generated, file/email delivered, staff viewed, task created/resolved, settings changed.
- Before pilot with real PHI: privacy/security addendum, subprocessor list, retention/deletion policy, backup/restore test, and lightweight PIA/security review.

## Acceptance criteria for MVP
- A clinic admin can configure branding and destination email/storage.
- Staff can generate a secure new-patient link and see its status.
- A patient can complete the form on mobile, draw a signature, and submit successfully.
- System generates a readable branded PDF plus signature attachment.
- Clinic receives the submission through configured delivery.
- Review flags/tasks appear for allergies, medications, selected medical checklist risks, pregnancy/status, urgent concern, missing insurance, or missing required acknowledgements.
- All submission access and delivery actions are audit logged.
- Verification gate passes: typecheck, lint, tests, build, and at least one generated-PDF smoke test.

## Open decisions / blockers
- Confirm production sender: Zoho SMTP account vs clinic-specific mailboxes.
- Confirm whether Wafa/Arak want bilingual form variants at launch.
- Decide default token expiry and whether DOB/phone verification is mandatory.
- Decide whether file upload for insurance card is MVP or phase 2.
