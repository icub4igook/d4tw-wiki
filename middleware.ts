import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Always allow webhook endpoint through without auth
  if (request.nextUrl.pathname.startsWith('/api/webhook')) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const auth = request.cookies.get('wiki_auth')?.value;
  if (auth === process.env.WIKI_PASSWORD) {
    return NextResponse.next();
  }

  // Allow the login page itself
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next();
  }

  // Allow the login API
  if (request.nextUrl.pathname === '/api/login') {
    return NextResponse.next();
  }

  // Redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
