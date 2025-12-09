import { Icon } from '@uikit/Icon';
import React from 'react';

import styles from './Modal.module.scss';

type Props = {
  title?: string;
  width?: number;
  onClose?: () => void;
  children?: React.ReactNode;
};

export const Modal: React.FC<Props> = ({ title, width = 522, onClose, children }) => {
  const handleClose = React.useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal} style={{ width }}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <button type="button" className={styles.close} aria-label="Close" onClick={handleClose}>
            <Icon name="IconClose" className={styles.icon} title="Close" />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
