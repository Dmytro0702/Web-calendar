// Базовые типы DTO на сервере (синхронны фронтовым)
export type Calendar = {
  id: string;
  ownerId: string;
  name: string;
  color: string; // HEX
  isDefault: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EventItem = {
  id: string;
  calendarId: string;
  ownerId: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  allDay?: boolean;
  recurrence?: unknown;
  color?: string;
  createdAt: string;
  updatedAt: string;
};

export type ShareToken = {
  token: string;
  eventId: string;
  ownerId: string;
  createdAt: string;
};

// ---- Express Request augmentation ----
import 'express-serve-static-core';
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}
