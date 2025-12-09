import { Checkbox } from '@uikit/Checkbox';
import classNames from 'classnames';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
  name: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  label?: React.ReactNode;
};

export function RHFCheckbox({ name, id, className, disabled, label }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { error } = fieldState;
        const describedBy = error ? `${id || name}-error` : undefined;

        return (
          <div className={classNames(className)}>
            <Checkbox
              id={id}
              checked={!!field.value}
              onChange={(next: boolean) => {
                field.onChange(next);
                // UI-kit не имеет onBlur — помечаем touched явно
                Promise.resolve().then(() => field.onBlur());
              }}
              disabled={disabled}
              aria-invalid={!!error || undefined}
              aria-describedby={describedBy}
              label={label as any}
              name={name as any}
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
