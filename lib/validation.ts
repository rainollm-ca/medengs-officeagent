import { z } from 'zod';

export const clinicRoleSchema = z.enum(['owner', 'manager', 'receptionist', 'clinician', 'auditor']);
export const taskPrioritySchema = z.enum(['low', 'medium', 'high']);
export const weekdaySchema = z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'time must use 24-hour HH:mm format');

export const createAgentTaskSchema = z.object({
  title: z.string().trim().min(3).max(180),
  ownerRole: clinicRoleSchema,
  priority: taskPrioritySchema.default('medium'),
  patientChart: z
    .string()
    .trim()
    .regex(/^[A-Z0-9-]{2,32}$/i, 'patientChart must be a clinic chart identifier')
    .optional(),
  requiresHumanApproval: z.literal(true).default(true),
});

export const createClinicalNoteDraftSchema = z.object({
  title: z.string().trim().min(3).max(180),
  templateName: z.string().trim().min(3).max(120),
  patientChart: z
    .string()
    .trim()
    .regex(/^[A-Z0-9-]{2,32}$/i, 'patientChart must be a clinic chart identifier')
    .optional(),
  requiresProviderApproval: z.literal(true).default(true),
});

export const clinicOperatingProfileSchema = z.object({
  identity: z.object({
    name: z.string().trim().min(2).max(120),
    slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/, 'slug must be lowercase letters, numbers, or hyphens'),
    website: z.string().trim().url().optional(),
    primaryPhone: z.string().trim().min(7).max(32),
    contactEmail: z.string().trim().email(),
    timezone: z.string().trim().min(3).max(80),
    languages: z.array(z.string().trim().min(2).max(12)).min(1).max(6),
  }),
  brand: z.object({
    primaryColor: z.string().regex(/^#[0-9a-f]{6}$/i, 'primaryColor must be a hex color'),
    logoUrl: z.string().trim().url().optional(),
  }),
  hours: z.array(z.object({
    day: weekdaySchema,
    open: timeSchema.optional(),
    close: timeSchema.optional(),
    closed: z.boolean().optional(),
  }).refine((hours) => hours.closed || (hours.open && hours.close), {
    message: 'open and close are required unless the day is closed',
  })).min(1).max(7),
  channels: z.array(z.object({
    key: z.enum(['phone', 'web_chat', 'whatsapp', 'email_drafts', 'forms']),
    label: z.string().trim().min(2).max(80),
    enabled: z.boolean(),
    status: z.enum(['pilot_ready', 'planned', 'needs_credentials']),
  })).min(1),
  workflows: z.array(z.object({
    key: z.enum([
      'new_patient_intake',
      'missed_call_capture',
      'emergency_triage',
      'insurance_collection',
      'recall_waitlist',
      'clinical_note_drafts',
      'forms_pdf_delivery',
    ]),
    label: z.string().trim().min(2).max(100),
    enabled: z.boolean(),
    ownerRole: clinicRoleSchema,
  })).min(1),
  approvalPolicy: z.object({
    patientMessages: z.literal('staff_required'),
    clinicalNotes: z.literal('provider_required'),
    pmsWrites: z.enum(['disabled', 'staff_required']),
  }),
});

/**
 * Intake webhook schema — n8n → OfficeAgent bridge (Pilot gate P1).
 * Deliberately restricted to demo-safe fields only.
 * No PHI: no DOB, no health card, no SIN, no insurance details, no health history.
 */
export const intakeWebhookSchema = z.object({
  clinic_slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/, 'clinic_slug must be lowercase letters, numbers, or hyphens'),
  patient_name: z.string().trim().min(2).max(120),
  patient_phone: z.string().trim().min(7).max(32).optional(),
  patient_email: z.string().trim().email().optional(),
  chief_concern: z.string().trim().max(400).optional(),
  preferred_appointment_time: z.string().trim().max(120).optional(),
});

export type IntakeWebhookInput = z.infer<typeof intakeWebhookSchema>;

export function parseIntakeWebhook(input: unknown): IntakeWebhookInput {
  return intakeWebhookSchema.parse(input);
}

export type CreateAgentTaskInput = z.infer<typeof createAgentTaskSchema>;
export type CreateClinicalNoteDraftInput = z.infer<typeof createClinicalNoteDraftSchema>;
export type ClinicOperatingProfileInput = z.infer<typeof clinicOperatingProfileSchema>;

export function parseCreateAgentTask(input: unknown): CreateAgentTaskInput {
  return createAgentTaskSchema.parse(input);
}

export function parseCreateClinicalNoteDraft(input: unknown): CreateClinicalNoteDraftInput {
  return createClinicalNoteDraftSchema.parse(input);
}

export function parseClinicOperatingProfile(input: unknown): ClinicOperatingProfileInput {
  return clinicOperatingProfileSchema.parse(input);
}
