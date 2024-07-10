/*
  Warnings:

  - A unique constraint covering the columns `[patientId,doctorId]` on the table `PatientDoctor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PatientDoctor_patientId_doctorId_key" ON "PatientDoctor"("patientId", "doctorId");
