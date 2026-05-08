import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AvailabilityProvider } from './context/AvailabilityContext';
import { PatientProvider } from './context/PatientContext';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { Toaster } from './components/ui/sonner';
import { useTokenRefresh } from './hooks/useTokenRefresh';

type View = 'landing' | 'login' | 'register' | 'dashboard';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const { user, isLoading } = useAuth();

  // Auto-refresh JWT tokens before expiration
  useTokenRefresh({
    refreshBeforeExpiry: 300,  // Refresh 5 minutes before expiry
    checkInterval: 60000,      // Check every minute
    showNotifications: true,   // Show toast notifications
  });

  // Show loading while checking authentication
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

  // If user is logged in, show dashboard
  if (user) {
    return <Dashboard />;
  }

  // Otherwise show the appropriate view
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