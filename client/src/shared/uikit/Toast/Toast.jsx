import { Icon } from '@uikit/Icon';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './Toast.module.scss';

export const Toast = ({ message, type, onClose }) => {
  return (
    <div role="status" aria-live="polite" className={`${styles.toast} ${styles[type]}`}>
      <span className={styles.message}>{message}</span>
      <button
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close notification"
        type="button"
      >
        <Icon name="close" />
      </button>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'success', 'error', 'warning']).isRequired,
  onClose: PropTypes.func.isRequired,
};
