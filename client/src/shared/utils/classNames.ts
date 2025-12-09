// client/src/shared/utils/classNames.ts

// Базовый тип совместим с most-used сигнатурами
export type ClassValue =
  | string
  | number
  | false
  | null
  | undefined
  | Record<string, boolean>;

/**
 * Склеивает классы:
 * - строки/числа — добавляет как есть;
 * - объекты вида { className: boolean } — добавляет ключи, где значение truthy;
 * - falsy значения игнорирует.
 */
export function classNames(...values: ClassValue[]): string {
  const result: string[] = [];

  for (const val of values) {
    if (!val) continue;

    if (typeof val === 'string' || typeof val === 'number') {
      result.push(String(val));
      continue;
    }

    if (typeof val === 'object') {
      for (const [key, flag] of Object.entries(val)) {
        if (flag) result.push(key);
      }
    }
  }

  return result.join(' ');
}

// ✅ Совместимость с существующими импортами default:
// import cn from '@utils/classNames'
const cn = (...args: ClassValue[]) => classNames(...args);
export default cn;
