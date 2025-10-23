/*
  Warnings:

  - Added the required column `clientId` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `gateways` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "clientId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "gateways" ADD COLUMN     "clientId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gateways" ADD CONSTRAINT "gateways_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
