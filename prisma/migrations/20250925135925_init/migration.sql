-- CreateTable
CREATE TABLE "sensorData" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "temperatura" DOUBLE PRECISION NOT NULL,
    "nivel" DOUBLE PRECISION NOT NULL,
    "rpm" DOUBLE PRECISION NOT NULL,
    "corrente" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "sensorData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "usuario" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_usuario_key" ON "usuarios"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "InteracaoIA" ADD CONSTRAINT "InteracaoIA_hyperparameterArmId_fkey" FOREIGN KEY ("hyperparameterArmId") REFERENCES "HyperparameterArm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
