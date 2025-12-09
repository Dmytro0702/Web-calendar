import 'dotenv/config';

import cors from 'cors';
import express, { Request, Response } from 'express';
import morgan from 'morgan';

import auth from './middleware/auth.js';
import calendarsRouter from './routes/calendars.js';
import eventsRouter from './routes/events.js';
import shareRouter from './routes/share.js';

export function createApp() {
  const app = express();

  // Сырые значения из переменной окружения
  const RAW_ALLOWED = process.env.ALLOWED_ORIGINS ?? '';

  // Разбираем строку в массив, чистим пробелы и убираем трейлинг-слэш
  const ENV_ALLOWED = RAW_ALLOWED.split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/\/$/, ''));

  // Хардкоженные origin'ы для дев/прода
  const HARDCODED_ALLOWED = [
    'https://calendar-dev-f58f5.web.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ];

  // Объединяем и удаляем дубликаты
  const ALLOWED = Array.from(new Set([...ENV_ALLOWED, ...HARDCODED_ALLOWED]));

  const isProd = (process.env.NODE_ENV ?? 'development') === 'production';

  app.use(
    cors({
      origin: (origin, cb) => {
        // Разрешаем no-origin (Postman, curl и т.п.)
        if (!origin) return cb(null, true);

        // Убираем хвостовой слэш для сравнения
        const normalizedOrigin = origin.replace(/\/$/, '');

        // Если список пуст — временно разрешаем всех (на проде так оставлять не надо)
        if (ALLOWED.length === 0) {
          console.warn('CORS: ALLOWED list empty, temporarily allow all');
          return cb(null, true);
        }

        // Разрешённый origin
        if (ALLOWED.includes(normalizedOrigin)) {
          return cb(null, true);
        }

        // Неожиданный origin — логируем и блочим
        console.warn('CORS: unexpected origin', { origin, ALLOWED });
        return cb(null, false);
      },
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Authorization', 'Content-Type'],
      credentials: false,
      maxAge: 86400,
    }),
  );

  app.use(express.json());
  app.use(morgan(isProd ? 'combined' : 'dev'));

  // ВНИМАНИЕ: здесь больше НЕТ префикса /api.
  // Cloud Function "api" уже съедает /api в URL.
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      env: process.env.NODE_ENV ?? 'development',
      projectId: process.env.FIREBASE_PROJECT_ID ?? 'unknown',
      bypass: String(process.env.BYPASS_AUTH ?? 'false'),
    });
  });

  app.get('/debug/me', auth as any, (req: any, res: Response) => {
    res.json({ userId: req.userId ?? null });
  });

  // Тоже без /api в префиксах
  app.use('/calendars', auth as any, calendarsRouter);
  app.use('/events', auth as any, eventsRouter);
  app.use('/share', auth as any, shareRouter);

  return app;
}

/**
 * Локальный dev-сервер.
 * Работает только когда скрипт запущен с START_SERVER=true
 * (см. server/package.json).
 */
const shouldStartServer =
  String(process.env.START_SERVER ?? '').toLowerCase() === 'true';

if (shouldStartServer) {
  const port = Number(process.env.PORT ?? '4000');
  const app = createApp();

  app.listen(port, () => {
    console.log(`[dev] API server listening on http://localhost:${port}`);
  });
}

export default createApp;
