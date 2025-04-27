/*
  Warnings:

  - The values [super_admin] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `allowResubmission` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `maxUploadSize` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('student', 'teacher', 'admin');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'student';
COMMIT;

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_studentId_fkey";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "allowResubmission",
DROP COLUMN "maxUploadSize",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Submission";

-- CreateTable
CREATE TABLE "AssignmentContent" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "contentTitle" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL,
    "contentData" TEXT NOT NULL,
    "filePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentSubmission" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "answerText" TEXT,
    "answerFile" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssignmentContent" ADD CONSTRAINT "AssignmentContent_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
