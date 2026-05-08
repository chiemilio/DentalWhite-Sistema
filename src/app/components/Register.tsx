import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/da6a072baf78bdc68ca5368ac2123d8644ed8db8.png';

interface RegisterProps {
  onBack: () => void;
  onLoginClick: () => void;
}

export function Register({ onBack, onLoginClick }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    sex: '',
    phone: '',
    address: '',
    colony: '',
    postalCode: '',
    municipality: '',
    tutor: '',
    occupation: '',
    patientType: 'Regular',
  });

  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        sex: formData.sex,
        phone: formData.phone,
        address: formData.address,
        colony: formData.colony,
        postalCode: formData.postalCode,
        municipality: formData.municipality,
        tutor: formData.tutor || undefined,
        occupation: formData.occupation,
        patientType: formData.patientType,
      });

      if (success) {
        toast.success('Registro exitoso. Por favor inicia sesión.');
        setTimeout(() => onLoginClick(), 1500);
      }
    } catch (error) {
      toast.error('Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center p-4 py-8">
      <Card className="w-full max-w-2xl border-sky-200">
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
          <CardTitle className="text-center text-sky-600">Registro de Paciente</CardTitle>
          <CardDescription className="text-center">
            Completa tus datos para crear tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className="border-sky-200 focus:border-sky-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  className="border-sky-200 focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  className="border-sky-200 focus:border-sky-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  required
                  className="border-sky-200 focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Edad *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  required
                  className="border-sky-200 focus:border-sky-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex">Sexo *</Label>
                <Select value={formData.sex} onValueChange={(value) => handleChange('sex', value)}>
                  <SelectTrigger className="border-sky-200 focus:border-sky-500">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                  className="border-sky-200 focus:border-sky-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required
                className="border-sky-200 focus:border-sky-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="colony">Colonia *</Label>
                <Input
                  id="colony"
                  value={formData.colony}
                  onChange={(e) => handleChange('colony', e.target.value)}
                  required
                  className="border-sky-200 focus:border-sky-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Código Postal *</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  required
                  className="border-sky-200 focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="municipality">Alcaldía / Municipio *</Label>
                <Input
                  id="municipality"
                  value={formData.municipality}
                  onChange={(e) => handleChange('municipality', e.target.value)}
                  required
                  className="border-sky-200 focus:border-sky-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tutor">Nombre del Tutor/Padres</Label>
                <Input
                  id="tutor"
                  value={formData.tutor}
                  onChange={(e) => handleChange('tutor', e.target.value)}
                  placeholder="Si aplica"
                  className="border-sky-200 focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation">Ocupación *</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleChange('occupation', e.target.value)}
                  required
                  className="border-sky-200 focus:border-sky-500"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={onLoginClick}
                className="text-sky-600 hover:text-sky-700 hover:underline"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}