/**
 * PROTECTED ROUTE COMPONENT
 * Componente para proteger rutas que requieren autenticación
 */

import { ReactNode } from 'react';
import { useAuth, type UserRole } from '../context/AuthContext';
import { Card, CardContent } from '../../../shared/ui/card';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '../../../shared/ui/button';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, allowedRoles, fallback }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-sky-500 mx-auto mb-4" />
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white p-4">
        <Card className="max-w-md w-full border-red-200">
          <CardContent className="pt-6 text-center">
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl mb-2 text-gray-800">Acceso Denegado</h2>
            <p className="text-gray-600 mb-6">
              Debes iniciar sesión para acceder a esta página
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-sky-500 hover:bg-sky-600"
            >
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role authorization if specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white p-4">
          <Card className="max-w-md w-full border-orange-200">
            <CardContent className="pt-6 text-center">
              <ShieldAlert className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl mb-2 text-gray-800">Sin Permisos</h2>
              <p className="text-gray-600 mb-2">
                No tienes los permisos necesarios para acceder a esta sección
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Tu rol: <span className="font-semibold">{user.role}</span>
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-sky-500 hover:bg-sky-600"
              >
                Volver al inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Authorized - render children
  return <>{children}</>;
}

/**
 * Hook para verificar permisos
 */
export function usePermissions() {
  const { user } = useAuth();

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return allowedRoles.includes(user.role);
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const isDoctor = (): boolean => {
    return user?.role === 'doctor';
  };

  const isReceptionist = (): boolean => {
    return user?.role === 'receptionist';
  };

  const isPatient = (): boolean => {
    return user?.role === 'patient';
  };

  const canAccessDashboard = (dashboardType: UserRole): boolean => {
    if (!user) return false;
    
    // Admin can access all dashboards
    if (user.role === 'admin') return true;
    
    // Others can only access their own dashboard
    return user.role === dashboardType;
  };

  return {
    hasRole,
    isAdmin,
    isDoctor,
    isReceptionist,
    isPatient,
    canAccessDashboard,
  };
}
