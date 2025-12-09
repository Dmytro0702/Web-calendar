import { classNames as cn } from '@utils/classNames';
import { useMemo } from 'react';

import styles from './ColorPicker.module.scss';

/**
 * Props:
 *  - id?: string
 *  - value: string (hex #RRGGBB)
 *  - onChange(hex: string): void
 *  - disabled?: boolean
 *  - palette?: string[]
 *  - ...aria (пойдет на radiogroup)
 */
export const ColorPicker = ({ id, value, onChange, disabled = false, palette = [], ...aria }) => {
  const normalized = useMemo(
    () =>
      (palette && palette.length
        ? palette
        : [
            '#00AE1C',
            '#EEC04C',
            '#80D78D',
            '#8332A4',
            '#9F2957',
            '#429488',
            '#FF5620',
            '#4254AF',
            '#439BDF',
            '#6C7AC4',
            '#B8C42F',
            '#C73461',
            '#D90056',
            '#DFC45A',
            '#E25D33',
          ]
      ).map((c) => String(c).toUpperCase()),
    [palette],
  );

  const upperValue = (value || '').toUpperCase();

  return (
    <div className={cn(styles.wrap, { [styles.disabled]: disabled })}>
      {id ? <input id={id} type="hidden" value={upperValue} /> : null}

      {/* компактная палитра как в макете – только свотчи */}
      <ul className={styles.palette} role="radiogroup" {...aria}>
        {normalized.map((hex) => {
          const selected = upperValue === hex;

          return (
            <li key={hex} className={styles.item}>
              <button
                type="button"
                className={cn(styles.swatch, { [styles.selected]: selected })}
                style={{ backgroundColor: hex }}
                onClick={() => onChange?.(hex)}
                role="radio"
                aria-checked={selected}
                aria-label={`Select color ${hex}`}
                aria-pressed={selected}
                disabled={disabled}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onChange?.(hex);
                  }
                }}
              >
                {selected && <span className={styles.dot} />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
