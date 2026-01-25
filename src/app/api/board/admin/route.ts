import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Admin endpoint to fetch all board members
export async function GET() {
  const user = await requireRole('EDITOR');
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const members = await prisma.boardMember.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ ok: true, members });
  } catch (e) {
    console.error('Board admin API error:', e);
    return NextResponse.json({ ok: false, error: 'Failed to fetch board members' }, { status: 500 });
  }
}

// POST - Create, update, delete, or reorder board members
export async function POST(request: Request) {
  const user = await requireRole('EDITOR');
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create') {
      const { name, role, roles, image, order } = body;
      
      if (!name || !role) {
        return NextResponse.json({ ok: false, error: 'Name and role are required' }, { status: 400 });
      }

      // Get max order if not provided
      const maxOrder = order ?? (await prisma.boardMember.aggregate({
        _max: { order: true },
      }))._max.order ?? -1;

      const member = await prisma.boardMember.create({
        data: {
          name,
          role,
          roles: roles || null,
          image: image || null,
          order: typeof order === 'number' ? order : maxOrder + 1,
        },
      });

      return NextResponse.json({ ok: true, member });
    }

    if (action === 'update') {
      const { id, name, role, roles, image, order } = body;
      
      if (!id) {
        return NextResponse.json({ ok: false, error: 'Member ID is required' }, { status: 400 });
      }

      const member = await prisma.boardMember.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(role && { role }),
          ...(roles !== undefined && { roles: roles || null }),
          ...(image !== undefined && { image: image || null }),
          ...(typeof order === 'number' && { order }),
        },
      });

      return NextResponse.json({ ok: true, member });
    }

    if (action === 'delete') {
      const { id } = body;
      
      if (!id) {
        return NextResponse.json({ ok: false, error: 'Member ID is required' }, { status: 400 });
      }

      await prisma.boardMember.delete({
        where: { id },
      });

      return NextResponse.json({ ok: true });
    }

    if (action === 'reorder') {
      const { members } = body;
      
      if (!Array.isArray(members)) {
        return NextResponse.json({ ok: false, error: 'Members array is required' }, { status: 400 });
      }

      // Update order for each member
      await Promise.all(
        members.map((m: { id: string; order: number }) =>
          prisma.boardMember.update({
            where: { id: m.id },
            data: { order: m.order },
          })
        )
      );

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 });
  } catch (e) {
    console.error('Board admin API error:', e);
    return NextResponse.json({ ok: false, error: 'Operation failed' }, { status: 500 });
  }
}
