import axios from 'axios';
import { auth } from '@app/firebase/init';

/**
 * Определяем baseURL отдельно для dev и prod:
 *
 *  - В production мы ВСЕГДА ждём явный VITE_API_BASE_URL.
 *    Если его нет — это ошибка конфигурации, падать на '/api' нельзя.
 *
 *  - В development:
 *      - если задан VITE_API_BASE_URL — используем его (можно ходить прямо на Cloud Functions);
 *      - если не задан — используем '/api' (под Vite proxy или локальный сервер).
 */
const isProd = import.meta.env.PROD;

let baseURL: string;

if (isProd) {
  // В проде обязателен VITE_API_BASE_URL
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!fromEnv) {
    // Явная ошибка конфигурации, чтобы сразу увидеть проблему
    // (можно убрать throw, если не хочешь падать, но тогда нужно дефолт).
    throw new Error(
      'VITE_API_BASE_URL is not defined in production build. Check client/.env.production',
    );
  }
  baseURL = fromEnv;
} else {
  // Dev: можно либо задать VITE_API_BASE_URL, либо использовать локальный /api
  baseURL = (import.meta.env.VITE_API_BASE_URL?.trim() || '/api') as string;
}

export const api = axios.create({
  baseURL,
});

/**
 * Request: добавляем Firebase ID token, если пользователь уже авторизован.
 */
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    try {
      const token = await user.getIdToken(); // актуальный idToken
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    } catch {
      // не смогли получить токен — пойдём без него (сервер вернёт 401)
    }
  }

  return config;
});

/**
 * Response: 401 и другие ошибки просто пробрасываем наверх.
 * При желании здесь можно добавить signOut + redirect.
 */
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
);
