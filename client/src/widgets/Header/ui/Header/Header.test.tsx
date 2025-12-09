import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { Header } from '../../widgets/Header/ui/Header';

describe('Header', () => {
  it('renders and shows basic controls', () => {
    render(
      <MemoryRouter initialEntries={['/day/2025-01-01']}>
        <Header />
      </MemoryRouter>,
    );
    // подправь текст под свой UI, если отличается
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });
});
