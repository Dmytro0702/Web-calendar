import { ColorPicker } from '@uikit/ColorPicker';
import { classNames as cn } from '@utils/classNames';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
  name: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  palette?: string[];
};

export function RHFColorPicker({ name, id, className, disabled, palette }: Props) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { error } = fieldState;
        const baseId = (id ?? String(name)).replace(/[^a-zA-Z0-9_-]/g, '_');
        const describedBy = error ? `${baseId}-error` : undefined;
        return (
          <div className={cn(className)}>
            <ColorPicker
              id={baseId}
              value={field.value ?? ''}
              onChange={(hex: string) => field.onChange(hex)}
              disabled={disabled}
              palette={(palette ?? []) as any}
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
