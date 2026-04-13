-- Round existing values and change column type to bigint
ALTER TABLE "properties" ALTER COLUMN "price_per_sqm" TYPE BIGINT USING ROUND("price_per_sqm")::BIGINT;
