import type { EventDTO } from '@entities/event/model/types';
import { http } from './http';

// Ре-экспортируем тип, чтобы его можно было импортировать из '@shared/api/events'
export type { EventDTO };

// Диапазон дат для загрузки событий
export type EventsRange = { from: string; to: string; calendarIds?: string[] };

// Универсальная сигнатура: fetchEvents({ from, to }) ИЛИ fetchEvents(from, to, calendarIds?)
export async function fetchEvents(
  rangeOrFrom: EventsRange | string,
  toMaybe?: string,
  calendarIdsMaybe?: string[],
): Promise<EventDTO[]> {
  let from: string;
  let to: string;
  let calendarIds: string[] | undefined;

  if (typeof rangeOrFrom === 'string') {
    // Вызов вида fetchEvents('2025-11-04', '2025-11-04', ['id1','id2'])
    from = rangeOrFrom;
    if (!toMaybe) {
      throw new Error('fetchEvents: "to" is required when first arg is string');
    }
    to = toMaybe;
    calendarIds = calendarIdsMaybe && calendarIdsMaybe.length ? calendarIdsMaybe : undefined;
  } else {
    // Вызов вида fetchEvents({ from, to, calendarIds })
    from = rangeOrFrom.from;
    to = rangeOrFrom.to;
    calendarIds =
      Array.isArray(rangeOrFrom.calendarIds) && rangeOrFrom.calendarIds.length
        ? rangeOrFrom.calendarIds
        : undefined;
  }

  const params: Record<string, string> = { from, to };
  if (calendarIds) params.calendarIds = calendarIds.join(',');

  const { data } = await http.get<EventDTO[]>('/events', { params });
  return data ?? [];
}

// DTO для создания события: всё, кроме серверных полей
export type CreateEventInput = Omit<EventDTO, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>;

// Для обновления используем те же поля, что и для создания
export type UpdateEventInput = CreateEventInput;

// Создание события
export async function createEvent(payload: CreateEventInput): Promise<EventDTO> {
  const { data } = await http.post<EventDTO>('/events', payload);
  return data;
}

// Обновление события (исправлено: PATCH + корректный путь)
export async function updateEvent(id: string, payload: UpdateEventInput): Promise<EventDTO> {
  const { data } = await http.patch<EventDTO>(`/events/${id}`, payload);
  return data;
}

// Удаление события
export async function deleteEvent(id: string): Promise<void> {
  await http.delete<void>(`/events/${id}`);
}
