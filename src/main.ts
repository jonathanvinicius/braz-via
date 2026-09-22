import { ConfigService } from '@nestjs/config';
import { createNestApp } from './app.factory';

async function bootstrap() {
  const app = await createNestApp();
  const config = app.get(ConfigService);
  const port = config.get<number>('app.port') ?? 3333;

  await app.listen(port);
  const prefix = config.get<string>('app.pathPrefix') ?? 'api';
  console.log(`[Nest] BRAZVIA API: http://localhost:${port}/${prefix}`);
  console.log(`[Nest] Swagger: http://localhost:${port}/${prefix}/docs`);
}

bootstrap();
