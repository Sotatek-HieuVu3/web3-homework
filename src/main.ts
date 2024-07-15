import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter';
import { BodyValidationPipe } from 'src/shared/pipes/body-validation.pipe';

async function bootstrap() {
  const options = new DocumentBuilder()
    .setTitle(`WEB3`)
    .setDescription(`API`)
    .build();

  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new BodyValidationPipe());

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`api/swagger`, app, document, {
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      displayRequestDuration: true,
    },
  });
  await app.listen(3000);
}
bootstrap();
