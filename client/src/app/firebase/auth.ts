import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';

import { auth } from './init';

// Ждём, пока Firebase сообщит текущее состояние пользователя (user|null)
let resolveReady!: () => void;
export const authReady = new Promise<void>((res) => (resolveReady = res));
let inited = false;
onAuthStateChanged(auth, () => {
  if (!inited) {
    inited = true;
    resolveReady();
  }
});

/** Вход под email/password */
export async function loginWithEmail(email: string, password: string): Promise<User> {
  await authReady;
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

/** Выход */
export function logout() {
  return signOut(auth);
}

/** Получить текущий ID token (без форса) */
export async function getIdTokenSafe(force = false): Promise<string | null> {
  await authReady;
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken(force);
  } catch {
    return null;
  }
}

/** Форс-обновить ID token (например, если протух) */
export async function refreshIdToken(): Promise<string | null> {
  return getIdTokenSafe(true);
}

/** Переаутентификация теми же email/password — полезно, если сервер отклоняет токен */
export async function reauthenticate(email: string, password: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('No current user');
  const cred = EmailAuthProvider.credential(email, password);
  await reauthenticateWithCredential(user, cred);
  // после этого можно форс-обновить токен
  await user.getIdToken(true);
}
