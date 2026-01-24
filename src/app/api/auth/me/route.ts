import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getSessionUser();
    
    if (!user) {
      return NextResponse.json({ ok: false, user: null });
    }

    return NextResponse.json({ 
      ok: true, 
      user: { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      } 
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ ok: false, user: null });
  }
}
