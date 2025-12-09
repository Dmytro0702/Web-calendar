import { IconCheck } from '@assets/icons';
import cn from '@utils/classNames';
import React from 'react';

import styles from './Button.module.scss';

/**
 * Универсальная кнопка UI kit.
 * variant: 'primary' | 'secondary' | 'ghost' (должны быть в Button.module.scss)
 */
export const Button = ({
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  withIcon = false,
  onClick,
  label, // строка подписи (если нет children)
  children, // явное содержимое
  className,
  type = 'button', // по умолчанию безопасно
  ariaLabel,
}) => {
  const content = children ?? label;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(styles.button, styles[variant], className, {
        [styles.disabled]: disabled,
        [styles.fullWidth]: fullWidth,
      })}
    >
      {withIcon && <IconCheck className={styles.icon} />}
      {content}
    </button>
  );
};
