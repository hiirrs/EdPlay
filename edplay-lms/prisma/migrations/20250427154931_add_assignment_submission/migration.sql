/*
  Warnings:

  - You are about to drop the column `answerFile` on the `AssignmentSubmission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assignmentId,userId]` on the table `AssignmentSubmission` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AssignmentSubmission" DROP COLUMN "answerFile",
ADD COLUMN     "filesJson" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentSubmission_assignmentId_userId_key" ON "AssignmentSubmission"("assignmentId", "userId");
