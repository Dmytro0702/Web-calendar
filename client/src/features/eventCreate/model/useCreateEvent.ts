import { createEvent, CreateEventInput } from '@shared/api/events';
import { qk } from '@shared/api/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateEvent(invalidateRange?: {
  from: string;
  to: string;
  calendarIds?: string[];
}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEventInput) => createEvent(payload),
    onSuccess: () => {
      if (invalidateRange) qc.invalidateQueries({ queryKey: qk.events(invalidateRange) });
    },
  });
}
