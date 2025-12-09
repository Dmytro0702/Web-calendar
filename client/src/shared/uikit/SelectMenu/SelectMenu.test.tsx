import { fireEvent, render, screen } from '@testing-library/react';
import { SelectMenu } from '@uikit/SelectMenu';
import React from 'react';

describe('SelectMenu', () => {
  it('opens and selects option', () => {
    const options = [
      { label: 'One', value: '1' },
      { label: 'Two', value: '2' },
    ];
    const onChange = vi.fn();
    render(<SelectMenu options={options} value="" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('option', { name: 'Two' }));
    expect(onChange).toHaveBeenCalledWith('2');
  });
});
