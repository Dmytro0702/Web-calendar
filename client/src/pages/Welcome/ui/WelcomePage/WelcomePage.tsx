import { auth } from '@app/firebase/init';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';

import s from './WelcomePage.module.scss';

/** Нормализуем код ошибки Firebase в читаемую строку */
function getErrorMessage(err: unknown): string {
  if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as any).code === 'string'
  ) {
    const code = (err as any).code as string; // например: "auth/invalid-email"
    // без replaceAll для совместимости с lib: ES2020
    return code.replace('auth/', '').split('-').join(' ');
  }
  return 'Unexpected authentication error.';
}

export function WelcomePage() {
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
      // редирект выполняется вашим onAuthStateChanged/guard
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={s.auth}>
      <h1>Welcome</h1>

      <form className={s.authForm} onSubmit={handleSubmit} noValidate>
        <label className={s.authLabel} htmlFor="wel-email">
          Email
        </label>
        <input
          id="wel-email"
          className={s.authInput}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          disabled={isSubmitting}
        />

        <label className={s.authLabel} htmlFor="wel-password">
          Password
        </label>
        <input
          id="wel-password"
          className={s.authInput}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          minLength={6}
          required
          disabled={isSubmitting}
        />

        {error && (
          <p className={s.authError} role="alert" aria-live="polite">
            {error}
          </p>
        )}

        <button
          className={s.authBtn}
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
        className={s.authSwitch}
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
