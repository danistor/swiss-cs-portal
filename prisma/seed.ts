import { PrismaClient, TicketPriority, TicketStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      clerkId: 'clerk1',
      email: 'user1@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'CUSTOMER',
      preferredLanguage: 'EN',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      clerkId: 'clerk2',
      email: 'user2@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'REPRESENTATIVE',
      preferredLanguage: 'DE',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      clerkId: 'user_2tnv03nJkcdM6GyqfKuPJPsgwN8',
      email: 'danistor+cs@icloud.com',
      firstName: 'Dan',
      lastName: 'Istrate',
      role: 'CUSTOMER',
      preferredLanguage: 'EN',
    },
  });

  // Define possible statuses and priorities
  const statuses = ['NEW', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  // Create Tickets for user3
  for (let i = 1; i <= 5; i++) {
    const ticket = await prisma.ticket.create({
      data: {
        title: `Issue ${i} with product`,
        description: `Description for issue ${i}.`,
        status: statuses[i % statuses.length] as TicketStatus,
        priority: priorities[i % priorities.length] as TicketPriority,
        creator: { connect: { id: user3.id } },
        assignee: { connect: { id: user2.id } },
      },
    });

    // Create Messages for each ticket
    await prisma.message.create({
      data: {
        content: `Customer message for issue ${i}.`,
        isFromCustomer: true,
        ticket: { connect: { id: ticket.id } },
        user: { connect: { id: user3.id } },
      },
    });

    await prisma.message.create({
      data: {
        content: `Representative response for issue ${i}.`,
        isFromCustomer: false,
        ticket: { connect: { id: ticket.id } },
        user: { connect: { id: user2.id } },
      },
    });
  }

  // Create Response Templates
  await prisma.responseTemplate.create({
    data: {
      title: 'Apology for inconvenience',
      content: 'We apologize for the inconvenience caused.',
      language: 'EN',
      category: 'Apology',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 