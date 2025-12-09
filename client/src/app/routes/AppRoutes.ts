export const AppRoutes = {
  welcome: (): string => '/welcome',
  // основной календарь: /:view(day|week)/:date(YYYY-MM-DD)
  calendar: (view: 'day' | 'week', isoDate: string): string => `/${view}/${isoDate}`,
  // fallback на сегодня:
  today(view: 'day' | 'week' = 'day'): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return this.calendar(view, `${y}-${m}-${day}`);
  },
};
export type CalendarView = 'day' | 'week';
