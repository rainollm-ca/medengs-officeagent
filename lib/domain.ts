export type ClinicRole = 'owner' | 'manager' | 'receptionist' | 'clinician' | 'auditor';

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
