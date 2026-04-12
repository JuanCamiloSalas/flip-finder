import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger"
import { PolygonFiltersService } from "./polygon-filters.service"
import { CreatePolygonFilterDto } from "./dto/create-polygon-filter.dto"
import { UpdatePolygonFilterDto } from "./dto/update-polygon-filter.dto"

@ApiTags("Polygon Filters")
@Controller("polygon-filters")
export class PolygonFiltersController {
  constructor(private readonly polygonFiltersService: PolygonFiltersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new polygon filter" })
  create(@Body() dto: CreatePolygonFilterDto) {
    return this.polygonFiltersService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: "List all polygon filters" })
  @ApiQuery({ name: "polygon_id", required: false, description: "Filter by polygon ID" })
  findAll(@Query("polygon_id") polygonId: string) {
    return this.polygonFiltersService.findAll(polygonId)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a polygon filter by ID" })
  findOne(@Param("id") id: string) {
    return this.polygonFiltersService.findOne(id)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a polygon filter" })
  update(@Param("id") id: string, @Body() dto: UpdatePolygonFilterDto) {
    return this.polygonFiltersService.update(id, dto)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a polygon filter" })
  remove(@Param("id") id: string) {
    return this.polygonFiltersService.remove(id)
  }
}
