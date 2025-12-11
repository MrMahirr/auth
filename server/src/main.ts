import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookie middleware
  app.use(cookieParser());

  // Allowed Origins
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : [
        'http://localhost:5173',
        'http://localhost:3001',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3001',
      ];

  console.log('[CORS] Allowed origins:', allowedOrigins);

  // Normalize helper
  const normalizeOrigin = (origin: string | undefined): string | undefined => {
    if (!origin) return origin;
    return origin.endsWith('/') ? origin.slice(0, -1) : origin;
  };

  app.enableCors({
    origin: (
      requestOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      console.log('[CORS] Request from origin:', requestOrigin);

      // Origin header yoksa (mobile, curl)
      if (!requestOrigin) {
        console.log('[CORS] No origin header - allowing');
        return callback(null, true);
      }

      const normalizedOrigin = normalizeOrigin(requestOrigin);
      const isAllowed = allowedOrigins.some(
        (allowed) => normalizeOrigin(allowed) === normalizedOrigin,
      );

      if (isAllowed) {
        console.log('[CORS] ✅ Origin allowed:', requestOrigin);
        callback(null, true);
      } else {
        console.error('[CORS] ❌ Origin blocked:', requestOrigin);
        console.error('[CORS] Allowed origins:', allowedOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

// ❗ HATALI VERSİYON:
// bootstrap().catch((err) => console.error(err));

// ✔ DÜZGÜN VE ESLINT UYUMLU VERSİYON:
bootstrap().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error('[Bootstrap] Fatal error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.error('[Bootstrap] Unknown fatal error:', {
      raw: error,
      timestamp: new Date().toISOString(),
    });
  }

  process.exit(1);
});
