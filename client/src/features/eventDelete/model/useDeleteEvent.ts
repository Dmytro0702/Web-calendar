
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { qk } from '@shared/api/queryKeys';
import { deleteEvent } from '@shared/api/events';
import type { EventsRange } from '@shared/api/events';

export const useDeleteEvent = (rangeToInvalidate: EventsRange) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.events(rangeToInvalidate) });
    },
  });
};
