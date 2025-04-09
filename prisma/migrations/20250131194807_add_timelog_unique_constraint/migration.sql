/*
  Warnings:

  - A unique constraint covering the columns `[userId,clockIn]` on the table `TimeLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TimeLog_userId_clockIn_key" ON "TimeLog"("userId", "clockIn");
