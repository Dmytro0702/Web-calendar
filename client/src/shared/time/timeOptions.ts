import type { Option } from '@shared/types/options';

/** "HH:mm" -> minutes since 00:00 */
export function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

/** создаёт список опций от min до max включительно, с шагом stepMin (12h labels + 24h value) */
export function generateTimeOptions(stepMin = 15, min = '00:00', max = '23:45'): Option[] {
  const from = timeToMinutes(min);
  const to = timeToMinutes(max);
  const res: Option[] = [];
  for (let cur = from; cur <= to; cur += stepMin) {
    const h = Math.floor(cur / 60);
    const m = cur % 60;
    const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    // 12-часовая подпись
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const ampm = h < 12 ? 'am' : 'pm';
    const label = `${h12}:${String(m).padStart(2, '0')} ${ampm}`;

    res.push({ value, label });
  }
  return res;
}
