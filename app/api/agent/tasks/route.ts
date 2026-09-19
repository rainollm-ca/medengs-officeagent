import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { parseCreateAgentTask } from '../../../../lib/validation';
import { queuedTasks, type ReviewTask } from '../../../../lib/intake-queue';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({
    tasks: queuedTasks,
    safety: {
      persistence: 'Demo runtime queue only; database-backed persistence is not enabled yet.',
      outboundCommunicationBlocked: true,
      phiLoggingPolicy: 'Do not log raw patient data or prompt contents.',
    },
  });
}

export async function POST(request: Request) {
  try {
    const payload = parseCreateAgentTask(await request.json());
    const task: ReviewTask = {
      id: crypto.randomUUID(),
      status: 'queued_for_staff_review',
      createdAt: new Date().toISOString(),
      title: payload.title,
      ownerRole: payload.ownerRole,
      priority: payload.priority,
      patientChart: payload.patientChart,
      requiresHumanApproval: payload.requiresHumanApproval,
    };

    queuedTasks.unshift(task);

    return NextResponse.json(
      {
        task,
        safety: {
          outboundCommunicationBlocked: true,
          humanApprovalRequired: payload.requiresHumanApproval,
          phiLoggingPolicy: 'Do not log raw patient data or prompt contents.',
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
            message: 'Invalid agent task request.',
            details: error.flatten(),
          },
        },
        { status: 422 },
      );
    }

    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'Request body must be valid JSON.' } },
      { status: 400 },
    );
  }
}
