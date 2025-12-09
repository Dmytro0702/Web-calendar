export type EventItem = {
  id: string;
  calendarId: string;
  ownerId?: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  allDay?: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
};

export type CalendarItem = {
  id: string;
  ownerId?: string;
  name: string;
  color: string;
  isDefault: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
};

export const db = {
  events: [] as EventItem[],
  calendars: [
    {
      id: 'cal_default',
      ownerId: 'owner_demo',
      name: 'Default',
      color: '#22c55e',
      isDefault: true,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as CalendarItem[],
};
