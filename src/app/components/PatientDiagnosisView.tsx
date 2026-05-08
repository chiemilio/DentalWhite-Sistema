import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { ArrowLeft, Save, Printer, FileText } from 'lucide-react';
import { toast } from 'sonner';
import type { Patient, Appointment } from '../data/mockData';
import { MedicalPrescription } from './MedicalPrescription';

interface PatientDiagnosisViewProps {
  patient: Patient;
  appointment: Appointment;
  onBack: () => void;
}

interface DiagnosisData {
  consultReason: string;
  recognition: string;
  diagnosis: string;
  treatment: string;
}

export function PatientDiagnosisView({ patient, appointment, onBack }: PatientDiagnosisViewProps) {
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData>({
    consultReason: '',
    recognition: '',
    diagnosis: '',
    treatment: '',
  });
  const [showPrescription, setShowPrescription] = useState(false);

  const handleSave = () => {
    if (!diagnosisData.consultReason || !diagnosisData.diagnosis || !diagnosisData.treatment) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    // Aquí se guardaría la información del diagnóstico
    toast.success('Diagnóstico guardado exitosamente');
    console.log('Diagnosis saved:', diagnosisData);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePrescription = () => {
    if (!diagnosisData.treatment) {
      toast.error('Debes ingresar un tratamiento antes de generar la receta');
      return;
    }
    setShowPrescription(true);
  };

  // Si está mostrando la receta
  if (showPrescription) {
    return (
      <MedicalPrescription
        patient={patient}
        onBack={() => setShowPrescription(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button - No imprimir */}
      <div className="flex items-center justify-between print:hidden">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-sky-300 text-sky-600 hover:bg-sky-50"
        >
          <ArrowLeft className="mr-2" size={18} />
          Volver a Citas
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="border-sky-300 text-sky-600 hover:bg-sky-50"
          >
            <Printer className="mr-2" size={18} />
            Imprimir
          </Button>
          <Button onClick={handleSave} className="bg-sky-500 hover:bg-sky-600">
            <Save className="mr-2" size={18} />
            Guardar Diagnóstico
          </Button>
          <Button
            onClick={handleGeneratePrescription}
            className="bg-sky-500 hover:bg-sky-600"
          >
            <FileText className="mr-2" size={18} />
            Generar Receta
          </Button>
        </div>
      </div>

      {/* Patient Information Card */}
      <Card className="border-sky-200">
        <CardHeader className="bg-sky-50">
          <CardTitle className="text-sky-600">Datos del Paciente</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label className="text-gray-600">Nombre Completo</Label>
              <p className="font-semibold text-lg">{patient.name}</p>
            </div>
            <div>
              <Label className="text-gray-600">Edad</Label>
              <p className="font-semibold text-lg">{patient.age} años</p>
            </div>
            <div>
              <Label className="text-gray-600">Sexo</Label>
              <p className="font-semibold text-lg">{patient.sex}</p>
            </div>
            <div>
              <Label className="text-gray-600">Teléfono</Label>
              <p className="font-semibold text-lg">{patient.phone}</p>
            </div>
            <div>
              <Label className="text-gray-600">Email</Label>
              <p className="font-semibold text-lg">{patient.email}</p>
            </div>
            <div>
              <Label className="text-gray-600">Dirección</Label>
              <p className="font-semibold text-lg">{patient.address}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-4 pt-4 border-t">
            <div>
              <Label className="text-gray-600">Servicio</Label>
              <p className="font-semibold text-lg text-sky-600">{appointment.serviceName}</p>
            </div>
            <div>
              <Label className="text-gray-600">Fecha de Cita</Label>
              <p className="font-semibold text-lg">
                {new Date(appointment.date).toLocaleDateString('es-MX')}
              </p>
            </div>
            <div>
              <Label className="text-gray-600">Hora</Label>
              <p className="font-semibold text-lg">{appointment.time}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis Form */}
      <Card className="border-sky-200">
        <CardHeader className="bg-sky-50">
          <CardTitle className="text-sky-600">Atención Médica</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Motivo de la Consulta */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Motivo de la Consulta: <span className="text-red-500">*</span>
            </Label>
            <Input
              value={diagnosisData.consultReason}
              onChange={(e) =>
                setDiagnosisData({ ...diagnosisData, consultReason: e.target.value })
              }
              placeholder="Ingrese el motivo de la consulta"
              className="border-sky-200 h-12"
            />
          </div>

          {/* Reconocimiento */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Reconocimiento:</Label>
            <Textarea
              value={diagnosisData.recognition}
              onChange={(e) =>
                setDiagnosisData({ ...diagnosisData, recognition: e.target.value })
              }
              placeholder="Ingrese los hallazgos del reconocimiento médico"
              className="border-sky-200 min-h-[120px] resize-y"
              rows={5}
            />
          </div>

          {/* Diagnóstico */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Diagnóstico: <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={diagnosisData.diagnosis}
              onChange={(e) =>
                setDiagnosisData({ ...diagnosisData, diagnosis: e.target.value })
              }
              placeholder="Ingrese el diagnóstico del paciente"
              className="border-sky-200 min-h-[140px] resize-y"
              rows={6}
            />
          </div>

          {/* Tratamiento */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Tratamiento: <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={diagnosisData.treatment}
              onChange={(e) =>
                setDiagnosisData({ ...diagnosisData, treatment: e.target.value })
              }
              placeholder="Ingrese el tratamiento a seguir"
              className="border-sky-200 min-h-[140px] resize-y"
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button at Bottom - No imprimir */}
      <div className="flex justify-end print:hidden">
        <Button
          onClick={handleSave}
          className="bg-sky-500 hover:bg-sky-600 px-8"
          size="lg"
        >
          <Save className="mr-2" size={20} />
          Guardar Diagnóstico
        </Button>
      </div>
    </div>
  );
}