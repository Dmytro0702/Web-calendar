import { Textarea } from '@uikit/Textarea';
import { classNames } from '@utils/classNames';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
  name: string;
  id?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
};

export const RHFTextarea: React.FC<Props> = ({
  name,
  id,
  className,
  placeholder,
  disabled,
  rows = 4,
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { error } = fieldState;
        const textareaId = (id ?? String(name)).replace(/[^a-zA-Z0-9_-]/g, '_');
        const describedBy = error ? `${textareaId}-error` : undefined;
        return (
          <div className={classNames(className)}>
            <Textarea
              id={textareaId}
              label={'' as any}
              className={'' as any}
              rows={rows as any}
              value={field.value ?? ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                field.onChange(e.target.value)
              }
              onBlur={field.onBlur}
              placeholder={placeholder as any}
              disabled={disabled}
              aria-invalid={!!error || undefined}
              aria-describedby={describedBy}
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
};
