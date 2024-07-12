-- CreateTable
CREATE TABLE "PatientStorage" (
    "id" SERIAL NOT NULL,
    "patientId" TEXT NOT NULL,
    "maxSpace" DOUBLE PRECISION NOT NULL,
    "usedSpace" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientStorage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PatientStorage_patientId_key" ON "PatientStorage"("patientId");

-- AddForeignKey
ALTER TABLE "PatientStorage" ADD CONSTRAINT "PatientStorage_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
