import { DatePicker } from '@uikit/DatePicker';
import { classNames as cn } from '@utils/classNames';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// helpers: Date <-> 'YYYY-MM-DD'
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
export const formatISODate = (d: Date): string => {
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${y}-${m}-${day}`;
};
export const parseISODate = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

type Props = {
  name: string;
  id?: string;
  className?: string;
  disabled?: boolean;
};

export function RHFDatePicker({ name, id, className, disabled }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { error } = fieldState;
        const hasValue = typeof field.value === 'string' && field.value.length > 0;
        const uiValue = hasValue ? parseISODate(field.value as string) : undefined;

        const rawId = id ?? String(name);
        const baseId = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');
        const describedBy = error ? `${baseId}-error` : undefined;

        return (
          <div className={cn(className)}>
            <DatePicker
              id={baseId}
              value={uiValue}
              onChange={(d: Date) => field.onChange(formatISODate(d))}
              onBlur={field.onBlur}
              disabled={disabled}
              aria-invalid={!!error || undefined}
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
}
