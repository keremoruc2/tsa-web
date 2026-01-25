import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const boardMembers = [
  {
    name: 'Kaan Taşpek',
    role: 'President',
    roles: null,
    order: 0,
  },
  {
    name: 'Utku Şahin',
    role: 'Vice President',
    roles: 'Secretary, Events Coordination',
    order: 1,
  },
  {
    name: 'Berat İlkay',
    role: 'Treasurer',
    roles: 'Finance & Compliance',
    order: 2,
  },
  {
    name: 'Asil Altepe',
    role: 'PR Lead',
    roles: 'Communications & Branding',
    order: 3,
  },
  {
    name: 'Kerem Oruç',
    role: 'IT Lead',
    roles: 'Digital & Documentation',
    order: 4,
  },
];

async function main() {
  console.log('Seeding board members...');
  
  // Clear existing board members
  await prisma.boardMember.deleteMany();
  
  // Create new board members
  for (const member of boardMembers) {
    await prisma.boardMember.create({
      data: member,
    });
    console.log(`✓ Created: ${member.name} - ${member.role}`);
  }
  
  console.log('\n✅ Board members seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding board members:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
