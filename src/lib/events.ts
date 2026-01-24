import { prisma } from '@/lib/prisma';
import type { Event as EventType } from '@/types/events';
import { toDateOnlyString } from '@/utils/date';

export async function getEvents(): Promise<{ upcoming: EventType[]; past: EventType[] }> {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const allEvents = await prisma.event.findMany({
    where: { hidden: false },
    orderBy: { date: 'desc' },
  });

  const upcoming: EventType[] = [];
  const past: EventType[] = [];

  for (const e of allEvents) {
    const eventData: EventType = {
      id: e.id,
      title: e.title,
      date: toDateOnlyString(e.date),
      time: e.time,
      dateTBA: e.dateTBA,
      venue: e.venue,
      location: e.location,
      description: e.description,
      image: e.image,
      gallery: e.gallery,
    };

    if (e.date >= now || e.dateTBA) {
      upcoming.push(eventData);
    } else {
      past.push(eventData);
    }
  }

  // Sort upcoming by date ascending (nearest first)
  upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return { upcoming, past };
}
