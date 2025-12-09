// src/shared/validation/event.ts

import { z } from 'zod';

// Схема для формы создания/редактирования события
export const EventCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long'),
  description: z
    .string()
    .max(1000, 'Description is too long')
    .optional()
    .or(z.literal('')),
  date: z
    .string()
    .min(1, 'Date is required'),
  startTime: z
    .string()
    .min(1, 'Start time is required'),
  endTime: z
    .string()
    .min(1, 'End time is required'),
  calendarId: z
    .string()
    .min(1, 'Calendar is required'),
  color: z
    .string()
    .optional(),
  // ✅ добавляем флаг "весь день"
  allDay: z
    .boolean()
    .default(false),
});

// DTO для использования в коде (то, что возвращает/принимает форма)
export type EventCreateDto = z.infer<typeof EventCreateSchema>;

// Значения формы
export type EventFormValues = EventCreateDto;
