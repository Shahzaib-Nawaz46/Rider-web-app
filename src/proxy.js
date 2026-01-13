import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Allow Next.js internals & static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Public paths
  const publicPaths = [
    '/',
    '/User/Login',
    '/User/Verification',
    '/Rider/Login',
    '/Rider/Verification',
  ];

  const isPublic = publicPaths.some(
    path => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // Auth check (NextAuth official way)
  const token = await getToken({ req: request });

  if (token) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
