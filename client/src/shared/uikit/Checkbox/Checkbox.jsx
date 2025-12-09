import { IconCheck } from '@assets/icons';
import { classNames as cn } from '@utils/classNames';
import React from 'react';

import styles from './Checkbox.module.scss';

export const Checkbox = ({ checked, onChange, label, disabled = false, name, id }) => {
  return (
    <label htmlFor={id || name} className={cn(styles.wrapper, { [styles.disabled]: disabled })}>
      <input
        id={id || name}
        name={name}
        type="checkbox"
        className={styles.input}
        checked={!!checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
      />

      <span className={cn(styles.box, { [styles.checked]: checked })}>
        {checked && <IconCheck className={styles.icon} />}
      </span>

      {label && <span className={styles.labelText}>{label}</span>}
    </label>
  );
};
