-- 1. Create polygon_filters table
CREATE TABLE "polygon_filters" (
    "id" TEXT NOT NULL,
    "polygon_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PolygonType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "property_type" "PropertyType",
    "property_status" "PropertyStatus",
    "min_price" INTEGER,
    "max_price" INTEGER,
    "min_bedrooms" SMALLINT,
    "max_bedrooms" SMALLINT,
    "min_bathrooms" SMALLINT,
    "max_bathrooms" SMALLINT,
    "min_area" INTEGER,
    "max_area" INTEGER,
    "parking" BOOLEAN,
    "min_stratum" SMALLINT,
    "max_stratum" SMALLINT,
    "min_age" SMALLINT,
    "max_age" SMALLINT,
    "deviation_threshold" SMALLINT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "polygon_filters_pkey" PRIMARY KEY ("id")
);

-- 2. Migrate data: create one filter per existing polygon
INSERT INTO "polygon_filters" (
    "id", "polygon_id", "name", "type", "enabled",
    "property_type", "property_status",
    "min_price", "max_price",
    "min_bedrooms", "max_bedrooms",
    "min_bathrooms", "max_bathrooms",
    "min_area", "max_area",
    "parking", "min_stratum", "max_stratum",
    "min_age", "max_age", "deviation_threshold",
    "created_at", "updated_at"
)
SELECT
    gen_random_uuid(), "id", "name", "polygon_type", "enabled",
    "property_type", "property_status",
    "min_price", "max_price",
    "min_bedrooms", "max_bedrooms",
    "min_bathrooms", "max_bathrooms",
    "min_area", "max_area",
    "parking", "min_stratum", "max_stratum",
    "min_age", "max_age", "deviation_threshold",
    "created_at", "updated_at"
FROM "polygons";

-- 3. Add polygon_filter_id to executions
ALTER TABLE "executions" ADD COLUMN "polygon_filter_id" TEXT;

-- Populate: match execution to the filter that was created from its polygon
UPDATE "executions" e
SET "polygon_filter_id" = pf."id"
FROM "polygon_filters" pf
WHERE pf."polygon_id" = e."polygon_id";

-- Make it NOT NULL and add FK
ALTER TABLE "executions" ALTER COLUMN "polygon_filter_id" SET NOT NULL;
ALTER TABLE "executions" ADD CONSTRAINT "executions_polygon_filter_id_fkey"
    FOREIGN KEY ("polygon_filter_id") REFERENCES "polygon_filters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop old polygon FK
ALTER TABLE "executions" DROP CONSTRAINT "executions_polygon_id_fkey";
ALTER TABLE "executions" DROP COLUMN "polygon_id";

-- 4. Rename polygon_id to polygon_filter_id in potential_properties
ALTER TABLE "potential_properties" ADD COLUMN "polygon_filter_id" TEXT;

UPDATE "potential_properties" pp
SET "polygon_filter_id" = pf."id"
FROM "polygon_filters" pf
WHERE pf."polygon_id" = pp."polygon_id";

ALTER TABLE "potential_properties" ALTER COLUMN "polygon_filter_id" SET NOT NULL;
ALTER TABLE "potential_properties" ADD CONSTRAINT "potential_properties_polygon_filter_id_fkey"
    FOREIGN KEY ("polygon_filter_id") REFERENCES "polygon_filters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop old unique index and polygon FK
DROP INDEX "potential_properties_polygon_id_property_id_key";
ALTER TABLE "potential_properties" DROP CONSTRAINT "potential_properties_polygon_id_fkey";
ALTER TABLE "potential_properties" DROP COLUMN "polygon_id";

-- Add new unique index
CREATE UNIQUE INDEX "potential_properties_polygon_filter_id_property_id_key"
    ON "potential_properties"("polygon_filter_id", "property_id");

-- 5. Add FK from polygon_filters to polygons
ALTER TABLE "polygon_filters" ADD CONSTRAINT "polygon_filters_polygon_id_fkey"
    FOREIGN KEY ("polygon_id") REFERENCES "polygons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 6. Remove filter columns and polygon_type from polygons
ALTER TABLE "polygons" DROP COLUMN "polygon_type";
ALTER TABLE "polygons" DROP COLUMN "property_type";
ALTER TABLE "polygons" DROP COLUMN "property_status";
ALTER TABLE "polygons" DROP COLUMN "min_price";
ALTER TABLE "polygons" DROP COLUMN "max_price";
ALTER TABLE "polygons" DROP COLUMN "min_bedrooms";
ALTER TABLE "polygons" DROP COLUMN "max_bedrooms";
ALTER TABLE "polygons" DROP COLUMN "min_bathrooms";
ALTER TABLE "polygons" DROP COLUMN "max_bathrooms";
ALTER TABLE "polygons" DROP COLUMN "min_area";
ALTER TABLE "polygons" DROP COLUMN "max_area";
ALTER TABLE "polygons" DROP COLUMN "parking";
ALTER TABLE "polygons" DROP COLUMN "min_stratum";
ALTER TABLE "polygons" DROP COLUMN "max_stratum";
ALTER TABLE "polygons" DROP COLUMN "min_age";
ALTER TABLE "polygons" DROP COLUMN "max_age";
ALTER TABLE "polygons" DROP COLUMN "deviation_threshold";
