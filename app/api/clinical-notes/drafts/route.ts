import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import type { ClinicalNoteDraft } from '../../../../lib/domain';
import { dentalNoteTemplates } from '../../../../lib/sample-data';
import { parseCreateClinicalNoteDraft } from '../../../../lib/validation';

export const dynamic = 'force-dynamic';

const seededDrafts: ClinicalNoteDraft[] = dentalNoteTemplates.slice(0, 2).map((template, index) => ({
  id: `demo-note-${index + 1}`,
  title: `${template.name} draft`,
  templateName: template.name,
  patientChart: index === 0 ? 'P-1027' : undefined,
  status: 'draft_for_provider_review',
  requiresProviderApproval: true,
  createdAt: new Date(Date.UTC(2026, 5, 5, 16, 20 + index)).toISOString(),
}));

const noteDrafts: ClinicalNoteDraft[] = [...seededDrafts];

export function GET() {
  return NextResponse.json({
    drafts: noteDrafts,
    templates: dentalNoteTemplates,
    safety: {
      providerApprovalRequired: true,
      noDiagnosisGeneration: true,
      phiLoggingPolicy: 'Demo only; do not log raw clinical details or patient messages.',
    },
  });
}

export async function POST(request: Request) {
  try {
    const payload = parseCreateClinicalNoteDraft(await request.json());
    const draft: ClinicalNoteDraft = {
      id: crypto.randomUUID(),
      title: payload.title,
      templateName: payload.templateName,
      patientChart: payload.patientChart,
      status: 'draft_for_provider_review',
      requiresProviderApproval: true,
      createdAt: new Date().toISOString(),
    };

    noteDrafts.unshift(draft);

    return NextResponse.json(
      {
        draft,
        safety: {
          providerApprovalRequired: true,
          noDiagnosisGeneration: true,
          noAutonomousClinicalAdvice: true,
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
            message: 'Invalid clinical note draft request.',
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
