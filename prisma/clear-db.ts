import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    // Delete child records first
    await prisma.message.deleteMany({});
    await prisma.conversation.deleteMany({});
    await prisma.ticket.deleteMany({});
    await prisma.responseTemplate.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('All data deleted successfully.');
  } catch (error) {
    console.error('Error deleting data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();