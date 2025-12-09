import React, { type FC } from 'react';

import { Modal } from '@shared/uikit/Modal';
import type { EventDTO } from '@entities/event/model/types';
import type { EventsRange } from '@shared/api/events';
import { CreateEventForm } from '@features/eventCreate/ui/CreateEventForm';

import { useUpdateEvent } from '../../model/useUpdateEvent';

export interface EditEventModalProps {
  event: EventDTO;
  onClose: () => void;
  rangeToInvalidate: EventsRange;
}

export const EditEventModal: FC<EditEventModalProps> = ({
  event,
  onClose,
  rangeToInvalidate,
}) => {
  // Мутация обновления события
  const { mutateAsync, isPending } = useUpdateEvent(rangeToInvalidate);

  // Стартовые значения формы редактирования
  const initialValues = {
    title: event.title,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    calendarId: event.calendarId,
    description: event.description ?? '',
    allDay: event.allDay ?? false,
    // repeat пока не редактируем — по умолчанию 'none'
    repeat: 'none',
  };

  const handleSubmit = async (values: any) => {
    await mutateAsync({
      id: event.id,
      data: {
        title: values.title,
        date: values.date, // уже строка 'YYYY-MM-DD'
        startTime: values.startTime,
        endTime: values.endTime,
        calendarId: values.calendarId,
        description: values.description,
        allDay: values.allDay,
        // repeat здесь не отправляем — поддержка повторений будет добавлена отдельно
      },
    });

    onClose();
  };

  return (
    <Modal title="Edit event" width={522} onClose={onClose}>
      <CreateEventForm
        defaultDate={event.date}
        onClose={onClose}
        rangeToInvalidate={rangeToInvalidate}
        initialValues={initialValues}
        onSubmitExternal={handleSubmit}
        isSubmittingExternal={isPending}
      />
    </Modal>
  );
};
