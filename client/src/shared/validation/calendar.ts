import { z } from 'zod';

export const calendarCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Title is required'),
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Invalid color')
    .default('#00AE1C'),
});

export type CalendarCreateDto = z.infer<typeof calendarCreateSchema>;
