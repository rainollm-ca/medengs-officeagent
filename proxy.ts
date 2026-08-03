import { NextResponse, type NextRequest } from 'next/server';
import { isAuthRequired, isPublicPath, validateAccessToken } from './lib/security';

export function proxy(request: NextRequest) {
  if (isPublicPath(request.nextUrl.pathname) || !isAuthRequired()) {
    return NextResponse.next();
  }

  const configuredToken = process.env.APP_ACCESS_TOKEN;

  if (!configuredToken) {
    return NextResponse.json(
      {
        error: {
          code: 'AUTH_NOT_CONFIGURED',
          message: 'Application access token is required before production traffic is allowed.',
        },
      },
      { status: 503 },
    );
  }

  if (!validateAccessToken(request.headers.get('authorization'), configuredToken)) {
    return NextResponse.json(
      {
        error: {
          code: 'UNAUTHORIZED',
          message: 'Bearer access token required.',
        },
      },
      { status: 401 },
    );
  }

  const response = NextResponse.next();
  response.headers.set('X-Flowgent-Auth', 'verified');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
