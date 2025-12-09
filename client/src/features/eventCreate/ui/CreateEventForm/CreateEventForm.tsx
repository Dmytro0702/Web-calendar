import { zodResolver } from '@hookform/resolvers/zod';
import { fetchCalendars, type CalendarDTO } from '@shared/api/calendars';
import { createEvent, type CreateEventInput } from '@shared/api/events';
import { qk } from '@shared/api/queryKeys';
import {
  RHFCheckbox,
  RHFDatePicker,
  RHFInput,
  RHFSelect,
  RHFTextarea,
  RHFTimeEnd,
  RHFTimeStart,
} from '@shared/form';
import type { Option } from '@shared/types/options';
import { EventCreateSchema } from '@shared/validation/event';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toISODate } from '@shared/lib/date';

import s from './CreateEventForm.module.scss';

// тип input для совместимости с defaultValues
type FormValues = z.input<typeof EventCreateSchema>;

const REPEAT_OPTIONS: Option[] = [
  { label: 'Does not repeat', value: 'none' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly on Thursday', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Annually on November 2', value: 'annually' },
];

type Props = {
  // базовые пропсы для "создания"
  defaultDate: string;
  onClose: () => void;
  rangeToInvalidate: { from: string; to: string; calendarIds?: string[] };

  // доп. пропсы для "редактирования"
  initialValues?: Partial<FormValues>;
  onSubmitExternal?: (values: FormValues) => Promise<void> | void;
  isSubmittingExternal?: boolean;
};

export function CreateEventForm({
  defaultDate,
  onClose,
  rangeToInvalidate,
  initialValues,
  onSubmitExternal,
  isSubmittingExternal,
}: Props) {
  // календари для селекта
  const { data: calendars = [] } = useQuery<CalendarDTO[]>({
    queryKey: qk.calendars(),
    queryFn: fetchCalendars,
    staleTime: 60_000,
  });

  const calendarOptions: Option[] = React.useMemo(
    () => calendars.map((c) => ({ label: c.name, value: c.id })),
    [calendars],
  );

  const defaultCalendarId =
    calendars.find((c) => c.isDefault)?.id || calendars[0]?.id || '';

  const qc = useQueryClient();

  // базовые значения для "создания"
  const baseDefaults: FormValues = {
    title: '',
    date: defaultDate,
    startTime: '12:00',
    endTime: '13:00',
    allDay: false,
    repeat: 'none',
    calendarId: defaultCalendarId,
    description: '',
  } as FormValues;

  // если передали initialValues (режим "редактирование") — переопределяем
  const mergedDefaults: FormValues = {
    ...baseDefaults,
    ...(initialValues as FormValues | undefined),
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(EventCreateSchema),
    defaultValues: mergedDefaults,
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = form;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: CreateEventInput) => createEvent(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.events(rangeToInvalidate) }),
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    // безопасно приводим дату к 'YYYY-MM-DD' без UTC-сдвига
    const rawDate = values.date as unknown as string | Date;
    const dateISO = typeof rawDate === 'string' ? rawDate : toISODate(rawDate);

    // нормализуем values так, чтобы date гарантированно была строкой
    const normalizedValues: FormValues = {
      ...values,
      date: dateISO as any,
    };

    if (onSubmitExternal) {
      // РЕЖИМ РЕДАКТИРОВАНИЯ: внешняя логика (updateEvent и т.п.)
      await onSubmitExternal(normalizedValues);
    } else {
      // РЕЖИМ СОЗДАНИЯ: стандартный createEvent
      const payload: CreateEventInput = {
        calendarId: normalizedValues.calendarId!,
        title: normalizedValues.title!,
        date: dateISO,
        startTime: normalizedValues.startTime!,
        endTime: normalizedValues.endTime!,
        allDay: !!normalizedValues.allDay,
        description: normalizedValues.description || undefined,
      };

      await mutateAsync(payload);
    }

    onClose();
  };

  const externalSubmitting = isSubmittingExternal ?? false;
  const timeDisabled = isPending || isSubmitting || externalSubmitting;
  const disabled = isPending || isSubmitting || externalSubmitting;

  return (
    <FormProvider {...form}>
      <form className={s.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* TITLE */}
        <div className={s.section}>
          <label className={s.label} htmlFor="event-title">
            Title
          </label>
          <RHFInput
            name="title"
            id="event-title"
            className={s.textInput}
            placeholder="Enter title"
          />
        </div>

        {/* DATE + TIME */}
        <div className={`${s.section} ${s.sectionRow}`}>
          <div className={s.col}>
            <label className={s.label} htmlFor="event-date">
              Date
            </label>
            <RHFDatePicker
              name="date"
              id="event-date"
              className={s.dateControl}
            />
          </div>

          <div className={s.col}>
            <label className={s.label} htmlFor="event-start">
              Time
            </label>
            <div className={s.timeRow}>
              <RHFTimeStart
                name="startTime"
                id="event-start"
                className={s.timeControl}
                endName="endTime"
                stepMin={15}
                getValues={getValues}
                disabled={timeDisabled}
              />
              <span className={s.timeDash}>–</span>
              <RHFTimeEnd
                name="endTime"
                id="event-end"
                className={s.timeControl}
                startName="startTime"
                stepMin={15}
                getValues={getValues}
                disabled={timeDisabled}
              />
            </div>
          </div>
        </div>

        {/* ALL DAY + REPEAT (одна строка как в макете) */}
        <div className={`${s.section} ${s.sectionAllDay}`}>
          <div className={s.allDayLeft}>
            <RHFCheckbox
              name="allDay"
              label="All day"
              className={s.checkbox}
            />
          </div>
          <div className={s.allDayRight}>
            <RHFSelect
              name="repeat"
              id="event-repeat"
              options={REPEAT_OPTIONS}
              className={s.selectControl}
              placeholder="Does not repeat"
            />
          </div>
        </div>

        {/* CALENDAR — label слева, селект справа в одной строке */}
        <div className={`${s.section} ${s.sectionCalendar}`}>
          <label className={s.label} htmlFor="event-calendar">
            Calendar
          </label>
          <RHFSelect
            name="calendarId"
            id="event-calendar"
            options={calendarOptions}
            className={s.calendarSelectControl}
            placeholder="Select…"
          />
        </div>

        {/* DESCRIPTION */}
        <div className={s.section}>
          <label className={s.label} htmlFor="event-description">
            Description
          </label>
          <RHFTextarea
            name="description"
            id="event-description"
            className={s.descriptionControl}
            placeholder="Enter description"
            rows={2}
          />
        </div>

        {/* BUTTONS */}
        <div className={s.footer}>
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
