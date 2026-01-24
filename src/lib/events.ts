import { prisma } from '@/lib/prisma';
import type { Event as EventType, PastEvent as PastEventType } from '@/types/events';
import { toDateOnlyString } from '@/utils/date';

export async function getEvents(): Promise<{ upcoming: EventType[]; past: PastEventType[] }> {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Fetch upcoming events (future dates, not hidden)
  const upcomingRows = await prisma.event.findMany({
    where: { 
      hidden: false,
      OR: [
        { date: { gte: now } },
        { dateTBA: true }
      ]
    },
    orderBy: { date: 'asc' },
  });

  // Fetch past events from PastEvent table
  const pastRows = await prisma.pastEvent.findMany({
    where: { hidden: false },
    orderBy: { date: 'desc' },
  });

  const upcoming: EventType[] = upcomingRows.map((e) => ({
    id: e.id,
    title: e.title,
    date: toDateOnlyString(e.date),
    time: e.time,
    dateTBA: e.dateTBA,
    venue: e.venue,
    location: e.location,
    description: e.description,
    image: e.image,
  }));

  const past: PastEventType[] = pastRows.map((e) => ({
    id: e.id,
    title: e.title,
    date: toDateOnlyString(e.date),
    venue: e.venue,
    location: e.location,
    image: e.image,
    gallery: e.gallery,
    description: e.description,
  }));

  return { upcoming, past };
}
