import { NextResponse } from 'next/server';
import { auth } from './auth';

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

  // get path name from req object
  const { pathname } = req.nextUrl;
  const session = await auth();

  if (!session && protectedPaths.some((p) => p.test(pathname)))
    return NextResponse.redirect(new URL('/sign-in', req.nextUrl.origin));

  const sessionCartId = req.cookies.get('sessionCartId') || crypto.randomUUID();
  const response = NextResponse.next();
  if (!req.cookies.get('sessionCartId')) {
    response.cookies.set('sessionCartId', sessionCartId);
  }

  return response;
}
