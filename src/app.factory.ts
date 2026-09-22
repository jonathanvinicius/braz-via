import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';
import { AppModule } from './app.module';

export async function createNestApp(): Promise<INestApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const config = app.get(ConfigService);
  const pathPrefix = config.get<string>('app.pathPrefix') ?? '';
  const corsOrigin = config.get<string>('app.corsOrigin') ?? '*';

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  if (pathPrefix) {
    app.setGlobalPrefix(pathPrefix);
  }

  const allowedOrigins = corsOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const isDev = (process.env.NODE_ENV ?? 'development') !== 'production';

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || isDev) {
        callback(null, true);
        return;
      }
      const allowed =
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        /\.ngrok(-free)?\.app$/.test(origin) ||
        origin.endsWith('.ngrok.io');
      callback(null, allowed);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'ngrok-skip-browser-warning',
    ],
  });

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((error) =>
          Object.values(error.constraints ?? {}),
        );
        return new BadRequestException(
          messages.length > 0 ? messages : 'Dados inválidos',
        );
      },
    }),
  );

  if (process.env.NODE_ENV !== 'production') {
    const swaggerPath = pathPrefix ? `${pathPrefix}/docs` : 'docs';
    const swagger = new DocumentBuilder()
      .setTitle('BRAZVIA API')
      .setDescription('Catálogo de imóveis e admin')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swagger);
    SwaggerModule.setup(swaggerPath, app, document);
  }

  await app.init();
  return app;
}
