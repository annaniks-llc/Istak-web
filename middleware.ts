import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matchedLocale = i18n.locales.find((locale) => pathname.startsWith(`/${locale}`));
  const locale = matchedLocale || i18n.defaultLocale;

  if (!matchedLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.headers.set('x-debug-locale', locale);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
