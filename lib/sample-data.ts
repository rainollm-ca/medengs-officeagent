import type { AgentTask, AuditEvent, FormTemplate, PatientRecord } from './domain';

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
