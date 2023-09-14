import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { LoggingInterceptor } from '@interceptors/logging.interceptor';
import { HttpExceptionFilter } from '@filters/http-exception.filter';
import '@config/dayjs';
// import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* GLOBAL HOOKS  */
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    // new TransformInterceptor(),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
      transform: true,
    }),
  );

  /* MIDDLEWARES */
  app.use(cookieParser());

  /* SWAGGER */
  const config = new DocumentBuilder()
    .addCookieAuth('optional-session-id')
    .setTitle('Portfolio BE Ghez')
    .setDescription('Práctica Nestjs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
}
bootstrap();
