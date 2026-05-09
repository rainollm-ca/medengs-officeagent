import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { parseCreateAgentTask } from '../../../../lib/validation';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const payload = parseCreateAgentTask(await request.json());

    return NextResponse.json(
      {
        task: {
          id: crypto.randomUUID(),
          status: 'queued_for_staff_review',
          ...payload,
        },
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
