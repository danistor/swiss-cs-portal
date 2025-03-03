import { prisma } from "~/lib/db.server";
import type { Language } from "@prisma/client";

export async function createResponseTemplate(data: {
  title: string;
  content: string;
  language: Language;
  category: string;
}) {
  return prisma.responseTemplate.create({
    data
  });
}

export async function getResponseTemplates(filters?: {
  language?: Language;
  category?: string;
}) {
  return prisma.responseTemplate.findMany({
    where: filters,
    orderBy: {
      createdAt: "asc"
    }
  });
}

export async function updateResponseTemplate(templateId: string, data: {
  title?: string;
  content?: string;
  language?: Language;
  category?: string;
}) {
  return prisma.responseTemplate.update({
    where: { id: templateId },
    data
  });
}

export async function deleteResponseTemplate(templateId: string) {
  return prisma.responseTemplate.delete({
    where: { id: templateId }
  });
} 