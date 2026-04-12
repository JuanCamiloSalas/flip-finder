import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { PolygonType, PropertyType, PropertyStatus } from "@prisma/client"

export class CreatePolygonFilterDto {
  @ApiProperty({ description: "Polygon ID this filter belongs to" })
  polygon_id!: string

  @ApiProperty({ example: "Cedritos - est. 4" })
  name!: string

  @ApiProperty({ enum: PolygonType, example: PolygonType.ANALYZE })
  type!: PolygonType

  @ApiPropertyOptional({ default: true })
  enabled?: boolean

  @ApiPropertyOptional({ enum: PropertyType })
  property_type?: PropertyType

  @ApiPropertyOptional({ enum: PropertyStatus })
  property_status?: PropertyStatus

  @ApiPropertyOptional({ example: 100000000 })
  min_price?: number

  @ApiPropertyOptional({ example: 500000000 })
  max_price?: number

  @ApiPropertyOptional({ example: 2 })
  min_bedrooms?: number

  @ApiPropertyOptional({ example: 4 })
  max_bedrooms?: number

  @ApiPropertyOptional({ example: 2 })
  min_bathrooms?: number

  @ApiPropertyOptional({ example: 3 })
  max_bathrooms?: number

  @ApiPropertyOptional({ example: 60 })
  min_area?: number

  @ApiPropertyOptional({ example: 90 })
  max_area?: number

  @ApiPropertyOptional({ description: "Filter by parking availability" })
  parking?: boolean

  @ApiPropertyOptional({ example: 4, description: "Estrato mínimo (1-6)" })
  min_stratum?: number

  @ApiPropertyOptional({ example: 4, description: "Estrato máximo (1-6)" })
  max_stratum?: number

  @ApiPropertyOptional({ example: 0 })
  min_age?: number

  @ApiPropertyOptional({ example: 20 })
  max_age?: number

  @ApiPropertyOptional({ example: 25, description: "Deviation threshold % for ANALYZE (e.g. 25 = -25%)" })
  deviation_threshold?: number
}
