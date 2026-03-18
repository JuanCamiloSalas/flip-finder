import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix("api")

  const config = new DocumentBuilder()
    .setTitle("Flip Finder API")
    .setDescription("API for managing polygons and property extraction")
    .setVersion("1.0")
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("docs", app, document)

  await app.listen(4000)
}
bootstrap()
