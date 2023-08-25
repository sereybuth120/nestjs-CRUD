/*
  Warnings:

  - Made the column `firstName` on table `Auth` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `Auth` required. This step will fail if there are existing NULL values in that column.
  - Made the column `age` on table `Auth` required. This step will fail if there are existing NULL values in that column.
  - Made the column `accountNumber` on table `Auth` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Auth" ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL,
ALTER COLUMN "age" SET NOT NULL,
ALTER COLUMN "accountNumber" SET NOT NULL;
