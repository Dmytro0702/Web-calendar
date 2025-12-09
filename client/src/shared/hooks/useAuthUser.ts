// client/src/shared/hooks/useAuthUser.ts
import { auth } from '@app/firebase/init';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';

/**
 * Возвращает { user, loading, isAuthed }.
 * - Снимает loading один раз, но НЕ блокирует дальнейшие апдейты user.
 * - Совместим со StrictMode: двойной маунт не ломает подписку.
 */
export function useAuthUser() {
  // если сессия уже восстановлена синхронно (hot start), сразу проставим
  const initialUser: User | null = auth.currentUser ?? null;

  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState<boolean>(true);

  // флажок "мы уже сняли loading" — но НЕ блокируем последующие onAuthStateChanged
  const loadedOnceRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!loadedOnceRef.current) {
        loadedOnceRef.current = true;
        setLoading(false);
      }
    });

    // если user уже есть (auth.currentUser), снимем loading микротаской
    if (initialUser && !loadedOnceRef.current) {
      Promise.resolve().then(() => {
        if (!loadedOnceRef.current) {
          loadedOnceRef.current = true;
          setLoading(false);
        }
      });
    }

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, loading, isAuthed: !!user };
}

export default useAuthUser;
