import { generateTimeOptions, timeToMinutes } from '@shared/time/timeOptions';
import type { Option } from '@shared/types/options';
import { SelectMenu } from '@uikit/SelectMenu';
import { classNames as cn } from '@utils/classNames';
import React from 'react';
import { Controller, useFormContext, type UseFormGetValues } from 'react-hook-form';

type Props = {
  name: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  /** Шаг, мин (по требованиям проекта — 15) */
  stepMin?: number;
  /** Нижняя граница времени, HH:mm */
  min?: string;
  /** Верхняя граница времени, HH:mm */
  max?: string;
  /** Имя поля End для валидации start < end */
  endName?: string;
  /** getValues из react-hook-form (используется для сравнения start/end) */
  getValues?: UseFormGetValues<any>;
};

export const RHFTimeStart: React.FC<Props> = ({
  name,
  id,
  className,
  disabled,
  placeholder,
  stepMin = 15,
  min = '00:00',
  max = '23:45',
  endName,
  getValues,
}) => {
  const { control, getValues: ctxGetValues } = useFormContext();

  // Базовый getValues: либо из пропсов, либо из контекста формы
  const baseGetValues = getValues ?? ctxGetValues;

  // Явный враппер с аргументом: TS видит сигнатуру (fieldName: string) => string
  const effectiveGetValues = (fieldName: string): string =>
    (baseGetValues as (name: string) => unknown)(fieldName) as string;

  const options: Option[] = React.useMemo(
    () => generateTimeOptions(stepMin, min, max),
    [stepMin, min, max],
  );

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: 'Start time is required',
        validate: (v: string) => {
          if (endName) {
            const end = effectiveGetValues(endName);
            if (end && timeToMinutes(v) >= timeToMinutes(end)) {
              return 'Start must be before end';
            }
          }
          return true;
        },
      }}
      render={({ field, fieldState }) => {
        const { error } = fieldState;

        const rawId = id ?? String(name);
        const baseId = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');
        const describedBy = error ? `${baseId}-error` : undefined;

        return (
          <div className={cn(className)}>
            <SelectMenu
              id={baseId}
              className={'' as any} // SelectMenu требует className; даём пустую строку
              options={options as unknown as any}
              value={field.value ?? ''}
              onChange={(next: string) => field.onChange(next)}
              disabled={disabled}
              placeholder={placeholder as any}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
            />
            {error && (
              <div id={describedBy} role="alert">
                {error.message}
              </div>
            )}
          </div>
        );
      }}
    />
  );
};
