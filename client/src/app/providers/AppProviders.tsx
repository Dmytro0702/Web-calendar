import '@app/firebase/init';

import { store } from '@app/store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

export const AppProviders: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    </ReduxProvider>
  );
};
