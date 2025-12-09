import { Modal } from '@uikit/Modal';
import React from 'react';

import { CalendarForm } from '../CalendarForm';

export const CreateCalendarModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <Modal title="Create calendar" width={294} onClose={onClose}>
      <CalendarForm onClose={onClose} />
    </Modal>
  );
};
