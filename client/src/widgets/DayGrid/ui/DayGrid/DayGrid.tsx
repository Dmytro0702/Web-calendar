
import cn from 'classnames';
import type { FC } from 'react';
import { useMemo } from 'react';

import { NowLine } from '@widgets/NowLine/ui/NowLine';
import type { EventDTO } from '@shared/api/events';

import styles from './DayGrid.module.scss';

type DayGridProps = {
  date: string;
  slots?: string[];
  nowSlot?: string | null; // оставляем для совместимости, но не используем
  events?: EventDTO[] | Record<string, EventDTO> | null;
  onSlotClick?: (time: string) => void;
  onEventClick?: (event: EventDTO) => void;
  interactive?: boolean;
  isToday?: boolean;
};

const SLOT_MINUTES = 15;

/** "HH:mm" -> минут от начала суток */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  const hours = Number.isFinite(h) ? h : 0;
  const minutes = Number.isFinite(m) ? m : 0;
  return hours * 60 + minutes;
}

/** дефолтные слоты 15 мин на сутки */
function makeDefaultSlots(): string[] {
  const out: string[] = [];
  for (let h = 0; h < 24; h += 1) {
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      out.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return out;
}

type PositionedEvent = EventDTO & {
  top: number; // px от верха дня
  height: number; // px высота карточки
};

export const DayGrid: FC<DayGridProps> = ({
  date,
  slots,
  nowSlot: _nowSlot,
  events,
  onSlotClick,
  onEventClick,
  interactive = true,
  isToday = false,
}) => {
  const safeSlots = useMemo(
    () => (slots && slots.length > 0 ? slots : makeDefaultSlots()),
    [slots],
  );

  // нормализуем события и считаем top/height
  const dayEvents = useMemo<PositionedEvent[]>(() => {
    const normalized: EventDTO[] = Array.isArray(events)
      ? events
      : events && typeof events === 'object'
        ? Object.values(events)
        : [];

    return normalized
      .filter((ev) => ev.date === date)
      .map((ev) => {
        const startMinutes = timeToMinutes(ev.startTime);
        const rawEndMinutes = timeToMinutes(ev.endTime ?? ev.startTime);
        const endMinutes = Math.max(rawEndMinutes, startMinutes + SLOT_MINUTES);

        // 60px = 1 час, 1px = 1 минута
        const top = startMinutes; // px
        const height = endMinutes - startMinutes; // px

        return {
          ...ev,
          top,
          height,
        };
      });
  }, [events, date]);

  return (
    <section className={cn(styles.dayGrid, { [styles.isToday]: isToday })}>
      <div className={styles.colTimes}>
        {Array.from({ length: 24 }, (_, hour) => {
          const isZero = hour === 0;
          const isNoon = hour === 12;
          const label = isZero
            ? ''
            : hour < 12
              ? `${hour} am`
              : isNoon
                ? '12 pm'
                : `${hour - 12} pm`;

          return (
            <div key={hour} className={styles.timeLabel}>
              {label}
            </div>
          );
        })}
      </div>

      <div className={styles.colEvents}>
        {/* фоновые слоты и клики по сетке */}
        <div className={styles.slots}>
          {safeSlots.map((slotValue) => {
            const minute = Number(slotValue.slice(3, 5));
            const isHourStart = minute === 0;

            const className = cn(
              styles.slot,
              isHourStart ? styles.slotHour : styles.slotQuarter,
            );

            if (interactive) {
              return (
                <button
                  key={slotValue}
                  type="button"
                  className={className}
                  onClick={() => onSlotClick?.(slotValue)}
                />
              );
            }

            return <div key={slotValue} className={className} />;
          })}
        </div>

        {/* линия текущего времени — только для сегодня */}
        <NowLine visible={isToday} />

        {/* слой с событиями поверх сетки */}
        <div className={styles.eventsLayer}>
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className={styles.event}
              style={{
                top: `${event.top}px`,
                height: `${event.height}px`,
              }}
              title={`${event.title} — ${event.startTime}–${event.endTime}`}
              onClick={() => onEventClick?.(event)}
            >
              <div className={styles.eventTitle}>{event.title}</div>
              <div className={styles.eventTime}>
                {event.startTime} – {event.endTime}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
