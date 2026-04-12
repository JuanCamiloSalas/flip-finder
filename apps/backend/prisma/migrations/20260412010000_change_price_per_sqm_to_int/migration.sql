-- Round existing values and change column type to integer
ALTER TABLE "properties" ALTER COLUMN "price_per_sqm" TYPE INTEGER USING ROUND("price_per_sqm")::INTEGER;
