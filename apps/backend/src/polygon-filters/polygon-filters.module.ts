import { Module } from "@nestjs/common"
import { PolygonFiltersController } from "./polygon-filters.controller"
import { PolygonFiltersService } from "./polygon-filters.service"

@Module({
  controllers: [PolygonFiltersController],
  providers: [PolygonFiltersService],
  exports: [PolygonFiltersService],
})
export class PolygonFiltersModule {}
