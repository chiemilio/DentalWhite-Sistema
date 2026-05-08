import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { ArrowLeft, Printer } from 'lucide-react';
import { toast } from 'sonner';
import type { Patient } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/da6a072baf78bdc68ca5368ac2123d8644ed8db8.png';

interface MedicalPrescriptionProps {
  patient: Patient;
  onBack: () => void;
}

interface PrescriptionData {
  prescriptionNumber: string;
  date: string;
  weight: string;
  bloodPressure: string;
  pulse: string;
  glucose: string;
  treatment: string;
}

export function MedicalPrescription({ patient, onBack }: MedicalPrescriptionProps) {
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData>({
    prescriptionNumber: `${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    date: new Date().toLocaleDateString('es-MX'),
    weight: '',
    bloodPressure: '',
    pulse: '',
    glucose: '',
    treatment: '',
  });

  const handlePrint = () => {
    window.print();
    toast.success('Receta lista para imprimir');
  };

  return (
    <div className="space-y-6">
      {/* Botones de control - No imprimir */}
      <div className="flex items-center justify-between print:hidden">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-sky-300 text-sky-600 hover:bg-sky-50"
        >
          <ArrowLeft className="mr-2" size={18} />
          Volver
        </Button>
        <Button onClick={handlePrint} className="bg-sky-500 hover:bg-sky-600">
          <Printer className="mr-2" size={18} />
          Imprimir Receta
        </Button>
      </div>

      {/* Formulario de captura - Solo visible en pantalla */}
      <Card className="border-sky-200 print:hidden">
        <CardContent className="pt-6 space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Peso</Label>
              <Input
                value={prescriptionData.weight}
                onChange={(e) =>
                  setPrescriptionData({ ...prescriptionData, weight: e.target.value })
                }
                placeholder="Ej: 70 kg"
                className="border-sky-200"
              />
            </div>
            <div className="space-y-2">
              <Label>TA (Tensión Arterial)</Label>
              <Input
                value={prescriptionData.bloodPressure}
                onChange={(e) =>
                  setPrescriptionData({ ...prescriptionData, bloodPressure: e.target.value })
                }
                placeholder="Ej: 120/80"
                className="border-sky-200"
              />
            </div>
            <div className="space-y-2">
              <Label>Pulso</Label>
              <Input
                value={prescriptionData.pulse}
                onChange={(e) =>
                  setPrescriptionData({ ...prescriptionData, pulse: e.target.value })
                }
                placeholder="Ej: 70 lpm"
                className="border-sky-200"
              />
            </div>
            <div className="space-y-2">
              <Label>Glucosa</Label>
              <Input
                value={prescriptionData.glucose}
                onChange={(e) =>
                  setPrescriptionData({ ...prescriptionData, glucose: e.target.value })
                }
                placeholder="Ej: 100 mg/dL"
                className="border-sky-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>TX (Tratamiento/Prescripción)</Label>
            <Textarea
              value={prescriptionData.treatment}
              onChange={(e) =>
                setPrescriptionData({ ...prescriptionData, treatment: e.target.value })
              }
              placeholder="Ingrese el tratamiento o medicamentos recetados..."
              className="border-sky-200 min-h-[200px]"
              rows={10}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vista previa en pantalla */}
      <Card className="border-sky-200 print:hidden">
        <CardContent className="p-8">
          {/* Header */}
          <div className="border-b-2 border-gray-800 pb-4 mb-6">
            <div className="flex items-start justify-between">
              {/* Información del Doctor */}
              <div className="flex items-center gap-4">
                <div className="w-24 h-20 border-2 border-gray-800 rounded-md flex items-center justify-center p-2">
                  <ImageWithFallback
                    src={logoImage}
                    alt="Logo del Doctor"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm">CD. Faustino Vázquez Rodríguez</p>
                  <p className="text-xs">Ced. Prof. 08708710</p>
                  <p className="text-xs">SSG. 4831</p>
                </div>
              </div>

              {/* Logo Dental White */}
              <div className="text-center">
                <p className="text-2xl font-bold text-sky-600">DENTAL</p>
                <p className="text-xs text-sky-600">WHITE</p>
              </div>

              {/* Número de receta */}
              <div className="text-right">
                <p className="text-xs">№</p>
                <p className="text-xl font-bold">{prescriptionData.prescriptionNumber}</p>
                <p className="text-sm font-bold">FAUSTINO VAZQUEZ</p>
                <p className="text-sm font-bold">ESTETICA DENTAL</p>
              </div>
            </div>
          </div>

          {/* Datos del Paciente */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <span className="text-sm">Nombre del paciente: </span>
                <span className="border-b border-gray-400 inline-block min-w-[300px] text-sm">
                  {patient.name}
                </span>
              </div>
              <div>
                <span className="text-sm">Fecha: </span>
                <span className="border-b border-gray-400 inline-block min-w-[100px] text-sm">
                  {prescriptionData.date}
                </span>
              </div>
              <div>
                <span className="text-sm">Peso: </span>
                <span className="border-b border-gray-400 inline-block min-w-[80px] text-sm">
                  {prescriptionData.weight}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm">TA: </span>
                <span className="border-b border-gray-400 inline-block min-w-[150px] text-sm">
                  {prescriptionData.bloodPressure}
                </span>
              </div>
              <div>
                <span className="text-sm">Pulso: </span>
                <span className="border-b border-gray-400 inline-block min-w-[150px] text-sm">
                  {prescriptionData.pulse}
                </span>
              </div>
              <div>
                <span className="text-sm">Glucosa: </span>
                <span className="border-b border-gray-400 inline-block min-w-[150px] text-sm">
                  {prescriptionData.glucose}
                </span>
              </div>
            </div>
          </div>

          {/* Área de Tratamiento */}
          <div className="relative min-h-[400px] mb-8">
            <p className="text-sm mb-2">TX:</p>
            
            {/* Marca de agua del diente */}
            <div className="absolute left-0 top-20 opacity-10 w-64 h-64">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <ellipse cx="100" cy="100" rx="80" ry="90" fill="#cbd5e1" />
                <path
                  d="M 60 80 Q 100 60 140 80 L 140 140 Q 100 160 60 140 Z"
                  fill="white"
                />
              </svg>
            </div>

            {/* Contenido del tratamiento */}
            <div className="relative z-10 whitespace-pre-wrap text-sm min-h-[300px] text-gray-700">
              {prescriptionData.treatment || '(El tratamiento aparecerá aquí)'}
            </div>

            {/* Línea de firma */}
            <div className="mt-12">
              <div className="border-t border-gray-400 w-64">
                <p className="text-xs mt-1">Firma:</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-sky-900 text-white p-3 -mx-8 -mb-8 flex justify-between items-center">
            <div className="text-xs">
              <span>Citas: ☎ 429 691 0928</span>
              <span className="ml-4">📱 429 130 9742</span>
            </div>
            <div className="text-xs">
              Alvaro Obregón #53 Centro Huanimaro, Guanajuato
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receta para imprimir - SOLO ESTO SE IMPRIME */}
      <div className="hidden print:block bg-white p-8">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          <div className="flex items-start justify-between">
            {/* Información del Doctor */}
            <div className="flex items-center gap-4">
              <div className="w-24 h-20 border-2 border-gray-800 rounded-md flex items-center justify-center p-2">
                <ImageWithFallback
                  src={logoImage}
                  alt="Logo del Doctor"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm">CD. Faustino Vázquez Rodríguez</p>
                <p className="text-xs">Ced. Prof. 08708710</p>
                <p className="text-xs">SSG. 4831</p>
              </div>
            </div>

            {/* Logo Dental White */}
            <div className="text-center">
              <p className="text-2xl font-bold text-sky-600">DENTAL</p>
              <p className="text-xs text-sky-600">WHITE</p>
            </div>

            {/* Número de receta */}
            <div className="text-right">
              <p className="text-xs">№</p>
              <p className="text-xl font-bold">{prescriptionData.prescriptionNumber}</p>
              <p className="text-sm font-bold">FAUSTINO VAZQUEZ</p>
              <p className="text-sm font-bold">ESTETICA DENTAL</p>
            </div>
          </div>
        </div>

        {/* Datos del Paciente */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <span className="text-sm">Nombre del paciente: </span>
              <span className="border-b border-gray-400 inline-block min-w-[300px] text-sm">
                {patient.name}
              </span>
            </div>
            <div>
              <span className="text-sm">Fecha: </span>
              <span className="border-b border-gray-400 inline-block min-w-[100px] text-sm">
                {prescriptionData.date}
              </span>
            </div>
            <div>
              <span className="text-sm">Peso: </span>
              <span className="border-b border-gray-400 inline-block min-w-[80px] text-sm">
                {prescriptionData.weight}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm">TA: </span>
              <span className="border-b border-gray-400 inline-block min-w-[150px] text-sm">
                {prescriptionData.bloodPressure}
              </span>
            </div>
            <div>
              <span className="text-sm">Pulso: </span>
              <span className="border-b border-gray-400 inline-block min-w-[150px] text-sm">
                {prescriptionData.pulse}
              </span>
            </div>
            <div>
              <span className="text-sm">Glucosa: </span>
              <span className="border-b border-gray-400 inline-block min-w-[150px] text-sm">
                {prescriptionData.glucose}
              </span>
            </div>
          </div>
        </div>

        {/* Área de Tratamiento */}
        <div className="relative min-h-[400px] mb-8">
          <p className="text-sm mb-2">TX:</p>
          
          {/* Marca de agua del diente */}
          <div className="absolute left-0 top-20 opacity-10 w-64 h-64">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <ellipse cx="100" cy="100" rx="80" ry="90" fill="#cbd5e1" />
              <path
                d="M 60 80 Q 100 60 140 80 L 140 140 Q 100 160 60 140 Z"
                fill="white"
              />
            </svg>
          </div>

          {/* Contenido del tratamiento */}
          <div className="relative z-10 whitespace-pre-wrap text-sm min-h-[300px]">
            {prescriptionData.treatment}
          </div>

          {/* Línea de firma */}
          <div className="mt-12">
            <div className="border-t border-gray-400 w-64">
              <p className="text-xs mt-1">Firma:</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-sky-900 text-white p-3 flex justify-between items-center -mx-8 -mb-8">
          <div className="text-xs">
            <span>Citas: ☎ 429 691 0928</span>
            <span className="ml-4">📱 429 130 9742</span>
          </div>
          <div className="text-xs">
            Alvaro Obregón #53 Centro Huanimaro, Guanajuato
          </div>
        </div>
      </div>
    </div>
  );
}