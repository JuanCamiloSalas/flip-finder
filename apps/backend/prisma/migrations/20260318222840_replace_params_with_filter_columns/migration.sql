/*
  Warnings:

  - You are about to drop the column `params` on the `polygons` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'STUDIO', 'HOUSE', 'COMMERCIAL', 'OFFICE', 'LOT', 'WAREHOUSE', 'FARM');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('NEW', 'USED');

-- AlterTable
ALTER TABLE "polygons" DROP COLUMN "params",
ADD COLUMN     "max_age" SMALLINT,
ADD COLUMN     "max_area" INTEGER,
ADD COLUMN     "max_bathrooms" SMALLINT,
ADD COLUMN     "max_bedrooms" SMALLINT,
ADD COLUMN     "max_parking" SMALLINT,
ADD COLUMN     "max_price" INTEGER,
ADD COLUMN     "min_age" SMALLINT,
ADD COLUMN     "min_area" INTEGER,
ADD COLUMN     "min_bathrooms" SMALLINT,
ADD COLUMN     "min_bedrooms" SMALLINT,
ADD COLUMN     "min_parking" SMALLINT,
ADD COLUMN     "min_price" INTEGER,
ADD COLUMN     "property_status" "PropertyStatus",
ADD COLUMN     "property_type" "PropertyType",
ADD COLUMN     "stratum" SMALLINT;
