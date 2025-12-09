
import { Input } from '@uikit/Input';
import { classNames } from '@utils/classNames';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
  name: string;
  id?: string;
  className?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
  helperText?: string;
};

/**
 * RHF-адаптер для UI-инпута.
 * Пробрасывает в Input:
 *  - error (boolean) -> для красной рамки
 *  - helperText (string) -> для красного текста ошибки
 */
export const RHFInput: React.FC<Props> = ({
  name,
  id,
  className,
  label,
  placeholder,
  disabled,
  type = 'text',
  helperText,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { error } = fieldState;
        const inputId = (id ?? String(name)).replace(/[^a-zA-Z0-9_-]/g, '_');
        const describedBy = error ? `${inputId}-error` : undefined;

        return (
          <div className={classNames(className)}>
            <Input
              id={inputId}
              name={name as any}
              type={type}
              value={field.value ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                field.onChange(e.target.value)
              }
              onBlur={field.onBlur}
              placeholder={(placeholder ?? '') as any}
              disabled={disabled}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              error={!!error}
              helperText={error?.message ?? helperText ?? ''}
              label={label ?? ''}
              className={className ?? ''}
            />
          </div>
        );
      }}
    />
  );
};
