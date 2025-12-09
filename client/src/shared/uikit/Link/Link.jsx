import cn from '@utils/classNames';
import React from 'react';

import styles from './Link.module.scss';

/**
 * Стилизованная ссылка.
 * variant: 'default' | 'muted' | 'primary' — должны быть в SCSS.
 */
export const Link = ({ to, variant = 'default', isExternal = false, children, className }) => {
  const combinedClass = cn(styles.link, styles[variant], className);

  if (isExternal) {
    return (
      <a href={to} className={combinedClass} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <a href={to} className={combinedClass}>
      {children}
    </a>
  );
};
