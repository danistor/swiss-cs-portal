import { PrismaClient } from '@prisma/client';
import type { Language, TicketPriority, TicketStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Agent Performance Analytics
export async function getAgentPerformance(userId: string, startDate: Date, endDate: Date) {
  return prisma.agentPerformance.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });
}

export async function updateAgentPerformance(
  userId: string,
  data: {
    ticketsResolved?: number;
    averageResponseTime?: number;
    customerSatisfactionScore?: number;
  }
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingRecord = await prisma.agentPerformance.findFirst({
    where: {
      userId,
      date: today,
    },
  });

  if (existingRecord) {
    return prisma.agentPerformance.update({
      where: { id: existingRecord.id },
      data,
    });
  } else {
    return prisma.agentPerformance.create({
      data: {
        userId,
        ...data,
      },
    });
  }
}

// Ticket Metrics Analytics
export async function getTicketMetrics(startDate: Date, endDate: Date) {
  return prisma.ticketMetrics.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });
}

export async function updateTicketMetrics(
  data: {
    newTickets?: number;
    resolvedTickets?: number;
    averageResolutionTime?: number;
    priorityDistribution?: Record<TicketPriority, number>;
    statusDistribution?: Record<TicketStatus, number>;
  }
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingRecord = await prisma.ticketMetrics.findFirst({
    where: {
      date: today,
    },
  });

  if (existingRecord) {
    return prisma.ticketMetrics.update({
      where: { id: existingRecord.id },
      data,
    });
  } else {
    return prisma.ticketMetrics.create({
      data,
    });
  }
}

// Language Metrics Analytics
export async function getLanguageMetrics(startDate: Date, endDate: Date) {
  return prisma.languageMetrics.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });
}

export async function updateLanguageMetrics(
  language: Language,
  data: {
    ticketCount?: number;
    messageCount?: number;
  }
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingRecord = await prisma.languageMetrics.findFirst({
    where: {
      language,
      date: today,
    },
  });

  if (existingRecord) {
    return prisma.languageMetrics.update({
      where: { id: existingRecord.id },
      data,
    });
  } else {
    return prisma.languageMetrics.create({
      data: {
        language,
        ...data,
      },
    });
  }
}

// Dashboard Summary
export async function getDashboardSummary() {
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const [
    ticketMetrics,
    agentPerformance,
    languageMetrics,
    openTickets,
    totalTickets,
  ] = await Promise.all([
    prisma.ticketMetrics.findMany({
      where: {
        date: {
          gte: lastWeek,
        },
      },
      orderBy: {
        date: 'asc',
      },
    }),
    prisma.agentPerformance.findMany({
      where: {
        date: {
          gte: lastWeek,
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
    prisma.languageMetrics.findMany({
      where: {
        date: {
          gte: lastWeek,
        },
      },
    }),
    prisma.ticket.count({
      where: {
        status: {
          in: ['NEW', 'IN_PROGRESS', 'PENDING'],
        },
      },
    }),
    prisma.ticket.count(),
  ]);

  return {
    ticketMetrics,
    agentPerformance,
    languageMetrics,
    openTickets,
    totalTickets,
  };
} 