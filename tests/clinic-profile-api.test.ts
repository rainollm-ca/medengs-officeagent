import { describe, expect, it } from 'vitest';
import { GET, POST } from '../app/api/clinic/profile/route';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createClinicSessionToken } from '../lib/clinic-access';
import type { ClinicRole } from '../lib/domain';

describe('clinic operating profile API', () => {
  function useIsolatedProfileStore() {
    process.env.CLINIC_PROFILE_STORE_PATH = join(mkdtempSync(join(tmpdir(), 'flawgent-profile-')), 'profiles.json');
    process.env.SESSION_SECRET = 'test-session-secret-for-signed-clinic-access';
  }

  function signedClinicRequest(tenantSlug = 'smile-north-dental', role: ClinicRole = 'manager') {
    const token = createClinicSessionToken({
      tenantSlug,
      email: `${role}@${tenantSlug}.example`,
      role,
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    });

    return {
      'x-flawgent-session': token,
      'x-clinic-slug': tenantSlug,
    };
  }

  it('returns a dental-ready default profile with approval boundaries', async () => {
    useIsolatedProfileStore();
    const response = GET(new Request('http://localhost/api/clinic/profile', {
      headers: signedClinicRequest(),
    }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.profile.identity.name).toBe('Smile North Dental');
    expect(body.profile.approvalPolicy.patientMessages).toBe('staff_required');
    expect(body.profile.approvalPolicy.pmsWrites).toBe('disabled');
    expect(body.profile.workflows.some((workflow: { key: string }) => workflow.key === 'new_patient_intake')).toBe(true);
    expect(body.readiness.enabledWorkflowCount).toBeGreaterThanOrEqual(4);
  });

  it('accepts a safe clinic operating profile update', async () => {
    useIsolatedProfileStore();
    const response = await POST(new Request('http://localhost/api/clinic/profile', {
      method: 'POST',
      headers: signedClinicRequest('ottawa-family-dental', 'manager'),
      body: JSON.stringify({
        identity: {
          name: 'Ottawa Family Dental',
          slug: 'ottawa-family-dental',
          website: 'https://example-dental.ca',
          primaryPhone: '+1 613 555 0100',
          contactEmail: 'frontdesk@example-dental.ca',
          timezone: 'America/Toronto',
          languages: ['en', 'ar'],
        },
        brand: {
          primaryColor: '#0f766e',
          logoUrl: 'https://example-dental.ca/logo.png',
        },
        hours: [
          { day: 'monday', open: '08:00', close: '17:00' },
          { day: 'tuesday', open: '08:00', close: '17:00' },
          { day: 'sunday', closed: true },
        ],
        channels: [
          { key: 'phone', label: 'Phone', enabled: true, status: 'pilot_ready' },
          { key: 'web_chat', label: 'Web chat', enabled: true, status: 'planned' },
        ],
        workflows: [
          { key: 'new_patient_intake', label: 'New patient intake', enabled: true, ownerRole: 'receptionist' },
          { key: 'emergency_triage', label: 'Emergency triage', enabled: true, ownerRole: 'clinician' },
        ],
        approvalPolicy: {
          patientMessages: 'staff_required',
          clinicalNotes: 'provider_required',
          pmsWrites: 'disabled',
        },
      }),
    }));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.profile.identity.slug).toBe('ottawa-family-dental');
    expect(body.readiness.enabledChannelCount).toBe(2);
    expect(body.readiness.blockers).toContain('Billing is not configured yet.');
  });

  it('rejects clinic profiles that try to enable autonomous PMS writes', async () => {
    useIsolatedProfileStore();
    const response = await POST(new Request('http://localhost/api/clinic/profile', {
      method: 'POST',
      headers: signedClinicRequest('unsafe-dental', 'manager'),
      body: JSON.stringify({
        identity: {
          name: 'Unsafe Dental',
          slug: 'unsafe-dental',
          primaryPhone: '+1 613 555 0199',
          contactEmail: 'frontdesk@unsafe.example',
          timezone: 'America/Toronto',
          languages: ['en'],
        },
        brand: { primaryColor: '#0f766e' },
        hours: [{ day: 'monday', open: '08:00', close: '17:00' }],
        channels: [{ key: 'phone', label: 'Phone', enabled: true, status: 'pilot_ready' }],
        workflows: [{ key: 'new_patient_intake', label: 'New patient intake', enabled: true, ownerRole: 'receptionist' }],
        approvalPolicy: {
          patientMessages: 'staff_required',
          clinicalNotes: 'provider_required',
          pmsWrites: 'autonomous',
        },
      }),
    }));
    const body = await response.json();

    expect(response.status).toBe(422);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('persists clinic profile updates by tenant slug', async () => {
    useIsolatedProfileStore();
    const request = new Request('http://localhost/api/clinic/profile', {
      method: 'POST',
      headers: signedClinicRequest('ottawa-family-dental', 'manager'),
      body: JSON.stringify({
        identity: {
          name: 'Ottawa Family Dental',
          slug: 'ottawa-family-dental',
          website: 'https://example-dental.ca',
          primaryPhone: '+1 613 555 0100',
          contactEmail: 'frontdesk@example-dental.ca',
          timezone: 'America/Toronto',
          languages: ['en', 'fr'],
        },
        brand: {
          primaryColor: '#0f766e',
          logoUrl: 'https://example-dental.ca/logo.png',
        },
        hours: [
          { day: 'monday', open: '08:00', close: '17:00' },
          { day: 'tuesday', open: '08:00', close: '17:00' },
        ],
        channels: [
          { key: 'phone', label: 'Phone', enabled: true, status: 'pilot_ready' },
          { key: 'forms', label: 'Forms', enabled: true, status: 'pilot_ready' },
        ],
        workflows: [
          { key: 'new_patient_intake', label: 'New patient intake', enabled: true, ownerRole: 'receptionist' },
          { key: 'missed_call_capture', label: 'Missed-call capture', enabled: true, ownerRole: 'receptionist' },
        ],
        approvalPolicy: {
          patientMessages: 'staff_required',
          clinicalNotes: 'provider_required',
          pmsWrites: 'disabled',
        },
      }),
    });

    const writeResponse = await POST(request);
    const readResponse = GET(new Request('http://localhost/api/clinic/profile', {
      headers: signedClinicRequest('ottawa-family-dental', 'manager'),
    }));
    const defaultTenantResponse = GET(new Request('http://localhost/api/clinic/profile', {
      headers: signedClinicRequest('smile-north-dental', 'manager'),
    }));
    const body = await readResponse.json();
    const defaultBody = await defaultTenantResponse.json();

    expect(writeResponse.status).toBe(201);
    expect(body.profile.identity.name).toBe('Ottawa Family Dental');
    expect(body.persistence).toMatchObject({
      tenantSlug: 'ottawa-family-dental',
      durable: true,
      storage: 'file',
    });
    expect(defaultBody.profile.identity.name).toBe('Smile North Dental');
  });

  it('rejects mismatched tenant slug writes', async () => {
    useIsolatedProfileStore();
    const response = await POST(new Request('http://localhost/api/clinic/profile', {
      method: 'POST',
      headers: signedClinicRequest('wafa-dental', 'manager'),
      body: JSON.stringify({
        identity: {
          name: 'Ottawa Family Dental',
          slug: 'ottawa-family-dental',
          primaryPhone: '+1 613 555 0100',
          contactEmail: 'frontdesk@example-dental.ca',
          timezone: 'America/Toronto',
          languages: ['en'],
        },
        brand: { primaryColor: '#0f766e' },
        hours: [{ day: 'monday', open: '08:00', close: '17:00' }],
        channels: [{ key: 'phone', label: 'Phone', enabled: true, status: 'pilot_ready' }],
        workflows: [{ key: 'new_patient_intake', label: 'New patient intake', enabled: true, ownerRole: 'receptionist' }],
        approvalPolicy: {
          patientMessages: 'staff_required',
          clinicalNotes: 'provider_required',
          pmsWrites: 'disabled',
        },
      }),
    }));
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error.code).toBe('TENANT_MISMATCH');
  });

  it('rejects unauthenticated clinic profile reads', async () => {
    useIsolatedProfileStore();
    const response = GET(new Request('http://localhost/api/clinic/profile'));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('AUTH_REQUIRED');
  });

  it('rejects clinic profile writes from non-manager roles', async () => {
    useIsolatedProfileStore();
    const response = await POST(new Request('http://localhost/api/clinic/profile', {
      method: 'POST',
      headers: signedClinicRequest('smile-north-dental', 'receptionist'),
      body: JSON.stringify({
        identity: {
          name: 'Smile North Dental',
          slug: 'smile-north-dental',
          primaryPhone: '+1 613 555 0100',
          contactEmail: 'frontdesk@example-dental.ca',
          timezone: 'America/Toronto',
          languages: ['en'],
        },
        brand: { primaryColor: '#0f766e' },
        hours: [{ day: 'monday', open: '08:00', close: '17:00' }],
        channels: [{ key: 'phone', label: 'Phone', enabled: true, status: 'pilot_ready' }],
        workflows: [{ key: 'new_patient_intake', label: 'New patient intake', enabled: true, ownerRole: 'receptionist' }],
        approvalPolicy: {
          patientMessages: 'staff_required',
          clinicalNotes: 'provider_required',
          pmsWrites: 'disabled',
        },
      }),
    }));
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error.code).toBe('ROLE_FORBIDDEN');
  });
});
