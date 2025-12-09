import { describe, expect, test } from 'vitest';

import { fromISODate, shiftISODate, startOfWeekISO, toISODate } from '../../../shared/lib/date';

describe('date utils', () => {
  test('toISODate', () => {
    const d = new Date(2025, 8, 27); // 27 Sep 2025
    expect(toISODate(d)).toBe('2025-09-27');
  });

  test('fromISODate', () => {
    const d = fromISODate('2025-09-27');
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(8);
    expect(d.getDate()).toBe(27);
  });

  test('shiftISODate', () => {
    expect(shiftISODate('2025-09-27', 1)).toBe('2025-09-28');
    expect(shiftISODate('2025-09-27', -1)).toBe('2025-09-26');
  });

  test('startOfWeekISO', () => {
    // Суббота 27 Sep 2025 → понедельник этой недели
    expect(startOfWeekISO('2025-09-27')).toBe('2025-09-22');
  });
});
