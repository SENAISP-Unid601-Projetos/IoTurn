-- CreateTable
CREATE TABLE `InteracaoIA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `perguntaUsuario` VARCHAR(191) NOT NULL,
    `queryMontada` VARCHAR(191) NOT NULL,
    `respostaHumanizada` VARCHAR(191) NOT NULL,
    `feedbackUsuario` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
