import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const revalidate = 300;

// GET - Public endpoint to fetch all board members
export async function GET() {
  try {
    const members = await prisma.boardMember.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ ok: true, members });
  } catch (e) {
    console.error('Board API error:', e);
    return NextResponse.json({ ok: false, error: 'Failed to fetch board members' }, { status: 500 });
  }
}
