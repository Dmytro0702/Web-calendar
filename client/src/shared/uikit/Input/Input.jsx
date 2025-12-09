import { IconEye } from '@assets/icons';
import { classNames as cn } from '@utils/classNames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './Input.module.scss';

/**
 * Базовый инпут UI-кита.
 * - error: boolean — включает красную рамку и красный helperText
 * - helperText: строка под инпутом (ошибка или подсказка)
 */
export const Input = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  disabled = false,
  error = false,
  helperText = '',
  withIcon = false,
  name,
  id,
  className,
  ...rest
}) => {
  const inputId = id || name;
  const wrapperClass = cn(styles.wrapper, className);
  const inputClass = cn(styles.input, {
    [styles.inputError]: error,
    [styles.disabled]: disabled,
  });

  return (
    <div className={wrapperClass}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <input
          id={inputId}
          name={name}
          className={inputClass}
          placeholder={placeholder}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          {...rest}
        />
        {withIcon && <IconEye className={styles.icon} />}
      </div>

      {helperText && (
        <p className={cn(styles.helperText, { [styles.helperError]: error })}>
          {helperText}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  withIcon: PropTypes.bool,
  name: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
};
