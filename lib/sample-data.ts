import type {
  AgentTask,
  AuditEvent,
  ClinicSetupStep,
  DentalNoteTemplate,
  FormTemplate,
  IntegrationStatus,
  ClinicOperatingProfile,
  PatientRecord,
  ReceptionWorkflow,
} from './domain';

export const clinicSetupSteps: ClinicSetupStep[] = [
  {
    title: 'Brand + clinic identity',
    description: 'Upload logo, choose colours, add clinic name, locations, hours, emergency policy, and languages.',
    output: 'Branded patient links, PDFs, website widget, and AI greeting.',
  },
  {
    title: 'Reception rules',
    description: 'Define new-patient intake, existing-patient verification, emergency escalation, no-show, cancellation, insurance, and recall rules.',
    output: 'Clinic-specific AI receptionist playbook.',
  },
  {
    title: 'Forms + documents',
    description: 'Load intake, medical history, consent, financial policy, record release, referrals, post-op instructions, and custom PDFs.',
    output: 'Secure form links and staff-reviewed document drafts.',
  },
  {
    title: 'Channels + approvals',
    description: 'Enable phone, web chat, WhatsApp via Evolution API, and email drafts with consent and approval settings.',
    output: 'One unified reception inbox with audited staff approvals.',
  },
];

export const receptionWorkflows: ReceptionWorkflow[] = [
  {
    channel: 'phone',
    intent: 'new_patient',
    title: 'Missed call → new patient task',
    aiAction: 'Answers, captures reason for visit, insurance, availability, urgency, and creates intake task.',
    staffApproval: 'Reception approves callback, form link, or booking slot.',
    safetyNote: 'No PMS write or clinical advice in MVP.',
  },
  {
    channel: 'phone',
    intent: 'emergency_triage',
    title: 'Pain/swelling/trauma escalation',
    aiAction: 'Asks clinic-approved red-flag questions and marks same-day urgent task.',
    staffApproval: 'Dentist/reception reviews before giving care-specific direction.',
    safetyNote: 'Admin triage only; no diagnosis.',
  },
  {
    channel: 'whatsapp',
    intent: 'forms',
    title: 'WhatsApp form-link follow-up',
    aiAction: 'Prepares a minimal PHI-safe WhatsApp message with a secure form link.',
    staffApproval: 'Reception approves send and consent status.',
    safetyNote: 'Evolution API enabled only with opt-in and message audit.',
  },
  {
    channel: 'web_chat',
    intent: 'insurance',
    title: 'Insurance info collector',
    aiAction: 'Collects carrier, group, member ID, dependent details, and missing-data checklist.',
    staffApproval: 'Billing/admin verifies before PMS/CDAnet workflow.',
    safetyNote: 'Does not submit claims; supports certified PMS process.',
  },
  {
    channel: 'walk_in',
    intent: 'employee_admin',
    title: 'Staff clock-in and daily checklist',
    aiAction: 'Records clock-in/out, breaks, handoff notes, and role-based daily checklist items.',
    staffApproval: 'Manager reviews time export before payroll.',
    safetyNote: 'Separate from payroll until explicitly connected.',
  },
];

export const integrationStatuses: IntegrationStatus[] = [
  {
    name: 'Twilio phone AI',
    purpose: 'First-contact phone receptionist and missed-call recovery.',
    status: 'planned',
    boundary: 'Creates staff tasks first; no live PMS writes.',
  },
  {
    name: 'Evolution API WhatsApp',
    purpose: 'Opt-in WhatsApp form links, reminders, and simple admin follow-up.',
    status: 'planned',
    boundary: 'Consent required; minimal PHI; staff approval default.',
  },
  {
    name: 'n8n workflows',
    purpose: 'Async routing: completed forms, lead capture, daily summary, storage sync.',
    status: 'demo_ready',
    boundary: 'Not in realtime call loop.',
  },
  {
    name: 'CDAnet / ITRANS via PMS',
    purpose: 'Canadian insurance claim workflows through certified PMS paths.',
    status: 'approval_required',
    boundary: 'Flowgent prepares/checks data; does not replace certified claim submission.',
  },
];

export const dentalNoteTemplates: DentalNoteTemplate[] = [
  {
    name: 'Limited Emergency Exam Note',
    workflow: 'emergency',
    sections: ['Chief concern', 'History', 'Findings', 'Radiographs reviewed', 'Assessment placeholder', 'Plan discussed', 'Provider signature'],
    approvalOwner: 'dentist',
    safetyBoundary: 'AI drafts structure and summary only; dentist finalizes diagnosis and treatment plan.',
  },
  {
    name: 'New Patient Comprehensive Exam Note',
    workflow: 'exam',
    sections: ['Medical history reviewed', 'Dental history', 'Extraoral/intraoral screening', 'Perio screening', 'Odontogram notes', 'Risk factors', 'Provider plan'],
    approvalOwner: 'dentist',
    safetyBoundary: 'Clinical interpretation remains provider-controlled.',
  },
  {
    name: 'Hygiene Visit Progress Note',
    workflow: 'hygiene',
    sections: ['Medical changes', 'Perio status', 'Debridement performed', 'OHI delivered', 'Recall interval recommendation', 'Provider review flags'],
    approvalOwner: 'hygienist',
    safetyBoundary: 'Recall recommendation is a draft until provider/hygienist approval.',
  },
  {
    name: 'Procedure Note Template',
    workflow: 'procedure',
    sections: ['Consent confirmed', 'Anesthetic', 'Procedure steps', 'Materials', 'Complications', 'Post-op instructions', 'Next visit'],
    approvalOwner: 'dentist',
    safetyBoundary: 'AI never invents clinical details; missing fields stay blank for dentist completion.',
  },
  {
    name: 'Post-op Follow-up Call Note',
    workflow: 'post_op',
    sections: ['Patient-reported status', 'Red flags', 'Instructions repeated', 'Escalation decision', 'Follow-up task'],
    approvalOwner: 'dentist',
    safetyBoundary: 'Escalates red flags; no independent medical advice.',
  },
];

export const formTemplates: FormTemplate[] = [
  {
    name: 'New Patient Package',
    category: 'intake',
    description: 'Demographics, medical/dental history, consent, insurance, signature.',
    aiActions: ['Convert paper PDF', 'Shorten form', 'Translate', 'Brand with logo'],
  },
  {
    name: 'Medical History Update',
    category: 'medical',
    description: 'Focused update for allergies, medications, pregnancy, diabetes, cardiac risks.',
    aiActions: ['Flag urgent answers', 'Summarize for staff', 'Generate chart-note draft'],
  },
  {
    name: 'Procedure Consent',
    category: 'consent',
    description: 'Extraction, implant, sedation, whitening, perio, and custom procedure consent.',
    aiActions: ['Draft consent', 'Add clinic-specific wording', 'Create branded PDF'],
  },
  {
    name: 'Referral + Attachment Package',
    category: 'referral',
    description: 'Referral forms, attachments, routed PDF bundles, follow-up tasks.',
    aiActions: ['Create referral', 'Bundle PDFs', 'Assign follow-up'],
  },
];

export const patients: PatientRecord[] = [
  {
    chartNumber: 'P-1027',
    name: 'Sample Patient',
    contact: 'patient@example.com',
    status: 'needs_review',
    flags: [
      { label: 'Medication list updated', severity: 'warning', source: 'form' },
      { label: 'Consent missing signature', severity: 'critical', source: 'agent' },
    ],
  },
  {
    chartNumber: 'P-1104',
    name: 'Demo Patient',
    contact: '+1 555 0104',
    status: 'missing_forms',
    flags: [{ label: 'Insurance info incomplete', severity: 'info', source: 'form' }],
  },
];

export const agentTasks: AgentTask[] = [
  { title: 'Send medical history update link', ownerRole: 'receptionist', priority: 'high', patientChart: 'P-1027' },
  { title: 'Review flagged anticoagulant answer', ownerRole: 'clinician', priority: 'high', patientChart: 'P-1027' },
  { title: 'Convert clinic financial policy PDF into digital form', ownerRole: 'manager', priority: 'medium' },
  { title: 'Confirm Google Drive folder mapping for signed forms', ownerRole: 'owner', priority: 'medium' },
];

export const auditEvents: AuditEvent[] = [
  { action: 'Patient form link generated', actor: 'Receptionist', patientChart: 'P-1027', timestamp: 'Today 09:14' },
  { action: 'AI generated branded consent PDF draft', actor: 'OfficeAgent', patientChart: 'P-1027', timestamp: 'Today 09:16' },
  { action: 'Urgent form response flagged', actor: 'OfficeAgent', patientChart: 'P-1027', timestamp: 'Today 09:17' },
];

export const defaultClinicProfile: ClinicOperatingProfile = {
  identity: {
    name: 'Smile North Dental',
    slug: 'smile-north-dental',
    website: 'https://example-dental.ca',
    primaryPhone: '+1 613 555 0100',
    contactEmail: 'frontdesk@example-dental.ca',
    timezone: 'America/Toronto',
    languages: ['en', 'ar'],
  },
  brand: {
    primaryColor: '#19c6b8',
    logoUrl: 'https://example-dental.ca/logo.png',
  },
  hours: [
    { day: 'monday', open: '08:00', close: '17:00' },
    { day: 'tuesday', open: '08:00', close: '17:00' },
    { day: 'wednesday', open: '08:00', close: '17:00' },
    { day: 'thursday', open: '08:00', close: '17:00' },
    { day: 'friday', open: '08:00', close: '15:00' },
    { day: 'saturday', closed: true },
    { day: 'sunday', closed: true },
  ],
  channels: [
    { key: 'phone', label: 'Phone receptionist', enabled: true, status: 'pilot_ready' },
    { key: 'forms', label: 'Branded intake forms', enabled: true, status: 'pilot_ready' },
    { key: 'email_drafts', label: 'Email drafts', enabled: true, status: 'pilot_ready' },
    { key: 'web_chat', label: 'Website chat', enabled: false, status: 'planned' },
    { key: 'whatsapp', label: 'WhatsApp follow-up', enabled: false, status: 'needs_credentials' },
  ],
  workflows: [
    { key: 'new_patient_intake', label: 'New patient intake', enabled: true, ownerRole: 'receptionist' },
    { key: 'missed_call_capture', label: 'Missed-call capture', enabled: true, ownerRole: 'receptionist' },
    { key: 'emergency_triage', label: 'Emergency admin triage', enabled: true, ownerRole: 'clinician' },
    { key: 'forms_pdf_delivery', label: 'Forms and PDF delivery', enabled: true, ownerRole: 'manager' },
    { key: 'insurance_collection', label: 'Insurance info collection', enabled: false, ownerRole: 'receptionist' },
    { key: 'recall_waitlist', label: 'Recall and waitlist helper', enabled: false, ownerRole: 'manager' },
    { key: 'clinical_note_drafts', label: 'Dentist/hygienist note drafts', enabled: false, ownerRole: 'clinician' },
  ],
  approvalPolicy: {
    patientMessages: 'staff_required',
    clinicalNotes: 'provider_required',
    pmsWrites: 'disabled',
  },
};
