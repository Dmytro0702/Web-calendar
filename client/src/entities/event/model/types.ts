// Минимальный фронтовый контракт события, приходящий с сервера.
export type EventDTO = {
  id: string; // идентификатор события
  calendarId: string; // ссылка на календарь
  ownerId: string; // владелец (серверный колонтитул)
  title: string; // заголовок
  description?: string; // описание
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  allDay?: boolean; // флаг полного дня
  recurrence?: unknown; // зарезервировано под будущее (RRule-like)
  color?: string; // цвет (может не приходить — берём из календаря)
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

/*
File summary — entities/event/model/types.ts
Роль: тип данных EventDTO, используемый в UI и API-слое.
Контракты: простые строки для дат/времени; расширение под recurrence позже.
Почему: единая форма контракта между API и UI.
Зависимости: нет.
*/
