import { createHmac, timingSafeEqual } from 'node:crypto';
import type { ClinicRole } from './domain';

const CLINIC_SLUG_PATTERN = /^[a-z0-9-]{2,80}$/;
const CLINIC_ROLES: ClinicRole[] = ['owner', 'manager', 'receptionist', 'clinician', 'auditor'];
const READ_ROLES = new Set<ClinicRole>(CLINIC_ROLES);
const MANAGE_ROLES = new Set<ClinicRole>(['owner', 'manager']);

export type ClinicSessionPayload = {
  tenantSlug: string;
  email: string;
  role: ClinicRole;
  expiresAt: string;
};

export type ClinicAccessContext = ClinicSessionPayload;

export type ClinicAccessAction = 'read' | 'manage';

export class AuthRequiredError extends Error {
  constructor(message = 'Signed clinic session is required.') {
    super(message);
    this.name = 'AuthRequiredError';
  }
}

export class RoleForbiddenError extends Error {
  constructor() {
    super('This clinic role cannot perform the requested action.');
    this.name = 'RoleForbiddenError';
  }
}

export class ClinicAccessMismatchError extends Error {
  constructor() {
    super('Clinic tenant header does not match the signed clinic session.');
    this.name = 'ClinicAccessMismatchError';
  }
}

export function createClinicSessionToken(payload: ClinicSessionPayload, secret = getSessionSecret()) {
  validateSessionPayload(payload);
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export function requireClinicAccess(request: Request | undefined, action: ClinicAccessAction): ClinicAccessContext {
  const token = request?.headers.get('x-flawgent-session')?.trim();

  if (!token) {
    throw new AuthRequiredError();
  }

  const access = verifyClinicSessionToken(token);
  const requestedTenantSlug = request?.headers.get('x-clinic-slug')?.trim();

  if (requestedTenantSlug && requestedTenantSlug !== access.tenantSlug) {
    throw new ClinicAccessMismatchError();
  }

  const allowedRoles = action === 'manage' ? MANAGE_ROLES : READ_ROLES;

  if (!allowedRoles.has(access.role)) {
    throw new RoleForbiddenError();
  }

  return access;
}

export function verifyClinicSessionToken(token: string, secret = getSessionSecret()): ClinicAccessContext {
  const [encodedPayload, signature] = token.split('.');

  if (!encodedPayload || !signature) {
    throw new AuthRequiredError('Clinic session token is malformed.');
  }

  const expectedSignature = sign(encodedPayload, secret);

  if (!safeEqual(signature, expectedSignature)) {
    throw new AuthRequiredError('Clinic session token signature is invalid.');
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as ClinicSessionPayload;
  validateSessionPayload(payload);

  if (new Date(payload.expiresAt).getTime() <= Date.now()) {
    throw new AuthRequiredError('Clinic session token is expired.');
  }

  return payload;
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 16) {
    throw new AuthRequiredError('SESSION_SECRET must be configured for signed clinic sessions.');
  }

  return secret;
}

function validateSessionPayload(payload: ClinicSessionPayload) {
  if (!CLINIC_SLUG_PATTERN.test(payload.tenantSlug)) {
    throw new AuthRequiredError('Clinic session tenant slug is invalid.');
  }

  if (!payload.email.includes('@')) {
    throw new AuthRequiredError('Clinic session email is invalid.');
  }

  if (!CLINIC_ROLES.includes(payload.role)) {
    throw new AuthRequiredError('Clinic session role is invalid.');
  }

  if (Number.isNaN(new Date(payload.expiresAt).getTime())) {
    throw new AuthRequiredError('Clinic session expiry is invalid.');
  }
}

function sign(encodedPayload: string, secret: string) {
  return createHmac('sha256', secret).update(encodedPayload).digest('base64url');
}

function safeEqual(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}
