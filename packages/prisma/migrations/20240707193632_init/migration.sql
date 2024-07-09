-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ALTER COLUMN "privyDid" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PatientFile" (
    "id" TEXT NOT NULL,
    "ipfsCid" TEXT NOT NULL,
    "bucketName" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PatientFile" ADD CONSTRAINT "PatientFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
