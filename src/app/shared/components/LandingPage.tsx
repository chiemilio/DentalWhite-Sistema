import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Calendar, Users, Shield, Phone, Mail, MapPin, MessageCircle, Play, Image as ImageIcon, Globe } from 'lucide-react';
import { services } from '../data/mockData';
import logoImage from 'figma:asset/da6a072baf78bdc68ca5368ac2123d8644ed8db8.png';
import doctorImage from 'figma:asset/7fc5ebdb2d35bffb567c0b8e0cfaa57931319cdb.png';
import promoImage from 'figma:asset/6d65dfbab9e3b3e5a0f0c7e8e8f9d1959319b4ca.png';
import { SimpleCaptcha } from '../../modules/auth/components/SimpleCaptcha';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '../ui/dialog';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function LandingPage({ onLoginClick, onRegisterClick }: LandingPageProps) {
  // Imágenes del carrusel - AHORA CON SERVICIOS DENTALES
  const carouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1598256989809-394fa4f6cd26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBvcnRob2RvbnRpY3MlMjB0cmVhdG1lbnR8ZW58MXx8fHwxNzczMzc1NjUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Ortodoncia Especializada',
      description: 'Tratamientos de ortodoncia con tecnología de vanguardia',
    },
    {
      url: 'https://images.unsplash.com/photo-1588776814601-a454a8e3a940?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBjbGVhbmluZyUyMHByb2NlZHVyZXxlbnwxfHx8fDE3NzMzNzU2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Limpieza Dental Profesional',
      description: 'Cuidado preventivo para mantener tu sonrisa saludable',
    },
    {
      url: 'https://images.unsplash.com/photo-1643216503879-b2c604ce6cf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBpbXBsYW50JTIwc3VyZ2VyeXxlbnwxfHx8fDE3NzMzNjIyOTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Implantes Dentales',
      description: 'Soluciones permanentes con implantes de última generación',
    },
    {
      url: 'https://images.unsplash.com/photo-1657313611708-17639e445455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWV0aCUyMHdoaXRlbmluZyUyMGRlbnRhbHxlbnwxfHx8fDE3NzMzNzU2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Blanqueamiento Dental',
      description: 'Recupera el brillo natural de tu sonrisa',
    },
    {
      url: 'https://images.unsplash.com/photo-1606142979064-349704d230e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBzbWlsZSUyMGRlc2lnbnxlbnwxfHx8fDE3NzMzNzU2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Diseño de Sonrisa',
      description: 'Transforma tu sonrisa con nuestros expertos',
    },
  ];

  // Galería de servicios
  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1643660527072-9c702932f606?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBjbGluaWMlMjBtb2Rlcm4lMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzczMzI0MzA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Equipamiento Moderno',
      category: 'Instalaciones',
    },
    {
      url: 'https://images.unsplash.com/photo-1598256989809-394fa4f6cd26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBvcnRob2RvbnRpY3MlMjB0cmVhdG1lbnR8ZW58MXx8fHwxNzczMzc1NjUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Tratamiento de Ortodoncia',
      category: 'Servicios',
    },
    {
      url: 'https://images.unsplash.com/photo-1643660527190-4f401370f788?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBlbmRvZG9udGljcyUyMHRyZWF0bWVudHxlbnwxfHx8fDE3NzMzNzU2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Endodoncia Especializada',
      category: 'Servicios',
    },
    {
      url: 'https://images.unsplash.com/photo-1662837625421-1f9f79491cf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBwcm9zdGhvZG9udGljcyUyMGNyb3dufGVufDF8fHx8MTc3MzM3NTY1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Coronas y Prótesis',
      category: 'Servicios',
    },
    {
      url: 'https://images.unsplash.com/photo-1565090567208-c8038cfcf6cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBoeWdpZW5pc3QlMjB3b3JraW5nfGVufDF8fHx8MTc3MzM3MzYwNHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Atención Profesional',
      category: 'Equipo',
    },
    {
      url: 'https://images.unsplash.com/photo-1758205307836-0829c799890b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWRpYXRyaWMlMjBkZW50aXN0cnklMjBjaGlsZHJlbnxlbnwxfHx8fDE3NzMzNzU2NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Odontopediatría',
      category: 'Servicios',
    },
    {
      url: 'https://images.unsplash.com/photo-1619691249147-c5689d88016b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjB4LXJheSUyMGltYWdpbmd8ZW58MXx8fHwxNzczMzc1NjU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Diagnóstico por Imagen',
      category: 'Tecnología',
    },
    {
      url: 'https://images.unsplash.com/photo-1588776814601-a454a8e3a940?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBjbGVhbmluZyUyMHByb2NlZHVyZXxlbnwxfHx8fDE3NzMzNzU2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Profilaxis Dental',
      category: 'Servicios',
    },
    {
      url: 'https://images.unsplash.com/photo-1606142979064-349704d230e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBzbWlsZSUyMGRlc2lnbnxlbnwxfHx8fDE3NzMzNzU2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Estética Dental',
      category: 'Servicios',
    },
  ];

  // Videos de ejemplo (URLs de YouTube embebibles)
  const galleryVideos = [
    {
      id: 'video1',
      title: 'Proceso de Limpieza Dental',
      thumbnail: 'https://images.unsplash.com/photo-1588776814601-a454a8e3a940?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBjbGVhbmluZyUyMHByb2NlZHVyZXxlbnwxfHx8fDE3NzMzNzU2NTF8MA&ixlib=rb-4.1.0&q=80&w=400',
      description: 'Video educativo sobre el procedimiento de limpieza',
    },
    {
      id: 'video2',
      title: 'Colocación de Implantes',
      thumbnail: 'https://images.unsplash.com/photo-1643216503879-b2c604ce6cf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBpbXBsYW50JTIwc3VyZ2VyeXxlbnwxfHx8fDE3NzMzNjIyOTd8MA&ixlib=rb-4.1.0&q=80&w=400',
      description: 'Procedimiento completo de implantes dentales',
    },
    {
      id: 'video3',
      title: 'Blanqueamiento Dental',
      thumbnail: 'https://images.unsplash.com/photo-1657313611708-17639e445455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWV0aCUyMHdoaXRlbmluZyUyMGRlbnRhbHxlbnwxfHx8fDE3NzMzNzU2NTJ8MA&ixlib=rb-4.1.0&q=80&w=400',
      description: 'Proceso de blanqueamiento profesional',
    },
  ];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    
    if (!isCaptchaValid) {
      toast.error('Por favor completa el captcha correctamente');
      return;
    }
    
    toast.success('Mensaje enviado exitosamente. Te contactaremos pronto.');
    setName('');
    setEmail('');
    setMessage('');
    setIsCaptchaValid(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header - LOGO Y NOMBRE MÁS GRANDES */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          {/* Logo y nombre agrandados */}
          <div className="flex items-center gap-4">
            <ImageWithFallback
              src={logoImage}
              alt="Dental White Logo"
              className="w-24 h-20 object-contain"
            />
            <h1 className="text-4xl text-sky-600">Dental White</h1>
          </div>
          
          {/* Navegación con Galería */}
          <nav className="hidden md:flex gap-6 items-center">
            <a href="#servicios" className="text-gray-700 hover:text-sky-600 transition text-lg">
              Servicios
            </a>
            <a href="#promociones" className="text-gray-700 hover:text-sky-600 transition text-lg">
              Promociones
            </a>
            <a href="#nosotros" className="text-gray-700 hover:text-sky-600 transition text-lg">
              Nosotros
            </a>
            <a href="#galeria" className="text-gray-700 hover:text-sky-600 transition text-lg">
              Galería
            </a>
            <a href="#contacto" className="text-gray-700 hover:text-sky-600 transition text-lg">
              Contacto
            </a>
          </nav>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onLoginClick} className="border-sky-500 text-sky-600 hover:bg-sky-50">
              Iniciar Sesión
            </Button>
            <Button onClick={onRegisterClick} className="bg-sky-500 hover:bg-sky-600">
              Registrarse
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Carousel */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <Carousel className="w-full">
          <CarouselContent>
            {carouselImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[500px] rounded-2xl overflow-hidden">
                  <ImageWithFallback
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col items-center justify-end pb-16 text-white">
                    <h2 className="text-4xl md:text-5xl mb-4">{image.title}</h2>
                    <p className="text-xl">{image.description}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-sky-200">
            <CardHeader>
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-2">
                <Calendar className="text-sky-600" size={24} />
              </div>
              <CardTitle className="text-sky-600 text-xl">Agenda en Línea</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Programa tus citas de manera rápida y sencilla las 24 horas del día
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-sky-200">
            <CardHeader>
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-2">
                <Users className="text-sky-600" size={24} />
              </div>
              <CardTitle className="text-sky-600 text-xl">Expertos Certificados</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Nuestro equipo está altamente capacitado en las últimas técnicas dentales
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-sky-200">
            <CardHeader>
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-2">
                <Shield className="text-sky-600" size={24} />
              </div>
              <CardTitle className="text-sky-600 text-xl">Seguridad Total</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Protocolos de higiene y esterilización certificados
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-sky-200">
            <CardHeader>
              <div className="w-16 h-16 bg-sky-100 rounded-lg flex items-center justify-center mb-2 p-2">
                <ImageWithFallback
                  src={logoImage}
                  alt="Dental White Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <CardTitle className="text-sky-600 text-xl">Tecnología Avanzada</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Equipos de última generación para diagnósticos precisos
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Nosotros Section */}
      <section id="nosotros" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl text-sky-600 mb-4">Nosotros</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conoce nuestra misión, visión y al equipo que cuida de tu sonrisa
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-sky-200">
              <CardHeader>
                <CardTitle className="text-sky-600 text-2xl">Misión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Brindar atención odontológica para nuestros pacientes con un trato más cercano, honesto y respetuoso, ofreciendo soluciones mediante el uso de tecnología, procesos seguros y equipo capacitado, enfocados en la prevención de la salud bucal.
                </p>
              </CardContent>
            </Card>

            <Card className="border-sky-200">
              <CardHeader>
                <CardTitle className="text-sky-600 text-2xl">Visión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Ser un consultorio dental reconocido por su profesionalismo, atención empática, actualización constante y compromiso para mejorar la calidad de vida de nuestros pacientes. Ser competentes dentro del área de salud.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-sky-200 bg-gradient-to-br from-sky-50 to-white">
            <CardHeader>
              <CardTitle className="text-sky-600 text-2xl text-center mb-4">
                Conoce a tu especialista
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center">
                  <div className="relative w-1/2">
                    <ImageWithFallback
                      src={doctorImage}
                      alt="Dr. Faustino Vázquez Rodríguez"
                      className="rounded-2xl shadow-lg w-full h-auto object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl text-sky-600">Dr. Faustino Vázquez Rodríguez</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Es cirujano dentista egresado de la Universidad Michoacana de San Nicolás de Hidalgo (UMSNH).
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Cuenta con especialidad de ortodoncia, 3 diplomados en implantología, rehabilitación sobre prótesis, con maestría en periodoncia con implantes de la Universidad Francisco de Victoria, Madrid, España.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Se caracteriza por su profesionalismo, ética y trato respetuoso hacia cada paciente, priorizando siempre la tranquilidad y comodidad durante cada consulta, de esa forma logrando el objetivo de que cada persona se vaya del consultorio no sólo con una mejor sonrisa si no con una experiencia positiva y de confianza.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Promociones Section */}
      <section id="promociones" className="bg-gradient-to-br from-blue-900 to-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl text-white mb-4">Promociones</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Aprovecha nuestras ofertas especiales
            </p>
          </div>

          <div className="flex justify-center">
            <div className="max-w-3xl w-full">
              <ImageWithFallback
                src={promoImage}
                alt="Promoción por apertura - Todo el mes de enero"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services - REDISEÑADO */}
      <section id="servicios" className="bg-sky-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl text-sky-600 mb-4">Nuestras Sucursales y Servicios</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Contamos con 3 sucursales, cada una especializada en diferentes tratamientos
            </p>
            <p className="text-sm text-gray-500 mt-2">
              *Los precios se informarán al momento de agendar la cita
            </p>
          </div>

          {/* Grid de Sucursales */}
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Sucursal Pénjamo */}
            <Card className="border-2 border-sky-300 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              {/* Imagen de la sucursal */}
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1764004450351-37fb72cb8e8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZW50YWwlMjBjbGluaWMlMjBleHRlcmlvcnxlbnwxfHx8fDE3NzMzNzE4MTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Sucursal Pénjamo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/80 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl mb-2">Sucursal Pénjamo</h3>
                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      Calle primero de mayo #9, Pénjamo Gto
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista de servicios */}
              <CardContent className="pt-6">
                <h4 className="text-sky-600 text-lg mb-4">Servicios disponibles:</h4>
                <ul className="space-y-2 mb-6">
                  {services.filter(s => s.branch === 'Pénjamo').map((service) => (
                    <li key={service.id} className="flex items-start gap-2">
                      <span className="text-sky-500 mt-1">✓</span>
                      <span className="text-gray-700">{service.name}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={onRegisterClick} 
                  className="w-full bg-sky-500 hover:bg-sky-600 text-base py-6"
                >
                  Agendar Cita en Pénjamo
                </Button>
              </CardContent>
            </Card>

            {/* Sucursal Valle de Santiago */}
            <Card className="border-2 border-blue-300 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              {/* Imagen de la sucursal */}
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1762625570087-6d98fca29531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBjbGluaWMlMjByZWNlcHRpb24lMjBhcmVhfGVufDF8fHx8MTc3MzM3NTg2M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Sucursal Valle de Santiago"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl mb-2">Sucursal Valle de Santiago</h3>
                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      Centro, Valle de Santiago Gto
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista de servicios */}
              <CardContent className="pt-6">
                <h4 className="text-blue-600 text-lg mb-4">Servicios disponibles:</h4>
                <ul className="space-y-2 mb-6">
                  {services.filter(s => s.branch === 'Valle de Santiago').map((service) => (
                    <li key={service.id} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <span className="text-gray-700">{service.name}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={onRegisterClick} 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-base py-6"
                >
                  Agendar Cita en Valle de Santiago
                </Button>
              </CardContent>
            </Card>

            {/* Sucursal Abasolo */}
            <Card className="border-2 border-cyan-300 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              {/* Imagen de la sucursal */}
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1704455306251-b4634215d98f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzMzNzU4NjN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Sucursal Abasolo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl mb-2">Sucursal Abasolo</h3>
                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      Centro, Abasolo Gto
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista de servicios */}
              <CardContent className="pt-6">
                <h4 className="text-cyan-600 text-lg mb-4">Servicios disponibles:</h4>
                <ul className="space-y-2 mb-6">
                  {services.filter(s => s.branch === 'Abasolo').map((service) => (
                    <li key={service.id} className="flex items-start gap-2">
                      <span className="text-cyan-500 mt-1">✓</span>
                      <span className="text-gray-700">{service.name}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={onRegisterClick} 
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-base py-6"
                >
                  Agendar Cita en Abasolo
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* GALERÍA - NUEVA SECCIÓN */}
      <section id="galeria" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl text-sky-600 mb-4">Galería</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conoce nuestras instalaciones, servicios y los resultados de nuestro trabajo
            </p>
          </div>

          {/* Tabs de Fotografías y Videos */}
          <div className="mb-8">
            <div className="flex justify-center gap-4 mb-8">
              <Button 
                variant="outline" 
                className="border-sky-500 text-sky-600 hover:bg-sky-50"
              >
                <ImageIcon className="mr-2" size={20} />
                Fotografías
              </Button>
              <Button 
                variant="outline" 
                className="border-sky-500 text-sky-600 hover:bg-sky-50"
              >
                <Play className="mr-2" size={20} />
                Videos
              </Button>
            </div>
          </div>

          {/* Grid de Fotografías */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {galleryImages.map((item, index) => (
              <Card 
                key={index} 
                className="border-sky-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedImage(item.url)}
              >
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white">
                      <p className="text-sm opacity-80">{item.category}</p>
                      <h3 className="text-lg">{item.title}</h3>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Videos */}
          <div className="mt-12">
            <h3 className="text-2xl text-sky-600 mb-6 text-center">Videos Educativos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryVideos.map((video) => (
                <Card key={video.id} className="border-sky-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48 bg-gray-100 flex items-center justify-center group cursor-pointer">
                    <ImageWithFallback
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="text-sky-600 ml-1" size={32} />
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-sky-600 text-lg">{video.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{video.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Nota informativa */}
          <div className="mt-12 text-center">
            <Card className="border-sky-200 bg-sky-50 max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <p className="text-gray-700">
                  <span className="text-sky-600">📸</span> ¿Quieres ver más? Síguenos en nuestras redes sociales para conocer casos de éxito, testimoniales y las últimas novedades de Dental White.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modal para ver imagen en grande */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div className="relative">
              <ImageWithFallback
                src={selectedImage}
                alt="Imagen de galería"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact */}
      <section id="contacto" className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-sky-600 mb-4">Contáctanos</h2>
          <p className="text-gray-600">Estamos aquí para ayudarte</p>
        </div>

        {/* Grid de 5 columnas */}
        <div className="grid md:grid-cols-5 gap-6">
          <Card className="border-sky-200">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="text-sky-600" size={24} />
              </div>
              <CardTitle className="text-sky-600">Teléfono</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700">55 1234 5678</p>
              <p className="text-gray-700">55 8765 4321</p>
            </CardContent>
          </Card>

          <Card className="border-sky-200">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-green-600" size={24} />
              </div>
              <CardTitle className="text-sky-600">WhatsApp</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <a 
                href="https://wa.me/5214291309742" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 hover:underline"
              >
                +52 1 429 130 9742
              </a>
            </CardContent>
          </Card>

          <Card className="border-sky-200">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="text-sky-600" size={24} />
              </div>
              <CardTitle className="text-sky-600">Email</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700">contacto@dentalwhite.com</p>
              <p className="text-gray-700">citas@dentalwhite.com</p>
            </CardContent>
          </Card>

          <Card className="border-sky-200">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-sky-600" size={24} />
              </div>
              <CardTitle className="text-sky-600">Ubicación</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700">Calle primero de mayo #9</p>
              <p className="text-gray-700">Pénjamo Gto</p>
            </CardContent>
          </Card>

          {/* Nueva tarjeta de Sitio Web */}
          <Card className="border-sky-200">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="text-blue-600" size={24} />
              </div>
              <CardTitle className="text-sky-600">Sitio Web</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <a 
                href="https://www.facebook.com/profile.php?id=61571549779328" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                Dental White
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <Card className="border-sky-200">
            <CardHeader>
              <CardTitle className="text-2xl text-sky-600">Escríbenos un mensaje</CardTitle>
              <CardDescription>Completa el formulario y nos pondremos en contacto contigo</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="border-sky-200"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-sky-200"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje *</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="border-sky-200 min-h-32"
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                  />
                </div>
                <SimpleCaptcha
                  isCaptchaValid={isCaptchaValid}
                  setIsCaptchaValid={setIsCaptchaValid}
                />
                <div className="pt-2">
                  <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-lg py-6">
                    Enviar Mensaje
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sky-600 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ImageWithFallback
              src={logoImage}
              alt="Dental White Logo"
              className="w-10 h-8 object-contain"
            />
            <span className="text-xl">Dental White</span>
          </div>
          <p className="text-sky-100">© 2026 Dental White. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}