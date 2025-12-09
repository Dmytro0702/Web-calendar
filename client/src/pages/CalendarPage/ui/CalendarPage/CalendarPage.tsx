import { AppRoutes } from '@app/routes/AppRoutes';
import { closeModal } from '@app/store/slices/uiSlice';
import { CreateCalendarModal } from '@features/calendarCreate/ui/CreateCalendarModal';
import { CreateEventModal } from '@features/eventCreate/ui/CreateEventModal';
import { EventDetailsModal } from '@features/eventDetails/ui/EventDetailsModal';
import { EditEventModal } from '@features/eventEdit/ui/EditEventModal';
import { DeleteEventModal } from '@features/eventDelete/ui/DeleteEventModal';
import { fetchEvents } from '@shared/api/events';
import { qk } from '@shared/api/queryKeys';
import { useAppDispatch } from '@shared/hooks/useAppDispatch';
import { useAppSelector } from '@shared/hooks/useAppSelector';
import { buildSlots15, computeNowSlot, dayRange, getTodayISO, weekRange } from '@shared/lib/date';
import type { EventDTO } from '@entities/event/model/types';
import { useQuery } from '@tanstack/react-query';
import { DayGrid } from '@widgets/DayGrid/ui/DayGrid';
import { Header } from '@widgets/Header/ui/Header';
import { Sidebar } from '@widgets/Sidebar/ui/Sidebar';
import { WeekGrid } from '@widgets/WeekGrid/ui/WeekGrid';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import s from './CalendarPage.module.scss';

type ViewParam = 'day' | 'week';
type Params = { view?: string; date?: string };

type EventModalState =
  | { type: 'details'; event: EventDTO }
  | { type: 'edit'; event: EventDTO }
  | { type: 'delete'; event: EventDTO }
  | null;

const isValidView = (v: string | undefined): v is ViewParam => v === 'day' || v === 'week';
const isValidISODate = (d: string | undefined) => !!d && /^\d{4}-\d{2}-\d{2}$/.test(d);

// ⬇️ ИМЕНОВАННЫЙ экспорт
export const CalendarPage: React.FC = () => {
  const { view: rawView = 'day', date: rawDate = '' } = useParams<Params>();
  const ui = useAppSelector((state) => state.ui.activeModal);
  const dispatch = useAppDispatch();

  const view: ViewParam = isValidView(rawView) ? (rawView as ViewParam) : 'day';
  const date: string = isValidISODate(rawDate) ? rawDate : getTodayISO();

  const range = view === 'week' ? weekRange(date) : dayRange(date);

  const { data: events = [], isLoading } = useQuery({
    queryKey: qk.events(range),
    queryFn: () => fetchEvents(range),
    staleTime: 30_000,
    enabled: isValidView(rawView) && isValidISODate(rawDate),
  });

  const slots = React.useMemo(buildSlots15, []);
  const nowSlot = React.useMemo(computeNowSlot, []);
  const isToday = date === getTodayISO();

  const [eventModal, setEventModal] = React.useState<EventModalState>(null);

  if (!isValidView(rawView) || !isValidISODate(rawDate)) {
    return <Navigate to={AppRoutes.today('day')} replace />;
  }

  return (
    <div className={s.page}>
      <Header />
      <div className={s.body}>
        <Sidebar selectedDate={date} view={view} />
        <main className={s.content}>
          {view === 'week' ? (
            <WeekGrid date={date} events={events} />
          ) : (
            <DayGrid
              date={date}
              slots={slots}
              nowSlot={nowSlot}
              events={events}
              interactive
              isToday={isToday}
              onEventClick={(event) => setEventModal({ type: 'details', event })}
            />
          )}
          {isLoading ? <div style={{ padding: 12 }}>Loading…</div> : null}
        </main>
      </div>

      {ui?.type === 'create-event' ? (
        <CreateEventModal
          selectedDate={date}
          onClose={() => dispatch(closeModal())}
          rangeToInvalidate={range}
        />
      ) : null}

      {ui?.type === 'create-calendar' ? (
        <CreateCalendarModal onClose={() => dispatch(closeModal())} />
      ) : null}

      {eventModal?.type === 'details' && (
        <EventDetailsModal
          event={eventModal.event}
          onClose={() => setEventModal(null)}
          onEdit={(event) => setEventModal({ type: 'edit', event })}
          onDelete={(event) => setEventModal({ type: 'delete', event })}
        />
      )}

      {eventModal?.type === 'edit' && (
        <EditEventModal
          event={eventModal.event}
          onClose={() => setEventModal(null)}
          rangeToInvalidate={range}
        />
      )}

      {eventModal?.type === 'delete' && (
        <DeleteEventModal
          event={eventModal.event}
          onClose={() => setEventModal(null)}
          rangeToInvalidate={range}
        />
      )}
    </div>
  );
};
