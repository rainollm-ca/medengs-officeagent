import { describe, expect, it } from 'vitest';
import { GET, POST } from '../app/api/clinical-notes/drafts/route';

describe('clinical notes draft API', () => {
  it('lists provider-review note templates and drafts', async () => {
    const response = GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.templates.length).toBeGreaterThan(0);
    expect(body.safety.providerApprovalRequired).toBe(true);
    expect(body.safety.noDiagnosisGeneration).toBe(true);
  });

  it('queues a clinical note draft for provider approval', async () => {
    const response = await POST(new Request('http://localhost/api/clinical-notes/drafts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Emergency exam note draft',
        templateName: 'Limited Emergency Exam Note',
        patientChart: 'P-1027',
        requiresProviderApproval: true,
      }),
    }));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.draft).toMatchObject({
      title: 'Emergency exam note draft',
      status: 'draft_for_provider_review',
      requiresProviderApproval: true,
    });
    expect(body.safety.noAutonomousClinicalAdvice).toBe(true);
  });
});
