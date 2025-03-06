import { prisma } from "~/lib/db.server";
import type { Language } from "@prisma/client";

export async function createMessage(data: {
  content: string;
  ticketId: string;
  userId: string;
  isFromCustomer: boolean;
  sentimentScore?: number;
  language?: Language;
}) {
  return prisma.message.create({
    data: {
      content: data.content,
      isFromCustomer: data.isFromCustomer,
      sentimentScore: data.sentimentScore,
      language: data.language,
      ticket: { connect: { id: data.ticketId } },
      user: { connect: { id: data.userId } }
    }
  });
}

export async function getMessagesByTicketId(ticketId: string) {
  return prisma.message.findMany({
    where: { ticketId },
    include: {
      user: true
    },
    orderBy: {
      createdAt: "asc"
    }
  });
}

export async function updateMessage(messageId: string, data: {
  content?: string;
  isFromCustomer?: boolean;
  sentimentScore?: number;
  language?: Language;
}) {
  return prisma.message.update({
    where: { id: messageId },
    data
  });
}

export async function deleteMessage(messageId: string) {
  return prisma.message.delete({
    where: { id: messageId }
  });
} 