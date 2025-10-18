-- DropForeignKey
ALTER TABLE "machines" DROP CONSTRAINT "machines_deviceId_fkey";

-- AlterTable
ALTER TABLE "machines" ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
ALTER COLUMN "deviceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
