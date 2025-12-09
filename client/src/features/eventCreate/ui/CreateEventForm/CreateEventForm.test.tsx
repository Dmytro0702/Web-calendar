import { CreateEventForm } from '@features/create-event/ui/CreateEventForm';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

describe('CreateEventForm', () => {
  it('validates title required', async () => {
    render(<CreateEventForm />);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  });
});
