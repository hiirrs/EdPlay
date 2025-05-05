/*
  Warnings:

  - A unique constraint covering the columns `[enrollToken]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "enrollToken" TEXT NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Course_enrollToken_key" ON "Course"("enrollToken");
