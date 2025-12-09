import { nanoid } from 'nanoid';

import type { Calendar, EventItem, ShareToken } from '../types.ts';

type UserId = string;

const calendarsByUser = new Map<UserId, Map<string, Calendar>>();
const eventsByUser = new Map<UserId, Map<string, EventItem>>();
const sharesByToken = new Map<string, ShareToken>();

function nowISO() {
  return new Date().toISOString();
}

export function ensureUserBootstrap(userId: string) {
  if (!calendarsByUser.has(userId)) {
    const map = new Map<string, Calendar>();
    const id = nanoid(10);
    const cal: Calendar = {
      id,
      ownerId: userId,
      name: 'Default',
      color: '#22c55e',
      isDefault: true,
      isVisible: true,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    map.set(id, cal);
    calendarsByUser.set(userId, map);
  }
  if (!eventsByUser.has(userId)) {
    eventsByUser.set(userId, new Map());
  }
}

export const db = {
  listCalendars(userId: string): Calendar[] {
    ensureUserBootstrap(userId);
    return Array.from(calendarsByUser.get(userId)!.values());
  },
  createCalendar(userId: string, input: Pick<Calendar, 'name' | 'color'>): Calendar {
    ensureUserBootstrap(userId);
    const id = nanoid(10);
    const cal: Calendar = {
      id,
      ownerId: userId,
      name: input.name,
      color: input.color,
      isDefault: false,
      isVisible: true,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    calendarsByUser.get(userId)!.set(id, cal);
    return cal;
  },
  updateCalendar(
    userId: string,
    id: string,
    patch: Partial<Pick<Calendar, 'name' | 'color' | 'isVisible'>>,
  ): Calendar | null {
    ensureUserBootstrap(userId);
    const map = calendarsByUser.get(userId)!;
    const cur = map.get(id);
    if (!cur) return null;

    // ❗️НЕ вызываем hasOwnProperty у целевого объекта — используем безопасный вызов
    if (cur.isDefault && Object.prototype.hasOwnProperty.call(patch, 'isDefault')) {
      // запрет менять флаг — no-op
    }

    const next: Calendar = { ...cur, ...patch, updatedAt: nowISO() };
    map.set(id, next);
    return next;
  },
  deleteCalendar(userId: string, id: string): boolean {
    ensureUserBootstrap(userId);
    const map = calendarsByUser.get(userId)!;
    const cur = map.get(id);
    if (!cur || cur.isDefault) return false;
    // удаляем все события этого календаря
    const evMap = eventsByUser.get(userId)!;
    for (const [eid, ev] of evMap) {
      if (ev.calendarId === id) evMap.delete(eid);
    }
    return map.delete(id);
  },

  listEvents(
    userId: string,
    params: { from: string; to: string; calendarIds?: string[] },
  ): EventItem[] {
    ensureUserBootstrap(userId);
    const evMap = eventsByUser.get(userId)!;
    const res: EventItem[] = [];
    const { from, to, calendarIds } = params;
    for (const ev of evMap.values()) {
      if (ev.date >= from && ev.date <= to) {
        if (calendarIds?.length && !calendarIds.includes(ev.calendarId)) continue;
        res.push(ev);
      }
    }
    return res;
  },
  createEvent(
    userId: string,
    input: Omit<EventItem, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>,
  ): EventItem {
    ensureUserBootstrap(userId);
    const id = nanoid(10);
    const ev: EventItem = {
      ...input,
      id,
      ownerId: userId,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    eventsByUser.get(userId)!.set(id, ev);
    return ev;
  },
  updateEvent(userId: string, id: string, patch: Partial<EventItem>): EventItem | null {
    ensureUserBootstrap(userId);
    const map = eventsByUser.get(userId)!;
    const cur = map.get(id);
    if (!cur) return null;
    const next: EventItem = {
      ...cur,
      ...patch,
      id: cur.id,
      ownerId: cur.ownerId,
      updatedAt: nowISO(),
    };
    map.set(id, next);
    return next;
  },
  deleteEvent(userId: string, id: string): boolean {
    ensureUserBootstrap(userId);
    return eventsByUser.get(userId)!.delete(id);
  },

  createShare(userId: string, eventId: string): ShareToken | null {
    ensureUserBootstrap(userId);
    const ev = eventsByUser.get(userId)!.get(eventId);
    if (!ev) return null;
    const token = nanoid(16);
    const share: ShareToken = { token, eventId, ownerId: userId, createdAt: nowISO() };
    sharesByToken.set(token, share);
    return share;
  },
  getSharedEvent(token: string): EventItem | null {
    const s = sharesByToken.get(token);
    if (!s) return null;
    const ev = eventsByUser.get(s.ownerId)?.get(s.eventId) || null;
    return ev ?? null;
  },
};
