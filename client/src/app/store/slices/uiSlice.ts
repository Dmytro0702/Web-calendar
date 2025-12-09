import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UiModal =
  | null
  | { type: 'create-event' }
  | { type: 'edit-event'; eventId: string }
  | { type: 'delete-event'; eventId: string }
  | { type: 'create-calendar' }
  | { type: 'edit-calendar'; calendarId: string }
  | { type: 'delete-calendar'; calendarId: string };

type UiState = {
  activeModal: UiModal;
};

const initialState: UiState = {
  activeModal: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<UiModal>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
  },
});

export const { openModal, closeModal } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
