import { NextRequest, NextResponse } from 'next/server';

import { updateSession } from './lib/auth';

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  try {
    const session = await updateSession(request);
    if (
      !session &&
      url.pathname !== '/sign-in' &&
      url.pathname !== '/sign-up'
    ) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    if (url.pathname === '/sign-in' && session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Decide how to handle errors - maybe redirect to an error page
    return NextResponse.redirect(new URL('/error', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|assets).*)']
};
