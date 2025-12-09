import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // storageBucket / messagingSenderId можно добавить при необходимости
};

const app = getApps().length ? getApps()[0] : initializeApp(cfg);
const auth = getAuth(app);

export { app, auth };
