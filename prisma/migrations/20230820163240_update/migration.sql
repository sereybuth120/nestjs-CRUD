/*
  Warnings:

  - You are about to drop the `auth` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "auth";

-- CreateTable
CREATE TABLE "Auth" (
    "id" SERIAL NOT NULL,
    "creatdeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "age" INTEGER,
    "accountNumber" INTEGER,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");
