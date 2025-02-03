/*
  Warnings:

  - You are about to drop the column `actualHours` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `attachments` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedHours` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Task` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeLogId` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "actualHours",
DROP COLUMN "attachments",
DROP COLUMN "dueDate",
DROP COLUMN "estimatedHours",
DROP COLUMN "priority",
DROP COLUMN "status",
DROP COLUMN "tags",
DROP COLUMN "title",
DROP COLUMN "updatedAt",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "timeLogId" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_timeLogId_fkey" FOREIGN KEY ("timeLogId") REFERENCES "TimeLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
