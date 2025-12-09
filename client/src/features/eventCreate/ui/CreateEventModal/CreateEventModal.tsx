import { Modal } from '@uikit/Modal';
import React from 'react';

import { CreateEventForm } from '../CreateEventForm';

export function CreateEventModal({
  onClose,
  selectedDate,
  rangeToInvalidate,
}: {
  onClose: () => void;
  selectedDate: string;
  rangeToInvalidate: { from: string; to: string; calendarIds?: string[] };
}) {
  return (
    <Modal title="Create event" width={522} onClose={onClose}>
      <CreateEventForm
        defaultDate={selectedDate}
        onClose={onClose}
        rangeToInvalidate={rangeToInvalidate}
      />
    </Modal>
  );
}
