
import React, { type FC } from 'react';

import { Modal } from '@shared/uikit/Modal';
import type { EventDTO } from '@entities/event/model/types';

import styles from './EventDetailsModal.module.scss';

export interface EventDetailsModalProps {
  event: EventDTO;
  onClose: () => void;
  onEdit: (event: EventDTO) => void;
  onDelete: (event: EventDTO) => void;
}

export const EventDetailsModal: FC<EventDetailsModalProps> = ({
  event,
  onClose,
  onEdit,
  onDelete,
}) => {
  return (
    <Modal onClose={onClose}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>Event information</h2>
        </header>

        <div className={styles.body}>
          <div className={styles.row}>
            <span className={styles.label}>Title</span>
            <span className={styles.value}>{event.title}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Date</span>
            <span className={styles.value}>{event.date}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Time</span>
            <span className={styles.value}>
              {event.startTime} – {event.endTime}
            </span>
          </div>

          {event.description ? (
            <div className={styles.row}>
              <span className={styles.label}>Description</span>
              <span className={styles.value}>{event.description}</span>
            </div>
          ) : null}
        </div>

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => onDelete(event)}
          >
            Delete
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => onEdit(event)}
          >
            Edit
          </button>
        </footer>
      </div>
    </Modal>
  );
};
