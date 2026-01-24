import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/events';

export const runtime = 'nodejs';
export const revalidate = 300;

export async function GET() {
  try {
    const { upcoming, past } = await getEvents();
    return NextResponse.json({ ok: true, upcoming, past });
  } catch (e) {
    console.error('Events API error:', e);
    
    // Return mock data if database is not available (for development)
    const mockUpcoming = [
      {
        id: 1,
        title: "Turkish Cultural Night",
        date: "2026-02-15",
        time: "19:00",
        dateTBA: false,
        venue: "Vrijhof",
        location: "University of Twente, Enschede",
        description: "Join us for an evening of Turkish culture, music, food, and dance! Experience traditional performances and taste authentic Turkish cuisine.",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
        gallery: null,
      },
      {
        id: 2,
        title: "Networking Borrel",
        date: "2026-03-01",
        time: "17:00",
        dateTBA: false,
        venue: "The Vestingbar",
        location: "Enschede",
        description: "Connect with fellow students and professionals at our monthly networking event. Free drinks and snacks!",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
        gallery: null,
      },
      {
        id: 3,
        title: "Nevruz Celebration",
        date: "2026-03-21",
        time: "14:00",
        dateTBA: false,
        venue: "Campus Grounds",
        location: "University of Twente",
        description: "Celebrate Nevruz, the traditional spring festival! Join us for games, music, and festive activities.",
        image: null,
        gallery: null,
      },
    ];

    const mockPast = [
      {
        id: 101,
        title: "Welcome Party 2025",
        date: "2025-09-10",
        venue: "Pakkerij",
        location: "Enschede",
        description: "Our annual welcome party for new students was a huge success!",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
        gallery: "https://photos.example.com/welcome-2025",
      },
      {
        id: 102,
        title: "Turkish Tea & Talk",
        date: "2025-10-15",
        venue: "Bastille",
        location: "Enschede",
        description: "A cozy evening of Turkish tea and conversation.",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80",
        gallery: null,
      },
    ];

    return NextResponse.json({ ok: true, upcoming: mockUpcoming, past: mockPast });
  }
}
