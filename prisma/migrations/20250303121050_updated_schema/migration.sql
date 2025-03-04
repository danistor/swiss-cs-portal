/*
  Warnings:

  - The values [URGENT] on the enum `TicketPriority` will be removed. If these variants are still used in the database, this will fail.
  - The values [OPEN] on the enum `TicketStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `assignedToId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `conversationSummary` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `lifetimeValue` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `sentiment` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `AIMetric` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Response` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TicketToTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creatorId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'REPRESENTATIVE', 'ADMIN');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'DE', 'FR', 'IT');

-- AlterEnum
BEGIN;
CREATE TYPE "TicketPriority_new" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
ALTER TABLE "Ticket" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "Ticket" ALTER COLUMN "priority" TYPE "TicketPriority_new" USING ("priority"::text::"TicketPriority_new");
ALTER TYPE "TicketPriority" RENAME TO "TicketPriority_old";
ALTER TYPE "TicketPriority_new" RENAME TO "TicketPriority";
DROP TYPE "TicketPriority_old";
ALTER TABLE "Ticket" ALTER COLUMN "priority" SET DEFAULT 'MEDIUM';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TicketStatus_new" AS ENUM ('NEW', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED');
ALTER TABLE "Ticket" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Ticket" ALTER COLUMN "status" TYPE "TicketStatus_new" USING ("status"::text::"TicketStatus_new");
ALTER TYPE "TicketStatus" RENAME TO "TicketStatus_old";
ALTER TYPE "TicketStatus_new" RENAME TO "TicketStatus";
DROP TYPE "TicketStatus_old";
ALTER TABLE "Ticket" ALTER COLUMN "status" SET DEFAULT 'NEW';
COMMIT;

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_userId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_createdById_fkey";

-- DropForeignKey
ALTER TABLE "_TicketToTag" DROP CONSTRAINT "_TicketToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_TicketToTag" DROP CONSTRAINT "_TicketToTag_B_fkey";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "assignedToId",
DROP COLUMN "category",
DROP COLUMN "conversationSummary",
DROP COLUMN "createdById",
DROP COLUMN "language",
DROP COLUMN "lifetimeValue",
DROP COLUMN "sentiment",
ADD COLUMN     "assigneeId" TEXT,
ADD COLUMN     "autoClassification" TEXT,
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "customerValueTier" TEXT,
ADD COLUMN     "sentimentScore" DOUBLE PRECISION,
ALTER COLUMN "status" SET DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "department",
DROP COLUMN "language",
ADD COLUMN     "preferredLanguage" "Language" NOT NULL DEFAULT 'EN',
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER';

-- DropTable
DROP TABLE "AIMetric";

-- DropTable
DROP TABLE "Response";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_TicketToTag";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "summary" TEXT,
    "keyPoints" TEXT,
    "ticketId" TEXT NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isFromCustomer" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentimentScore" DOUBLE PRECISION,
    "language" "Language",
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseTemplate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResponseTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Conversation_ticketId_idx" ON "Conversation"("ticketId");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- CreateIndex
CREATE INDEX "Message_userId_idx" ON "Message"("userId");

-- CreateIndex
CREATE INDEX "Ticket_creatorId_idx" ON "Ticket"("creatorId");

-- CreateIndex
CREATE INDEX "Ticket_assigneeId_idx" ON "Ticket"("assigneeId");

-- CreateIndex
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");

-- CreateIndex
CREATE INDEX "Ticket_priority_idx" ON "Ticket"("priority");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
