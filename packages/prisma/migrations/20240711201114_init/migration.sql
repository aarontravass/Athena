/*
  Warnings:

  - You are about to drop the column `userId` on the `FileShareToken` table. All the data in the column will be lost.
  - Added the required column `patientFileId` to the `FileShareToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FileShareToken" DROP CONSTRAINT "FileShareToken_userId_fkey";

-- AlterTable
ALTER TABLE "FileShareToken" DROP COLUMN "userId",
ADD COLUMN     "patientFileId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "FileShareToken" ADD CONSTRAINT "FileShareToken_patientFileId_fkey" FOREIGN KEY ("patientFileId") REFERENCES "PatientFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
