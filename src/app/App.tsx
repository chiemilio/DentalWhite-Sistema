import { useState } from 'react';
import { AuthProvider, useAuth } from './modules/auth/context/AuthContext';
import { AvailabilityProvider } from './shared/context/AvailabilityContext';
import { PatientProvider } from './shared/context/PatientContext';
import { Login, Register, LandingPage } from './modules/auth';
import { Dashboard } from './modules/dashboard/components/Dashboard';
import { Toaster } from './shared/ui/sonner';
import { useTokenRefresh } from './shared/hooks/useTokenRefresh';

type View = 'landing' | 'login' | 'register' | 'dashboard';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const { user, isLoading } = useAuth();

  useTokenRefresh({
    refreshBeforeExpiry: 300,
    checkInterval: 60000,
    showNotifications: true,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  switch (currentView) {
    case 'login':
      return (
        <Login
          onBack={() => setCurrentView('landing')}
          onRegisterClick={() => setCurrentView('register')}
        />
      );
    case 'register':
      return (
        <Register
          onBack={() => setCurrentView('landing')}
          onLoginClick={() => setCurrentView('login')}
        />
      );
    case 'landing':
    default:
      return (
        <LandingPage
          onLoginClick={() => setCurrentView('login')}
          onRegisterClick={() => setCurrentView('register')}
        />
      );
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AvailabilityProvider>
        <PatientProvider>
          <AppContent />
          <Toaster position="top-right" />
        </PatientProvider>
      </AvailabilityProvider>
    </AuthProvider>
  );
}