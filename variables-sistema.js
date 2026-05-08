/**
 * VARIABLES DEL SISTEMA - DENTAL WHITE
 * Archivo de configuración con todas las constantes y datos del sistema
 * Version: 0.0.1
 * Fecha: 25 de febrero de 2026
 */

// ============================================
// INFORMACIÓN GENERAL DEL SISTEMA
// ============================================

export const SYSTEM_INFO = {
  name: 'Dental White',
  slogan: 'Tu sonrisa, nuestra pasión',
  version: '0.0.1',
  type: 'module',
  projectName: '@figma/my-make-file',
};

// ============================================
// INFORMACIÓN DE CONTACTO
// ============================================

export const CONTACT_INFO = {
  phone1: '55 1234 5678',
  phone2: '55 8765 4321',
  whatsapp: '+52 1 429 130 9742',
  emailContact: 'contacto@dentalwhite.com',
  emailAppointments: 'citas@dentalwhite.com',
  mainAddress: 'Calle primero de mayo #9, Pénjamo Gto',
};

// ============================================
// INFORMACIÓN DEL DIRECTOR
// ============================================

export const DIRECTOR_INFO = {
  name: 'Dr. Faustino Vázquez Rodríguez',
  title: 'Cirujano Dentista',
  university: 'Universidad Michoacana de San Nicolás de Hidalgo (UMSNH)',
  specialty: 'Ortodoncia',
  diplomados: ['Implantología', 'Rehabilitación sobre prótesis'],
  masters: 'Periodoncia con implantes - Universidad Francisco de Victoria, Madrid, España',
};

// ============================================
// MISIÓN Y VISIÓN
// ============================================

export const MISSION =
  'Brindar atención odontológica para nuestros pacientes con un trato más cercano, honesto y respetuoso, ofreciendo soluciones mediante el uso de tecnología, procesos seguros y equipo capacitado, enfocados en la prevención de la salud bucal.';

export const VISION =
  'Ser un consultorio dental reconocido por su profesionalismo, atención empática, actualización constante y compromiso para mejorar la calidad de vida de nuestros pacientes. Ser competentes dentro del área de salud.';

// ============================================
// ROLES DE USUARIO
// ============================================

export const USER_ROLES = {
  PATIENT: 'patient',
  RECEPTIONIST: 'receptionist',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
};

export const USER_ROLES_ARRAY = [
  USER_ROLES.PATIENT,
  USER_ROLES.RECEPTIONIST,
  USER_ROLES.DOCTOR,
  USER_ROLES.ADMIN,
];

// ============================================
// USUARIOS DEL SISTEMA (MOCK)
// ============================================

export const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@dentalwhite.com',
    password: 'admin123',
    role: USER_ROLES.ADMIN,
    name: 'Administrador Principal',
  },
  {
    id: '2',
    email: 'recepcion@dentalwhite.com',
    password: 'recep123',
    role: USER_ROLES.RECEPTIONIST,
    name: 'María González',
    phone: '5511111111',
    workCenter: 'Sucursal Centro',
    hireDate: '2025-03-01',
    status: 'active',
  },
  {
    id: '3',
    email: 'doctor@dentalwhite.com',
    password: 'doctor123',
    role: USER_ROLES.DOCTOR,
    name: 'Dr. Carlos Méndez',
    phone: '5522222222',
    specialty: 'Odontología General',
    workCenter: 'Sucursal Centro',
    hireDate: '2025-02-01',
    status: 'active',
  },
  {
    id: '4',
    email: 'paciente@example.com',
    password: 'paciente123',
    role: USER_ROLES.PATIENT,
    name: 'Juan Pérez',
    phone: '5512345678',
    age: 32,
    sex: 'Masculino',
    address: 'Calle Principal 123',
    colony: 'Centro',
    delegation: 'Cuauhtémoc',
  },
];

// ============================================
// CENTROS DE TRABAJO / SUCURSALES
// ============================================

export const WORK_CENTERS = [
  {
    id: '1',
    name: 'Sucursal Centro',
    address: 'Av. Juárez 100, Centro',
    location: 'Calle primero de mayo #9, Pénjamo Gto',
    colorTheme: 'sky',
    phone: '55 1234 5678',
  },
  {
    id: '2',
    name: 'Sucursal Norte',
    address: 'Av. Insurgentes 200, Polanco',
    location: 'Centro, Valle de Santiago Gto',
    colorTheme: 'blue',
    phone: '55 8765 4321',
  },
  {
    id: '3',
    name: 'Sucursal Sur',
    address: 'Av. Universidad 300, Coyoacán',
    location: 'Centro, Abasolo Gto',
    colorTheme: 'cyan',
    phone: '55 1234 5678',
  },
];

// ============================================
// SERVICIOS DENTALES
// ============================================

export const SERVICES = [
  // Servicios de Pénjamo
  {
    id: '1',
    name: 'Limpieza Dental',
    description:
      'Es el cuidado preventivo para mantener una buena higiene de la boca. La falta de higiene conllevar una acumulación excesiva de placa bacteriana y sarro en la boca que pueden desembocar en Enfermedades Dentales',
    branch: 'Pénjamo',
    examplePrice: 500,
  },
  {
    id: '2',
    name: 'Ortodoncia',
    description:
      'Corrige la mala posición de los huesos y dientes mediante la aplicación de diferentes tipos de fuerzas con aparatos, su objetivo es alinear los dientes, corregir problemas de mordida, mejorar la estética y función bucal.',
    branch: 'Pénjamo',
    examplePrice: 15000,
  },
  {
    id: '3',
    name: 'Endodoncia',
    description:
      'Consiste en eliminar una parte profunda del diente, la cual se encuentra lesionada o infectada, algunos de los principales motivos para realizarla es limpiar una parte del diente por dentro y rellenarla con otro material.',
    branch: 'Pénjamo',
    examplePrice: 1500,
  },
  {
    id: '4',
    name: 'Extracción',
    description:
      'Es la eliminación por completo un diente de su cavidad. Se realiza por caries severas, infecciones, enfermedad periodontal, fracturas o para ortodoncia.',
    branch: 'Pénjamo',
    examplePrice: 800,
  },
  {
    id: '5',
    name: 'Blanqueamiento',
    description:
      'Es un tratamiento estético no invasivo para eliminar las manchas y la suciedad de los dientes, con el objetivo de tener un tono más blanco y brillante de las piezas.',
    branch: 'Pénjamo',
    examplePrice: 3000,
  },
  {
    id: '6',
    name: 'Prótesis Dentales',
    description:
      'Es un dispositivo artificial, diseñado para restaurar la funcionalidad y estética de la boca al sustituir uno o más dientes perdidos o dañados. Mejora la masticación, el habla y la apariencia facial, y puede ser fija o removible.',
    branch: 'Pénjamo',
  },
  {
    id: '7',
    name: 'Revisión General',
    description:
      'Examen exhaustivo y preventivo para evaluar el estado integral de la salud bucodental. Consiste en la inspección de dientes, encías, lengua, boca y articulación temporomandibular para detectar problemas antes de que causen dolor.',
    branch: 'Pénjamo',
    examplePrice: 300,
  },
  // Servicios de Valle de Santiago
  {
    id: '8',
    name: 'Prótesis Dentales',
    description:
      'Es un dispositivo artificial, diseñado para restaurar la funcionalidad y estética de la boca al sustituir uno o más dientes perdidos o dañados. Mejora la masticación, el habla y la apariencia facial, y puede ser fija o removible.',
    branch: 'Valle de Santiago',
  },
  {
    id: '9',
    name: 'Implantes Dentales',
    description:
      'Son raíces artificiales de titanio que se colocan en el hueso maxilar para reemplazar dientes perdidos. Ofrecen una solución permanente y natural para recuperar la función masticatoria y estética dental.',
    branch: 'Valle de Santiago',
  },
  {
    id: '10',
    name: 'Cirugía Maxilofacial',
    description:
      'Especialidad quirúrgica que trata enfermedades, lesiones y defectos en la cabeza, cuello, cara, mandíbulas y tejidos duros y blandos de la región oral y maxilofacial.',
    branch: 'Valle de Santiago',
  },
  {
    id: '11',
    name: 'Periodoncia',
    description:
      'Tratamiento especializado de las encías y el hueso que soporta los dientes. Previene y trata enfermedades periodontales como gingivitis y periodontitis.',
    branch: 'Valle de Santiago',
  },
  // Servicios de Abasolo
  {
    id: '12',
    name: 'Odontopediatría',
    description:
      'Atención dental especializada para niños desde la infancia hasta la adolescencia. Cuidamos la salud bucal de los más pequeños con técnicas adaptadas a su edad.',
    branch: 'Abasolo',
  },
  {
    id: '13',
    name: 'Diseño de Sonrisa',
    description:
      'Tratamiento estético integral que combina diferentes procedimientos para lograr la sonrisa perfecta. Incluye carillas, blanqueamiento y alineación dental.',
    branch: 'Abasolo',
  },
  {
    id: '14',
    name: 'Coronas y Puentes',
    description:
      'Restauraciones dentales fijas que cubren o reemplazan dientes dañados o perdidos. Devuelven la funcionalidad y estética a tu sonrisa.',
    branch: 'Abasolo',
  },
  {
    id: '15',
    name: 'Rehabilitación Oral',
    description:
      'Tratamiento integral que combina diferentes especialidades para restaurar la función, estética y salud de toda la boca.',
    branch: 'Abasolo',
  },
];

// ============================================
// PACIENTES DE EJEMPLO
// ============================================

export const MOCK_PATIENTS = [
  {
    id: '4',
    name: 'Juan Pérez',
    email: 'paciente@example.com',
    phone: '5512345678',
    age: 32,
    sex: 'Masculino',
    address: 'Calle Principal 123',
    colony: 'Centro',
    municipality: 'Cuauhtémoc',
    occupation: 'Ingeniero',
    patientType: 'Regular',
    registrationDate: '2026-01-15',
  },
  {
    id: '5',
    name: 'María López',
    email: 'maria.lopez@example.com',
    phone: '5523456789',
    age: 28,
    sex: 'Femenino',
    address: 'Av. Reforma 456',
    colony: 'Polanco',
    municipality: 'Miguel Hidalgo',
    occupation: 'Diseñadora',
    patientType: 'Regular',
    registrationDate: '2026-01-20',
  },
  {
    id: '6',
    name: 'Ana Rodríguez',
    email: 'ana.rodriguez@example.com',
    phone: '5534567890',
    age: 45,
    sex: 'Femenino',
    address: 'Calle Norte 789',
    colony: 'Del Valle',
    municipality: 'Benito Juárez',
    occupation: 'Abogada',
    patientType: 'Primera vez',
    registrationDate: '2026-02-01',
  },
  {
    id: '7',
    name: 'Carlos Martínez',
    email: 'carlos.martinez@example.com',
    phone: '5545678901',
    age: 12,
    sex: 'Masculino',
    address: 'Calle Sur 321',
    colony: 'Coyoacán',
    municipality: 'Coyoacán',
    tutor: 'Roberto Martínez',
    occupation: 'Estudiante',
    patientType: 'Pediátrico',
    registrationDate: '2026-02-05',
  },
];

// ============================================
// EMPLEADOS DEL SISTEMA
// ============================================

export const MOCK_EMPLOYEES = [
  {
    id: '1',
    name: 'Administrador Principal',
    email: 'admin@dentalwhite.com',
    role: USER_ROLES.ADMIN,
    phone: '5500000000',
    hireDate: '2025-01-01',
    status: 'active',
  },
  {
    id: '2',
    name: 'María González',
    email: 'recepcion@dentalwhite.com',
    role: USER_ROLES.RECEPTIONIST,
    phone: '5511111111',
    workCenter: 'Sucursal Centro',
    hireDate: '2025-03-01',
    status: 'active',
  },
  {
    id: '3',
    name: 'Dr. Carlos Méndez',
    email: 'doctor@dentalwhite.com',
    role: USER_ROLES.DOCTOR,
    phone: '5522222222',
    specialty: 'Odontología General',
    workCenter: 'Sucursal Centro',
    hireDate: '2025-02-01',
    status: 'active',
  },
  {
    id: '7',
    name: 'Dra. Laura Sánchez',
    email: 'laura.sanchez@dentalwhite.com',
    role: USER_ROLES.DOCTOR,
    phone: '5533333333',
    specialty: 'Endodoncia',
    workCenter: 'Sucursal Norte',
    hireDate: '2025-04-01',
    status: 'active',
  },
];

// ============================================
// ESTADOS Y TIPOS
// ============================================

export const APPOINTMENT_STATUSES = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const APPOINTMENT_STATUSES_ARRAY = [
  APPOINTMENT_STATUSES.SCHEDULED,
  APPOINTMENT_STATUSES.CONFIRMED,
  APPOINTMENT_STATUSES.COMPLETED,
  APPOINTMENT_STATUSES.CANCELLED,
];

export const PAYMENT_TYPES = {
  COMPLETE: 'complete',
  INSTALLMENT: 'installment',
};

export const PAYMENT_TYPES_ARRAY = [PAYMENT_TYPES.COMPLETE, PAYMENT_TYPES.INSTALLMENT];

export const PATIENT_TYPES = {
  REGULAR: 'Regular',
  FIRST_TIME: 'Primera vez',
  PEDIATRIC: 'Pediátrico',
};

export const PATIENT_TYPES_ARRAY = [
  PATIENT_TYPES.REGULAR,
  PATIENT_TYPES.FIRST_TIME,
  PATIENT_TYPES.PEDIATRIC,
];

export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

// ============================================
// CONFIGURACIÓN DE TEMA
// ============================================

export const THEME_COLORS = {
  primary: '#0284c7',
  secondary: '#0ea5e9',
  accent: '#2563eb',
  background: '#ffffff',
  foreground: 'oklch(0.145 0 0)',
  destructive: '#d4183d',
  muted: '#ececf0',
  border: 'rgba(0, 0, 0, 0.1)',
};

export const BRAND_COLORS = {
  penjamo: 'sky',
  valleSantiago: 'blue',
  abasolo: 'cyan',
};

export const TYPOGRAPHY = {
  baseFontSize: '16px',
  fontWeightMedium: 500,
  fontWeightNormal: 400,
};

export const BORDER_RADIUS = {
  sm: '0.375rem', // 6px
  md: '0.475rem', // 7.6px
  lg: '0.625rem', // 10px
  xl: '0.875rem', // 14px
};

// ============================================
// CONFIGURACIÓN DE CAPTCHA
// ============================================

export const CAPTCHA_CONFIG = {
  length: 6,
  allowedChars: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
  excludedChars: ['O', '0', 'I', '1'], // Para evitar confusión
};

// ============================================
// FORMATOS
// ============================================

export const DATE_FORMATS = {
  date: 'YYYY-MM-DD',
  time: 'HH:MM',
  displayDate: 'DD/MM/YYYY',
  displayDateTime: 'DD/MM/YYYY HH:MM',
};

// ============================================
// ASSETS E IMÁGENES
// ============================================

export const ASSETS = {
  logo: 'figma:asset/da6a072baf78bdc68ca5368ac2123d8644ed8db8.png',
  doctorImage: 'figma:asset/7fc5ebdb2d35bffb567c0b8e0cfaa57931319cdb.png',
  promotionBanner: 'figma:asset/6d65dfbab9e3b3e5a0f0c7e8e8f9d1959319b4ca.png',
  clinicImages: [
    'figma:asset/9e7301732c603d31964f65f6cf46f690c1180b7e.png',
    'figma:asset/e6e4c220d725c1048ef64dcbcb5cfa603119322d.png',
    'figma:asset/42b0afd7abc99fbcc119fca151c6748bdb2e634d.png',
  ],
};

// ============================================
// OPCIONES DE EXPEDIENTE MÉDICO
// ============================================

export const MEDICAL_RECORD_OPTIONS = {
  physicalStates: ['good', 'bad', 'regular'],
  dentalStates: ['good', 'bad', 'regular'],
  faceForms: ['symmetric', 'asymmetric'],
  labialMusculature: ['weak', 'normal', 'strong'],
  crossbiteTypes: ['unilateral', 'bilateral'],
  techniqueQuality: ['good', 'bad', 'regular'],
};

// ============================================
// REPORTES Y FILTROS
// ============================================

export const REPORT_TYPES = [
  'Servicios más solicitados',
  'Ingresos por sucursal',
  'Citas por sucursal',
  'Total de consultas',
];

export const PERIOD_FILTERS = {
  MONTHLY: 'monthly',
  ANNUAL: 'annual',
  CUSTOM: 'custom',
};

export const PERIOD_FILTERS_ARRAY = [
  PERIOD_FILTERS.MONTHLY,
  PERIOD_FILTERS.ANNUAL,
  PERIOD_FILTERS.CUSTOM,
];

// ============================================
// CONFIGURACIÓN DE SISTEMA
// ============================================

export const SYSTEM_CONFIG = {
  sessionTimeout: null, // Sin timeout definido
  toastDuration: 4000, // 4 segundos (default de Sonner)
  maxUploadSize: 5 * 1024 * 1024, // 5MB
  allowedImageFormats: ['image/jpeg', 'image/png', 'image/gif'],
  allowedDocumentFormats: ['application/pdf'],
};

// ============================================
// RUTAS DEL SISTEMA
// ============================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD_PATIENT: '/dashboard/patient',
  DASHBOARD_RECEPTIONIST: '/dashboard/receptionist',
  DASHBOARD_DOCTOR: '/dashboard/doctor',
  DASHBOARD_ADMIN: '/dashboard/admin',
};

// ============================================
// MENSAJES DEL SISTEMA
// ============================================

export const MESSAGES = {
  success: {
    login: 'Inicio de sesión exitoso',
    register: 'Registro completado con éxito',
    appointmentCreated: 'Cita creada exitosamente',
    appointmentUpdated: 'Cita actualizada correctamente',
    appointmentCancelled: 'Cita cancelada',
    recordSaved: 'Expediente guardado correctamente',
  },
  error: {
    loginFailed: 'Credenciales incorrectas',
    emailExists: 'El email ya está registrado',
    requiredFields: 'Por favor completa todos los campos requeridos',
    networkError: 'Error de conexión. Intenta de nuevo',
    unauthorized: 'No tienes permisos para esta acción',
  },
  validation: {
    invalidEmail: 'Email inválido',
    invalidPhone: 'Teléfono inválido',
    passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
    captchaRequired: 'Por favor completa el captcha',
    captchaIncorrect: 'Código captcha incorrecto',
  },
};

// ============================================
// CREDENCIALES DE ACCESO (SOLO DESARROLLO)
// ============================================

export const DEV_CREDENTIALS = {
  admin: {
    email: 'admin@dentalwhite.com',
    password: 'admin123',
  },
  receptionist: {
    email: 'recepcion@dentalwhite.com',
    password: 'recep123',
  },
  doctor: {
    email: 'doctor@dentalwhite.com',
    password: 'doctor123',
  },
  patient: {
    email: 'paciente@example.com',
    password: 'paciente123',
  },
};

// ============================================
// EXPORTACIÓN DEFAULT
// ============================================

export default {
  SYSTEM_INFO,
  CONTACT_INFO,
  DIRECTOR_INFO,
  MISSION,
  VISION,
  USER_ROLES,
  MOCK_USERS,
  WORK_CENTERS,
  SERVICES,
  MOCK_PATIENTS,
  MOCK_EMPLOYEES,
  APPOINTMENT_STATUSES,
  PAYMENT_TYPES,
  PATIENT_TYPES,
  THEME_COLORS,
  BRAND_COLORS,
  TYPOGRAPHY,
  BORDER_RADIUS,
  CAPTCHA_CONFIG,
  DATE_FORMATS,
  ASSETS,
  MEDICAL_RECORD_OPTIONS,
  REPORT_TYPES,
  PERIOD_FILTERS,
  SYSTEM_CONFIG,
  ROUTES,
  MESSAGES,
  DEV_CREDENTIALS,
};
