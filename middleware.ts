import { NextResponse } from 'next/server';

export async function middleware(req: any) {
  const protectedPaths = [
    /\/shipping-address/,
    /\/payment-method/,
    /\/place-order/,
    /\/profile/,
    /\/user\/(.*)/,
    /\/order\/(.*)/,
    /\/admin/,
  ];

  const url = req.nextUrl.clone();

  const isProtected = protectedPaths.some((p) => p.test(url.pathname));

  const auth =
    req.cookies.get(process.env.SECURE_AUTH_COOKIE) ||
    req.cookies.get('authjs.session-token');

  if (!auth && isProtected) {
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  const sessionCartId = req.cookies.get('sessionCartId') || crypto.randomUUID();
  const response = NextResponse.next();
  if (!req.cookies.get('sessionCartId')) {
    response.cookies.set('sessionCartId', sessionCartId);
  }

  return response;
}
