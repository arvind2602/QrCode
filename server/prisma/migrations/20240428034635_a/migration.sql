/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "updatedAt",
ADD COLUMN     "updatedat" TIMESTAMP(3);
