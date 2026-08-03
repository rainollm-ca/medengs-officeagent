import { describe, expect, it } from 'vitest';
import { GET, POST } from '../app/api/agent/tasks/route';

describe('agent task API', () => {
  it('lists demo tasks queued for staff review', async () => {
    const response = GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.tasks.length).toBeGreaterThan(0);
    expect(body.safety.outboundCommunicationBlocked).toBe(true);
  });

  it('queues a validated task for human approval', async () => {
    const response = await POST(new Request('http://localhost/api/agent/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Send medical history update link',
        ownerRole: 'receptionist',
        priority: 'high',
        patientChart: 'P-1027',
      }),
    }));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.task).toMatchObject({
      title: 'Send medical history update link',
      status: 'queued_for_staff_review',
      requiresHumanApproval: true,
    });
    expect(body.safety.humanApprovalRequired).toBe(true);
  });

  it('rejects tasks that try to bypass human approval', async () => {
    const response = await POST(new Request('http://localhost/api/agent/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Send medical history update link',
        ownerRole: 'receptionist',
        priority: 'high',
        patientChart: 'P-1027',
        requiresHumanApproval: false,
      }),
    }));
    const body = await response.json();

    expect(response.status).toBe(422);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });
});
