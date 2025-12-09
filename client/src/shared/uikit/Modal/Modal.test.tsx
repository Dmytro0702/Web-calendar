import { fireEvent, render, screen } from '@testing-library/react';
import { Modal } from '@uikit/Modal';
import React from 'react';

describe('Modal', () => {
  it('closes on close button click', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Dialog">
        content
      </Modal>,
    );
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
