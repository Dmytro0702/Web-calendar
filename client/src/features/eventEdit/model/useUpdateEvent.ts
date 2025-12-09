
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { qk } from '@shared/api/queryKeys';
import { updateEvent, type UpdateEventInput } from '@shared/api/events';
import type { EventsRange } from '@shared/api/events';

type UpdateEventArgs = {
  id: string;
  data: UpdateEventInput;
};

export const useUpdateEvent = (rangeToInvalidate: EventsRange) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateEventArgs) => updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.events(rangeToInvalidate) });
    },
  });
};
