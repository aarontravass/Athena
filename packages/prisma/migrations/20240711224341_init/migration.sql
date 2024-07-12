/*
  Warnings:

  - The primary key for the `FileShareToken` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "FileShareToken" DROP CONSTRAINT "FileShareToken_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FileShareToken_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FileShareToken_id_seq";
