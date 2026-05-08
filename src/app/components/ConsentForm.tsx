import logoImage from 'figma:asset/da6a072baf78bdc68ca5368ac2123d8644ed8db8.png';

interface ConsentFormProps {
  patientName: string;
  doctorName: string;
}

export function ConsentForm({ patientName, doctorName }: ConsentFormProps) {
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleDateString('es-MX', { month: 'long' });
  const year = today.getFullYear();

  return (
    <div className="bg-white p-8 space-y-6 print:p-0">
      {/* Header with Logo */}
      <div className="flex items-start justify-between border-b pb-4">
        <img src={logoImage} alt="Dental White" className="w-24 h-auto object-contain" />
      </div>

      {/* Title */}
      <div className="text-center">
        <h2 className="font-bold text-base">CONSENTIMIENTO PARA TRATAMIENTO COSMÉTICO</h2>
        <p className="text-sm">(INCLUYE BLANQUEAMIENTO Y/O CARILLAS)</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4 text-sm">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold">Don/Dña:</span>
          <div className="flex-1 border-b border-gray-800 px-1">
            <span>{patientName}</span>
          </div>
          <span className="font-semibold ml-4">con DNI/NIE:</span>
          <div className="w-32 border-b border-gray-800 px-1">
            <span>_____________</span>
          </div>
        </div>

        <div className="border-b border-gray-800 px-1">
          <span className="text-xs italic">. En calidad de representante legal, familiar o allegado del paciente.</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-semibold">DECLARO:</span>
          <span>que el Dr/Dra.</span>
          <div className="w-48 border-b border-gray-800 px-1">
            <span>{doctorName}</span>
          </div>
          <span>me ha explicado que:</span>
        </div>
      </div>

      {/* Body Text */}
      <div className="space-y-4 text-xs leading-relaxed text-justify">
        <p>
          Entiendo que la odontología cosmética puede tener ciertos riesgos y posibles fracasos. Aunque se tenga el mayor cuidado y se 
          cuide de mantener el cuidado y competencia que se requiere, no hay garantía anticipada a los resultados del tratamiento o longevidad de este. Sin 
          embargo, asumo todos los riesgos y posibles fracasos asociados con pero no limitados a lo siguiente:
        </p>

        <div className="space-y-3 pl-4">
          <div>
            <span className="font-semibold">1. </span>
            <span>
              <strong>Reducción o desgaste de la superficie del diente:</strong> será necesario reducir y desgastar la superficie dentaria a la cual se 
              adherirá la carilla. Este proceso es conservativo posible, pero una vez hecho el desgaste, Ud. se compromete a hacer la carilla o coronas 
              para toda la vida. Si la carilla se rompe o se cae el diente queda susceptible a caries a no ser conducido en un tiempo razonable.
            </span>
          </div>

          <div>
            <span className="font-semibold">2. </span>
            <span>
              <strong>Sensibilidad de dientes:</strong> Como resultado de blanqueamientos, o durante el proceso de modificar el diente para recibir 
              una carilla existe la posibilidad de aumento de sensibilidad permanente temporal, la cual puede dar lugar a la necesidad de endodoncia, 
              blanqueamiento o la preparación del diente.
            </span>
          </div>

          <div>
            <span className="font-semibold">3. </span>
            <span>
              <strong>Remodelación, fractura o adherencia de la carilla:</strong> Puede ocurrir o caer a cualquier momento después de la cementación. 
              Muchos factores pueden contribuir a que esto suceda tales como: mascar materiales duros, cambios en la fuerza de oclusión, cambiar el 
              comer de comida de la masticación por otra que el odontólogo no conoce.
            </span>
          </div>

          <div>
            <span className="font-semibold">4. </span>
            <span>
              <strong>Sensibilidad o reacción alérgica de la encía a los materiales de blanqueamiento o agentes de pegar:</strong> Los tejidos de la 
              boca están expuestos a varios materiales usados en estos procedimientos los cuales pueden crear una reacción alérgica. También se me 
              puede morder el labio durante el proceso de inyección.
            </span>
          </div>

          <div>
            <span className="font-semibold">5. </span>
            <span>
              <strong>Apariencia Estética:</strong> Todo lo posible se hará para igualar la forma y el color de las carillas las cuales se harán para 
              verse lo mejor y patrones. Sin embargo, hay claras diferencias entre lo natural y lo artificial hecho por el humano de manera imposible 
              una forma y el color quedan perfectamente iguales al diente natural. Una vez que las carillas se hayan cementado si se desea un ajuste o 
              cambio de la carilla.
            </span>
          </div>

          <div>
            <span className="font-semibold">6. </span>
            <span>
              <strong>Longevidad:</strong> Es imposible determinar el tiempo que la carilla va a durar. Estos periodos pueden ser cortos o largos 
              dependiendo de cada situación personal y de hábitos internos.
            </span>
          </div>

          <div>
            <span className="font-semibold">7. </span>
            <span>
              <strong>Consideraciones para Blanqueamiento:</strong> El blanqueamiento se puede hacer en la oficina o en su casa. El grado de 
              blanqueamiento varía con cada persona y la mejoría de color. La mejoría es cambio considerable (1-3 tonos en la guía de colores) para 
              algunos pacientes los toma más tiempo alcanzar el blanqueamiento deseado. Café, te y tabaco manchan los dientes después del blanqueamiento 
              y se deben evitar por las primeras 24 horas después del tratamiento.
            </span>
          </div>
        </div>

        <p className="font-semibold">
          INFORMACIÓN DE CONSENTIMIENTO: Se me ha dado la oportunidad de hacer preguntas con respecto a las materiales y el 
          propósito del tratamiento cosmético y he recibido las respuestas a mi satisfacción. Yo voluntariamente asumo cualquier y todos 
          los posibles riesgos incluyendo un riesgo substancial et estuviera relacionado con una fase de tratamiento es de espera de obtener 
          los resultados deseados los cuales pueden o no ser alcanzados en un tiempo dado con respecto al resultado del tratamiento.
        </p>

        <p className="font-semibold">
          COMO PACIENTE (o su representante legal), en pleno uso de mis facultades, libre y voluntariamente, DECLARO que: 
          AUTORIZO al Dr/Dra. junto con sus colaboradores, para que me sea realizado el procedimiento
        </p>

        <div className="flex items-baseline gap-2 pt-4">
          <span>En Huanímaro, Gto. a</span>
          <div className="w-12 border-b border-gray-800 text-center">
            <span>{day}</span>
          </div>
          <span>de</span>
          <div className="w-32 border-b border-gray-800 text-center">
            <span>{month}</span>
          </div>
          <span>del</span>
          <div className="w-16 border-b border-gray-800 text-center">
            <span>{year}</span>
          </div>
          <span>.</span>
        </div>
      </div>

      {/* Signature Section */}
      <div className="grid grid-cols-2 gap-8 pt-12 mt-8">
        <div className="text-center space-y-2">
          <div className="border-b-2 border-gray-800 pb-16"></div>
          <p className="font-semibold text-sm">Firma del paciente</p>
          <p className="text-xs">(o su representante legal en caso de incapacidad) D.N.I.</p>
        </div>
        <div className="text-center space-y-2">
          <div className="border-b-2 border-gray-800 pb-16"></div>
          <p className="font-semibold text-sm">Firma del médico responsable</p>
          <p className="text-xs">Nombre y Nº de colegiado</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs pt-8 border-t border-gray-300 mt-8">
        <p className="font-semibold">
          DENTAL WHITE – Calle Álvaro Obregón #25, Zona Centro, Huanímaro, Guanajuato. CP 36990
        </p>
      </div>
    </div>
  );
}
