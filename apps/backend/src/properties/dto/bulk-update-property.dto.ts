import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class BulkUpdateItemDto {
  @ApiProperty({ example: "c97c7fb0-f578-4d36-9e7b-208ec8d3f2f7" })
  id!: string

  @ApiPropertyOptional({ description: "Group label to mark duplicates (e.g. 'A', 'B')" })
  duplicated_group?: string

  @ApiPropertyOptional()
  reviewed?: boolean

  @ApiPropertyOptional()
  notes?: string | null

  @ApiPropertyOptional({ enum: ["ORIGINAL", "REMODELED"] })
  state?: "ORIGINAL" | "REMODELED"

  @ApiPropertyOptional()
  floor?: number

  @ApiPropertyOptional()
  elevator?: boolean

  @ApiPropertyOptional()
  admin_price?: number

  // Set internally by duplicate group logic
  duplicated_of_id?: string | null
}

export class BulkUpdatePropertyDto {
  @ApiProperty({ type: [BulkUpdateItemDto] })
  properties!: BulkUpdateItemDto[]
}
