import { useState } from 'react';
import logoImage from 'figma:asset/da6a072baf78bdc68ca5368ac2123d8644ed8db8.png';
import { Patient } from '../data/mockData';

interface ClinicalHistoryFormProps {
  patient: Patient;
  doctorName: string;
}

export function ClinicalHistoryForm({ patient, doctorName }: ClinicalHistoryFormProps) {
  // Estado para los campos editables
  const [formData, setFormData] = useState({
    dni: '',
    representante: '',
    ocupacion: patient.occupation || '',
    nombreDoctor: doctorName,
    // Estado actual
    estadoFisico: '',
    estadoDental: '',
    // Antecedentes
    atencionMedica: '',
    // Examen de la cara
    forma: '',
    simetria: '',
    perfil: '',
    frente: '',
    orejas: '',
    tic: '',
    rictus: '',
    lineaBipupilar: '',
    // Línea de Holdaway
    muscuLaturaLabial: '',
    hiperactividad: '',
    // Examen bucal
    relacionMolar: '',
    relacionCanina: '',
    relacionIncisal: '',
    overJet: '',
    overBite: '',
    mordidaAbierta: '',
    lineaMedia: '',
    dientesAusente: '',
    dientesMalformados: '',
    dientesCaries: '',
    temporales: '',
    mordidaCruzada: '',
    tecnicaCepillado: '',
    estadoParodontal: '',
    // Examen radiográfico
    cefalografia: '',
    ortoradiales: '',
    palmar: '',
    oclusal: '',
    oblicua: '',
    ortopantografias: '',
    mesioradial: '',
    ausenciaCongenita: '',
    supernomerarios: '',
    quistes: '',
    lesionesPeriapicales: '',
    inclusiones: '',
    resorcionRadicular: '',
    tercerosMolares: '',
    raicesEnanas: '',
    raicesAnormales: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
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
            <span className="font-bold mr-1 text-[11px] whitespace-nowrap">NOMBRE DEL PADRE O TUTOR</span>
            <div className="flex-1 border-b border-black px-1">
              <span className="text-[11px]">{patient.tutor || 'N/A'}</span>
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
                value={formData.nombreDoctor}
                onChange={(e) => handleChange('nombreDoctor', e.target.value)}
                className="w-full outline-none bg-transparent text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* HISTOTIA CLINICA Section */}
        <div className="pt-2">
          <h3 className="text-center text-sm font-bold mb-2">HISTOTIA CLINICA</h3>
          
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
                  <input type="checkbox" checked={formData.estadoFisico === 'bueno'} onChange={() => handleChange('estadoFisico', 'bueno')} />
                </td>
                <td className="border-r border-black p-1 text-center">
                  <input type="checkbox" checked={formData.estadoFisico === 'malo'} onChange={() => handleChange('estadoFisico', 'malo')} />
                </td>
                <td className="p-1 text-center">
                  <input type="checkbox" checked={formData.estadoFisico === 'regular'} onChange={() => handleChange('estadoFisico', 'regular')} />
                </td>
              </tr>
              <tr>
                <td className="border-r border-black p-1 font-bold">DENTAL</td>
                <td className="border-r border-black p-1 text-center">
                  <input type="checkbox" checked={formData.estadoDental === 'bueno'} onChange={() => handleChange('estadoDental', 'bueno')} />
                </td>
                <td className="border-r border-black p-1 text-center">
                  <input type="checkbox" checked={formData.estadoDental === 'malo'} onChange={() => handleChange('estadoDental', 'malo')} />
                </td>
                <td className="p-1 text-center">
                  <input type="checkbox" checked={formData.estadoDental === 'regular'} onChange={() => handleChange('estadoDental', 'regular')} />
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
                  <input type="text" className="ml-1 border-b border-black w-20 outline-none text-[9px]" />
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
            <input type="text" className="w-full border-b border-black outline-none text-[10px]" />
            <input type="text" className="w-full border-b border-black outline-none text-[10px]" />
            <input type="text" className="w-full border-b border-black outline-none text-[10px]" />
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
                  <input type="text" value={formData.lineaBipupilar} onChange={(e) => handleChange('lineaBipupilar', e.target.value)} className="w-full outline-none bg-transparent text-[10px]" />
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
                <input type="radio" name="muscuLabial" checked={formData.muscuLaturaLabial === 'debil'} onChange={() => handleChange('muscuLaturaLabial', 'debil')} />
                <span>DEBIL</span>
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="muscuLabial" checked={formData.muscuLaturaLabial === 'normal'} onChange={() => handleChange('muscuLaturaLabial', 'normal')} />
                <span>NORMAL</span>
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="muscuLabial" checked={formData.muscuLaturaLabial === 'fuerte'} onChange={() => handleChange('muscuLaturaLabial', 'fuerte')} />
                <span>FUERTE</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">HIPERACTIVIDAD MENTONIANA:</span>
              <label className="flex items-center gap-1">
                <input type="radio" name="hiper" checked={formData.hiperactividad === 'si'} onChange={() => handleChange('hiperactividad', 'si')} />
                <span>SI</span>
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="hiper" checked={formData.hiperactividad === 'no'} onChange={() => handleChange('hiperactividad', 'no')} />
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
              <input type="text" value={formData.relacionMolar} onChange={(e) => handleChange('relacionMolar', e.target.value)} className="flex-1 border-b border-black outline-none text-[10px]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold w-32">RELACION CANINA</span>
              <input type="text" value={formData.relacionCanina} onChange={(e) => handleChange('relacionCanina', e.target.value)} className="flex-1 border-b border-black outline-none text-[10px]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold w-32">RELACION INCISAL</span>
              <input type="text" value={formData.relacionIncisal} onChange={(e) => handleChange('relacionIncisal', e.target.value)} className="flex-1 border-b border-black outline-none text-[10px]" />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="font-bold">OVER JET (MM)</span>
                <input type="text" value={formData.overJet} onChange={(e) => handleChange('overJet', e.target.value)} className="w-16 border-b border-black outline-none text-[10px]" />
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">OVER BITE(MM)</span>
                <input type="text" value={formData.overBite} onChange={(e) => handleChange('overBite', e.target.value)} className="w-16 border-b border-black outline-none text-[10px]" />
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">MORDIDA ABIERTA(MM)</span>
                <input type="text" value={formData.mordidaAbierta} onChange={(e) => handleChange('mordidaAbierta', e.target.value)} className="w-16 border-b border-black outline-none text-[10px]" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold w-24">LINEA MEDIA</span>
              <input type="text" value={formData.lineaMedia} onChange={(e) => handleChange('lineaMedia', e.target.value)} className="flex-1 border-b border-black outline-none text-[10px]" />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 flex-1">
                <span className="font-bold whitespace-nowrap">DIENTES AUSENTE</span>
                <input type="text" value={formData.dientesAusente} onChange={(e) => handleChange('dientesAusente', e.target.value)} className="flex-1 border-b border-black outline-none text-[10px]" />
              </div>
              <div className="flex items-center gap-1 flex-1">
                <span className="font-bold whitespace-nowrap">DIENTES MALFORMADOS</span>
                <input type="text" value={formData.dientesMalformados} onChange={(e) => handleChange('dientesMalformados', e.target.value)} className="flex-1 border-b border-black outline-none text-[10px]" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 flex-1">
                <span className="font-bold whitespace-nowrap">DIENTES CON CARIES</span>
                <input type="text" value={formData.dientesCaries} onChange={(e) => handleChange('dientesCaries', e.target.value)} className="flex-1 border-b border-black outline-none text-[10px]" />
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
                      <input type="radio" name="mordida" checked={formData.mordidaCruzada === 'unilateral'} onChange={() => handleChange('mordidaCruzada', 'unilateral')} />
                      <span>UNILATERAL</span>
                    </label>
                  </td>
                  <td className="border-r border-black p-1 text-center">
                    <label className="flex items-center justify-center gap-1">
                      <input type="radio" name="mordida" checked={formData.mordidaCruzada === 'bilateral'} onChange={() => handleChange('mordidaCruzada', 'bilateral')} />
                      <span>BILATERAL</span>
                    </label>
                  </td>
                  <td className="p-1"></td>
                </tr>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-1 font-bold">TECNICA DE SEPILLADO</td>
                  <td className="border-r border-black p-1 text-center">
                    <input type="checkbox" checked={formData.tecnicaCepillado === 'buena'} onChange={() => handleChange('tecnicaCepillado', 'buena')} />
                    <span className="ml-1">BUENA</span>
                  </td>
                  <td className="border-r border-black p-1 text-center">
                    <input type="checkbox" checked={formData.tecnicaCepillado === 'mala'} onChange={() => handleChange('tecnicaCepillado', 'mala')} />
                    <span className="ml-1">MALA</span>
                  </td>
                  <td className="p-1 text-center">
                    <input type="checkbox" checked={formData.tecnicaCepillado === 'regular'} onChange={() => handleChange('tecnicaCepillado', 'regular')} />
                    <span className="ml-1">REGULAR</span>
                  </td>
                </tr>
                <tr>
                  <td className="border-r border-black p-1 font-bold">ESTADO PARODONTAL</td>
                  <td className="border-r border-black p-1 text-center">
                    <input type="checkbox" checked={formData.estadoParodontal === 'bueno'} onChange={() => handleChange('estadoParodontal', 'bueno')} />
                    <span className="ml-1">BUENO</span>
                  </td>
                  <td className="border-r border-black p-1 text-center">
                    <input type="checkbox" checked={formData.estadoParodontal === 'malo'} onChange={() => handleChange('estadoParodontal', 'malo')} />
                    <span className="ml-1">MALO</span>
                  </td>
                  <td className="p-1 text-center">
                    <input type="checkbox" checked={formData.estadoParodontal === 'regular'} onChange={() => handleChange('estadoParodontal', 'regular')} />
                    <span className="ml-1">REGULAR</span>
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
                  <input type="text" value={formData.ausenciaCongenita} onChange={(e) => handleChange('ausenciaCongenita', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
                <td className="border-r border-black p-1 font-bold w-1/4">SUPERNOMERARIOS</td>
                <td className="p-1">
                  <input type="text" value={formData.supernomerarios} onChange={(e) => handleChange('supernomerarios', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">QUISTES</td>
                <td className="border-r border-black p-1">
                  <input type="text" value={formData.quistes} onChange={(e) => handleChange('quistes', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
                <td className="border-r border-black p-1 font-bold">LESIONES PERIAPICALES</td>
                <td className="p-1">
                  <input type="text" value={formData.lesionesPeriapicales} onChange={(e) => handleChange('lesionesPeriapicales', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">INCLUSIONES</td>
                <td className="border-r border-black p-1">
                  <input type="text" value={formData.inclusiones} onChange={(e) => handleChange('inclusiones', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
                <td className="border-r border-black p-1 font-bold">RESORCION RADICULAR</td>
                <td className="p-1">
                  <input type="text" value={formData.resorcionRadicular} onChange={(e) => handleChange('resorcionRadicular', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">TERCEROS MOLARES</td>
                <td className="border-r border-black p-1">
                  <input type="text" value={formData.tercerosMolares} onChange={(e) => handleChange('tercerosMolares', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
                <td className="border-r border-black p-1 font-bold">RAICES ENANAS</td>
                <td className="p-1">
                  <input type="text" value={formData.raicesEnanas} onChange={(e) => handleChange('raicesEnanas', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
              </tr>
              <tr>
                <td className="border-r border-black p-1 font-bold">RAICES ANORMALES</td>
                <td className="p-1" colSpan={3}>
                  <input type="text" value={formData.raicesAnormales} onChange={(e) => handleChange('raicesAnormales', e.target.value)} className="w-full outline-none bg-transparent text-[9px]" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
