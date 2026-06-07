import { useState, useEffect } from 'react';
import logoImage from 'figma:asset/da6a072baf78bdc68ca5368ac2123d8644ed8db8.png';
import { Patient } from '../../../shared/data/mockData';

interface ClinicalHistoryFormProps {
  patient: Patient;
  doctorName: string;
  onDataChange?: (data: ClinicalHistoryData) => void;
  initialData?: Partial<ClinicalHistoryData>;
}

export interface ClinicalHistoryData {
  dni: string;
  representante: string;
  ocupacion: string;
  nombre_doctor: string;
  estado_fisico: string;
  estado_dental: string;
  atencion_medica: string;
  forma: string;
  simetria: string;
  perfil: string;
  frente: string;
  orejas: string;
  tic: string;
  rictus: string;
  linea_bipupilar: string;
  musculatura_labial: string;
  hiperactividad_mentoniana: string;
  relacion_molar: string;
  relacion_canina: string;
  relacion_incisal: string;
  over_jet: string;
  over_bite: string;
  mordida_abierta: string;
  linea_media: string;
  dientes_ausentes: string;
  dientes_malformados: string;
  dientes_con_caries: string;
  temporales: string;
  mordida_cruzada: string;
  tecnica_cepillado: string;
  estado_parodontal: string;
  cefalografia: string;
  ortoradiales: string;
  palmar: string;
  oclusal: string;
  oblicua: string;
  ortopantografias: string;
  mesioradial: string;
  ausencia_congenita: string;
  supernumerarios: string;
  quistes: string;
  lesiones_periapicales: string;
  inclusiones: string;
  resorcion_radicular: string;
  terceros_molares: string;
  raices_enanas: string;
  raices_anormales: string;
}

const defaultData: ClinicalHistoryData = {
  dni: '',
  representante: '',
  ocupacion: '',
  nombre_doctor: '',
  estado_fisico: '',
  estado_dental: '',
  atencion_medica: '',
  forma: '',
  simetria: '',
  perfil: '',
  frente: '',
  orejas: '',
  tic: '',
  rictus: '',
  linea_bipupilar: '',
  musculatura_labial: '',
  hiperactividad_mentoniana: '',
  relacion_molar: '',
  relacion_canina: '',
  relacion_incisal: '',
  over_jet: '',
  over_bite: '',
  mordida_abierta: '',
  linea_media: '',
  dientes_ausentes: '',
  dientes_malformados: '',
  dientes_con_caries: '',
  temporales: '',
  mordida_cruzada: '',
  tecnica_cepillado: '',
  estado_parodontal: '',
  cefalografia: '',
  ortoradiales: '',
  palmar: '',
  oclusal: '',
  oblicua: '',
  ortopantografias: '',
  mesioradial: '',
  ausencia_congenita: '',
  supernumerarios: '',
  quistes: '',
  lesiones_periapicales: '',
  inclusiones: '',
  resorcion_radicular: '',
  terceros_molares: '',
  raices_enanas: '',
  raices_anormales: '',
};

export function ClinicalHistoryForm({ patient, doctorName, onDataChange, initialData }: ClinicalHistoryFormProps) {
  const [formData, setFormData] = useState<ClinicalHistoryData>({
    ...defaultData,
    ocupacion: patient.occupation || '',
    nombre_doctor: doctorName,
    ...initialData,
  });

  useEffect(() => {
    setFormData({
      ...defaultData,
      ocupacion: patient.occupation || '',
      nombre_doctor: doctorName,
      ...initialData,
    });
  }, [patient.id, doctorName, initialData]);

  const handleChange = (field: keyof ClinicalHistoryData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange?.(newData);
  };

  return (
    <div className="bg-white space-y-4 text-xs max-w-full">
      {/* PAGE 1: DATOS GENERALES Y HISTOTIA CLINICA */}
      <div className="bg-white p-4 space-y-3 border border-gray-300">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="text-xs text-gray-400">
            <p className="text-[10px]">FECHA</p>
            <p className="text-[10px]">{new Date().toLocaleDateString('es-MX')}</p>
          </div>
          <div className="text-right">
            <img src={logoImage} alt="Dental White" className="w-16 h-auto object-contain ml-auto mb-1" />
            <h2 className="text-sm font-bold">ORTODONCIA</h2>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h3 className="text-sm font-bold">DATOS GENERALES DEL PACIENTE</h3>
        </div>

        {/* Patient Data Fields */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center flex-1">
              <span className="font-bold mr-1 text-[11px] whitespace-nowrap">NOMBRE</span>
              <div className="flex-1 border-b border-black px-1">
                <span className="text-[11px]">{patient.name}</span>
              </div>
            </div>
            <div className="flex items-center w-20">
              <span className="font-bold mr-1 text-[11px]">EDAD</span>
              <div className="flex-1 border-b border-black px-1 text-center">
                <span className="text-[11px]">{patient.age}</span>
              </div>
            </div>
            <div className="flex items-center w-28">
              <span className="font-bold mr-1 text-[11px]">SEXO</span>
              <div className="flex-1 border-b border-black px-1">
                <span className="text-[11px]">{patient.sex}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <span className="font-bold mr-1 text-[11px]">DIRECCION</span>
            <div className="flex-1 border-b border-black px-1">
              <span className="text-[11px]">{patient.address}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center flex-1">
              <span className="font-bold mr-1 text-[11px]">COLONIA</span>
              <div className="flex-1 border-b border-black px-1">
                <span className="text-[11px]">{patient.colony}</span>
              </div>
            </div>
            <div className="flex items-center flex-1">
              <span className="font-bold mr-1 text-[11px] whitespace-nowrap">TELEFONO</span>
              <div className="flex-1 border-b border-black px-1">
                <span className="text-[11px]">{patient.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center flex-1">
              <span className="font-bold mr-1 text-[11px] whitespace-nowrap">DELEGACION O MUNICIPIO</span>
              <div className="flex-1 border-b border-black px-1">
                <span className="text-[11px]">{patient.municipality}</span>
              </div>
            </div>
            <div className="flex items-center w-32">
              <span className="font-bold mr-1 text-[11px]">C.P</span>
              <div className="flex-1 border-b border-black px-1">
                <span className="text-[11px]">{patient.postalCode}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <span className="font-bold mr-1 text-[11px] whitespace-nowrap">DNI</span>
            <div className="flex-1 border-b border-black px-1">
              <input
                type="text"
                value={formData.dni}
                onChange={(e) => handleChange('dni', e.target.value)}
                className="w-full outline-none bg-transparent text-[11px]"
              />
            </div>
          </div>

          <div className="flex items-center">
            <span className="font-bold mr-1 text-[11px] whitespace-nowrap">NOMBRE DEL PADRE O TUTOR</span>
            <div className="flex-1 border-b border-black px-1">
              <input
                type="text"
                value={formData.representante}
                onChange={(e) => handleChange('representante', e.target.value)}
                className="w-full outline-none bg-transparent text-[11px]"
              />
            </div>
          </div>

          <div className="flex items-center">
            <span className="font-bold mr-1 text-[11px]">OCUPACION</span>
            <div className="flex-1 border-b border-black px-1">
              <input
                type="text"
                value={formData.ocupacion}
                onChange={(e) => handleChange('ocupacion', e.target.value)}
                className="w-full outline-none bg-transparent text-[11px]"
              />
            </div>
          </div>

          <div className="flex items-center">
            <span className="font-bold mr-1 text-[11px] whitespace-nowrap">NOMBRE DEL DOCTOR:</span>
            <div className="flex-1 border-b border-black px-1">
              <input
                type="text"
                value={formData.nombre_doctor}
                onChange={(e) => handleChange('nombre_doctor', e.target.value)}
                className="w-full outline-none bg-transparent text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* HISTOTIA CLINICA Section */}
        <div className="pt-2">
          <h3 className="text-center text-sm font-bold mb-2">HISTORIA CLINICA</h3>
          
          <table className="w-full border border-black mb-2 text-[10px]">
            <thead>
              <tr className="border-b border-black">
                <th className="border-r border-black p-1 text-left font-bold">ESTADO ACTUAL DEL PACIENTE</th>
                <th className="border-r border-black p-1 text-center font-bold w-16">BUENO</th>
                <th className="border-r border-black p-1 text-center font-bold w-16">MALO</th>
                <th className="p-1 text-center font-bold w-16">REGULAR</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">FISICO</td>
                <td className="border-r border-black p-1 text-center">
                  <input type="checkbox" checked={formData.estado_fisico === 'bueno'} onChange={() => handleChange('estado_fisico', 'bueno')} />
                </td>
                <td className="border-r border-black p-1 text-center">
                  <input type="checkbox" checked={formData.estado_fisico === 'malo'} onChange={() => handleChange('estado_fisico', 'malo')} />
                </td>
                <td className="p-1 text-center">
                  <input type="checkbox" checked={formData.estado_fisico === 'regular'} onChange={() => handleChange('estado_fisico', 'regular')} />
                </td>
              </tr>
              <tr>
                <td className="border-r border-black p-1 font-bold">DENTAL</td>
                <td className="border-r border-black p-1 text-center">
                  <input type="checkbox" checked={formData.estado_dental === 'bueno'} onChange={() => handleChange('estado_dental', 'bueno')} />
                </td>
                <td className="border-r border-black p-1 text-center">
                  <input type="checkbox" checked={formData.estado_dental === 'malo'} onChange={() => handleChange('estado_dental', 'malo')} />
                </td>
                <td className="p-1 text-center">
                  <input type="checkbox" checked={formData.estado_dental === 'regular'} onChange={() => handleChange('estado_dental', 'regular')} />
                </td>
              </tr>
            </tbody>
          </table>

          {/* ANTECEDENTES Table */}
          <table className="w-full border border-black mb-2 text-[9px]">
            <thead>
              <tr className="border-b border-black">
                <th colSpan={8} className="p-1 text-center font-bold">ANTECEDENTES</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold w-24">PATOLOGICOS</td>
                <td className="border-r border-black p-1 text-center">AMIGDALITIS</td>
                <td className="border-r border-black p-1 text-center">ADENOIDES</td>
                <td className="border-r border-black p-1 text-center">HERPEZ</td>
                <td className="border-r border-black p-1 text-center">GRIPE</td>
                <td className="p-1 text-center" colSpan={2}>PROB.RESPIRATORIOS</td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">NO PATOLOGICOS</td>
                <td className="border-r border-black p-1 text-center">LABIO</td>
                <td className="border-r border-black p-1 text-center">LENGUA</td>
                <td className="border-r border-black p-1 text-center">OBJETOS</td>
                <td className="border-r border-black p-1 text-center">DEDO</td>
                <td className="p-1" colSpan={2}>
                  <span className="font-bold">OTRO:</span>
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">FRECUENCIA</td>
                <td colSpan={6} className="p-1">
                  <input type="text" className="w-full border-b border-black outline-none text-[9px]" />
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">DURACION</td>
                <td colSpan={6} className="p-1">
                  <input type="text" className="w-full border-b border-black outline-none text-[9px]" />
                </td>
              </tr>
              <tr>
                <td className="border-r border-black p-1 font-bold">INTENSIDAD</td>
                <td colSpan={6} className="p-1">
                  <input type="text" className="w-full border-b border-black outline-none text-[9px]" />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="space-y-1 text-[10px]">
            <div className="flex items-start">
              <span className="font-bold mr-1 whitespace-nowrap text-[10px]">EN EL ULTIMO AÑO ¿RECIBIO USTED ATENCION MEDICA? CAUSA</span>
            </div>
            <input
              type="text"
              value={formData.atencion_medica}
              onChange={(e) => handleChange('atencion_medica', e.target.value)}
              className="w-full border-b border-black outline-none text-[10px]"
            />
          </div>
        </div>

        {/* Signature Section */}
        <div className="grid grid-cols-2 gap-6 pt-4">
          <div className="text-center">
            <div className="border-b border-black mb-1 pb-8"></div>
            <p className="font-bold text-[10px]">FIRMA DEL PACIENTE</p>
          </div>
          <div className="text-center">
            <div className="border-b border-black mb-1 pb-8"></div>
            <p className="font-bold text-[10px]">FIRMA DE LA PERSONA LEGALMENTE</p>
          </div>
        </div>
      </div>

      {/* PAGE 2: EXAMEN DE LA CARA Y EXAMEN BUCAL */}
      <div className="bg-white p-4 space-y-3 border border-gray-300">
        {/* Header Page 2 */}
        <div className="flex items-start justify-end">
          <div className="text-right">
            <img src={logoImage} alt="Dental White" className="w-16 h-auto object-contain ml-auto mb-1" />
            <h2 className="text-sm font-bold">ORTODONCIA</h2>
          </div>
        </div>

        {/* EXAMEN DE LA CARA */}
        <div>
          <h3 className="text-center text-sm font-bold mb-2">EXAMEN DE LA CARA</h3>
          
          <table className="w-full border border-black mb-2 text-[10px]">
            <tbody>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold w-20">FORMA</td>
                <td className="border-r border-black p-1">
                  <input type="text" value={formData.forma} onChange={(e) => handleChange('forma', e.target.value)} className="w-full outline-none bg-transparent text-[10px]" />
                </td>
                <td className="border-r border-black p-1 font-bold text-center w-24">SIMETRICA</td>
                <td className="border-r border-black p-1 text-center w-20">
                  <input type="checkbox" checked={formData.simetria === 'simetrica'} onChange={() => handleChange('simetria', 'simetrica')} />
                </td>
                <td className="border-r border-black p-1 font-bold text-center w-24">ASIMETRICA</td>
                <td className="p-1 text-center w-20">
                  <input type="checkbox" checked={formData.simetria === 'asimetrica'} onChange={() => handleChange('simetria', 'asimetrica')} />
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">PERFIL</td>
                <td className="border-r border-black p-1">
                  <input type="text" value={formData.perfil} onChange={(e) => handleChange('perfil', e.target.value)} className="w-full outline-none bg-transparent text-[10px]" />
                </td>
                <td className="border-r border-black p-1 font-bold text-center">FRENTE</td>
                <td className="border-r border-black p-1">
                  <input type="text" value={formData.frente} onChange={(e) => handleChange('frente', e.target.value)} className="w-full outline-none bg-transparent text-[10px]" />
                </td>
                <td className="border-r border-black p-1 font-bold text-center">OREJAS</td>
                <td className="p-1">
                  <input type="text" value={formData.orejas} onChange={(e) => handleChange('orejas', e.target.value)} className="w-full outline-none bg-transparent text-[10px]" />
                </td>
              </tr>
              <tr>
                <td className="border-r border-black p-1 font-bold">TIC</td>
                <td className="border-r border-black p-1">
                  <input type="text" value={formData.tic} onChange={(e) => handleChange('tic', e.target.value)} className="w-full outline-none bg-transparent text-[10px]" />
                </td>
                <td className="border-r border-black p-1 font-bold text-center">RICTUS</td>
                <td className="border-r border-black p-1">
                  <input type="text" value={formData.rictus} onChange={(e) => handleChange('rictus', e.target.value)} className="w-full outline-none bg-transparent text-[10px]" />
                </td>
                <td className="border-r border-black p-1 font-bold text-center">LINEA BIPUPILAR</td>
                <td className="p-1">
                  <input type="text" value={formData.linea_bipupilar} onChange={(e) => handleChange('linea_bipupilar', e.target.value)} className="w-full outline-none bg-transparent text-[10px]" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* LINEA DE HOLDAWAY */}
        <div>
          <h3 className="text-xs font-bold mb-1">LINEA DE HOLDAWAY (ESTETICA)</h3>
          <div className="space-y-1 text-[10px]">
            <div className="flex items-center gap-2">
              <span className="font-bold">MUSCULATURA LABIAL:</span>
              <label className="flex items-center gap-1">
                <input type="radio" name="muscuLabial" checked={formData.musculatura_labial === 'debil'} onChange={() => handleChange('musculatura_labial', 'debil')} />
                <span>DEBIL</span>
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="muscuLabial" checked={formData.musculatura_labial === 'normal'} onChange={() => handleChange('musculatura_labial', 'normal')} />
                <span>NORMAL</span>
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="muscuLabial" checked={formData.musculatura_labial === 'fuerte'} onChange={() => handleChange('musculatura_labial', 'fuerte')} />
                <span>FUERTE</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">HIPERACTIVIDAD MENTONIANA:</span>
              <label className="flex items-center gap-1">
                <input type="radio" name="hiper" checked={formData.hiperactividad_mentoniana === 'si'} onChange={() => handleChange('hiperactividad_mentoniana', 'si')} />
                <span>SI</span>
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="hiper" checked={formData.hiperactividad_mentoniana === 'no'} onChange={() => handleChange('hiperactividad_mentoniana', 'no')} />
                <span>NO</span>
              </label>
            </div>
          </div>
        </div>

        {/* EXAMEN BUCAL */}
        <div>
          <h3 className="text-xs font-bold mb-1">EXAMEN BUCAL</h3>
          <div className="space-y-1 text-[10px]">
            <div className="flex items-center gap-2">
              <span className="font-bold w-32">RELACION MOLAR</span>
              <input type="text" value={formData.relacion_molar} onChange={(e) => handleChange('relacion_molar', e.target.value)} className="flex-1 border-b border-black outline-none text-[10px]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold w-32">RELACION CANINA</span>
              <input type="text" value={formData.relacion_canina} onChange={(e) => handleChange('relacion_canina', e.target.value)} className="flex-1 border-b border-black outline-none text-[10px]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold w-32">RELACION INCISAL</span>
              <input type="text" value={formData.relacion_incisal} onChange={(e) => handleChange('relacion_incisal', e.target.value)} className="flex-1 border-b border-black outline-none text-[10px]" />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="font-bold">OVER JET (MM)</span>
                <input type="text" value={formData.over_jet} onChange={(e) => handleChange('over_jet', e.target.value)} className="w-16 border-b border-black outline-none text-[10px]" />
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">OVER BITE(MM)</span>
                <input type="text" value={formData.over_bite} onChange={(e) => handleChange('over_bite', e.target.value)} className="w-16 border-b border-black outline-none text-[10px]" />
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">MORDIDA ABIERTA(MM)</span>
                <input type="text" value={formData.mordida_abierta} onChange={(e) => handleChange('mordida_abierta', e.target.value)} className="w-16 border-b border-black outline-none text-[10px]" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold w-24">LINEA MEDIA</span>
              <input type="text" value={formData.linea_media} onChange={(e) => handleChange('linea_media', e.target.value)} className="flex-1 border-b border-black outline-none text-[10px]" />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 flex-1">
                <span className="font-bold whitespace-nowrap">DIENTES AUSENTE</span>
                <input type="text" value={formData.dientes_ausentes} onChange={(e) => handleChange('dientes_ausentes', e.target.value)} className="flex-1 border-b border-black outline-none text-[10px]" />
              </div>
              <div className="flex items-center gap-1 flex-1">
                <span className="font-bold whitespace-nowrap">DIENTES MALFORMADOS</span>
                <input type="text" value={formData.dientes_malformados} onChange={(e) => handleChange('dientes_malformados', e.target.value)} className="flex-1 border-b border-black outline-none text-[10px]" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 flex-1">
                <span className="font-bold whitespace-nowrap">DIENTES CON CARIES</span>
                <input type="text" value={formData.dientes_con_caries} onChange={(e) => handleChange('dientes_con_caries', e.target.value)} className="flex-1 border-b border-black outline-none text-[10px]" />
              </div>
              <div className="flex items-center gap-1 flex-1">
                <span className="font-bold">TEMPORALES</span>
                <input type="text" value={formData.temporales} onChange={(e) => handleChange('temporales', e.target.value)} className="flex-1 border-b border-black outline-none text-[10px]" />
              </div>
            </div>

            {/* Table for Mordida */}
            <table className="w-full border border-black mt-1 text-[9px]">
              <tbody>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-1 font-bold">MORDIDA CRUZADA POSTERIOR</td>
                  <td className="border-r border-black p-1 text-center">
                    <label className="flex items-center justify-center gap-1">
                      <input type="radio" name="mordida" checked={formData.mordida_cruzada === 'unilateral'} onChange={() => handleChange('mordida_cruzada', 'unilateral')} />
                      <span>UNILATERAL</span>
                    </label>
                  </td>
                  <td className="border-r border-black p-1 text-center">
                    <label className="flex items-center justify-center gap-1">
                      <input type="radio" name="mordida" checked={formData.mordida_cruzada === 'bilateral'} onChange={() => handleChange('mordida_cruzada', 'bilateral')} />
                      <span>BILATERAL</span>
                    </label>
                  </td>
                  <td className="p-1"></td>
                </tr>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-1 font-bold">TECNICA DE CEPILLADO</td>
                  <td className="border-r border-black p-1 text-center">
                    <label className="flex items-center justify-center gap-1">
                      <input type="radio" name="cepillado" checked={formData.tecnica_cepillado === 'buena'} onChange={() => handleChange('tecnica_cepillado', 'buena')} />
                      <span>BUENA</span>
                    </label>
                  </td>
                  <td className="border-r border-black p-1 text-center">
                    <label className="flex items-center justify-center gap-1">
                      <input type="radio" name="cepillado" checked={formData.tecnica_cepillado === 'mala'} onChange={() => handleChange('tecnica_cepillado', 'mala')} />
                      <span>MALA</span>
                    </label>
                  </td>
                  <td className="p-1 text-center">
                    <label className="flex items-center justify-center gap-1">
                      <input type="radio" name="cepillado" checked={formData.tecnica_cepillado === 'regular'} onChange={() => handleChange('tecnica_cepillado', 'regular')} />
                      <span>REGULAR</span>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td className="border-r border-black p-1 font-bold">ESTADO PARODONTAL</td>
                  <td className="border-r border-black p-1 text-center">
                    <label className="flex items-center justify-center gap-1">
                      <input type="radio" name="parodontal" checked={formData.estado_parodontal === 'bueno'} onChange={() => handleChange('estado_parodontal', 'bueno')} />
                      <span>BUENO</span>
                    </label>
                  </td>
                  <td className="border-r border-black p-1 text-center">
                    <label className="flex items-center justify-center gap-1">
                      <input type="radio" name="parodontal" checked={formData.estado_parodontal === 'malo'} onChange={() => handleChange('estado_parodontal', 'malo')} />
                      <span>MALO</span>
                    </label>
                  </td>
                  <td className="p-1 text-center">
                    <label className="flex items-center justify-center gap-1">
                      <input type="radio" name="parodontal" checked={formData.estado_parodontal === 'regular'} onChange={() => handleChange('estado_parodontal', 'regular')} />
                      <span>REGULAR</span>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* EXAMEN RADIOGRAFICO */}
        <div>
          <h3 className="text-xs font-bold mb-1">EXAMEN RADIOGRAFICO</h3>
          
          <table className="w-full border border-black mb-1 text-[9px]">
            <tbody>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold w-1/4">CEFALOGRAFIA</td>
                <td className="border-r border-black p-1">
                  <input type="text" value={formData.cefalografia} onChange={(e) => handleChange('cefalografia', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
                <td className="border-r border-black p-1 font-bold w-1/4">ORTORADIALES</td>
                <td className="p-1">
                  <input type="text" value={formData.ortoradiales} onChange={(e) => handleChange('ortoradiales', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">PALMAR</td>
                <td className="border-r border-black p-1">
                  <input type="text" value={formData.palmar} onChange={(e) => handleChange('palmar', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
                <td className="border-r border-black p-1 font-bold">OCLUSAL</td>
                <td className="p-1">
                  <input type="text" value={formData.oclusal} onChange={(e) => handleChange('oclusal', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">OBLICUA</td>
                <td className="border-r border-black p-1">
                  <input type="text" value={formData.oblicua} onChange={(e) => handleChange('oblicua', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
                <td className="border-r border-black p-1 font-bold">ORTOPANTOGRAFIAS</td>
                <td className="p-1">
                  <input type="text" value={formData.ortopantografias} onChange={(e) => handleChange('ortopantografias', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
              </tr>
              <tr>
                <td className="border-r border-black p-1 font-bold">MESIORADIAL</td>
                <td className="p-1" colSpan={3}>
                  <input type="text" value={formData.mesioradial} onChange={(e) => handleChange('mesioradial', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
              </tr>
            </tbody>
          </table>

          <table className="w-full border border-black text-[9px]">
            <tbody>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold w-1/4">AUSENCIA CONGENITA</td>
                <td className="border-r border-black p-1">
                  <input type="text" value={formData.ausencia_congenita} onChange={(e) => handleChange('ausencia_congenita', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
                <td className="border-r border-black p-1 font-bold w-1/4">SUPERNUMERARIOS</td>
                <td className="p-1">
                  <input type="text" value={formData.supernumerarios} onChange={(e) => handleChange('supernumerarios', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">QUISTES</td>
                <td className="border-r border-black p-1">
                  <input type="text" value={formData.quistes} onChange={(e) => handleChange('quistes', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
                <td className="border-r border-black p-1 font-bold">LESIONES PERIAPICALES</td>
                <td className="p-1">
                  <input type="text" value={formData.lesiones_periapicales} onChange={(e) => handleChange('lesiones_periapicales', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">INCLUSIONES</td>
                <td className="border-r border-black p-1">
                  <input type="text" value={formData.inclusiones} onChange={(e) => handleChange('inclusiones', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
                <td className="border-r border-black p-1 font-bold">RESORCION RADICULAR</td>
                <td className="p-1">
                  <input type="text" value={formData.resorcion_radicular} onChange={(e) => handleChange('resorcion_radicular', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">TERCEROS MOLARES</td>
                <td className="border-r border-black p-1">
                  <input type="text" value={formData.terceros_molares} onChange={(e) => handleChange('terceros_molares', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
                <td className="border-r border-black p-1 font-bold">RAICES ENANAS</td>
                <td className="p-1">
                  <input type="text" value={formData.raices_enanas} onChange={(e) => handleChange('raices_enanas', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
              </tr>
              <tr>
                <td className="border-r border-black p-1 font-bold">RAICES ANORMALES</td>
                <td className="p-1" colSpan={3}>
                  <input type="text" value={formData.raices_anormales} onChange={(e) => handleChange('raices_anormales', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
