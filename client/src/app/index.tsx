import '@app/firebase/init';
import '@shared/styles/index.scss'; // ✅ глобальные стили и токены

import { App } from '@app/App';
import { AppProviders } from '@app/providers/AppProviders';
import React from 'react';
import ReactDOM from 'react-dom/client';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: any }> {
  state = { error: null as any };
  static getDerivedStateFromError(error: any) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <pre className="app-error-boundary">
          {String(this.state.error?.message || this.state.error)}
        </pre>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <AppProviders>
      <App />
    </AppProviders>
  </ErrorBoundary>,
);
