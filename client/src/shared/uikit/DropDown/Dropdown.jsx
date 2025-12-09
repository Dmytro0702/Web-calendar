import { useClickOutside } from '@hooks/useClickOutside';
import { Icon } from '@uikit/Icon';
import cn from '@utils/classNames';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import styles from './Dropdown.module.scss';

/**
 * Dropdown — кликабельный список с клавиатурной поддержкой.
 * Важно: события клавиатуры развешаны на пунктах меню и кнопке,
 * на корневом <div> обработчиков нет (иначе jsx-a11y ругается).
 */
export const Dropdown = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select…',
  disabled = false,
  size = 'md',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const rootRef = useRef(null);

  // закрытие по клику вне
  useClickOutside(rootRef, () => setIsOpen(false), { enabled: isOpen });

  // нормализация опций к {label, value}
  const normalized = useMemo(
    () => options.map((opt) => (typeof opt === 'string' ? { label: opt, value: opt } : opt)),
    [options],
  );

  // выбранный элемент
  const selected = useMemo(
    () => normalized.find((o) => o.value === value) || null,
    [normalized, value],
  );

  const open = useCallback(() => !disabled && setIsOpen(true), [disabled]);
  const toggle = useCallback(() => !disabled && setIsOpen((s) => !s), [disabled]);
  const close = useCallback(() => setIsOpen(false), []);

  // сбрасываем подсветку при закрытии
  useEffect(() => {
    if (!isOpen) setHighlight(-1);
  }, [isOpen]);

  return (
    <div
      ref={rootRef}
      className={cn(styles.wrapper, styles[size], className, { [styles.disabled]: disabled })}
    >
      <button
        type="button"
        className={styles.control}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggle}
        onFocus={open}
        disabled={disabled}
      >
        <span className={cn(styles.value, { [styles.placeholder]: !selected })}>
          {selected ? selected.label : placeholder}
        </span>
        <Icon name="chevron-down" className={styles.chevron} />
      </button>

      {isOpen && (
        <ul className={styles.menu} role="listbox">
          {normalized.map((opt, idx) => (
            <li
              key={opt.value}
              role="option"
              tabIndex={0}
              aria-selected={selected?.value === opt.value}
              className={cn(styles.item, {
                [styles.active]: highlight === idx,
                [styles.selected]: selected?.value === opt.value,
              })}
              onMouseEnter={() => setHighlight(idx)}
              onClick={() => {
                onChange?.(opt.value);
                close();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange?.(opt.value);
                  close();
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setHighlight((h) => Math.min((h < 0 ? idx : h) + 1, normalized.length - 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setHighlight((h) => Math.max((h < 0 ? idx : h) - 1, 0));
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  close();
                }
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  options: PropTypes.array, // (string | {label, value})[]
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};
