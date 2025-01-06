import { NextResponse } from 'next/server';

export function middleware(req: any) {
  const sessionCartId = req.cookies.get('sessionCartId') || crypto.randomUUID();
  const response = NextResponse.next();
  if (!req.cookies.get('sessionCartId')) {
    response.cookies.set('sessionCartId', sessionCartId);
  }

  return response;
}
