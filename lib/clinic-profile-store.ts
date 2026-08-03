import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { ClinicOperatingProfile } from './domain';
import { defaultClinicProfile } from './sample-data';
import { parseClinicOperatingProfile } from './validation';

const TENANT_SLUG_PATTERN = /^[a-z0-9-]{2,80}$/;

type StoredClinicProfile = {
  profile: ClinicOperatingProfile;
  updatedAt: string;
};

type ClinicProfileStore = {
  version: 1;
  profiles: Record<string, StoredClinicProfile>;
};

export type ClinicProfileSnapshot = {
  profile: ClinicOperatingProfile;
  persistence: {
    tenantSlug: string;
    durable: boolean;
    storage: 'file';
    updatedAt?: string;
  };
};

export class TenantMismatchError extends Error {
  constructor(headerTenant: string, payloadTenant: string) {
    super(`Tenant header ${headerTenant} does not match profile slug ${payloadTenant}.`);
    this.name = 'TenantMismatchError';
  }
}

export class InvalidTenantSlugError extends Error {
  constructor(tenantSlug: string) {
    super(`Invalid tenant slug: ${tenantSlug}`);
    this.name = 'InvalidTenantSlugError';
  }
}

export function getClinicProfileStorePath() {
  return process.env.CLINIC_PROFILE_STORE_PATH ?? join('.data', 'clinic-profiles.json');
}

export function resolveClinicTenant(request?: Request) {
  const tenantSlug = request?.headers.get('x-clinic-slug')?.trim() || defaultClinicProfile.identity.slug;

  if (!TENANT_SLUG_PATTERN.test(tenantSlug)) {
    throw new InvalidTenantSlugError(tenantSlug);
  }

  return tenantSlug;
}

export function readClinicProfile(tenantSlug: string): ClinicProfileSnapshot {
  const store = readStore();
  const storedProfile = store.profiles[tenantSlug];

  if (storedProfile) {
    return {
      profile: storedProfile.profile,
      persistence: {
        tenantSlug,
        durable: true,
        storage: 'file',
        updatedAt: storedProfile.updatedAt,
      },
    };
  }

  return {
    profile: defaultClinicProfile,
    persistence: {
      tenantSlug,
      durable: false,
      storage: 'file',
    },
  };
}

export function writeClinicProfile(profile: ClinicOperatingProfile, requestedTenantSlug?: string): ClinicProfileSnapshot {
  const tenantSlug = requestedTenantSlug || profile.identity.slug;

  if (!TENANT_SLUG_PATTERN.test(tenantSlug)) {
    throw new InvalidTenantSlugError(tenantSlug);
  }

  if (tenantSlug !== profile.identity.slug) {
    throw new TenantMismatchError(tenantSlug, profile.identity.slug);
  }

  const store = readStore();
  const updatedAt = new Date().toISOString();
  store.profiles[tenantSlug] = { profile, updatedAt };
  writeStore(store);

  return {
    profile,
    persistence: {
      tenantSlug,
      durable: true,
      storage: 'file',
      updatedAt,
    },
  };
}

function readStore(): ClinicProfileStore {
  const storePath = getClinicProfileStorePath();

  if (!existsSync(storePath)) {
    return { version: 1, profiles: {} };
  }

  const parsed = JSON.parse(readFileSync(storePath, 'utf8')) as ClinicProfileStore;

  return {
    version: 1,
    profiles: Object.fromEntries(
      Object.entries(parsed.profiles ?? {}).map(([tenantSlug, storedProfile]) => [
        tenantSlug,
        {
          profile: parseClinicOperatingProfile(storedProfile.profile),
          updatedAt: storedProfile.updatedAt,
        },
      ]),
    ),
  };
}

function writeStore(store: ClinicProfileStore) {
  const storePath = getClinicProfileStorePath();
  mkdirSync(dirname(storePath), { recursive: true });
  writeFileSync(storePath, `${JSON.stringify(store, null, 2)}\n`, 'utf8');
}
