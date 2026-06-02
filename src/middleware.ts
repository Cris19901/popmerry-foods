import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? process.env.ADMIN_PASSWORD ?? 'fallback');
const COOKIE = 'admin_token';
const SESSION_HOURS = 8;
const REFRESH_THRESHOLD_HOURS = 2;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get(COOKIE)?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      const res = NextResponse.next();

      // Sliding session: refresh if less than 2 hours remain
      const exp = payload.exp as number;
      const now = Math.floor(Date.now() / 1000);
      if (exp - now < REFRESH_THRESHOLD_HOURS * 3600) {
        const fresh = await new SignJWT({ role: 'admin' })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime(`${SESSION_HOURS}h`)
          .sign(secret);

        res.cookies.set(COOKIE, fresh, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: SESSION_HOURS * 3600,
          path: '/',
        });
      }

      return res;
    } catch {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
