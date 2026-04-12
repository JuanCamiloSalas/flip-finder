import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreatePolygonFilterDto } from "./dto/create-polygon-filter.dto"
import { UpdatePolygonFilterDto } from "./dto/update-polygon-filter.dto"

const FILTER_COLUMNS = [
  "property_type",
  "property_status",
  "min_price",
  "max_price",
  "min_bedrooms",
  "max_bedrooms",
  "min_bathrooms",
  "max_bathrooms",
  "min_area",
  "max_area",
  "parking",
  "min_stratum",
  "max_stratum",
  "min_age",
  "max_age",
  "deviation_threshold",
] as const

const ENUM_COLUMNS: Record<string, string> = {
  property_type: '"PropertyType"',
  property_status: '"PropertyStatus"',
  type: '"PolygonType"',
}

export interface PolygonFilterRow {
  id: string
  polygon_id: string
  name: string
  type: string
  enabled: boolean
  property_type: string | null
  property_status: string | null
  min_price: number | null
  max_price: number | null
  min_bedrooms: number | null
  max_bedrooms: number | null
  min_bathrooms: number | null
  max_bathrooms: number | null
  min_area: number | null
  max_area: number | null
  parking: boolean | null
  min_stratum: number | null
  max_stratum: number | null
  min_age: number | null
  max_age: number | null
  deviation_threshold: number | null
  created_at: Date
  updated_at: Date
}

@Injectable()
export class PolygonFiltersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePolygonFilterDto) {
    const columns = ["id", "polygon_id", "name", "type", "enabled", "created_at", "updated_at"]
    const placeholders = [
      "gen_random_uuid()",
      "$1",
      "$2",
      `$3::"PolygonType"`,
      "$4",
      "NOW()",
      "NOW()",
    ]
    const values: unknown[] = [dto.polygon_id, dto.name, dto.type, dto.enabled ?? true]

    for (const col of FILTER_COLUMNS) {
      if (dto[col as keyof CreatePolygonFilterDto] !== undefined) {
        values.push(dto[col as keyof CreatePolygonFilterDto])
        const idx = `$${values.length}`
        columns.push(col)
        placeholders.push(ENUM_COLUMNS[col] ? `${idx}::${ENUM_COLUMNS[col]}` : idx)
      }
    }

    const query = `
      INSERT INTO polygon_filters (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING *
    `

    const rows = await this.prisma.$queryRawUnsafe<PolygonFilterRow[]>(query, ...values)
    return rows[0]
  }

  async findAll(polygonId?: string) {
    if (polygonId) {
      return this.prisma.$queryRawUnsafe<PolygonFilterRow[]>(
        `SELECT * FROM polygon_filters WHERE polygon_id = $1 ORDER BY created_at DESC`,
        polygonId,
      )
    }

    return this.prisma.$queryRawUnsafe<PolygonFilterRow[]>(
      `SELECT * FROM polygon_filters ORDER BY created_at DESC`,
    )
  }

  async findOne(id: string) {
    const rows = await this.prisma.$queryRawUnsafe<PolygonFilterRow[]>(
      `SELECT * FROM polygon_filters WHERE id = $1`,
      id,
    )

    if (rows.length === 0) {
      throw new NotFoundException(`PolygonFilter ${id} not found`)
    }

    return rows[0]
  }

  async update(id: string, dto: UpdatePolygonFilterDto) {
    await this.findOne(id)

    const setClauses: string[] = []
    const values: unknown[] = []

    if (dto.name !== undefined) {
      values.push(dto.name)
      setClauses.push(`name = $${values.length}`)
    }

    if (dto.type !== undefined) {
      values.push(dto.type)
      setClauses.push(`type = $${values.length}::"PolygonType"`)
    }

    if (dto.enabled !== undefined) {
      values.push(dto.enabled)
      setClauses.push(`enabled = $${values.length}`)
    }

    for (const col of FILTER_COLUMNS) {
      if (dto[col as keyof UpdatePolygonFilterDto] !== undefined) {
        values.push(dto[col as keyof UpdatePolygonFilterDto])
        const idx = `$${values.length}`
        setClauses.push(ENUM_COLUMNS[col] ? `${col} = ${idx}::${ENUM_COLUMNS[col]}` : `${col} = ${idx}`)
      }
    }

    if (setClauses.length === 0) {
      return this.findOne(id)
    }

    setClauses.push("updated_at = NOW()")
    values.push(id)

    const query = `
      UPDATE polygon_filters
      SET ${setClauses.join(", ")}
      WHERE id = $${values.length}
      RETURNING *
    `

    const rows = await this.prisma.$queryRawUnsafe<PolygonFilterRow[]>(query, ...values)
    return rows[0]
  }

  async remove(id: string) {
    await this.findOne(id)

    await this.prisma.$queryRawUnsafe(`DELETE FROM polygon_filters WHERE id = $1`, id)

    return { deleted: true }
  }
}
