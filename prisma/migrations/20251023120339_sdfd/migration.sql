-- DropForeignKey
ALTER TABLE "machines" DROP CONSTRAINT "machines_responsibleUserId_fkey";

-- AlterTable
ALTER TABLE "machines" ALTER COLUMN "responsibleUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_responsibleUserId_fkey" FOREIGN KEY ("responsibleUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
