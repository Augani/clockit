-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_timeLogId_fkey";

-- CreateIndex
CREATE INDEX "Project_ownerId_idx" ON "Project"("ownerId");

-- CreateIndex
CREATE INDEX "Task_timeLogId_idx" ON "Task"("timeLogId");

-- CreateIndex
CREATE INDEX "Task_userId_idx" ON "Task"("userId");

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");

-- CreateIndex
CREATE INDEX "TimeLog_userId_idx" ON "TimeLog"("userId");

-- CreateIndex
CREATE INDEX "TimeLog_clockIn_idx" ON "TimeLog"("clockIn");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_timeLogId_fkey" FOREIGN KEY ("timeLogId") REFERENCES "TimeLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
