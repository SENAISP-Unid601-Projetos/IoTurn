-- CreateTable
CREATE TABLE `sensoresDados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `temperatura` DOUBLE NOT NULL,
    `nivel` DOUBLE NOT NULL,
    `rpm` DOUBLE NOT NULL,
    `corrente` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `usuarios_usuario_key`(`usuario`),
    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InteracaoIA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `perguntaUsuario` VARCHAR(191) NOT NULL,
    `queryMontada` VARCHAR(191) NOT NULL,
    `respostaHumanizada` TEXT NOT NULL,
    `feedbackUsuario` INTEGER NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,
    `hyperparameterArmId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HyperparameterArm` (
    `id` VARCHAR(191) NOT NULL,
    `modelName` VARCHAR(191) NULL,
    `version` VARCHAR(191) NULL,
    `temperature` DOUBLE NOT NULL,
    `topP` DOUBLE NOT NULL,
    `topK` INTEGER NOT NULL,
    `maxOutputTokens` INTEGER NOT NULL,
    `responseMimeType` VARCHAR(191) NOT NULL,
    `successes` INTEGER NULL DEFAULT 0,
    `failures` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InteracaoIA` ADD CONSTRAINT `InteracaoIA_hyperparameterArmId_fkey` FOREIGN KEY (`hyperparameterArmId`) REFERENCES `HyperparameterArm`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
