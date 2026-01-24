import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { attachSessionCookie, createSession, verifyPassword } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json().catch(() => ({ username: '', password: '' }));
    
    if (!username || !password) {
      return NextResponse.json({ ok: false, error: 'Username and password required' }, { status: 400 });
    }

    // Find user by username
    const user = await prisma.user.findFirst({ where: { username } });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const ok = verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // Create session
    const { sessionToken, expires } = await createSession(user.id);
    const res = NextResponse.json({ 
      ok: true, 
      user: { id: user.id, username: user.username, role: user.role } 
    });
    attachSessionCookie(res, sessionToken, expires);
    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ ok: false, error: 'Login failed' }, { status: 500 });
  }
}
