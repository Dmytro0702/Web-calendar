import { zodResolver } from '@hookform/resolvers/zod';
import { createCalendar } from '@shared/api/calendars';
import { qk } from '@shared/api/queryKeys';
import { RHFColorPicker, RHFInput } from '@shared/form';
import { calendarCreateSchema } from '@shared/validation/calendar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import s from './CalendarForm.module.scss';

const PALETTE = [
  '#00AE1C',
  '#EEC04C',
  '#8332A4',
  '#9F2957',
  '#429488',
  '#FF5620',
  '#4254AF',
  '#439BDF',
  '#6C7AC4',
  '#B8C42F',
  '#C73461',
  '#D90056',
] as const;

// тип input схемы (color может иметь дефолт)
type FormValues = z.input<typeof calendarCreateSchema>;

export function CalendarForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(calendarCreateSchema),
    defaultValues: { name: '', color: PALETTE[0] } as FormValues,
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCalendar,
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.calendars() }),
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await mutateAsync(values as any);
    onClose();
  };

  const disabled = isPending || isSubmitting;

  return (
    <FormProvider {...form}>
      <form className={s.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={s.field}>
          <label className={s.label} htmlFor="calendar-name">
            Title
          </label>
          {/* RHFInput сам выводит текст ошибки из RHF / zod */}
          <RHFInput
            name="name"
            id="calendar-name"
            className={s.input}
            placeholder="Enter title"
          />
        </div>

        <div className={s.field}>
          <span className={s.label}>Color</span>
          <RHFColorPicker
            name="color"
            id="calendar-color"
            className={s.color}
            palette={[...PALETTE]}
          />
        </div>

        <div className={s.actions}>
          <button
            type="button"
            className={s.secondary}
            onClick={onClose}
            disabled={disabled}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={s.primary}
            disabled={disabled}
          >
            Save
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
