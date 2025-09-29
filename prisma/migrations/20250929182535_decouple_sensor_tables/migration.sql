/*
  Warnings:

  - You are about to drop the `sensor_readings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sensor_readings" DROP CONSTRAINT "sensor_readings_machineId_fkey";

-- DropForeignKey
ALTER TABLE "sensor_readings" DROP CONSTRAINT "sensor_readings_userId_fkey";

-- DropTable
DROP TABLE "sensor_readings";

-- CreateTable
CREATE TABLE "rpm_readings" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rpm" INTEGER NOT NULL,
    "machineId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "rpm_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oil_temperature_readings" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "temperature" DOUBLE PRECISION NOT NULL,
    "machineId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "oil_temperature_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oil_level_readings" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" DOUBLE PRECISION NOT NULL,
    "machineId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "oil_level_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "current_readings" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "current" DOUBLE PRECISION NOT NULL,
    "machineId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "current_readings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rpm_readings" ADD CONSTRAINT "rpm_readings_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rpm_readings" ADD CONSTRAINT "rpm_readings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oil_temperature_readings" ADD CONSTRAINT "oil_temperature_readings_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oil_temperature_readings" ADD CONSTRAINT "oil_temperature_readings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oil_level_readings" ADD CONSTRAINT "oil_level_readings_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oil_level_readings" ADD CONSTRAINT "oil_level_readings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "current_readings" ADD CONSTRAINT "current_readings_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "current_readings" ADD CONSTRAINT "current_readings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
