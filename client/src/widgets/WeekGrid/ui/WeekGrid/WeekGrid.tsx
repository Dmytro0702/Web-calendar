import { shiftISODate, startOfWeekISO, toISODate } from '@shared/lib/date';
import type { EventDTO } from '@entities/event/model/types';
import type { FC } from 'react';
import React, { useMemo } from 'react';

import s from './WeekGrid.module.scss';

type Props = {
  date: string;
  events?: EventDTO[];
};

function formatDayTitle(dateISO: string): string {
  const d = new Date(dateISO);
  const day = d.toLocaleString('en-GB', { weekday: 'short' }); // Mon, Tue...
  const num = d.getDate();
  return `${day} ${num}`;
}

export const WeekGrid: FC<Props> = ({ date, events = [] }) => {
  const monday = startOfWeekISO(date);
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => shiftISODate(monday, i)),
    [monday],
  );
  const todayISO = toISODate(new Date());

  // Группируем события по дате
  const eventsByDay = useMemo(() => {
    const map: Record<string, EventDTO[]> = {};
    for (const ev of events) {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    }
    // сортируем внутри дня по времени начала
    Object.values(map).forEach((list) =>
      list.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    );
    return map;
  }, [events]);

  return (
    <section className={s.wrap}>
      <header className={s.head}>
        {days.map((d) => (
          <div key={d} className={`${s.colHead} ${d === todayISO ? s.todayHead : ''}`}>
            {formatDayTitle(d)}
          </div>
        ))}
      </header>

      <div className={s.body}>
        {days.map((d) => {
          const dayEvents = eventsByDay[d] ?? [];
          return (
            <div
              key={d}
              className={`${s.colBody} ${d === todayISO ? s.todayCol : ''}`}
            >
              {dayEvents.map((ev) => (
                <div key={ev.id} className={s.event}>
                  <div className={s.eventTime}>
                    {ev.startTime} – {ev.endTime}
                  </div>
                  <div className={s.eventTitle}>{ev.title}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
};
