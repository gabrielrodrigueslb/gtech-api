/*
  Warnings:

  - Added the required column `color` to the `Stage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stage" ADD COLUMN     "color" TEXT NOT NULL;
