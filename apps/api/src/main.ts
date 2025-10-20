import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as os from 'os';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  // In development allow any origin so local network devices can connect easily
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({ origin: true, credentials: true });
  } else {
    // Keep a stricter config for production (adjust as needed)
    app.enableCors({
      origin: [
        'http://localhost:4200',
        'http://192.168.42.5:4200',
        /^http:\/\/192\.168\.\d+\.\d+:4200$/,
      ],
      credentials: true,
    });
  }

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  const port = Number(process.env.PORT) || 3333;
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);

  // Gather local network IPv4 addresses for helpful logging
  const nets = os.networkInterfaces();
  const addresses: string[] = [];
  for (const name of Object.keys(nets)) {
    const iface = nets[name];
    if (!iface) continue;
    for (const net of iface) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push(net.address);
      }
    }
  }

  console.log(`🚀 API is running on: http://localhost:${port}/api`);
  if (addresses.length) {
    console.log(
      `🔗 Accessible on your local network at: ${addresses
        .map((a) => `http://${a}:${port}/api`)
        .join(', ')}`,
    );
  } else {
    console.log('🔗 No non-internal IPv4 addresses detected');
  }
}

bootstrap();
