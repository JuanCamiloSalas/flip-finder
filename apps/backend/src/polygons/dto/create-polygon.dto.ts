import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

interface GeoJsonPolygon {
  type: "Polygon"
  coordinates: number[][][]
}

export class CreatePolygonDto {
  @ApiProperty({ example: "Cedritos" })
  name!: string

  @ApiProperty({
    description: "GeoJSON Polygon geometry",
    example: {
      type: "Polygon",
      coordinates: [[[-74.05, 4.72], [-74.03, 4.71], [-74.03, 4.73], [-74.05, 4.73], [-74.05, 4.72]]],
    },
  })
  georeference!: GeoJsonPolygon

  @ApiProperty({ example: "Bogotá" })
  city!: string

  @ApiPropertyOptional({ default: true })
  enabled?: boolean
}
