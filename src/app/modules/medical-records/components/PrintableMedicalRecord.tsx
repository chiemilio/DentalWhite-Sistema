import { MedicalRecord } from '../../../shared/data/mockData';
import logoImage from 'figma:asset/da6a072baf78bdc68ca5368ac2123d8644ed8db8.png';
import { Button } from '../../../shared/ui/button';
import { Printer, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';

interface PrintableMedicalRecordProps {
  record: MedicalRecord;
}

export function PrintableMedicalRecord({ record }: PrintableMedicalRecordProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'letter');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`expediente_${record.patientName.replace(/\s/g, '_')}_${record.createdDate}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
    }
  };

  return (
    <div>
      {/* Buttons - No se imprimen */}
      <div className="no-print text-center mb-4">
        <Button onClick={handlePrint} className="bg-sky-500 hover:bg-sky-600">
          <Printer className="mr-2" size={16} />
          Imprimir
        </Button>
      </div>

      <div ref={printRef} className="printable-record bg-white p-8 max-w-[21cm] mx-auto">
      <style>{`
        @media print {
          header, footer, .no-print {
            display: none !important;
          }
          body * {
            visibility: hidden;
          }
          .printable-record, .printable-record * {
            visibility: visible;
          }
          .printable-record {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%!important;
            max-width: 100%;
            padding: 0.4cm;
          }
          @page {
            size: letter;
            margin: 0.4cm;
          }
          
          /* Números de página */
          .page-number {
            position: fixed;
            bottom: 0.3cm;
            right: 0.5cm;
            font-size: 10px;
          }
          
          /* AGRANDAR TODO EN IMPRESIÓN PARA FORZAR 2 PÁGINAS */
          table {
            font-size: 12px !important;
            margin-bottom: 24px !important;
          }
          
          table td, table th {
            padding: 12px 14px !important;
            line-height: 1.7 !important;
          }
          
          .section-title {
            font-size: 16px !important;
            margin: 28px 0 16px 0 !important;
          }
          
          .subsection-title {
            font-size: 13px !important;
            margin: 16px 0 12px 0 !important;
          }
          
          .print-checkbox {
            font-size: 12px !important;
            margin-right: 16px !important;
          }
          
          .print-checkbox input[type="checkbox"] {
            width: 14px !important;
            height: 14px !important;
            margin-right: 6px !important;
          }
          
          .mb-2 {
            margin-bottom: 14px !important;
            padding: 4px 0 !important;
          }
          
          .mb-4 {
            margin-bottom: 20px !important;
          }
          
          .signature-area {
            margin-top: 60px !important;
          }
          
          .signature-line {
            margin-top: 60px !important;
            font-size: 11px !important;
          }
          
          .text-base {
            font-size: 17px !important;
          }
          
          /* Logo más grande */
          .w-11 {
            width: 3rem !important;
          }
          
          .h-9 {
            height: 2.5rem !important;
          }
        }
        
        /* Salto de página */
        .page-break {
          page-break-after: always !important;
          page-break-inside: avoid !important;
          break-after: page !important;
        }
        
        /* Tablas con bordes */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 12px;
          font-size: 10px;
        }
        
        table td, table th {
          border: 1px solid #000;
          padding: 5px 6px;
          text-align: left;
          vertical-align: top;
        }
        
        table th {
          font-weight: bold;
          background-color: #f0f0f0;
        }
        
        /* Campos con líneas */
        .field-line {
          display: inline-flex;
          align-items: baseline;
          margin-bottom: 6px;
          font-size: 10px;
        }
        
        .field-line label {
          font-weight: bold;
          margin-right: 6px;
          white-space: nowrap;
        }
        
        .field-line .underline {
          border-bottom: 1px solid #000;
          flex: 1;
          min-width: 80px;
          padding: 0 4px;
        }
        
        /* Títulos de sección */
        .section-title {
          font-weight: bold;
          font-size: 13px;
          text-align: center;
          margin: 15px 0 10px 0;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        
        /* Subtítulos */
        .subsection-title {
          font-weight: bold;
          font-size: 11px;
          margin: 10px 0 6px 0;
        }
        
        /* Checkboxes */
        .print-checkbox {
          display: inline-flex;
          align-items: center;
          margin-right: 10px;
          font-size: 10px;
        }
        
        .print-checkbox input[type="checkbox"] {
          margin-right: 4px;
          width: 11px;
          height: 11px;
        }
        
        /* Líneas de firma */
        .signature-area {
          margin-top: 40px;
          display: flex;
          justify-content: space-around;
          gap: 30px;
        }
        
        .signature-box {
          flex: 1;
          text-align: center;
        }
        
        .signature-line {
          border-top: 1px solid #000;
          margin-top: 40px;
          padding-top: 6px;
          font-size: 10px;
          font-weight: bold;
        }
        
        /* Números de página */
        .page-number {
          position: fixed;
          bottom: 10px;
          right: 15px;
          font-size: 9px;
          color: #666;
        }
      `}</style>

      {/* Header con logo */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1"></div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <div className="text-base font-bold">ORTODONCIA</div>
            <img src={logoImage} alt="Dental White" className="w-11 h-9 object-contain" />
          </div>
        </div>
      </div>

      {/* Número de página 1 */}
      <div className="page-number">Página 1 de 2</div>

      {/* PÁGINA 1 */}
      {/* Datos Generales del Paciente */}
      <div className="section-title">Datos Generales del Paciente</div>
      <table>
        <tbody>
          <tr>
            <th style={{width: '15%'}}>Nombre:</th>
            <td colSpan={3}>{record.patientName}</td>
            <th style={{width: '10%'}}>Edad:</th>
            <td>{record.age}</td>
            <th style={{width: '10%'}}>Sexo:</th>
            <td>{record.sex}</td>
          </tr>
          <tr>
            <th>Teléfono:</th>
            <td colSpan={3}>{record.phone}</td>
            <th>C.P.:</th>
            <td colSpan={3}>{record.postalCode}</td>
          </tr>
          <tr>
            <th>Dirección:</th>
            <td colSpan={7}>{record.address}</td>
          </tr>
          <tr>
            <th>Colonia:</th>
            <td colSpan={3}>{record.colony}</td>
            <th>Delegación/Municipio:</th>
            <td colSpan={3}>{record.delegation}</td>
          </tr>
          <tr>
            <th>Padre o Tutor:</th>
            <td colSpan={3}>{record.tutor || 'N/A'}</td>
            <th>Ocupación:</th>
            <td colSpan={3}>{record.occupation}</td>
          </tr>
          <tr>
            <th>Doctor:</th>
            <td colSpan={7}>{record.assignedDoctor}</td>
          </tr>
        </tbody>
      </table>

      {/* Historia Clínica */}
      <div className="section-title">Historia Clínica</div>
      <table>
        <tbody>
          <tr>
            <th style={{width: '30%'}}>Estado Físico:</th>
            <td>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.clinicalHistory.physicalState === 'good'} readOnly />
                Bueno
              </label>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.clinicalHistory.physicalState === 'bad'} readOnly />
                Malo
              </label>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.clinicalHistory.physicalState === 'regular'} readOnly />
                Regular
              </label>
            </td>
          </tr>
          <tr>
            <th>Estado Dental:</th>
            <td>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.clinicalHistory.dentalState === 'good'} readOnly />
                Bueno
              </label>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.clinicalHistory.dentalState === 'bad'} readOnly />
                Malo
              </label>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.clinicalHistory.dentalState === 'regular'} readOnly />
                Regular
              </label>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Antecedentes */}
      <div className="section-title">Antecedentes</div>
      <div className="subsection-title">Patológicos:</div>
      <div className="mb-2 flex flex-wrap gap-2">
        <label className="print-checkbox">
          <input type="checkbox" checked={record.pathologicalHistory.tonsillitis} readOnly />
          Amigdalitis
        </label>
        <label className="print-checkbox">
          <input type="checkbox" checked={record.pathologicalHistory.adenoids} readOnly />
          Adenoides
        </label>
        <label className="print-checkbox">
          <input type="checkbox" checked={record.pathologicalHistory.herpes} readOnly />
          Herpes
        </label>
        <label className="print-checkbox">
          <input type="checkbox" checked={record.pathologicalHistory.flu} readOnly />
          Gripe
        </label>
        <label className="print-checkbox">
          <input type="checkbox" checked={record.pathologicalHistory.respiratoryProblems} readOnly />
          Problemas Respiratorios
        </label>
      </div>

      <div className="subsection-title">No Patológicos (Hábitos):</div>
      <div className="mb-2 flex flex-wrap gap-2">
        <label className="print-checkbox">
          <input type="checkbox" checked={record.nonPathologicalHistory.lip} readOnly />
          Labio
        </label>
        <label className="print-checkbox">
          <input type="checkbox" checked={record.nonPathologicalHistory.tongue} readOnly />
          Lengua
        </label>
        <label className="print-checkbox">
          <input type="checkbox" checked={record.nonPathologicalHistory.objects} readOnly />
          Objetos
        </label>
        <label className="print-checkbox">
          <input type="checkbox" checked={record.nonPathologicalHistory.finger} readOnly />
          Dedo
        </label>
        <label className="print-checkbox">
          <input type="checkbox" checked={!!record.nonPathologicalHistory.other} readOnly />
          Otro: {record.nonPathologicalHistory.other || '___________'}
        </label>
      </div>

      <table>
        <tbody>
          <tr>
            <th style={{width: '20%'}}>Frecuencia:</th>
            <td>{record.habitFrequency}</td>
            <th style={{width: '20%'}}>Duración:</th>
            <td>{record.habitDuration}</td>
            <th style={{width: '20%'}}>Intensidad:</th>
            <td>{record.habitIntensity}</td>
          </tr>
          <tr>
            <th colSpan={2}>¿Recibió atención médica en el último año?</th>
            <td>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.receivedMedicalAttention} readOnly />
                Sí
              </label>
              <label className="print-checkbox">
                <input type="checkbox" checked={!record.receivedMedicalAttention} readOnly />
                No
              </label>
            </td>
            <th>Causa:</th>
            <td colSpan={2}>{record.medicalAttentionCause || 'N/A'}</td>
          </tr>
        </tbody>
      </table>

      {/* Examen de la Cara */}
      <div className="section-title">Examen de la Cara</div>
      <table>
        <tbody>
          <tr>
            <th style={{width: '15%'}}>Forma:</th>
            <td>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.faceExam.form === 'symmetric'} readOnly />
                Simétrica
              </label>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.faceExam.form === 'asymmetric'} readOnly />
                Asimétrica
              </label>
            </td>
            <th style={{width: '15%'}}>Perfil:</th>
            <td>{record.faceExam.profile}</td>
          </tr>
          <tr>
            <th>Orejas:</th>
            <td>{record.faceExam.ears}</td>
            <th>TIC:</th>
            <td>{record.faceExam.tic}</td>
          </tr>
          <tr>
            <th>Rictus:</th>
            <td>{record.faceExam.rictus}</td>
            <th>Línea Bipupilar:</th>
            <td>{record.faceExam.bipupilarLine}</td>
          </tr>
        </tbody>
      </table>

      {/* Línea de Holdaway */}
      <div className="section-title">Línea de Holdaway (Estética)</div>
      <table>
        <tbody>
          <tr>
            <th style={{width: '30%'}}>Musculatura Labial:</th>
            <td>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.holdawayLine.labialMusculature === 'weak'} readOnly />
                Débil
              </label>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.holdawayLine.labialMusculature === 'normal'} readOnly />
                Normal
              </label>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.holdawayLine.labialMusculature === 'strong'} readOnly />
                Fuerte
              </label>
            </td>
          </tr>
          <tr>
            <th>Hiperactividad Mentoniana:</th>
            <td>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.holdawayLine.mentonianHyperactivity} readOnly />
                Sí
              </label>
              <label className="print-checkbox">
                <input type="checkbox" checked={!record.holdawayLine.mentonianHyperactivity} readOnly />
                No
              </label>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Salto de página */}
      <div className="page-break"></div>

      {/* PÁGINA 2 */}
      {/* Header repetido en página 2 */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1"></div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <div className="text-base font-bold">ORTODONCIA</div>
            <img src={logoImage} alt="Dental White" className="w-11 h-9 object-contain" />
          </div>
        </div>
      </div>

      {/* Número de página 2 */}
      <div className="page-number">Página 2 de 2</div>

      {/* Examen Bucal */}
      <div className="section-title">Examen Bucal</div>
      <table>
        <tbody>
          <tr>
            <th style={{width: '20%'}}>Relación Molar:</th>
            <td>{record.oralExam.molarRelation}</td>
            <th style={{width: '20%'}}>Canina:</th>
            <td>{record.oralExam.canineRelation}</td>
            <th style={{width: '20%'}}>Incisal:</th>
            <td>{record.oralExam.incisalRelation}</td>
          </tr>
          <tr>
            <th>Over Jet (MM):</th>
            <td>{record.oralExam.overJet}</td>
            <th>Over Bite (MM):</th>
            <td>{record.oralExam.overBite}</td>
            <th>Mordida Abierta (MM):</th>
            <td>{record.oralExam.openBite}</td>
          </tr>
          <tr>
            <th>Línea Media:</th>
            <td>{record.oralExam.midline}</td>
            <th>Dientes Ausentes:</th>
            <td>{record.oralExam.absentTeeth}</td>
            <th>Malformados:</th>
            <td>{record.oralExam.malformedTeeth}</td>
          </tr>
          <tr>
            <th>Con Caries:</th>
            <td>{record.oralExam.teethWithCavities}</td>
            <th>Temporales:</th>
            <td colSpan={3}>{record.oralExam.temporaryTeeth}</td>
          </tr>
          <tr>
            <th>Mordida Cruzada Posterior:</th>
            <td colSpan={5}>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.oralExam.posteriorCrossbite === 'unilateral'} readOnly />
                Unilateral
              </label>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.oralExam.posteriorCrossbite === 'bilateral'} readOnly />
                Bilateral
              </label>
            </td>
          </tr>
          <tr>
            <th>Técnica de Cepillado:</th>
            <td colSpan={2}>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.oralExam.brushingTechnique === 'good'} readOnly />
                Buena
              </label>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.oralExam.brushingTechnique === 'bad'} readOnly />
                Mala
              </label>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.oralExam.brushingTechnique === 'regular'} readOnly />
                Regular
              </label>
            </td>
            <th>Estado Parodontal:</th>
            <td colSpan={2}>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.oralExam.periodontalState === 'good'} readOnly />
                Bueno
              </label>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.oralExam.periodontalState === 'bad'} readOnly />
                Malo
              </label>
              <label className="print-checkbox">
                <input type="checkbox" checked={record.oralExam.periodontalState === 'regular'} readOnly />
                Regular
              </label>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Examen Radiográfico */}
      <div className="section-title">Examen Radiográfico</div>
      <table>
        <tbody>
          <tr>
            <th style={{width: '25%'}}>Cefalografía:</th>
            <td>{record.radiographicExam.cephalography}</td>
            <th style={{width: '25%'}}>Ortorradiales:</th>
            <td>{record.radiographicExam.orthoradial}</td>
          </tr>
          <tr>
            <th>Palmar:</th>
            <td>{record.radiographicExam.palmar}</td>
            <th>Oclusal:</th>
            <td>{record.radiographicExam.occlusal}</td>
          </tr>
          <tr>
            <th>Oblicua:</th>
            <td>{record.radiographicExam.oblique}</td>
            <th>Ortopantografías:</th>
            <td>{record.radiographicExam.orthopantography}</td>
          </tr>
          <tr>
            <th>Mesioradial:</th>
            <td>{record.radiographicExam.mesioradial}</td>
            <th>Ausencia Congénita:</th>
            <td>{record.radiographicExam.congenitalAbsence}</td>
          </tr>
          <tr>
            <th>Supernumerarios:</th>
            <td>{record.radiographicExam.supernumerary}</td>
            <th>Quistes:</th>
            <td>{record.radiographicExam.cysts}</td>
          </tr>
          <tr>
            <th>Lesiones Periapicales:</th>
            <td>{record.radiographicExam.periapicalLesions}</td>
            <th>Inclusiones:</th>
            <td>{record.radiographicExam.inclusions}</td>
          </tr>
          <tr>
            <th>Resorción Radicular:</th>
            <td>{record.radiographicExam.radicularResorption}</td>
            <th>Terceros Molares:</th>
            <td>{record.radiographicExam.thirdMolars}</td>
          </tr>
          <tr>
            <th>Raíces Enanas:</th>
            <td>{record.radiographicExam.dwarfRoots}</td>
            <th>Raíces Anormales:</th>
            <td>{record.radiographicExam.abnormalRoots}</td>
          </tr>
        </tbody>
      </table>

      {/* Observaciones */}
      <div className="section-title">Observaciones</div>
      <div style={{border: '1px solid #000', padding: '10px', minHeight: '60px', fontSize: '10px'}}>
        {record.observations}
      </div>

      {/* Firmas */}
      <div className="signature-area">
        <div className="signature-box">
          {record.patientSignature && (
            <div className="mb-2">
              <img src={record.patientSignature} alt="Firma del Paciente" className="h-16 border-b-2 border-black" />
            </div>
          )}
          <div className="signature-line">
            Firma del Paciente
          </div>
        </div>
        <div className="signature-box">
          {record.legalGuardianSignature && (
            <div className="mb-2">
              <img src={record.legalGuardianSignature} alt="Firma del Tutor" className="h-16 border-b-2 border-black" />
            </div>
          )}
          <div className="signature-line">
            Firma de la Persona Legalmente Responsable
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-xs text-gray-600">
        <p>Fecha de creación: {new Date(record.createdDate).toLocaleDateString('es-MX')}</p>
      </div>
    </div>
    </div>
  );
}