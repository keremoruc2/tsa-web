import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { clearSessionCookieOn } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const c = await cookies();
    const token = c.get('sid')?.value;
    
    if (token) {
      // Delete session from database
      await prisma.session.delete({ where: { sessionToken: token } }).catch(() => {});
    }

    const res = NextResponse.json({ ok: true });
    clearSessionCookieOn(res);
    return res;
  } catch (error) {
    console.error('Logout error:', error);
    const res = NextResponse.json({ ok: true }); // Still return success
    clearSessionCookieOn(res);
    return res;
  }
}
