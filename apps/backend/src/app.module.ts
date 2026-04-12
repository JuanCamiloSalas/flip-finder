import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "./prisma/prisma.module"
import { PolygonsModule } from "./polygons/polygons.module"
import { PolygonFiltersModule } from "./polygon-filters/polygon-filters.module"
import { PropertiesModule } from "./properties/properties.module"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, PolygonsModule, PolygonFiltersModule, PropertiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
