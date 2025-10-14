import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  // Allow both localhost and network IP for development/testing
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://192.168.42.5:4200',
      /^http:\/\/192\.168\.\d+\.\d+:4200$/, // Allow any local network IP
    ],
    credentials: true,
  });

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3333;
  await app.listen(port);

  console.log(`🚀 API is running on: http://localhost:${port}/api`);
}

bootstrap();
