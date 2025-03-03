import { prisma } from "~/lib/db.server";

export async function createConversation(data: {
  title?: string;
  ticketId: string;
  summary?: string;
  keyPoints?: string;
}) {
  return prisma.conversation.create({
    data: {
      title: data.title,
      summary: data.summary,
      keyPoints: data.keyPoints,
      ticket: { connect: { id: data.ticketId } }
    }
  });
}

export async function getConversationsByTicketId(ticketId: string) {
  return prisma.conversation.findMany({
    where: { ticketId },
    include: {
      messages: true
    },
    orderBy: {
      createdAt: "asc"
    }
  });
}

export async function updateConversation(conversationId: string, data: {
  title?: string;
  summary?: string;
  keyPoints?: string;
}) {
  return prisma.conversation.update({
    where: { id: conversationId },
    data
  });
}

export async function deleteConversation(conversationId: string) {
  return prisma.conversation.delete({
    where: { id: conversationId }
  });
} 