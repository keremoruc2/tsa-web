import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample upcoming events
  const upcomingEvents = [
    {
      title: 'Turkish Cultural Night',
      date: new Date('2026-02-15T19:00:00.000Z'),
      time: '19:00',
      dateTBA: false,
      venue: 'Vrijhof',
      location: 'University of Twente, Enschede',
      description: 'Join us for an evening of Turkish culture, music, food, and dance! Experience traditional performances and taste authentic Turkish cuisine.',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
      hidden: false,
    },
    {
      title: 'Networking Borrel',
      date: new Date('2026-03-01T17:00:00.000Z'),
      time: '17:00',
      dateTBA: false,
      venue: 'The Vestingbar',
      location: 'Enschede',
      description: 'Connect with fellow students and professionals at our monthly networking event. Free drinks and snacks!',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
      hidden: false,
    },
    {
      title: 'Nevruz Celebration',
      date: new Date('2026-03-21T14:00:00.000Z'),
      time: '14:00',
      dateTBA: false,
      venue: 'Campus Grounds',
      location: 'University of Twente',
      description: 'Celebrate Nevruz, the traditional spring festival! Join us for games, music, and festive activities.',
      image: null,
      hidden: false,
    },
    {
      title: 'Movie Night: Turkish Cinema',
      date: new Date('2026-04-10T20:00:00.000Z'),
      time: '20:00',
      dateTBA: false,
      venue: 'Cinestar',
      location: 'Enschede',
      description: 'A screening of a classic Turkish film followed by discussion. Snacks and drinks provided!',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
      hidden: false,
    },
  ];

  // Create sample past events
  const pastEvents = [
    {
      title: 'Welcome Party 2025',
      date: new Date('2025-09-10T20:00:00.000Z'),
      venue: 'Pakkerij',
      location: 'Enschede',
      description: 'Our annual welcome party for new students was a huge success!',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
      gallery: 'https://photos.example.com/welcome-2025',
      hidden: false,
    },
    {
      title: 'Turkish Tea & Talk',
      date: new Date('2025-10-15T18:00:00.000Z'),
      venue: 'Bastille',
      location: 'Enschede',
      description: 'A cozy evening of Turkish tea and conversation.',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80',
      gallery: null,
      hidden: false,
    },
    {
      title: 'Republic Day Celebration',
      date: new Date('2025-10-29T19:00:00.000Z'),
      venue: 'Vrijhof',
      location: 'University of Twente',
      description: 'Celebrating the 102nd anniversary of the Turkish Republic with cultural performances.',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
      gallery: 'https://photos.example.com/republic-day-2025',
      hidden: false,
    },
  ];

  // Clear existing data
  console.log('Clearing existing events...');
  await prisma.event.deleteMany({});

  // Insert events
  console.log('Creating events...');
  for (const event of [...upcomingEvents, ...pastEvents]) {
    await prisma.event.create({
      data: event,
    });
  }

  console.log(`✅ Created ${upcomingEvents.length + pastEvents.length} events`);
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
