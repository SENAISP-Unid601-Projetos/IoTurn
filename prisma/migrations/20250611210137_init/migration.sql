/*
  Warnings:

  - You are about to drop the `sensoresDados` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `sensoresDados`;

-- CreateTable
CREATE TABLE `sensorData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `temperatura` DOUBLE NOT NULL,
    `nivel` DOUBLE NOT NULL,
    `rpm` DOUBLE NOT NULL,
    `corrente` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
