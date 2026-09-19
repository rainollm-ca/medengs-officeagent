/**
 * POST /api/intake/webhook
 *
 * n8n → OfficeAgent intake bridge.
 * Called by the dental new-patient-intake n8n workflow after a form submission.
 * Creates a staff-review AgentTask in the in-memory queue (same queue as /api/agent/tasks).
 *
 * Authentication: static webhook secret via INTAKE_WEBHOOK_SECRET env var.
 * If the var is not set the endpoint refuses all requests (fail-secure).
 *
 * PHI policy: this endpoint deliberately accepts ONLY demo-safe fields.
 * No health history, DOB, health card, SIN, or insurance details are accepted.
 * Any additional fields in the request body are stripped and ignored.
 *
 * Pilot gate cleared: P1 — n8n webhook → OfficeAgent /api/agent/tasks contract.
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { parseIntakeWebhook } from '../../../../lib/validation';
import { queuedTasks } from '../../../../lib/intake-queue';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // --- Auth ---
  const secret = process.env.INTAKE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: { code: 'SERVICE_UNAVAILABLE', message: 'Intake webhook not configured.' } },
      { status: 503 },
    );
  }

  const authHeader = request.headers.get('x-webhook-secret') ?? '';
  if (authHeader !== secret) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Invalid webhook secret.' } },
      { status: 401 },
    );
  }

  // --- Parse & validate ---
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'Request body must be valid JSON.' } },
      { status: 400 },
    );
  }

  try {
    const intake = parseIntakeWebhook(body);

    const taskTitle = `New patient intake: ${intake.patient_name} (${intake.clinic_slug})`;

    const task = {
      id: crypto.randomUUID(),
      status: 'queued_for_staff_review' as const,
      createdAt: new Date().toISOString(),
      title: taskTitle,
      ownerRole: 'receptionist' as const,
      priority: 'medium' as const,
      patientChart: undefined,
      requiresHumanApproval: true as const,
      // Extended intake metadata (non-PHI)
      intakeMeta: {
        clinic_slug: intake.clinic_slug,
        patient_name: intake.patient_name,
        patient_phone: intake.patient_phone,
        patient_email: intake.patient_email,
        chief_concern: intake.chief_concern,
        preferred_appointment_time: intake.preferred_appointment_time ?? null,
        submission_source: 'n8n_intake_form',
      },
    };

    queuedTasks.unshift(task);

    return NextResponse.json(
      {
        task_id: task.id,
        status: task.status,
        message: 'Intake task queued for staff review.',
        safety: {
          outboundCommunicationBlocked: true,
          humanApprovalRequired: true,
          phiLoggingPolicy: 'Only demo-safe fields accepted; no PHI stored.',
          persistence: 'Demo runtime queue only; resets on server restart.',
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid intake payload.',
            details: error.flatten(),
          },
        },
        { status: 422 },
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Unexpected error processing intake.' } },
      { status: 500 },
    );
  }
}
