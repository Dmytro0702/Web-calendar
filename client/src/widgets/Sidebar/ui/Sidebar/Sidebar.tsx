import { AppRoutes } from '@app/routes/AppRoutes';
import { openModal } from '@app/store/slices/uiSlice';
import { useAppDispatch } from '@shared/hooks/useAppDispatch';
import { startOfWeekISO, toISODate } from '@shared/lib/date';
import type { FC } from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { fetchCalendars, type CalendarDTO } from '@shared/api/calendars';
import { qk } from '@shared/api/queryKeys';

import s from './Sidebar.module.scss';

type SidebarProps = {
  selectedDate: string; // ISO
  view: 'day' | 'week';
};

type MonthGridProps = {
  valueISO: string;
  onPick: (iso: string) => void;
};

function MonthGrid({ valueISO, onPick }: MonthGridProps) {
  const base = new Date(valueISO);
  const year = base.getFullYear();
  const month = base.getMonth();

  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Mon-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = useMemo(() => {
    const arr: (Date | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d));
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [offset, daysInMonth, year, month]);

  const todayISO = toISODate(new Date());

  return (
    <div className={s.miniGrid} role="grid" aria-label="Mini calendar">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => (
        <div key={w} className={s.wd}>
          {w}
        </div>
      ))}
      {cells.map((d, i) =>
        d ? (
          <button
            key={i}
            type="button"
            className={[
              s.dayCell,
              toISODate(d) === todayISO ? s.today : '',
              toISODate(d) === valueISO ? s.selected : '',
            ].join(' ')}
            onClick={() => onPick(toISODate(d))}
          >
            {d.getDate()}
          </button>
        ) : (
          <div key={i} className={s.dayEmpty} />
        ),
      )}
    </div>
  );
}

export const Sidebar: FC<SidebarProps> = ({ selectedDate, view }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleCreate = () => dispatch(openModal({ type: 'create-event' }));

  const onPickDay = (iso: string) => {
    // ❗ больше не принудительный week
    if (view === 'week') {
      navigate(AppRoutes.calendar('week', startOfWeekISO(iso)));
    } else {
      navigate(AppRoutes.calendar('day', iso));
    }
  };

  const { data: calendars = [] } = useQuery<CalendarDTO[]>({
    queryKey: qk.calendars(),
    queryFn: fetchCalendars,
    staleTime: 60_000,
  });

  return (
    <aside className={s.sidebar}>
      <button className={s.createBtn} type="button" onClick={handleCreate}>
        + Create
      </button>

      <div className={s.calendarBox}>
        <div className={s.calendarHeader}>
          {new Date(selectedDate).toLocaleString('en-GB', { month: 'long', year: 'numeric' })}
        </div>
        <MonthGrid valueISO={selectedDate} onPick={onPickDay} />
      </div>

      <div className={s.myCalendars}>
        <div className={s.myCalendarsHeader}>
          <span>My calendars</span>
          <button
            type="button"
            className={s.addBtn}
            onClick={() => dispatch(openModal({ type: 'create-calendar' }))}
            aria-label="Add calendar"
          >
            +
          </button>
        </div>

        {calendars.length > 0 ? (
          <ul className={s.calendarList}>
            {calendars.map((calendar) => (
              <li key={calendar.id} className={s.calendarItem}>
                <span
                  className={s.calendarColor}
                  aria-hidden="true"
                  style={{ backgroundColor: calendar.color }}
                />
                <span className={s.calendarName}>{calendar.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={s.emptyCalendars}>No calendars yet</p>
        )}
      </div>
    </aside>
  );
};
