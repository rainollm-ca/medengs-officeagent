const PUBLIC_PATH_PREFIXES = [
  '/api/health',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
] as const;

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isAuthRequired(env: Record<string, string | undefined> = process.env): boolean {
  return env.NODE_ENV === 'production' || env.REQUIRE_AUTH === 'true';
}

export function validateAccessToken(
  authorizationHeader: string | null,
  expectedToken: string | undefined,
): boolean {
  if (!expectedToken) return false;
  if (!authorizationHeader?.startsWith('Bearer ')) return false;

  const token = authorizationHeader.slice('Bearer '.length).trim();
  return token.length > 0 && token === expectedToken;
}
