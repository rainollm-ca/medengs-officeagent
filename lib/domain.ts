export type ClinicRole = 'owner' | 'manager' | 'receptionist' | 'clinician' | 'auditor';

export type ReceptionChannel = 'phone' | 'web_chat' | 'whatsapp' | 'email_draft' | 'walk_in';

export type ReceptionIntent =
  | 'new_patient'
  | 'emergency_triage'
  | 'appointment_change'
  | 'insurance'
  | 'forms'
  | 'records'
  | 'employee_admin';

export type ClinicSetupStep = {
  title: string;
  description: string;
  output: string;
};

export type ReceptionWorkflow = {
  channel: ReceptionChannel;
  intent: ReceptionIntent;
  title: string;
  aiAction: string;
  staffApproval: string;
  safetyNote: string;
};

export type IntegrationStatus = {
  name: string;
  purpose: string;
  status: 'demo_ready' | 'planned' | 'approval_required';
  boundary: string;
};

export type DentalNoteTemplate = {
  name: string;
  workflow: 'hygiene' | 'exam' | 'emergency' | 'procedure' | 'post_op' | 'admin';
  sections: string[];
  approvalOwner: 'dentist' | 'hygienist' | 'manager';
  safetyBoundary: string;
};

export type ClinicalNoteDraft = {
  id: string;
  title: string;
  templateName: string;
  patientChart?: string;
  status: 'draft_for_provider_review';
  requiresProviderApproval: true;
  createdAt: string;
};

export type PatientFlag = {
  label: string;
  severity: 'info' | 'warning' | 'critical';
  source: 'form' | 'staff' | 'agent';
};

export type PatientRecord = {
  chartNumber: string;
  name: string;
  contact: string;
  status: 'ready' | 'missing_forms' | 'needs_review';
  flags: PatientFlag[];
};

export type FormTemplate = {
  name: string;
  category: 'intake' | 'medical' | 'consent' | 'finance' | 'referral' | 'custom';
  description: string;
  aiActions: string[];
};

export type AgentTask = {
  title: string;
  ownerRole: ClinicRole;
  priority: 'low' | 'medium' | 'high';
  patientChart?: string;
};

export type AuditEvent = {
  action: string;
  actor: string;
  patientChart?: string;
  timestamp: string;
};

export type ClinicProfileIdentity = {
  name: string;
  slug: string;
  website?: string;
  primaryPhone: string;
  contactEmail: string;
  timezone: string;
  languages: string[];
};

export type ClinicProfileBrand = {
  primaryColor: string;
  logoUrl?: string;
};

export type ClinicHours = {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open?: string;
  close?: string;
  closed?: boolean;
};

export type ClinicChannelConfig = {
  key: 'phone' | 'web_chat' | 'whatsapp' | 'email_drafts' | 'forms';
  label: string;
  enabled: boolean;
  status: 'pilot_ready' | 'planned' | 'needs_credentials';
};

export type ClinicWorkflowConfig = {
  key:
    | 'new_patient_intake'
    | 'missed_call_capture'
    | 'emergency_triage'
    | 'insurance_collection'
    | 'recall_waitlist'
    | 'clinical_note_drafts'
    | 'forms_pdf_delivery';
  label: string;
  enabled: boolean;
  ownerRole: ClinicRole;
};

export type ClinicApprovalPolicy = {
  patientMessages: 'staff_required';
  clinicalNotes: 'provider_required';
  pmsWrites: 'disabled' | 'staff_required';
};

export type ClinicOperatingProfile = {
  identity: ClinicProfileIdentity;
  brand: ClinicProfileBrand;
  hours: ClinicHours[];
  channels: ClinicChannelConfig[];
  workflows: ClinicWorkflowConfig[];
  approvalPolicy: ClinicApprovalPolicy;
};

export type ClinicProfileReadiness = {
  enabledChannelCount: number;
  enabledWorkflowCount: number;
  blockers: string[];
};
