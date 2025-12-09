import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from '@uikit/Button';
import React from 'react';

describe('Button', () => {
  it('renders label and handles click', () => {
    const onClick = vi.fn();
    render(<Button label="Save" onClick={onClick} />);
    const btn = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
