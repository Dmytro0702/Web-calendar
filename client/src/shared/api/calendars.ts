// client/src/shared/api/calendars.ts
import { http } from './http';

export type CalendarDTO = {
  id: string;
  name: string;
  color: string;
  isDefault?: boolean;
  isVisible?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export async function fetchCalendars(): Promise<CalendarDTO[]> {
  const { data } = await http.get<CalendarDTO[]>('/calendars');
  return data ?? [];
}

export type CreateCalendarInput = Pick<CalendarDTO, 'name' | 'color'>;

export async function createCalendar(payload: CreateCalendarInput): Promise<CalendarDTO> {
  const { data } = await http.post<CalendarDTO>('/calendars', payload);
  return data;
}
