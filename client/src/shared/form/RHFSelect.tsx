import { SelectMenu } from '@uikit/SelectMenu';
import { classNames } from '@utils/classNames';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Option = { label: string; value: string };

type Props = {
  name: string;
  id?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  options: Array<Option | string>;
};

export const RHFSelect: React.FC<Props> = ({
  name,
  id,
  className,
  placeholder = 'Select…',
  disabled,
  options,
}) => {
  const { control } = useFormContext();

  const normalized = React.useMemo<Option[]>(
    () => options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o)),
    [options],
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { error } = fieldState;
        const selectId = (id ?? String(name)).replace(/[^a-zA-Z0-9_-]/g, '_');
        const describedBy = error ? `${selectId}-error` : undefined;

        return (
          <div className={classNames(className)}>
            <SelectMenu
              id={selectId}
              className=""
              options={normalized as any}
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
