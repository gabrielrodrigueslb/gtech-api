/*
  Warnings:

  - Made the column `name` on table `Contact` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Contact" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN     "address" TEXT,
ADD COLUMN     "contactNumber" INTEGER,
ADD COLUMN     "website" TEXT;
