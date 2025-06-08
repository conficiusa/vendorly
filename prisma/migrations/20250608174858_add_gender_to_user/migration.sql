/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gender` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GENDERTYPE" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "gender" "GENDERTYPE" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_key" ON "Transaction"("reference");
