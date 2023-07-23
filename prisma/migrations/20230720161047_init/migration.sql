/*
  Warnings:

  - Added the required column `AccountNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "AccountNumber" INTEGER NOT NULL,
ADD COLUMN     "age" INTEGER NOT NULL;
