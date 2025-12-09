import { AppRoutes } from '@app/routes/AppRoutes';
import { CalendarPage } from '@pages/CalendarPage/ui/CalendarPage';
import { WelcomePage } from '@pages/Welcome/ui/WelcomePage';
import useAuthUser from '@shared/hooks/useAuthUser';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const LoadingFallback: React.FC = () => (
  <div
    style={{
      padding: 40,
      textAlign: 'center',
      fontSize: 24,
      color: '#4CAF50',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    Проверка статуса пользователя...
  </div>
);

export const App: React.FC = () => {
  const { user, loading } = useAuthUser();

  if (loading) return <LoadingFallback />;

  // Гость → /welcome
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to={AppRoutes.welcome()} replace />} />
        <Route path={AppRoutes.welcome()} element={<WelcomePage />} />
        <Route path="*" element={<Navigate to={AppRoutes.welcome()} replace />} />
      </Routes>
    );
  }

  // Авторизован → календарь
  return (
    <Routes>
      <Route path="/" element={<Navigate to={AppRoutes.today('day')} replace />} />
      {/* строго :view/:date */}
      <Route path="/:view/:date" element={<CalendarPage />} />
      <Route path={AppRoutes.welcome()} element={<Navigate to={AppRoutes.today('day')} replace />} />
      <Route path="*" element={<Navigate to={AppRoutes.today('day')} replace />} />
    </Routes>
  );
};
