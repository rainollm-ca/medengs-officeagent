/**
 * Shared in-memory queue for OfficeAgent tasks.
 * Imported by both /api/agent/tasks and /api/intake/webhook so they share the same runtime queue.
 *
 * Note: This is a demo runtime queue. It resets on every server restart.
 * Database-backed persistence is a Phase 2 (PH2-B) gate and is not enabled in the pilot.
 */

import type { AgentTask, ClinicRole } from './domain';

export type ReviewTask = AgentTask & {
  id: string;
  status: 'queued_for_staff_review';
  requiresHumanApproval: true;
  createdAt: string;
  ownerRole: ClinicRole;
  intakeMeta?: {
    clinic_slug: string;
    patient_name: string;
    patient_phone?: string;
    patient_email?: string;
    chief_concern?: string;
    preferred_appointment_time?: string | null;
    submission_source: string;
  };
};

// Seeded demo tasks so the dashboard is never empty on first load
const DEMO_TASKS: ReviewTask[] = [
  {
    id: 'demo-task-1',
    status: 'queued_for_staff_review',
    requiresHumanApproval: true,
    createdAt: new Date(Date.UTC(2026, 8, 19, 14, 0)).toISOString(),
    title: 'Review new-patient intake form — demo patient',
    ownerRole: 'receptionist',
    priority: 'medium',
    patientChart: undefined,
  },
  {
    id: 'demo-task-2',
    status: 'queued_for_staff_review',
    requiresHumanApproval: true,
    createdAt: new Date(Date.UTC(2026, 8, 19, 14, 5)).toISOString(),
    title: 'Confirm appointment time for demo patient — preferred: Tuesday 10am',
    ownerRole: 'receptionist',
    priority: 'low',
    patientChart: undefined,
  },
];

export const queuedTasks: ReviewTask[] = [...DEMO_TASKS];
