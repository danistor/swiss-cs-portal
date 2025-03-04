-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "category" TEXT,
ADD COLUMN     "conversationSummary" TEXT,
ADD COLUMN     "lifetimeValue" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "department" TEXT,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isFromAgent" BOOLEAN NOT NULL DEFAULT false,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT,
    "sentiment" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIMetric" (
    "id" TEXT NOT NULL,
    "chatbotResolutions" INTEGER NOT NULL DEFAULT 0,
    "successfulClassifications" INTEGER NOT NULL DEFAULT 0,
    "sentimentAccuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "suggestionsAccepted" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TicketToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TicketToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "_TicketToTag_B_index" ON "_TicketToTag"("B");

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TicketToTag" ADD CONSTRAINT "_TicketToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TicketToTag" ADD CONSTRAINT "_TicketToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
