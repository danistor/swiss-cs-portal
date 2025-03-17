-- CreateTable
CREATE TABLE "AgentPerformance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticketsResolved" INTEGER NOT NULL DEFAULT 0,
    "averageResponseTime" INTEGER NOT NULL DEFAULT 0,
    "customerSatisfactionScore" DOUBLE PRECISION,

    CONSTRAINT "AgentPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketMetrics" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "newTickets" INTEGER NOT NULL DEFAULT 0,
    "resolvedTickets" INTEGER NOT NULL DEFAULT 0,
    "averageResolutionTime" INTEGER NOT NULL DEFAULT 0,
    "priorityDistribution" JSONB,
    "statusDistribution" JSONB,

    CONSTRAINT "TicketMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LanguageMetrics" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "language" "Language" NOT NULL,
    "ticketCount" INTEGER NOT NULL DEFAULT 0,
    "messageCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LanguageMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AgentPerformance_userId_idx" ON "AgentPerformance"("userId");

-- CreateIndex
CREATE INDEX "AgentPerformance_date_idx" ON "AgentPerformance"("date");

-- CreateIndex
CREATE INDEX "TicketMetrics_date_idx" ON "TicketMetrics"("date");

-- CreateIndex
CREATE INDEX "LanguageMetrics_date_idx" ON "LanguageMetrics"("date");

-- CreateIndex
CREATE INDEX "LanguageMetrics_language_idx" ON "LanguageMetrics"("language");

-- AddForeignKey
ALTER TABLE "AgentPerformance" ADD CONSTRAINT "AgentPerformance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
