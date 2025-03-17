import { PrismaClient, TicketPriority, TicketStatus, UserRole, Language } from '@prisma/client';
import type { Ticket } from '@prisma/client';

const prisma = new PrismaClient();

// Define types for tracking data
interface TicketDateCounts {
  new: number;
  resolved: number;
}

interface AgentDateMetrics {
  resolved: number;
  responseTime: number;
}

interface LanguageCounts {
  [date: string]: number;
}

async function main() {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.agentPerformance.deleteMany({}).catch(() => console.log('No AgentPerformance table yet'));
    await prisma.ticketMetrics.deleteMany({}).catch(() => console.log('No TicketMetrics table yet'));
    await prisma.languageMetrics.deleteMany({}).catch(() => console.log('No LanguageMetrics table yet'));
    await prisma.message.deleteMany({});
    await prisma.ticket.deleteMany({});
    await prisma.responseTemplate.deleteMany({});
    await prisma.user.deleteMany({});

    // Create Users
    const admin = await prisma.user.create({
      data: {
        clerkId: 'admin_clerk',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        preferredLanguage: 'EN',
      },
    });

    const agent1 = await prisma.user.create({
      data: {
        clerkId: 'user_2u7nPv9xpJefoWjY9EHxiiBArmZ',
        email: 'danistor+csagent@icloud.com',
        firstName: 'Dan',
        lastName: 'Agent',
        role: 'REPRESENTATIVE',
        preferredLanguage: 'EN',
      },
    });

    const agent2 = await prisma.user.create({
      data: {
        clerkId: 'clerk_agent2',
        email: 'agent2@example.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'REPRESENTATIVE',
        preferredLanguage: 'DE',
      },
    });

    const agent3 = await prisma.user.create({
      data: {
        clerkId: 'clerk_agent3',
        email: 'agent3@example.com',
        firstName: 'Michael',
        lastName: 'Brown',
        role: 'REPRESENTATIVE',
        preferredLanguage: 'FR',
      },
    });

    const customer1 = await prisma.user.create({
      data: {
        clerkId: 'user_2tnv03nJkcdM6GyqfKuPJPsgwN8',
        email: 'danistor+cs@icloud.com',
        firstName: 'Dan',
        lastName: 'Customer',
        role: 'CUSTOMER',
        preferredLanguage: 'EN',
      },
    });

    const customer2 = await prisma.user.create({
      data: {
        clerkId: 'clerk_customer2',
        email: 'customer2@example.com',
        firstName: 'Emma',
        lastName: 'Wilson',
        role: 'CUSTOMER',
        preferredLanguage: 'DE',
      },
    });

    const customer3 = await prisma.user.create({
      data: {
        clerkId: 'clerk_customer3',
        email: 'customer3@example.com',
        firstName: 'Thomas',
        lastName: 'Mueller',
        role: 'CUSTOMER',
        preferredLanguage: 'DE',
      },
    });

    const customer4 = await prisma.user.create({
      data: {
        clerkId: 'clerk_customer4',
        email: 'customer4@example.com',
        firstName: 'Sophie',
        lastName: 'Martin',
        role: 'CUSTOMER',
        preferredLanguage: 'FR',
      },
    });

    const customer5 = await prisma.user.create({
      data: {
        clerkId: 'clerk_customer5',
        email: 'customer5@example.com',
        firstName: 'Marco',
        lastName: 'Rossi',
        role: 'CUSTOMER',
        preferredLanguage: 'IT',
      },
    });

    // Define possible statuses and priorities
    const statuses = Object.values(TicketStatus);
    const priorities = Object.values(TicketPriority);
    const languages = Object.values(Language);
    const agents = [agent1, agent2, agent3];
    const customers = [customer1, customer2, customer3, customer4, customer5];

    // Create Response Templates
    await prisma.responseTemplate.create({
      data: {
        title: 'Apology for inconvenience',
        content: 'We apologize for the inconvenience caused.',
        language: 'EN',
        category: 'Apology',
      },
    });

    await prisma.responseTemplate.create({
      data: {
        title: 'Technical support',
        content: 'Our technical team is looking into this issue and will get back to you shortly.',
        language: 'EN',
        category: 'Technical',
      },
    });

    await prisma.responseTemplate.create({
      data: {
        title: 'Entschuldigung für Unannehmlichkeiten',
        content: 'Wir entschuldigen uns für die entstandenen Unannehmlichkeiten.',
        language: 'DE',
        category: 'Apology',
      },
    });

    await prisma.responseTemplate.create({
      data: {
        title: 'Nous vous remercions',
        content: 'Nous vous remercions de votre patience et de votre compréhension.',
        language: 'FR',
        category: 'Thanks',
      },
    });

    // Generate data for the past 30 days
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30);

    // Create tickets and messages for the past 30 days
    const tickets: Ticket[] = [];
    const ticketsByDate: Record<string, TicketDateCounts> = {};
    const ticketsByAgent: Record<string, Record<string, AgentDateMetrics>> = {};
    const ticketsByLanguage: Record<Language, LanguageCounts> = {
      EN: {},
      DE: {},
      FR: {},
      IT: {},
    };
    const messagesByLanguage: Record<Language, LanguageCounts> = {
      EN: {},
      DE: {},
      FR: {},
      IT: {},
    };

    // Initialize tracking objects
    agents.forEach(agent => {
      ticketsByAgent[agent.id] = {};
    });

    // Create 50 tickets over the past 30 days
    for (let i = 1; i <= 50; i++) {
      // Randomly select date within the past 30 days
      const ticketDate = new Date(startDate);
      ticketDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
      const dateKey = ticketDate.toISOString().split('T')[0];

      // Select customer and agent
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const agent = agents[Math.floor(Math.random() * agents.length)];

      // Select status and priority
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];

      // Create ticket
      const ticket = await prisma.ticket.create({
        data: {
          title: `Issue ${i}: ${['Login problem', 'Payment failed', 'Cannot access account', 'Feature request', 'Bug report'][Math.floor(Math.random() * 5)]}`,
          description: `Description for issue ${i}. ${['This has been happening for a week.', 'I need urgent assistance.', 'Please help me resolve this.', 'This is affecting my business.'][Math.floor(Math.random() * 4)]}`,
          status,
          priority,
          createdAt: ticketDate,
          updatedAt: ticketDate,
          creator: { connect: { id: customer.id } },
          assignee: { connect: { id: agent.id } },
          // Add AI fields
          autoClassification: ['Technical', 'Billing', 'Account', 'Feature', 'Bug'][Math.floor(Math.random() * 5)],
          sentimentScore: Math.random() * 5,
          customerValueTier: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
        },
      });

      tickets.push(ticket);

      // Track tickets by date
      if (!ticketsByDate[dateKey]) {
        ticketsByDate[dateKey] = { new: 0, resolved: 0 };
      }
      ticketsByDate[dateKey].new++;

      if (status === 'RESOLVED' || status === 'CLOSED') {
        ticketsByDate[dateKey].resolved++;
      }

      // Track tickets by agent
      if (!ticketsByAgent[agent.id][dateKey]) {
        ticketsByAgent[agent.id][dateKey] = { resolved: 0, responseTime: 0 };
      }

      if (status === 'RESOLVED' || status === 'CLOSED') {
        ticketsByAgent[agent.id][dateKey].resolved++;
        // Random response time between 5 and 120 minutes
        ticketsByAgent[agent.id][dateKey].responseTime += Math.floor(Math.random() * 115) + 5;
      }

      // Track tickets by language
      const ticketLanguage = customer.preferredLanguage as Language;
      if (!ticketsByLanguage[ticketLanguage][dateKey]) {
        ticketsByLanguage[ticketLanguage][dateKey] = 0;
      }
      ticketsByLanguage[ticketLanguage][dateKey]++;

      // Create 1-3 messages for each ticket
      const messageCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < messageCount; j++) {
        const isFromCustomer = j === 0 || Math.random() > 0.7;
        const messageDate = new Date(ticketDate);
        messageDate.setMinutes(messageDate.getMinutes() + (j * 30) + Math.floor(Math.random() * 30));
        const messageDateKey = messageDate.toISOString().split('T')[0];

        const messageLanguage = isFromCustomer ? customer.preferredLanguage as Language : agent.preferredLanguage as Language;

        await prisma.message.create({
          data: {
            content: isFromCustomer
              ? `Customer message ${j + 1} for issue ${i}. ${['Please help me with this.', 'I\'m having trouble with your product.', 'Can you fix this issue?', 'Thank you for your assistance.'][Math.floor(Math.random() * 4)]}`
              : `Agent response ${j + 1} for issue ${i}. ${['We\'re looking into this.', 'I\'ve fixed the problem.', 'Please try the following steps.', 'Is there anything else I can help with?'][Math.floor(Math.random() * 4)]}`,
            isFromCustomer,
            createdAt: messageDate,
            ticket: { connect: { id: ticket.id } },
            user: { connect: { id: isFromCustomer ? customer.id : agent.id } },
            // Add AI fields
            sentimentScore: Math.random() * 5,
            language: messageLanguage,
          },
        });

        // Track messages by language
        if (!messagesByLanguage[messageLanguage][messageDateKey]) {
          messagesByLanguage[messageLanguage][messageDateKey] = 0;
        }
        messagesByLanguage[messageLanguage][messageDateKey]++;
      }
    }

    // Create TicketMetrics entries
    console.log('Creating TicketMetrics entries...');
    for (const [dateStr, counts] of Object.entries(ticketsByDate)) {
      const date = new Date(dateStr);

      // Calculate priority and status distributions for this date
      const priorityDistribution: Record<TicketPriority, number> = {} as Record<TicketPriority, number>;
      const statusDistribution: Record<TicketStatus, number> = {} as Record<TicketStatus, number>;

      priorities.forEach(p => priorityDistribution[p] = 0);
      statuses.forEach(s => statusDistribution[s] = 0);

      tickets.forEach(ticket => {
        const ticketDate = ticket.createdAt.toISOString().split('T')[0];
        if (ticketDate === dateStr) {
          priorityDistribution[ticket.priority as TicketPriority]++;
          statusDistribution[ticket.status as TicketStatus]++;
        }
      });

      try {
        await prisma.ticketMetrics.create({
          data: {
            date,
            newTickets: counts.new,
            resolvedTickets: counts.resolved,
            averageResolutionTime: Math.floor(Math.random() * 240) + 60, // 1-5 hours in minutes
            priorityDistribution: priorityDistribution as any,
            statusDistribution: statusDistribution as any,
          },
        });
      } catch (error) {
        console.error('Error creating TicketMetrics:', error);
      }
    }

    // Create AgentPerformance entries
    console.log('Creating AgentPerformance entries...');

    // Ensure we have agent performance data for the last 7 days
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Create entries for each agent for the last 7 days
    for (const agent of agents) {
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];

        // Check if we already have metrics for this date
        const existingMetrics = ticketsByAgent[agent.id][dateKey];

        // If we have existing metrics with resolved tickets, use them
        if (existingMetrics && existingMetrics.resolved > 0) {
          const avgResponseTime = Math.round(existingMetrics.responseTime / existingMetrics.resolved);

          try {
            await prisma.agentPerformance.create({
              data: {
                userId: agent.id,
                date,
                ticketsResolved: existingMetrics.resolved,
                averageResponseTime: avgResponseTime,
                customerSatisfactionScore: Math.round((3.5 + Math.random() * 1.5) * 10) / 10, // 3.5-5.0 score
              },
            });
          } catch (error) {
            console.error('Error creating AgentPerformance:', error);
          }
        }
        // Otherwise, create an entry with some random data
        else {
          // Generate random data for demonstration purposes
          const ticketsResolved = Math.floor(Math.random() * 5) + 1; // 1-5 tickets
          const avgResponseTime = Math.floor(Math.random() * 115) + 5; // 5-120 minutes

          try {
            await prisma.agentPerformance.create({
              data: {
                userId: agent.id,
                date,
                ticketsResolved,
                averageResponseTime: avgResponseTime,
                customerSatisfactionScore: Math.round((3.5 + Math.random() * 1.5) * 10) / 10, // 3.5-5.0 score
              },
            });
          } catch (error) {
            console.error('Error creating AgentPerformance:', error);
          }
        }
      }
    }

    // Process any remaining historical agent performance data
    for (const agentId of Object.keys(ticketsByAgent)) {
      for (const [dateStr, metrics] of Object.entries(ticketsByAgent[agentId])) {
        const date = new Date(dateStr);

        // Skip if the date is within the last 7 days (already processed above)
        if (date >= lastWeek) continue;

        if (metrics.resolved > 0) {
          const avgResponseTime = Math.round(metrics.responseTime / metrics.resolved);

          try {
            await prisma.agentPerformance.create({
              data: {
                userId: agentId,
                date,
                ticketsResolved: metrics.resolved,
                averageResponseTime: avgResponseTime,
                customerSatisfactionScore: Math.round((3.5 + Math.random() * 1.5) * 10) / 10, // 3.5-5.0 score
              },
            });
          } catch (error) {
            console.error('Error creating AgentPerformance:', error);
          }
        }
      }
    }

    // Create LanguageMetrics entries
    console.log('Creating LanguageMetrics entries...');
    for (const language of languages) {
      const ticketDates = Object.keys(ticketsByLanguage[language]);
      const messageDates = Object.keys(messagesByLanguage[language]);
      const allDates = [...new Set([...ticketDates, ...messageDates])];

      for (const dateStr of allDates) {
        const date = new Date(dateStr);
        const ticketCount = ticketsByLanguage[language][dateStr] || 0;
        const messageCount = messagesByLanguage[language][dateStr] || 0;

        if (ticketCount > 0 || messageCount > 0) {
          try {
            await prisma.languageMetrics.create({
              data: {
                date,
                language,
                ticketCount,
                messageCount,
              },
            });
          } catch (error) {
            console.error('Error creating LanguageMetrics:', error);
          }
        }
      }
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 