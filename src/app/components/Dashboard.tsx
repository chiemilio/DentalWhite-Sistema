import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PatientDashboard } from './dashboards/PatientDashboard';
import { ReceptionistDashboard } from './dashboards/ReceptionistDashboard';
import { DoctorDashboard } from './dashboards/DoctorDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/da6a072baf78bdc68ca5368ac2123d8644ed8db8.png';

export function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'doctor':
        return 'Médico';
      case 'receptionist':
        return 'Recepcionista';
      case 'patient':
        return 'Paciente';
      default:
        return role;
    }
  };

  const renderDashboard = () => {
    switch (user.role) {
      case 'patient':
        return <PatientDashboard />;
      case 'receptionist':
        return <ReceptionistDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Rol no reconocido</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src={logoImage}
              alt="Dental White Logo"
              className="w-20 h-16 object-contain"
            />
            <h1 className="text-2xl text-sky-600">Dental White</h1>
          </div>
          <div className="flex items-center gap-4">
            <Card className="border-sky-200">
              <CardContent className="flex items-center gap-3 py-2 px-4">
                <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                  <User className="text-sky-600" size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">{getRoleName(user.role)}</p>
                </div>
              </CardContent>
            </Card>
            <Button
              variant="outline"
              onClick={logout}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-2" size={18} />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">{renderDashboard()}</main>

      {/* Footer */}
      <footer className="bg-sky-600 text-white py-6 mt-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ImageWithFallback
              src={logoImage}
              alt="Dental White Logo"
              className="w-5 h-5 object-cover"
            />
            <span className="text-lg">Dental White</span>
          </div>
          <p className="text-sky-100 text-sm">© 2026 Dental White. Sistema de Gestión Dental.</p>
        </div>
      </footer>
    </div>
  );
}