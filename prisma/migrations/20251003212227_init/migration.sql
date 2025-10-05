-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'SUSPENDED', 'CANCELED');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'TECHNICIAN', 'VIEWER');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ONLINE', 'OFFLINE', 'PROVISIONING', 'ERROR');

-- CreateTable
CREATE TABLE "InteracaoIA" (
    "id" SERIAL NOT NULL,
    "perguntaUsuario" TEXT NOT NULL,
    "queryMontada" TEXT NOT NULL,
    "respostaHumanizada" TEXT NOT NULL,
    "feedbackUsuario" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "hyperparameterArmId" TEXT NOT NULL,

    CONSTRAINT "InteracaoIA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HyperparameterArm" (
    "id" TEXT NOT NULL,
    "modelName" TEXT,
    "version" TEXT,
    "temperature" DOUBLE PRECISION NOT NULL,
    "topP" DOUBLE PRECISION NOT NULL,
    "topK" INTEGER NOT NULL,
    "maxOutputTokens" INTEGER NOT NULL,
    "responseMimeType" TEXT NOT NULL,
    "successes" INTEGER DEFAULT 0,
    "failures" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HyperparameterArm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "email" TEXT NOT NULL,
    "contractDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" "UserType" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machines" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT,
    "manufacturer" TEXT,
    "serialNumber" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "clientId" INTEGER NOT NULL,
    "responsibleUserId" INTEGER NOT NULL,
    "deviceId" INTEGER NOT NULL,

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" SERIAL NOT NULL,
    "nodeId" TEXT NOT NULL,
    "description" TEXT,
    "status" "DeviceStatus" NOT NULL DEFAULT 'PROVISIONING',
    "lastHeartbeat" TIMESTAMP(3) NOT NULL,
    "gatewayId" INTEGER,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gateways" (
    "id" SERIAL NOT NULL,
    "gatewayId" TEXT NOT NULL,
    "description" TEXT,
    "status" "DeviceStatus" NOT NULL DEFAULT 'OFFLINE',
    "lastHeartbeat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gateways_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "clients_cnpj_key" ON "clients"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "machines_serialNumber_key" ON "machines"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "machines_deviceId_key" ON "machines"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "devices_nodeId_key" ON "devices"("nodeId");

-- CreateIndex
CREATE UNIQUE INDEX "gateways_gatewayId_key" ON "gateways"("gatewayId");

-- AddForeignKey
ALTER TABLE "InteracaoIA" ADD CONSTRAINT "InteracaoIA_hyperparameterArmId_fkey" FOREIGN KEY ("hyperparameterArmId") REFERENCES "HyperparameterArm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_responsibleUserId_fkey" FOREIGN KEY ("responsibleUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_gatewayId_fkey" FOREIGN KEY ("gatewayId") REFERENCES "gateways"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
