/*
  Warnings:

  - Added the required column `tourDate` to the `tours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tours" ADD COLUMN     "tourDate" TIMESTAMP(3) NOT NULL;
