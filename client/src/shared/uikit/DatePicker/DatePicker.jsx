import { IconChevronLeft, IconChevronRight } from '@assets/icons';
import { classNames as cn } from '@utils/classNames';
import React, { useCallback, useMemo, useState } from 'react';

import styles from './DatePicker.module.scss';

/** Props: { id?, value: Date|undefined, onChange(Date), disabled?, ...aria } */
export const DatePicker = ({ id, value, onChange, disabled = false, ...aria }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cursor, setCursor] = useState(() => (value ? new Date(value) : new Date()));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay(); // 0..6 (Sun..Sat)
    const offset = (firstDay + 6) % 7; // Mon-first
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d));
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [year, month]);

  const toggle = useCallback(() => {
    if (!disabled) setIsOpen((s) => !s);
  }, [disabled]);
  const prevMonth = useCallback(() => setCursor(new Date(year, month - 1, 1)), [year, month]);
  const nextMonth = useCallback(() => setCursor(new Date(year, month + 1, 1)), [year, month]);

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <div className={cn(styles.wrapper, { [styles.disabled]: disabled })}>
      {id ? (
        <input
          id={id}
          type="text"
          readOnly
          value={value ? value.toISOString().slice(0, 10) : ''}
          tabIndex={-1}
          aria-hidden="true"
          className={styles.visuallyHidden}
        />
      ) : null}

      <button
        type="button"
        className={styles.inputField}
        onClick={toggle}
        disabled={disabled}
        {...aria}
      >
        {value ? value.toLocaleDateString('en-GB') : 'Select date'}
      </button>

      {isOpen && (
        <div className={styles.calendar} role="dialog" aria-label="Date picker">
          <div className={styles.header}>
            <button type="button" onClick={prevMonth} aria-label="Prev month">
              <IconChevronLeft className={styles.icon} />
            </button>
            <div>{cursor.toLocaleString('en-GB', { month: 'long', year: 'numeric' })}</div>
            <button type="button" onClick={nextMonth} aria-label="Next month">
              <IconChevronRight className={styles.icon} />
            </button>
          </div>

          <div className={styles.daysGrid} role="grid">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className={styles.weekday}>
                {d}
              </div>
            ))}
            {days.map((d, i) =>
              d ? (
                <button
                  key={i}
                  type="button"
                  className={cn(styles.day, {
                    [styles.selected]: value && isSameDay(d, value),
                  })}
                  onClick={() => {
                    onChange?.(d);
                    setIsOpen(false);
                  }}
                >
                  {d.getDate()}
                </button>
              ) : (
                <div key={i} />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};
