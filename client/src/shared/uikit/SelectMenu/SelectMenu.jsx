import { useClickOutside } from '@hooks/useClickOutside';
import { Icon } from '@uikit/Icon';
import { classNames as cn } from '@utils/classNames';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import styles from './SelectMenu.module.scss';

export const SelectMenu = ({
  options = [],
  value,
  onChange,
  disabled = false,
  placeholder = 'Select…',
  id,
  className,
  ...rest
}) => {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useClickOutside(containerRef, () => setIsOpen(false), { enabled: isOpen });

  const normalized = useMemo(
    () => options.map((opt) => (typeof opt === 'string' ? { label: opt, value: opt } : opt)),
    [options],
  );

  const selected = useMemo(
    () => normalized.find((o) => o.value === value) || null,
    [normalized, value],
  );

  const listboxId = id ? `${id}-listbox` : undefined;

  const toggle = useCallback(() => !disabled && setIsOpen((s) => !s), [disabled]);
  const choose = useCallback(
    (v) => {
      onChange?.(v);
      setIsOpen(false);
    },
    [onChange],
  );

  return (
    <div
      ref={containerRef}
      className={cn(styles.wrapper, { [styles.disabled]: disabled }, className)}
      {...rest}
    >
      {id ? (
        <input
          id={id}
          type="text"
          readOnly
          value={selected ? String(selected.value) : ''}
          tabIndex={-1}
          aria-hidden="true"
          className={styles.visuallyHidden}
        />
      ) : null}

      <button
        type="button"
        className={styles.selected}
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        disabled={disabled}
      >
        <span className={cn({ [styles.placeholder]: !selected })}>
          {selected ? selected.label : placeholder}
        </span>
        <Icon name="IconChevronDown" />
      </button>

      {isOpen && (
        <ul className={styles.options} role="listbox" id={listboxId}>
          {normalized.map((opt) => (
            <li
              key={opt.value}
              role="option"
              tabIndex={0}
              aria-selected={selected?.value === opt.value}
              className={cn(styles.option, {
                [styles.selectedOption]: selected?.value === opt.value,
              })}
              onClick={() => choose(opt.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  choose(opt.value);
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

SelectMenu.propTypes = {
  options: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
};
