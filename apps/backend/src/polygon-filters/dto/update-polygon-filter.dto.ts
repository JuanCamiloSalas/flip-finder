import { ApiPropertyOptional } from "@nestjs/swagger"
import { PolygonType, PropertyType, PropertyStatus } from "@prisma/client"

export class UpdatePolygonFilterDto {
  @ApiPropertyOptional({ example: "Cedritos - est. 5" })
  name?: string

  @ApiPropertyOptional({ enum: PolygonType })
  type?: PolygonType

  @ApiPropertyOptional()
  enabled?: boolean

  @ApiPropertyOptional({ enum: PropertyType })
  property_type?: PropertyType | null

  @ApiPropertyOptional({ enum: PropertyStatus })
  property_status?: PropertyStatus | null

  @ApiPropertyOptional()
  min_price?: number | null

  @ApiPropertyOptional()
  max_price?: number | null

  @ApiPropertyOptional()
  min_bedrooms?: number | null

  @ApiPropertyOptional()
  max_bedrooms?: number | null

  @ApiPropertyOptional()
  min_bathrooms?: number | null

  @ApiPropertyOptional()
  max_bathrooms?: number | null

  @ApiPropertyOptional()
  min_area?: number | null

  @ApiPropertyOptional()
  max_area?: number | null

  @ApiPropertyOptional()
  parking?: boolean | null

  @ApiPropertyOptional()
  min_stratum?: number | null

  @ApiPropertyOptional()
  max_stratum?: number | null

  @ApiPropertyOptional()
  min_age?: number | null

  @ApiPropertyOptional()
  max_age?: number | null

  @ApiPropertyOptional()
  deviation_threshold?: number | null
}
