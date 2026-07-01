import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? process.env.ADMIN_PASSWORD ?? 'fallback'
);

/** Returns true if the current request carries a valid admin session cookie. */
export async function isAdmin(): Promise<boolean> {
  try {
    const token = (await cookies()).get('admin_token')?.value;
    if (!token) return false;
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}
