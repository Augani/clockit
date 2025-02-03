/*
  Warnings:

  - You are about to drop the column `taskId` on the `TimeLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TimeLog" DROP CONSTRAINT "TimeLog_taskId_fkey";

-- AlterTable
ALTER TABLE "TimeLog" DROP COLUMN "taskId";
