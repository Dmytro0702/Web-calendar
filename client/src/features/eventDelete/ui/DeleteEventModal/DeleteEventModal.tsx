
import React, { type FC } from 'react';

import { Modal } from '@shared/uikit/Modal';
import type { EventDTO } from '@entities/event/model/types';
import type { EventsRange } from '@shared/api/events';
import { useDeleteEvent } from '../../model/useDeleteEvent';

import styles from './DeleteEventModal.module.scss';

export interface DeleteEventModalProps {
  event: EventDTO;
  onClose: () => void;
  rangeToInvalidate: EventsRange;
}

export const DeleteEventModal: FC<DeleteEventModalProps> = ({
  event,
  onClose,
  rangeToInvalidate,
}) => {
  const { mutateAsync, isPending } = useDeleteEvent(rangeToInvalidate);

  const handleDelete = async () => {
    await mutateAsync(event.id);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>Delete event</h2>
        </header>

        <p className={styles.text}>
          Are you sure you want to delete this event?
        </p>

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDelete}
            disabled={isPending}
          >
            Delete
          </button>
        </footer>
      </div>
    </Modal>
  );
};
