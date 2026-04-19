-- Add description and images columns to properties
ALTER TABLE "properties" ADD COLUMN "description" TEXT;
ALTER TABLE "properties" ADD COLUMN "images" TEXT[] NOT NULL DEFAULT '{}';
