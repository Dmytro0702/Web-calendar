import { classNames as cn } from '@utils/classNames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './Textarea.module.scss';

export const Textarea = ({
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  helperText = '',
  name,
  rows = 4,
  id,
  className,
  ...rest
}) => {
  const textareaId = id || name;
  const textareaClass = cn(
    styles.textarea,
    { [styles.textareaError]: error, [styles.disabled]: disabled },
    className,
  );

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        name={name}
        className={textareaClass}
        placeholder={placeholder}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        {...rest}
      />

      {helperText && (
        <p className={cn(styles.helperText, { [styles.helperError]: error })}>{helperText}</p>
      )}
    </div>
  );
};

Textarea.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  name: PropTypes.string,
  rows: PropTypes.number,
  id: PropTypes.string,
  className: PropTypes.string,
};
