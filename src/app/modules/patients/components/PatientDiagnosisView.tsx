import { useState, useEffect, useRef } from 'react';
import { Button } from '../../../shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Input } from '../../../shared/ui/input';
import { Label } from '../../../shared/ui/label';
import { Textarea } from '../../../shared/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/ui/tabs';
import { ArrowLeft, Printer, Pill, Plus, X, Save, FileText, Camera, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient, type BackendPatient } from '../../../shared/utils/api';
import { MedicalPrescription } from '../../medical-records/components/MedicalPrescription';

interface PhotoData {
  id: number;
  consulta_id: number;
  tipo_foto: string;
  url_foto: string;
  descripcion?: string;
  fecha_creacion?: string;
}

interface PatientDiagnosisViewProps {
  patient: Patient;
  appointment: Appointment;
  citaId: number;
  onBack: () => void;
}

interface DiagnosisData {
  consultReason: string;
  recognition: string;
  diagnosis: string;
  treatment: string;
}

export function PatientDiagnosisView({ patient, appointment, citaId, onBack }: PatientDiagnosisViewProps) {
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData>({
    consultReason: '',
    recognition: '',
    diagnosis: '',
    treatment: '',
  });
  const [showPrescription, setShowPrescription] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [diagnosisSaved, setDiagnosisSaved] = useState(false);
  const [consultationId, setConsultationId] = useState<number | null>(null);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPhotos = async () => {
    if (!consultationId) return;
    try {
      const data = await apiClient.get<PhotoData[]>(`/consultations/${consultationId}/photos/`, true);
      setPhotos(Array.isArray(data) ? data : []);
    } catch { /* silently fail */ }
  };

  useEffect(() => {
    if (consultationId) loadPhotos();
  }, [consultationId]);

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !consultationId) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tipo_foto', 'ANTES');
      await fetch(`/api/v1/consultations/${consultationId}/photos/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('dental_white_token')}` },
        body: formData,
      });
      toast.success('Foto subida correctamente');
      loadPhotos();
    } catch (err: any) {
      toast.error('Error al subir foto: ' + (err.message || ''));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!consultationId) return;
    try {
      await apiClient.delete(`/consultations/${consultationId}/photos/${photoId}`, true);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      toast.success('Foto eliminada');
    } catch {
      toast.error('Error al eliminar foto');
    }
  };

  const getFotoTypeLabel = (tipo: string) => {
    const map: Record<string, string> = { ANTES: 'Antes', DURANTE: 'Durante', DESPUES: 'Después' };
    return map[tipo] || tipo;
  };

  const handleSave = async () => {
    if (!diagnosisData.consultReason || !diagnosisData.diagnosis || !diagnosisData.treatment) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    setIsSaving(true);
    console.log('DEBUG: Guardando consulta con datos:', {
        cita_id: citaId,
        notas_adicionales: diagnosisData.consultReason,
        reconocimiento_hallazgos: diagnosisData.recognition || null,
        diagnostico: diagnosisData.diagnosis,
        tratamiento_indicaciones: diagnosisData.treatment,
      });
    try {
      const response = await apiClient.post<{id: number}>('/consultations/', {
        cita_id: citaId,
        notas_adicionales: diagnosisData.consultReason,
        reconocimiento_hallazgos: diagnosisData.recognition || null,
        diagnostico: diagnosisData.diagnosis,
        tratamiento_indicaciones: diagnosisData.treatment,
      }, true);
      console.log('DEBUG: Consulta guardada respuesta:', response);
      setConsultationId(response.id);
      await apiClient.put(`/appointments/${citaId}`, { estado_cita_id: 4 });
      setDiagnosisSaved(true);
      toast.success('Diagnóstico guardado exitosamente');
    } catch (error: unknown) {
      console.error('Error saving consultation:', error);
      let errorMessage = 'Error al guardar el diagnóstico';
      
      // Verificar si es un Error con message
      if (error && typeof error === 'object' && 'message' in error) {
        const msg = String((error as {message: unknown}).message);
        
        // Si ya existe la consulta, marcar como guardada
        if (msg.toLowerCase().includes('ya existe')) {
          setDiagnosisSaved(true);
          // Obtener la consulta existente para tener el ID
          try {
            const existingConsultation = await apiClient.get<any[]>(`/consultations/?cita_id=${citaId}`, true);
            if (existingConsultation && existingConsultation.length > 0) {
              setConsultationId(existingConsultation[0].id);
            }
          } catch {}
          toast.success('Ya existe un diagnóstico guardado para esta cita');
        } else {
          toast.error(msg);
        }
        setIsSaving(false);
        return;
      }
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePrescription = () => {
    // Verificar si ya se guardó el diagnóstico primero
    if (!diagnosisSaved) {
      toast.error('Primero debes guardar el diagnóstico antes de generar la receta');
      return;
    }
    // Verificar que tenga tratamiento
    if (!diagnosisData.treatment) {
      toast.error('Debes ingresar un tratamiento antes de generar la receta');
      return;
    }
    // Verificar que tenga diagnóstico
    if (!diagnosisData.diagnosis) {
      toast.error('Debes ingresar un diagnóstico antes de generar la receta');
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
        consultaId={consultationId || undefined}
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
          <Button onClick={handleSave} className="bg-sky-500 hover:bg-sky-600" disabled={isSaving}>
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

      <Card className="border-sky-200">
        <CardHeader className="bg-sky-50">
          <CardTitle className="text-sky-600">Atención Médica</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="diagnosis">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="diagnosis">Diagnóstico</TabsTrigger>
              <TabsTrigger value="photos" disabled={!consultationId}>
                <Camera className="mr-1" size={14} /> Fotos {photos.length > 0 && `(${photos.length})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="diagnosis" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Motivo de la Consulta: <span className="text-red-500">*</span></Label>
                <Input value={diagnosisData.consultReason} onChange={(e) => setDiagnosisData({...diagnosisData, consultReason: e.target.value})} placeholder="Ingrese el motivo de la consulta" className="border-sky-200 h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-base font-semibold">Reconocimiento:</Label>
                <Textarea value={diagnosisData.recognition} onChange={(e) => setDiagnosisData({...diagnosisData, recognition: e.target.value})} placeholder="Ingrese los hallazgos del reconocimiento médico" className="border-sky-200 min-h-[120px] resize-y" rows={5} />
              </div>
              <div className="space-y-2">
                <Label className="text-base font-semibold">Diagnóstico: <span className="text-red-500">*</span></Label>
                <Textarea value={diagnosisData.diagnosis} onChange={(e) => setDiagnosisData({...diagnosisData, diagnosis: e.target.value})} placeholder="Ingrese el diagnóstico del paciente" className="border-sky-200 min-h-[140px] resize-y" rows={6} />
              </div>
              <div className="space-y-2">
                <Label className="text-base font-semibold">Tratamiento: <span className="text-red-500">*</span></Label>
                <Textarea value={diagnosisData.treatment} onChange={(e) => setDiagnosisData({...diagnosisData, treatment: e.target.value})} placeholder="Ingrese el tratamiento a seguir" className="border-sky-200 min-h-[140px] resize-y" rows={6} />
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={handleSave} className="bg-sky-500 hover:bg-sky-600 px-8" size="lg" disabled={isSaving}>
                  <Save className="mr-2" size={20} /> Guardar Diagnóstico
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="photos" className="space-y-4 pt-4">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadPhoto}
                />
                <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-sky-500 hover:bg-sky-600">
                  <Camera className="mr-2" size={16} /> {uploading ? 'Subiendo...' : 'Subir Foto'}
                </Button>
              </div>

              {photos.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay fotos para esta consulta.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group border border-sky-200 rounded-lg overflow-hidden">
                      <img src={photo.url_foto} alt={photo.descripcion || 'Foto'} className="w-full h-40 object-cover" />
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                        {getFotoTypeLabel(photo.tipo_foto)}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button variant="destructive" size="icon" onClick={() => handleDeletePhoto(photo.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      {photo.descripcion && (
                        <div className="p-2 text-xs text-gray-600 truncate">{photo.descripcion}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}