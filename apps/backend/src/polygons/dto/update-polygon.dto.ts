import { ApiPropertyOptional } from "@nestjs/swagger"

interface GeoJsonPolygon {
  type: "Polygon"
  coordinates: number[][][]
}

export class UpdatePolygonDto {
  @ApiPropertyOptional({ example: "Cedritos" })
  name?: string

  @ApiPropertyOptional({ description: "GeoJSON Polygon geometry" })
  georeference?: GeoJsonPolygon

  @ApiPropertyOptional({ example: "Bogotá" })
  city?: string

  @ApiPropertyOptional()
  enabled?: boolean
}
