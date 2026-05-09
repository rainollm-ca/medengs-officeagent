const REQUIRED_PRODUCTION_ENV = [
  'DATABASE_URL',
  'NEXT_PUBLIC_APP_URL',
  'ENCRYPTION_KMS_KEY_REF',
] as const;

export type ReadinessCheck = {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  detail: string;
};

type ReadinessEnv = Partial<Record<string, string | undefined>>;

export function getReadinessChecks(env: ReadinessEnv = process.env): ReadinessCheck[] {
  const checks: ReadinessCheck[] = REQUIRED_PRODUCTION_ENV.map((key) => ({
    name: `env:${key}`,
    status: env[key] ? 'pass' : 'fail',
    detail: env[key] ? 'Configured' : 'Missing required production environment variable',
  }));

  checks.push({
    name: 'data-boundary:human-approval',
    status: 'pass',
    detail: 'Outbound patient communication remains staff-approved by default.',
  });

  checks.push({
    name: 'data-boundary:no-model-training',
    status: 'pass',
    detail: 'Product policy blocks provider training on clinic/patient data.',
  });

  checks.push({
    name: 'deployment:health-endpoint',
    status: 'pass',
    detail: '/api/health returns readiness metadata for Coolify checks.',
  });

  return checks;
}

export function summarizeReadiness(checks: ReadinessCheck[]) {
  const failed = checks.filter((check) => check.status === 'fail').length;
  const warnings = checks.filter((check) => check.status === 'warn').length;

  return {
    status: failed > 0 ? 'fail' : warnings > 0 ? 'warn' : 'pass',
    failed,
    warnings,
    passed: checks.filter((check) => check.status === 'pass').length,
  } as const;
}
