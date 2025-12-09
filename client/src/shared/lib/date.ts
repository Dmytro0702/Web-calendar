export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 'YYYY-MM-DD' -> Date (локальная полночь) */
export function fromISODate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** Сегодняшняя ISO-дата (локаль системы) */
export function getTodayISO(): string {
  return toISODate(new Date());
}

/** Сдвиг ISO-даты на N дней (может быть отрицательным) */
export function shiftISODate(s: string, days: number): string {
  const d = fromISODate(s);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** Начало недели (понедельник) для ISO-даты */
export function startOfWeekISO(s: string): string {
  const d = fromISODate(s);
  const day = d.getDay(); // 0..6 (вс=0)
  const delta = (day + 6) % 7; // до понедельника
  d.setDate(d.getDate() - delta);
  return toISODate(d);
}

/* ===================== ДОП. УТИЛИТЫ (валидации/сравнения) ================== */

/** Быстрая проверка формата 'YYYY-MM-DD' */
export function isValidISODateString(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

/** Строгая проверка существования календарной даты */
export function isExistingISODate(s: string): boolean {
  if (!isValidISODateString(s)) return false;
  const d = fromISODate(s);
  const [y, m, dd] = s.split('-').map(Number);
  return d.getFullYear() === y && d.getMonth() + 1 === m && d.getDate() === dd;
}

/** Сравнение двух ISO-дней (без времени): -1 / 0 / 1 */
export function compareISODate(a: string, b: string): -1 | 0 | 1 {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

/** Принадлежность дате интервалу [from, to] включительно */
export function isISODateInRange(date: string, from: string, to: string): boolean {
  return compareISODate(from, date) <= 0 && compareISODate(date, to) <= 0;
}

/** Клэмп даты в пределах [min, max] */
export function clampISODate(date: string, min: string, max: string): string {
  if (compareISODate(date, min) < 0) return min;
  if (compareISODate(date, max) > 0) return max;
  return date;
}

/* ============================ ФОРМАТЫ ДЛЯ UI =============================== */

/** "Mon, 07 Oct 2025" (локаль опциональна) */
export function formatHeaderDate(iso: string, locale?: string): string {
  const d = fromISODate(iso);
  try {
    return d.toLocaleDateString(locale, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return `${d.toDateString()} (${iso})`;
  }
}

/** "07–13 Oct 2025" или "29 Sep – 05 Oct 2025" */
export function formatWeekRange(mondayISO: string, sundayISO: string, locale?: string): string {
  const m = fromISODate(mondayISO);
  const s = fromISODate(sundayISO);

  const sameMonth = m.getMonth() === s.getMonth() && m.getFullYear() === s.getFullYear();

  const dayFmt: Intl.DateTimeFormatOptions = { day: '2-digit' };
  const monthYearFmt: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };

  try {
    const d1 = m.toLocaleDateString(locale, dayFmt);
    const d2 = s.toLocaleDateString(locale, sameMonth ? { ...dayFmt, ...monthYearFmt } : dayFmt);
    const m1 = m.toLocaleDateString(locale, monthYearFmt);
    const m2 = s.toLocaleDateString(locale, monthYearFmt);

    return sameMonth ? `${d1}–${d2}` : `${d1} ${m1} – ${d2} ${m2}`;
  } catch {
    return `${mondayISO} – ${sundayISO}`;
  }
}

/* ============================ ДИАПАЗОНЫ ДАТ ================================ */

export function dayRange(dateISO: string): { from: string; to: string } {
  return { from: dateISO, to: dateISO };
}

export function weekRange(dateISO: string): { from: string; to: string } {
  const monday = startOfWeekISO(dateISO);
  const sunday = shiftISODate(monday, 6);
  return { from: monday, to: sunday };
}

export function eachDayISO(from: string, to: string): string[] {
  if (compareISODate(from, to) > 0) return [];
  const days: string[] = [];
  let cur = from;
  while (compareISODate(cur, to) <= 0) {
    days.push(cur);
    cur = shiftISODate(cur, 1);
  }
  return days;
}

/* ============================ ВРЕМЯ ДЛЯ UI ================================= */

export const TIME_24H_RE = /^\d{2}:\d{2}$/;

export function isTimeAlignedToStep(value: string, stepMin = 15): boolean {
  if (!TIME_24H_RE.test(value)) return false;
  const [h, m] = value.split(':').map(Number);
  if (h < 0 || h > 23) return false;
  return m % stepMin === 0;
}

export function floorTimeToStep(value: string, stepMin = 15): string {
  if (!TIME_24H_RE.test(value)) return '00:00';
  const [h, m] = value.split(':').map(Number);
  const mm = m - (m % stepMin);
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export function buildSlots15(): string[] {
  const res: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 15, 30, 45]) {
      res.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return res;
}

export function computeNowSlot(stepMin = 15): string {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const mm = m - (m % stepMin);
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
