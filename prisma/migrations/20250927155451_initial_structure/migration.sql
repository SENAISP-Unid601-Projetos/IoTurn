-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "gatewayId" INTEGER;

-- CreateTable
CREATE TABLE "gateways" (
    "id" SERIAL NOT NULL,
    "gatewayId" TEXT NOT NULL,
    "description" TEXT,
    "status" "DeviceStatus" NOT NULL DEFAULT 'OFFLINE',
    "lastHeartbeat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gateways_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gateways_gatewayId_key" ON "gateways"("gatewayId");

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_gatewayId_fkey" FOREIGN KEY ("gatewayId") REFERENCES "gateways"("id") ON DELETE SET NULL ON UPDATE CASCADE;
