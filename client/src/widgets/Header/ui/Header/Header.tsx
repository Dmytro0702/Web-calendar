import { auth } from '@app/firebase/init';
import { AppRoutes } from '@app/routes/AppRoutes';
import useAuthUser from '@shared/hooks/useAuthUser';
import { shiftISODate } from '@shared/lib/date';
import { Icon } from '@uikit/Icon';
import { signOut } from 'firebase/auth';
import React, { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import s from './Header.module.scss';

type Params = { view?: 'day' | 'week'; date?: string };

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatMonth(dateISO: string): string {
  const d = new Date(dateISO);
  return d.toLocaleString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { view = 'day', date = todayISO() } = useParams<Params>();
  const { user } = useAuthUser();

  const viewOptions = useMemo(
    () => [
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
    ],
    [],
  );

  const onChangeView = useCallback(
    (next: string) => {
      const v: 'day' | 'week' = next === 'week' ? 'week' : 'day';
      navigate(AppRoutes.calendar(v, date));
    },
    [navigate, date],
  );

  const step = view === 'week' ? 7 : 1;

  const handlePrev = useCallback(() => {
    navigate(AppRoutes.calendar(view, shiftISODate(date, -step)));
  }, [navigate, view, date, step]);

  const handleNext = useCallback(() => {
    navigate(AppRoutes.calendar(view, shiftISODate(date, step)));
  }, [navigate, view, date, step]);

  const handleToday = useCallback(() => {
    navigate(AppRoutes.today(view));
  }, [navigate, view]);

  const handleLogout = useCallback(async () => {
    await signOut(auth);
    navigate(AppRoutes.welcome(), { replace: true });
  }, [navigate]);

  const display = user?.displayName || user?.email || 'User';
  const initial = (display?.[0] || 'U').toUpperCase();

  return (
    <header className={s.header}>
      <div className={s.left}>
        <div className={s.logo}>
          <span className={s.logoMark} aria-hidden />
          <span className={s.logoText}>WebCalendar</span>
        </div>

        <button type="button" className={s.today} onClick={handleToday}>
          Today
        </button>

        <div className={s.navButtons}>
          <button type="button" className={s.iconBtn} onClick={handlePrev} aria-label="Previous">
            <Icon name="IconChevronLeft" className={s.icon} title="Prev" />
          </button>
          <button type="button" className={s.iconBtn} onClick={handleNext} aria-label="Next">
            <Icon name="IconChevronRight" className={s.icon} title="Next" />
          </button>
        </div>

        <div className={s.currentMonth}>{formatMonth(date)}</div>
      </div>

      <div className={s.right}>
        <select
          className={s.viewSelect}
          value={view}
          onChange={(e) => onChangeView(e.target.value)}
          aria-label="Select view"
        >
          {viewOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className={s.user}>
          <div className={s.avatar} aria-hidden>
            {initial}
          </div>
          <span className={s.userName}>{display}</span>
          <button type="button" className={s.logout} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
