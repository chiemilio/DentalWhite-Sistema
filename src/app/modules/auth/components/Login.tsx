import { useState } from 'react';
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';
import { Label } from '../../../shared/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';
import logoImage from 'figma:asset/da6a072baf78bdc68ca5368ac2123d8644ed8db8.png';

interface LoginProps {
  onBack: () => void;
  onRegisterClick: () => void;
}

export function Login({ onBack, onRegisterClick }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (!success) {
        // Error toast is handled in AuthContext
      }
    } catch (error) {
      toast.error('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-sky-200">
        <CardHeader className="space-y-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="w-fit -ml-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50"
          >
            <ArrowLeft className="mr-2" size={20} />
            Volver al inicio
          </Button>
          <div className="flex items-center justify-center gap-3">
            <ImageWithFallback
              src={logoImage}
              alt="Dental White Logo"
              className="w-24 h-20 object-contain"
            />
            <h1 className="text-2xl text-sky-600">Dental White</h1>
          </div>
          <CardTitle className="text-center text-sky-600">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-sky-200 focus:border-sky-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-sky-200 focus:border-sky-500"
              />
            </div>
            <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600" disabled={isLoading}>
              {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <button
                onClick={onRegisterClick}
                className="text-sky-600 hover:text-sky-700 hover:underline"
              >
                Regístrate aquí
              </button>
            </p>
          </div>


        </CardContent>
      </Card>
    </div>
  );
}