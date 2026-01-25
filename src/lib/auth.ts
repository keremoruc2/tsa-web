import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from './prisma';

const HASH_ALGO = 'sha256';
const ITERATIONS = 100_000;
const KEYLEN = 32;

/**
 * Hash a password with PBKDF2
 */
export function hashPassword(password: string, salt?: string) {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const derived = crypto.pbkdf2Sync(password, s, ITERATIONS, KEYLEN, HASH_ALGO).toString('hex');
  return `pbkdf2$${HASH_ALGO}$${ITERATIONS}$${s}$${derived}`;
}

/**
 * Verify a password against a stored hash
 */
export function verifyPassword(password: string, stored: string) {
  try {
    const [scheme, algo, iterStr, salt, hash] = stored.split('$');
    if (scheme !== 'pbkdf2') return false;
    const iter = Number(iterStr) || ITERATIONS;
    const derived = crypto.pbkdf2Sync(password, salt, iter, KEYLEN, algo).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Create a session for a user
 */
export async function createSession(userId: string, ttlDays = 1) {
  const sessionToken = crypto.randomBytes(24).toString('hex');
  const expires = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { sessionToken, userId, expires } });
  return { sessionToken, expires };
}

/**
 * Get the current session user from cookies
 */
export async function getSessionUser() {
  const c = await cookies();
  const token = c.get('sid')?.value;
  if (!token) return null;
  
  const session = await prisma.session.findUnique({ 
    where: { sessionToken: token }, 
    include: { user: true } 
  });
  
  if (!session) return null;
  
  // Check if session expired
  if (session.expires < new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  
  return session.user;
}

/**
 * Require a minimum role level for access
 */
export async function requireRole(minRole: 'EDITOR' | 'ADMIN' | 'SUPERADMIN') {
  const user = await getSessionUser();
  if (!user) return null;
  
  const order = ['EDITOR', 'ADMIN', 'SUPERADMIN'];
  return order.indexOf(user.role) >= order.indexOf(minRole) ? user : null;
}

/**
 * Attach session cookie to response
 */
export function attachSessionCookie(res: NextResponse, sessionToken: string, expires: Date) {
  res.cookies.set('sid', sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires,
  });
}

/**
 * Clear session cookie
 */
export function clearSessionCookieOn(res: NextResponse) {
  res.cookies.set('sid', '', { path: '/', maxAge: 0 });
}
