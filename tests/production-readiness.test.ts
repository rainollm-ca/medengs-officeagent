import { describe, expect, it } from 'vitest';
import { getReadinessChecks, summarizeReadiness } from '../lib/production-readiness';

describe('production readiness checks', () => {
  it('fails closed when required production env vars are missing', () => {
    const summary = summarizeReadiness(getReadinessChecks({}));

    expect(summary.status).toBe('fail');
    expect(summary.failed).toBeGreaterThan(0);
  });

  it('passes required deployment checks when env is configured', () => {
    const checks = getReadinessChecks({
      DATABASE_URL: 'postgresql://example',
      NEXT_PUBLIC_APP_URL: 'https://officeagent.medengs.ca',
      ENCRYPTION_KMS_KEY_REF: 'op://Shared – DevOps/medengs-officeagent-kms/key',
      APP_ACCESS_TOKEN: 'configured-at-deploy-time',
      SESSION_SECRET: 'configured-at-deploy-time',
    });

    expect(summarizeReadiness(checks)).toMatchObject({ status: 'warn', failed: 0 });
    expect(checks.some((check) => check.name === 'clinical-boundary:provider-approval')).toBe(true);
    expect(checks.some((check) => check.name === 'security:signed-clinic-sessions')).toBe(true);
  });
});
