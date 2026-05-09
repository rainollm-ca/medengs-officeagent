import { NextResponse } from 'next/server';
import { getReadinessChecks, summarizeReadiness } from '../../../lib/production-readiness';

export const dynamic = 'force-dynamic';

export function GET() {
  const checks = getReadinessChecks();
  const summary = summarizeReadiness(checks);

  return NextResponse.json(
    {
      service: 'medengs-officeagent',
      environment: process.env.NODE_ENV ?? 'development',
      timestamp: new Date().toISOString(),
      summary,
      checks,
    },
    { status: summary.status === 'fail' && process.env.NODE_ENV === 'production' ? 503 : 200 },
  );
}
