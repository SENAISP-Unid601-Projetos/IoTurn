/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `machines` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deviceId` to the `machines` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ONLINE', 'OFFLINE', 'PROVISIONING', 'ERROR');

-- AlterTable
ALTER TABLE "machines" ADD COLUMN     "deviceId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "devices" (
    "id" SERIAL NOT NULL,
    "nodeId" TEXT NOT NULL,
    "description" TEXT,
    "status" "DeviceStatus" NOT NULL DEFAULT 'PROVISIONING',
    "lastHeartbeat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_nodeId_key" ON "devices"("nodeId");

-- CreateIndex
CREATE UNIQUE INDEX "machines_deviceId_key" ON "machines"("deviceId");

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
