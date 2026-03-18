import { Controller, Get, Post, Patch, Delete, Param, Body } from "@nestjs/common"
import { ApiTags, ApiOperation } from "@nestjs/swagger"
import { PolygonsService } from "./polygons.service"
import { CreatePolygonDto } from "./dto/create-polygon.dto"
import { UpdatePolygonDto } from "./dto/update-polygon.dto"

@ApiTags("Polygons")
@Controller("polygons")
export class PolygonsController {
  constructor(private readonly polygonsService: PolygonsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new polygon" })
  create(@Body() dto: CreatePolygonDto) {
    return this.polygonsService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: "List all polygons" })
  findAll() {
    return this.polygonsService.findAll()
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a polygon by ID" })
  findOne(@Param("id") id: string) {
    return this.polygonsService.findOne(id)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a polygon" })
  update(@Param("id") id: string, @Body() dto: UpdatePolygonDto) {
    return this.polygonsService.update(id, dto)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a polygon" })
  remove(@Param("id") id: string) {
    return this.polygonsService.remove(id)
  }
}
