
import { auth } from '@app/firebase/init';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';

/**
 * Преобразует код ошибки Firebase в читаемое сообщение.
 * Пример: 'auth/invalid-email' -> 'invalid email'
 */
function getErrorMessage(err: unknown): string {
  if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as any).code === 'string'
  ) {
    const errorCode = (err as any).code as string;
    // без replaceAll для совместимости с lib
    return errorCode.replace('auth/', '').split('-').join(' ');
  }
  return 'Unexpected authentication error.';
}

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // Редирект выполняется слушателем onAuthStateChanged/guard-роутера.
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth">
      <h1 className="auth__title">{mode === 'login' ? 'Log in' : 'Sign up'}</h1>

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <label className="auth__label" htmlFor="auth-email">
          Email
        </label>
        <input
          id="auth-email"
          className="auth__input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={isSubmitting}
        />

        <label className="auth__label" htmlFor="auth-password">
          Password
        </label>
        <input
          id="auth-password"
          className="auth__input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          disabled={isSubmitting}
        />

        {error && (
          <p className="auth__error" role="alert">
            {error}
          </p>
        )}

        <button
          className="auth__btn"
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting
            ? mode === 'login'
              ? 'Logging in...'
              : 'Signing up...'
            : mode === 'login'
              ? 'Log in'
              : 'Sign up'}
        </button>
      </form>

      <button
        className="auth__switch"
        type="button"
        onClick={() => {
          setMode((m) => (m === 'login' ? 'signup' : 'login'));
          setError(null);
        }}
        disabled={isSubmitting}
      >
        {mode === 'login' ? 'Create account' : 'Have an account? Log in'}
      </button>
    </main>
  );
}
