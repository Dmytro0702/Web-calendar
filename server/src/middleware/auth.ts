import type { NextFunction, Request, Response } from 'express';

import admin from '../firebaseAdmin.js';

// BYPASS_AUTH=true — полностью отключает проверку (только для локальной отладки)
const BYPASS = String(process.env.BYPASS_AUTH).toLowerCase() === 'true';
// Поддерживаем оба имени переменной для дев-токена
const DEV_TOKEN = process.env.DEV_TOKEN || process.env.DEV_BEARER_TOKEN || 'dev-token';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  if (BYPASS) {
    (req as any).userId = 'bypass-user';
    return next();
  }

  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing Authorization Bearer token' });
  }

  // Явный dev-токен для локальной работы без Auth UI
  if (token === DEV_TOKEN) {
    (req as any).userId = 'dev-user';
    return next();
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    (req as any).userId = decoded.uid;
    return next();
  } catch (e: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('verifyIdToken error:', e?.code || e?.message || e);
    }
    return res.status(401).json({
      error: 'Invalid or expired token',
      code: e?.code || 'unknown',
    });
  }
};

export default auth;
export { auth };

