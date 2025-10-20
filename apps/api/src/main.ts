import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as os from 'os';

function parseAllowedOrigins(env?: string) {
  if (!env) return undefined;
  return env
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      // Support regex-style entries like /regex/ and plain origins
      if (entry.startsWith('/') && entry.endsWith('/')) {
        try {
          return new RegExp(entry.slice(1, -1));
        } catch (e) {
          return entry; // fall back to string if invalid
        }
      }
      return entry;
    });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  // In development allow any origin so local network devices can connect easily
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({ origin: true, credentials: true });
  } else {
    // Production: allow an explicit list of origins via ALLOWED_ORIGINS env var.
    // If not provided, default to only localhost (developer can override).
    // Example: ALLOWED_ORIGINS="http://example.com,http://localhost:4200,/^https?:\\/\\/192\\.168\\.\\d+\\.\\d+:4200$/"
    const envAllowed = parseAllowedOrigins(process.env.ALLOWED_ORIGINS as string | undefined);
    const defaultAllowed: (string | RegExp)[] = [
      'http://localhost:4200',
      // Allow any 192.168.*.* on port 4200 if teams test from private network
      /^http:\/\/192\.168\.\d+\.\d+:4200$/,
    ];
    const allowedOrigins = envAllowed && envAllowed.length ? envAllowed : defaultAllowed;

    app.enableCors({ origin: allowedOrigins, credentials: true });
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
