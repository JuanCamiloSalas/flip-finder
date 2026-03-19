-- AlterTable
ALTER TABLE "polygons" ADD COLUMN     "deviation_threshold" SMALLINT;

-- CreateTable
CREATE TABLE "potential_properties" (
    "id" TEXT NOT NULL,
    "polygon_id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "potential_properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "potential_properties_polygon_id_property_id_key" ON "potential_properties"("polygon_id", "property_id");

-- AddForeignKey
ALTER TABLE "potential_properties" ADD CONSTRAINT "potential_properties_polygon_id_fkey" FOREIGN KEY ("polygon_id") REFERENCES "polygons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "potential_properties" ADD CONSTRAINT "potential_properties_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
