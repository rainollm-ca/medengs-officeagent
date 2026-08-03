import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import {
  AuthRequiredError,
  ClinicAccessMismatchError,
  requireClinicAccess,
  RoleForbiddenError,
} from '../../../../lib/clinic-access';
import { getProfileReadiness } from '../../../../lib/clinic-profile';
import {
  InvalidTenantSlugError,
  readClinicProfile,
  TenantMismatchError,
  writeClinicProfile,
} from '../../../../lib/clinic-profile-store';
import { parseClinicOperatingProfile } from '../../../../lib/validation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export function GET(request?: Request) {
  try {
    const access = requireClinicAccess(request, 'read');
    const snapshot = readClinicProfile(access.tenantSlug);

    return NextResponse.json({
      profile: snapshot.profile,
      access,
      readiness: getProfileReadiness(snapshot.profile),
      persistence: snapshot.persistence,
      safety: {
        demoStorageOnly: false,
        noPhiStorage: true,
        noAutonomousPatientMessages: true,
        noAutonomousPmsWrites: true,
      },
    });
  } catch (error) {
    const authResponse = handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    if (error instanceof InvalidTenantSlugError) {
      return NextResponse.json(
        { error: { code: 'INVALID_TENANT', message: 'Clinic tenant slug is invalid.' } },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: { code: 'STORE_ERROR', message: 'Clinic profile store could not be read.' } },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const access = requireClinicAccess(request, 'manage');
    const payload = parseClinicOperatingProfile(await request.json());
    const snapshot = writeClinicProfile(payload, access.tenantSlug);

    return NextResponse.json(
      {
        profile: snapshot.profile,
        access,
        readiness: getProfileReadiness(snapshot.profile),
        persistence: snapshot.persistence,
        safety: {
          demoStorageOnly: false,
          noPhiStorage: true,
          noAutonomousPatientMessages: true,
          noAutonomousPmsWrites: true,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const authResponse = handleAuthError(error);

    if (authResponse) {
      return authResponse;
    }

    if (error instanceof TenantMismatchError) {
      return NextResponse.json(
        {
          error: {
            code: 'TENANT_MISMATCH',
            message: 'Clinic tenant header must match the profile slug.',
          },
        },
        { status: 409 },
      );
    }

    if (error instanceof InvalidTenantSlugError) {
      return NextResponse.json(
        { error: { code: 'INVALID_TENANT', message: 'Clinic tenant slug is invalid.' } },
        { status: 400 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'Request body must be valid JSON.' } },
        { status: 400 },
      );
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid clinic operating profile.',
            details: error.flatten(),
          },
        },
        { status: 422 },
      );
    }

    return NextResponse.json(
      { error: { code: 'STORE_ERROR', message: 'Clinic profile store could not be written.' } },
      { status: 500 },
    );
  }
}

function handleAuthError(error: unknown) {
  if (error instanceof AuthRequiredError) {
    return NextResponse.json(
      {
        error: {
          code: 'AUTH_REQUIRED',
          message: 'A valid signed clinic session is required.',
        },
      },
      { status: 401 },
    );
  }

  if (error instanceof RoleForbiddenError) {
    return NextResponse.json(
      {
        error: {
          code: 'ROLE_FORBIDDEN',
          message: 'This clinic role cannot manage clinic settings.',
        },
      },
      { status: 403 },
    );
  }

  if (error instanceof ClinicAccessMismatchError) {
    return NextResponse.json(
      {
        error: {
          code: 'CLINIC_FORBIDDEN',
          message: 'Clinic tenant header does not match the signed clinic session.',
        },
      },
      { status: 403 },
    );
  }

  return null;
}
