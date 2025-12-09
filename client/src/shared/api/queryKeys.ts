
export const qk = {
  calendars: () => ['calendars'] as const,
  events: (range: { from: string; to: string; calendarIds?: string[] }) =>
    ['events', range] as const,
  shared: (token: string) => ['shared', token] as const,
};
