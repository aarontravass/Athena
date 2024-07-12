-- CreateTable
CREATE TABLE "PreSignedUrl" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreSignedUrl_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PreSignedUrl" ADD CONSTRAINT "PreSignedUrl_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
