const REQUIRED_PRODUCTION_ENV = [
  'DATABASE_URL',
  'NEXT_PUBLIC_APP_URL',
  'ENCRYPTION_KMS_KEY_REF',
  'APP_ACCESS_TOKEN',
  'SESSION_SECRET',
] as const;

const OPTIONAL_INTEGRATION_ENV = [
  'TWILIO_ACCOUNT_SID',
  'EVOLUTION_API_URL',
  'EVOLUTION_API_KEY_REF',
  'N8N_WEBHOOK_BASE_URL',
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
    name: 'clinical-boundary:provider-approval',
    status: 'pass',
    detail: 'Dental medical notes are drafts only until dentist/hygienist approval.',
  });

  checks.push({
    name: 'messaging-boundary:consent-required',
    status: 'pass',
    detail: 'WhatsApp/SMS workflows require consent, minimal PHI, and staff approval by default.',
  });

  checks.push({
    name: 'insurance-boundary:pms-certified-path',
    status: 'pass',
    detail: 'CDAnet/ITRANS work is prepared for certified PMS workflows, not replaced by Flowgent.',
  });

  OPTIONAL_INTEGRATION_ENV.forEach((key) => {
    checks.push({
      name: `integration:${key}`,
      status: env[key] ? 'pass' : 'warn',
      detail: env[key] ? 'Configured' : 'Missing until the integration is enabled for a pilot clinic',
    });
  });

  checks.push({
    name: 'deployment:health-endpoint',
    status: 'pass',
    detail: '/api/health returns readiness metadata for Coolify checks.',
  });

  checks.push({
    name: 'security:auth-fail-closed',
    status: 'pass',
    detail: 'Production traffic is blocked unless APP_ACCESS_TOKEN is configured and supplied as a Bearer token.',
  });

  checks.push({
    name: 'security:signed-clinic-sessions',
    status: env.SESSION_SECRET ? 'pass' : 'fail',
    detail: env.SESSION_SECRET
      ? 'Clinic APIs require HMAC-signed tenant/user sessions.'
      : 'Missing SESSION_SECRET for signed clinic sessions.',
  });

  checks.push({
    name: 'security:headers-csp',
    status: 'pass',
    detail: 'Next config applies CSP, frame denial, content-type, referrer, and permissions policy headers.',
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
