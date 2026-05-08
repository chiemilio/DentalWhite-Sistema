import { toast } from 'sonner';

export interface AppointmentConfirmationData {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  serviceName: string;
  date: string;
  time: string;
  workCenterName: string;
  workCenterAddress: string;
}

/**
 * Simula el envío de confirmación por correo electrónico
 */
export async function sendEmailConfirmation(data: AppointmentConfirmationData): Promise<boolean> {
  // Simular delay de envío
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simular respuesta exitosa del servidor
  console.log('📧 Enviando confirmación por correo a:', data.patientEmail);
  console.log('Detalles de la cita:', {
    paciente: data.patientName,
    servicio: data.serviceName,
    fecha: data.date,
    hora: data.time,
    sucursal: data.workCenterName,
  });

  // En producción, aquí se haría la llamada a la API
  // const response = await fetch('/api/send-email-confirmation', {
  //   method: 'POST',
  //   body: JSON.stringify(data),
  // });

  return true;
}

/**
 * Simula el envío de confirmación por WhatsApp
 */
export async function sendWhatsAppConfirmation(data: AppointmentConfirmationData): Promise<boolean> {
  // Simular delay de envío
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Formatear el número de teléfono
  const formattedPhone = data.patientPhone.replace(/\D/g, '');
  
  // Crear mensaje de WhatsApp
  const message = `
🦷 *DENTAL WHITE*

¡Hola ${data.patientName}!

Tu cita ha sido confirmada:

📋 *Servicio:* ${data.serviceName}
📅 *Fecha:* ${new Date(data.date + 'T12:00:00').toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}
🕐 *Hora:* ${data.time}
📍 *Sucursal:* ${data.workCenterName}
🏠 *Dirección:* ${data.workCenterAddress}

Por favor llega 10 minutos antes de tu cita.

Para cualquier cambio, contáctanos con anticipación.

¡Te esperamos! 😊
  `.trim();

  console.log('📱 Enviando confirmación por WhatsApp a:', formattedPhone);
  console.log('Mensaje:', message);

  // En producción, aquí se haría la llamada a la API de WhatsApp Business
  // const response = await fetch('/api/send-whatsapp', {
  //   method: 'POST',
  //   body: JSON.stringify({ phone: formattedPhone, message }),
  // });

  return true;
}

/**
 * Envía ambas confirmaciones (correo y WhatsApp) simultáneamente
 */
export async function sendAppointmentConfirmations(
  data: AppointmentConfirmationData
): Promise<{ email: boolean; whatsapp: boolean }> {
  try {
    const [emailResult, whatsappResult] = await Promise.all([
      sendEmailConfirmation(data),
      sendWhatsAppConfirmation(data),
    ]);

    if (emailResult && whatsappResult) {
      toast.success('Confirmaciones enviadas', {
        description: `Se enviaron confirmaciones por correo (${data.patientEmail}) y WhatsApp (${data.patientPhone})`,
        duration: 5000,
      });
    } else if (emailResult) {
      toast.warning('Confirmación parcial', {
        description: 'Se envió confirmación por correo, pero falló el envío por WhatsApp',
      });
    } else if (whatsappResult) {
      toast.warning('Confirmación parcial', {
        description: 'Se envió confirmación por WhatsApp, pero falló el envío por correo',
      });
    } else {
      toast.error('Error al enviar confirmaciones', {
        description: 'No se pudieron enviar las confirmaciones. Por favor, contacte al paciente manualmente.',
      });
    }

    return { email: emailResult, whatsapp: whatsappResult };
  } catch (error) {
    console.error('Error al enviar confirmaciones:', error);
    toast.error('Error al enviar confirmaciones');
    return { email: false, whatsapp: false };
  }
}

/**
 * Genera un mensaje de confirmación visual para mostrar en la UI
 */
export function getConfirmationMessage(data: AppointmentConfirmationData): string {
  return `
Cita confirmada para ${data.patientName}

📋 Servicio: ${data.serviceName}
📅 Fecha: ${new Date(data.date + 'T12:00:00').toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}
🕐 Hora: ${data.time}
📍 Sucursal: ${data.workCenterName}

✅ Confirmación enviada por:
   📧 Correo: ${data.patientEmail}
   📱 WhatsApp: ${data.patientPhone}
  `.trim();
}
