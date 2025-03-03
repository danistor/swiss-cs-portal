import { prisma } from "~/lib/db.server";

export async function createTag(name: string) {
  return prisma.tag.create({
    data: { name }
  });
}

export async function getAllTags() {
  return prisma.tag.findMany({
    orderBy: {
      name: "asc"
    }
  });
}

export async function addTagToTicket(ticketId: string, tagId: string) {
  return prisma.ticket.update({
    where: { id: ticketId },
    data: {
      tags: {
        connect: { id: tagId }
      }
    },
    include: {
      tags: true
    }
  });
}

export async function removeTagFromTicket(ticketId: string, tagId: string) {
  return prisma.ticket.update({
    where: { id: ticketId },
    data: {
      tags: {
        disconnect: { id: tagId }
      }
    },
    include: {
      tags: true
    }
  });
}