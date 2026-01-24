import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { del as blobDel } from '@vercel/blob';
import { isBlobUrl } from '@/lib/blob';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ============ GET: Fetch all events for admin ============
export async function GET() {
  const user = await requireRole('EDITOR');
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [upcomingRows, pastRows] = await Promise.all([
      prisma.event.findMany({
        orderBy: { date: 'asc' },
      }),
      prisma.pastEvent.findMany({
        orderBy: { date: 'desc' },
      }),
    ]);

    const upcoming = upcomingRows.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date instanceof Date ? e.date.toISOString().slice(0, 10) : String(e.date).slice(0, 10),
      time: e.time,
      dateTBA: e.dateTBA,
      venue: e.venue,
      location: e.location,
      description: e.description,
      image: e.image,
      buttonText: e.buttonText,
      buttonUrl: e.buttonUrl,
      hidden: e.hidden,
    }));

    const past = pastRows.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date instanceof Date ? e.date.toISOString().slice(0, 10) : String(e.date).slice(0, 10),
      venue: e.venue,
      location: e.location,
      image: e.image,
      gallery: e.gallery,
      description: e.description,
      hidden: e.hidden,
    }));

    return NextResponse.json({ ok: true, upcoming, past });
  } catch (err) {
    console.error('Admin events GET failed:', err);
    return NextResponse.json({ ok: false, error: 'Database error' }, { status: 500 });
  }
}

// ============ POST: Create/Update events ============
export async function POST(request: Request) {
  const user = await requireRole('EDITOR');
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, type, data } = body;

    if (!action || !type || !data) {
      return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
    }

    // Handle upcoming events
    if (type === 'upcoming') {
      if (action === 'create') {
        const event = await prisma.event.create({
          data: {
            title: data.title,
            date: new Date(data.date),
            time: data.time || null,
            dateTBA: data.dateTBA || false,
            venue: data.venue || null,
            location: data.location || null,
            description: data.description || null,
            image: data.image || null,
            buttonText: data.buttonText || null,
            buttonUrl: data.buttonUrl || null,
            hidden: data.hidden || false,
          },
        });
        return NextResponse.json({ ok: true, event });
      }

      if (action === 'update' && data.id) {
        // Get old event to check for image changes
        const oldEvent = await prisma.event.findUnique({ where: { id: data.id } });
        
        const event = await prisma.event.update({
          where: { id: data.id },
          data: {
            title: data.title,
            date: new Date(data.date),
            time: data.time || null,
            dateTBA: data.dateTBA || false,
            venue: data.venue || null,
            location: data.location || null,
            description: data.description || null,
            image: data.image || null,
            buttonText: data.buttonText || null,
            buttonUrl: data.buttonUrl || null,
            hidden: data.hidden || false,
          },
        });

        // Delete old blob image if it was replaced
        if (oldEvent?.image && oldEvent.image !== data.image && isBlobUrl(oldEvent.image)) {
          try {
            await blobDel(oldEvent.image);
          } catch (e) {
            console.warn('Failed to delete old blob:', e);
          }
        }

        return NextResponse.json({ ok: true, event });
      }

      if (action === 'delete' && data.id) {
        const event = await prisma.event.findUnique({ where: { id: data.id } });
        
        // Delete blob image if exists
        if (event?.image && isBlobUrl(event.image)) {
          try {
            await blobDel(event.image);
          } catch (e) {
            console.warn('Failed to delete blob:', e);
          }
        }

        await prisma.event.delete({ where: { id: data.id } });
        return NextResponse.json({ ok: true });
      }
    }

    // Handle past events
    if (type === 'past') {
      if (action === 'create') {
        const event = await prisma.pastEvent.create({
          data: {
            title: data.title,
            date: new Date(data.date),
            venue: data.venue || null,
            location: data.location || null,
            image: data.image || null,
            gallery: data.gallery || null,
            description: data.description || null,
            hidden: data.hidden || false,
          },
        });
        return NextResponse.json({ ok: true, event });
      }

      if (action === 'update' && data.id) {
        const oldEvent = await prisma.pastEvent.findUnique({ where: { id: data.id } });
        
        const event = await prisma.pastEvent.update({
          where: { id: data.id },
          data: {
            title: data.title,
            date: new Date(data.date),
            venue: data.venue || null,
            location: data.location || null,
            image: data.image || null,
            gallery: data.gallery || null,
            description: data.description || null,
            hidden: data.hidden || false,
          },
        });

        // Delete old blob image if replaced
        if (oldEvent?.image && oldEvent.image !== data.image && isBlobUrl(oldEvent.image)) {
          try {
            await blobDel(oldEvent.image);
          } catch (e) {
            console.warn('Failed to delete old blob:', e);
          }
        }

        return NextResponse.json({ ok: true, event });
      }

      if (action === 'delete' && data.id) {
        const event = await prisma.pastEvent.findUnique({ where: { id: data.id } });
        
        if (event?.image && isBlobUrl(event.image)) {
          try {
            await blobDel(event.image);
          } catch (e) {
            console.warn('Failed to delete blob:', e);
          }
        }

        await prisma.pastEvent.delete({ where: { id: data.id } });
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ ok: false, error: 'Invalid action or type' }, { status: 400 });
  } catch (err) {
    console.error('Admin events POST failed:', err);
    return NextResponse.json({ ok: false, error: 'Operation failed' }, { status: 500 });
  }
}
