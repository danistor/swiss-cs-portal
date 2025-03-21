import { prisma } from "~/lib/db.server";
import type { TicketStatus, TicketPriority, Language, Ticket } from "@prisma/client";

export async function createTicket(data: {
  title: string;
  description: string;
  creatorId: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  preferredLanguage?: Language;
  category?: string;
  assigneeId?: string;
}) {
  return prisma.ticket.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignee: data.assigneeId ? { connect: { id: data.assigneeId } } : undefined,
      creator: { connect: { id: data.creatorId } }
    },
    include: {
      creator: true,
      assignee: true
    }
  });
}

export async function getTickets(filters?: {
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string;
  creatorId?: string;
  preferredLanguage?: Language;
}): Promise<Array<Ticket>> {
  return prisma.ticket.findMany({
    where: filters,
    include: {
      creator: true,
      assignee: true
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
}

export async function getTicketById(id: string) {
  return prisma.ticket.findUnique({
    where: { id },
    include: {
      creator: true,
      assignee: true,
      messages: {
        include: {
          user: true
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });
}

export async function updateTicket(id: string, data: {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string;
  sentiment?: number;
  category?: string;
  lifetimeValue?: number;
  conversationSummary?: string;
}) {
  return prisma.ticket.update({
    where: { id },
    data,
    include: {
      creator: true,
      assignee: true
    }
  });
}

export async function deleteTicket(id: string) {
  return prisma.ticket.delete({
    where: { id }
  });
}