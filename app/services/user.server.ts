import { prisma } from "~/lib/db.server";
import type { UserRole, Language } from "@prisma/client";

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: { clerkId }
  });
}

export async function createUser(data: {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  preferredLanguage?: Language;
}) {
  return prisma.user.create({
    data
  });
}

export async function updateUser(id: string, data: {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  preferredLanguage?: Language;
  department?: string;
}) {
  return prisma.user.update({
    where: { id },
    data
  });
}

export async function getAgents() {
  return prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "REPRESENTATIVE", "CUSTOMER"]
      }
    },
    orderBy: {
      firstName: "asc"
    }
  });
}