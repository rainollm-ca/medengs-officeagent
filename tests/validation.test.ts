import { describe, expect, it } from 'vitest';
import { parseCreateAgentTask } from '../lib/validation';

describe('agent task validation', () => {
  it('normalizes a valid staff-approved agent task', () => {
    const task = parseCreateAgentTask({
      title: ' Send medical history update link ',
      ownerRole: 'receptionist',
      priority: 'high',
      patientChart: 'P-1027',
    });

    expect(task).toEqual({
      title: 'Send medical history update link',
      ownerRole: 'receptionist',
      priority: 'high',
      patientChart: 'P-1027',
      requiresHumanApproval: true,
    });
  });

  it('rejects unsafe or malformed chart identifiers', () => {
    expect(() => parseCreateAgentTask({
      title: 'Send link',
      ownerRole: 'receptionist',
      priority: 'medium',
      patientChart: '<script>alert(1)</script>',
    })).toThrow();
  });
});
