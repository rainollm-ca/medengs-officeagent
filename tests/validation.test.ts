import { describe, expect, it } from 'vitest';
import { parseCreateAgentTask, parseCreateClinicalNoteDraft } from '../lib/validation';

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

  it('requires provider approval for clinical note drafts', () => {
    const draft = parseCreateClinicalNoteDraft({
      title: 'Emergency exam note draft',
      templateName: 'Limited Emergency Exam Note',
      patientChart: 'P-1027',
      requiresProviderApproval: true,
    });

    expect(draft.requiresProviderApproval).toBe(true);
    expect(draft.templateName).toBe('Limited Emergency Exam Note');
  });

  it('rejects clinical note drafts that try to bypass provider approval', () => {
    expect(() => parseCreateClinicalNoteDraft({
      title: 'Auto-finalized diagnosis note',
      templateName: 'Limited Emergency Exam Note',
      requiresProviderApproval: false,
    })).toThrow();
  });
});
