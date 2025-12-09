// server/src/firebaseAdmin.ts
import admin from 'firebase-admin';
import fs from 'node:fs';
import path from 'node:path';

// Признак среды GCF/Cloud Run (в проде default credentials — без сервис-аккаунта)
const isGcf = !!process.env.K_SERVICE || !!process.env.FUNCTION_TARGET || !!process.env.FUNCTIONS_CONTROL_API;

// Локально явно пробуем подтянуть server/.env.local, если переменные ещё не заданы
function loadLocalEnvIfNeeded() {
  if (isGcf) return; // в GCF ничего не грузим
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) return;

  // Пытаемся найти server/.env.local относительно корня репо и server/
  const candidates = [
    path.resolve(process.cwd(), 'server/.env.local'),
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(path.dirname(new URL(import.meta.url).pathname), '../.env.local'),
  ];

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        // Простейший парсер, нам нужен только FIREBASE_SERVICE_ACCOUNT_JSON
        const raw = fs.readFileSync(p, 'utf8');
        for (const line of raw.split(/\r?\n/)) {
          const m = line.match(/^\s*FIREBASE_SERVICE_ACCOUNT_JSON\s*=\s*(.*)\s*$/);
          if (m) {
            // Сохраняем без кавычек; CLI анализ идёт в локальном процессе, это ок
            process.env.FIREBASE_SERVICE_ACCOUNT_JSON = m[1];
            break;
          }
        }
        break;
      }
    } catch {
      // игнор
    }
  }
}

function getLocalServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_JSON is missing. Put your service-account JSON into server/.env.local'
    );
  }
  const obj = JSON.parse(raw);
  const privateKey =
    typeof obj.private_key === 'string' && obj.private_key.includes('\\n')
      ? obj.private_key.replace(/\\n/g, '\n')
      : obj.private_key;

  return {
    projectId: obj.project_id,
    clientEmail: obj.client_email,
    privateKey,
  };
}

// ИНИЦИАЛИЗАЦИЯ
if (!admin.apps.length) {
  if (isGcf) {
    // В проде используем default credentials от сервис-аккаунта функции
    admin.initializeApp();
  } else {
    // Локально — читаем .env.local (если нужно) и инициализируем cert()
    loadLocalEnvIfNeeded();
    const sa = getLocalServiceAccount();
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: sa.projectId,
        clientEmail: sa.clientEmail,
        privateKey: sa.privateKey,
      }),
      projectId: sa.projectId,
    });
    console.log('[firebase-admin] Local init; projectId:', sa.projectId);
  }
}

export default admin;
