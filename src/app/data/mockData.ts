// Mock data for the dental clinic system

export interface Service {
  id: string;
  name: string;
  description: string;
  price?: string;
  duration?: string;
  branch?: string; // Sucursal
}

export const services: Service[] = [
  // Servicios de Pénjamo
  {
    id: '1',
    name: 'Limpieza Dental',
    description: 'Es el cuidado preventivo para mantener una buena higiene de la boca. La falta de higiene conllevar una acumulación excesiva de placa bacteriana y sarro en la boca que pueden desembocar en Enfermedades Dentales',
    branch: 'Pénjamo',
  },
  {
    id: '2',
    name: 'Ortodoncia',
    description: 'Corrige la mala posición de los huesos y dientes mediante la aplicación de diferentes tipos de fuerzas con aparatos, su objetivo es alinear los dientes, corregir problemas de mordida, mejorar la estética y función bucal.',
    branch: 'Pénjamo',
  },
  {
    id: '3',
    name: 'Endodoncia',
    description: 'Consiste en eliminar una parte profunda del diente, la cual se encuentra lesionada o infectada, algunos de los principales motivos para realizarla es limpiar una parte del diente por dentro y rellenarla con otro material.',
    branch: 'Pénjamo',
  },
  {
    id: '4',
    name: 'Extracción',
    description: 'Es la eliminación por completo un diente de su cavidad. Se realiza por caries severas, infecciones, enfermedad periodontal, fracturas o para ortodoncia.',
    branch: 'Pénjamo',
  },
  {
    id: '5',
    name: 'Blanqueamiento',
    description: 'Es un tratamiento estético no invasivo para eliminar las manchas y la suciedad de los dientes, con el objetivo de tener un tono más blanco y brillante de las piezas.',
    branch: 'Pénjamo',
  },
  
  // Servicios de Valle de Santiago
  {
    id: '8',
    name: 'Prótesis Dentales',
    description: 'Es un dispositivo artificial, diseñado para restaurar la funcionalidad y estética de la boca al sustituir uno o más dientes perdidos o dañados. Mejora la masticación, el habla y la apariencia facial, y puede ser fija o removible.',
    branch: 'Valle de Santiago',
  },
  {
    id: '9',
    name: 'Implantes Dentales',
    description: 'Son raíces artificiales de titanio que se colocan en el hueso maxilar para reemplazar dientes perdidos. Ofrecen una solución permanente y natural para recuperar la función masticatoria y estética dental.',
    branch: 'Valle de Santiago',
  },
  {
    id: '10',
    name: 'Cirugía Maxilofacial',
    description: 'Especialidad quirúrgica que trata enfermedades, lesiones y defectos en la cabeza, cuello, cara, mandíbulas y tejidos duros y blandos de la región oral y maxilofacial.',
    branch: 'Valle de Santiago',
  },
  {
    id: '11',
    name: 'Periodoncia',
    description: 'Tratamiento especializado de las encías y el hueso que soporta los dientes. Previene y trata enfermedades periodontales como gingivitis y periodontitis.',
    branch: 'Valle de Santiago',
  },
  
  // Servicios de Abasolo
  {
    id: '12',
    name: 'Odontopediatría',
    description: 'Atención dental especializada para niños desde la infancia hasta la adolescencia. Cuidamos la salud bucal de los más pequeños con técnicas adaptadas a su edad.',
    branch: 'Abasolo',
  },
  {
    id: '13',
    name: 'Diseño de Sonrisa',
    description: 'Tratamiento estético integral que combina diferentes procedimientos para lograr la sonrisa perfecta. Incluye carillas, blanqueamiento y alineación dental.',
    branch: 'Abasolo',
  },
  {
    id: '14',
    name: 'Coronas y Puentes',
    description: 'Restauraciones dentales fijas que cubren o reemplazan dientes dañados o perdidos. Devuelven la funcionalidad y estética a tu sonrisa.',
    branch: 'Abasolo',
  },
  {
    id: '15',
    name: 'Rehabilitación Oral',
    description: 'Tratamiento integral que combina diferentes especialidades para restaurar la función, estética y salud de toda la boca.',
    branch: 'Abasolo',
  },
  
  // Servicios generales (disponibles en todas)
  {
    id: '6',
    name: 'Prótesis Dentales',
    description: 'Es un dispositivo artificial, diseñado para restaurar la funcionalidad y estética de la boca al sustituir uno o más dientes perdidos o dañados. Mejora la masticación, el habla y la apariencia facial, y puede ser fija o removible.',
    branch: 'Pénjamo',
  },
  {
    id: '7',
    name: 'Revisión General',
    description: 'Examen exhaustivo y preventivo para evaluar el estado integral de la salud bucodental. Consiste en la inspección de dientes, encías, lengua, boca y articulación temporomandibular para detectar problemas antes de que causen dolor.',
    branch: 'Pénjamo',
  },
];

export interface WorkCenter {
  id: string;
  name: string;
  address: string;
}

export const workCenters: WorkCenter[] = [
  { id: '1', name: 'Pénjamo', address: 'Calle primero de mayo #9, Pénjamo Gto' },
  { id: '2', name: 'Valle de Santiago', address: 'Centro, Valle de Santiago Gto' },
  { id: '3', name: 'Abasolo', address: 'Abasolo Gto' },
];

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  serviceId: string;
  serviceName: string;
  workCenterId: string;
  workCenterName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  doctorId?: string;
  doctorName?: string;
  // Payment information
  servicePrice?: number;
  amountPaid?: number;
  paymentType?: 'complete' | 'installment';
  numberOfPayments?: number;
  currentPayment?: number;
}

export const appointments: Appointment[] = [
  {
    id: '1',
    patientId: '4',
    patientName: 'Juan Pérez',
    serviceId: '1',
    serviceName: 'Limpieza Dental',
    workCenterId: '1',
    workCenterName: 'Pénjamo',
    date: '2026-02-15',
    time: '10:00',
    status: 'scheduled',
    doctorId: '3',
    doctorName: 'Dr. Carlos Méndez',
    servicePrice: 500,
    amountPaid: 500,
    paymentType: 'complete',
  },
  {
    id: '2',
    patientId: '5',
    patientName: 'María López',
    serviceId: '7',
    serviceName: 'Revisión General',
    workCenterId: '1',
    workCenterName: 'Pénjamo',
    date: '2026-02-12',
    time: '11:00',
    status: 'confirmed',
    doctorId: '3',
    doctorName: 'Dr. Carlos Méndez',
    servicePrice: 300,
    amountPaid: 300,
    paymentType: 'complete',
  },
  {
    id: '3',
    patientId: '6',
    patientName: 'Ana Rodríguez',
    serviceId: '3',
    serviceName: 'Endodoncia',
    workCenterId: '2',
    workCenterName: 'Valle de Santiago',
    date: '2026-02-13',
    time: '14:00',
    status: 'scheduled',
    doctorId: '7',
    doctorName: 'Dra. Laura Sánchez',
    servicePrice: 1500,
    amountPaid: 500,
    paymentType: 'installment',
    numberOfPayments: 3,
    currentPayment: 1,
  },
  {
    id: '4',
    patientId: '7',
    patientName: 'Carlos Martínez',
    serviceId: '2',
    serviceName: 'Ortodoncia',
    workCenterId: '1',
    workCenterName: 'Pénjamo',
    date: '2026-02-14',
    time: '09:00',
    status: 'confirmed',
    doctorId: '3',
    doctorName: 'Dr. Carlos Méndez',
    servicePrice: 15000,
    amountPaid: 5000,
    paymentType: 'installment',
    numberOfPayments: 3,
    currentPayment: 1,
  },
  {
    id: '5',
    patientId: '4',
    patientName: 'Juan Pérez',
    serviceId: '7',
    serviceName: 'Revisión General',
    workCenterId: '1',
    workCenterName: 'Pénjamo',
    date: '2026-02-14',
    time: '11:30',
    status: 'confirmed',
    doctorId: '3',
    doctorName: 'Dr. Carlos Méndez',
    servicePrice: 300,
    amountPaid: 300,
    paymentType: 'complete',
  },
  {
    id: '6',
    patientId: '5',
    patientName: 'María López',
    serviceId: '5',
    serviceName: 'Blanqueamiento',
    workCenterId: '1',
    workCenterName: 'Pénjamo',
    date: '2026-02-14',
    time: '15:00',
    status: 'scheduled',
    doctorId: '3',
    doctorName: 'Dr. Carlos Méndez',
    servicePrice: 3000,
    amountPaid: 3000,
    paymentType: 'complete',
  },
  {
    id: '7',
    patientId: '6',
    patientName: 'Ana Rodríguez',
    serviceId: '4',
    serviceName: 'Extracción',
    workCenterId: '1',
    workCenterName: 'Pénjamo',
    date: '2026-02-14',
    time: '16:30',
    status: 'scheduled',
    doctorId: '3',
    doctorName: 'Dr. Carlos Méndez',
    servicePrice: 800,
    amountPaid: 800,
    paymentType: 'complete',
  },
  {
    id: '8',
    patientId: '7',
    patientName: 'Carlos Martínez',
    serviceId: '1',
    serviceName: 'Limpieza Dental',
    workCenterId: '1',
    workCenterName: 'Pénjamo',
    date: '2026-02-15',
    time: '09:00',
    status: 'confirmed',
    doctorId: '3',
    doctorName: 'Dr. Carlos Méndez',
    servicePrice: 500,
    amountPaid: 500,
    paymentType: 'complete',
  },
  {
    id: '9',
    patientId: '5',
    patientName: 'María López',
    serviceId: '3',
    serviceName: 'Endodoncia',
    workCenterId: '1',
    workCenterName: 'Pénjamo',
    date: '2026-02-15',
    time: '14:00',
    status: 'confirmed',
    doctorId: '3',
    doctorName: 'Dr. Carlos Méndez',
    servicePrice: 2500,
    amountPaid: 1000,
    paymentType: 'installment',
    numberOfPayments: 3,
    currentPayment: 1,
  },
  {
    id: '10',
    patientId: '6',
    patientName: 'Ana Rodríguez',
    serviceId: '6',
    serviceName: 'Prótesis Dentales',
    workCenterId: '1',
    workCenterName: 'Pénjamo',
    date: '2026-02-16',
    time: '10:00',
    status: 'scheduled',
    doctorId: '3',
    doctorName: 'Dr. Carlos Méndez',
    servicePrice: 8000,
    amountPaid: 2000,
    paymentType: 'installment',
    numberOfPayments: 4,
    currentPayment: 1,
  },
  {
    id: '11',
    patientId: '4',
    patientName: 'Juan Pérez',
    serviceId: '5',
    serviceName: 'Blanqueamiento',
    workCenterId: '1',
    workCenterName: 'Pénjamo',
    date: '2026-02-16',
    time: '12:00',
    status: 'scheduled',
    doctorId: '3',
    doctorName: 'Dr. Carlos Méndez',
    servicePrice: 3000,
    amountPaid: 3000,
    paymentType: 'complete',
  },
  {
    id: '12',
    patientId: '7',
    patientName: 'Carlos Martínez',
    serviceId: '7',
    serviceName: 'Revisión General',
    workCenterId: '1',
    workCenterName: 'Pénjamo',
    date: '2026-02-17',
    time: '09:30',
    status: 'scheduled',
    doctorId: '3',
    doctorName: 'Dr. Carlos Méndez',
    servicePrice: 300,
    amountPaid: 300,
    paymentType: 'complete',
  },
  {
    id: '13',
    patientId: '5',
    patientName: 'María López',
    serviceId: '4',
    serviceName: 'Extracción',
    workCenterId: '1',
    workCenterName: 'Pénjamo',
    date: '2026-02-17',
    time: '11:00',
    status: 'confirmed',
    doctorId: '3',
    doctorName: 'Dr. Carlos Méndez',
    servicePrice: 800,
    amountPaid: 800,
    paymentType: 'complete',
  },
  {
    id: '14',
    patientId: '6',
    patientName: 'Ana Rodríguez',
    serviceId: '1',
    serviceName: 'Limpieza Dental',
    workCenterId: '1',
    workCenterName: 'Pénjamo',
    date: '2026-02-18',
    time: '10:00',
    status: 'scheduled',
    doctorId: '3',
    doctorName: 'Dr. Carlos Méndez',
    servicePrice: 500,
    amountPaid: 500,
    paymentType: 'complete',
  },
  {
    id: '15',
    patientId: '4',
    patientName: 'Juan Pérez',
    serviceId: '2',
    serviceName: 'Ortodoncia',
    workCenterId: '1',
    workCenterName: 'Pénjamo',
    date: '2026-02-18',
    time: '14:30',
    status: 'scheduled',
    doctorId: '3',
    doctorName: 'Dr. Carlos Méndez',
    servicePrice: 15000,
    amountPaid: 3000,
    paymentType: 'installment',
    numberOfPayments: 5,
    currentPayment: 1,
  },
];

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  createdDate: string;
  startDate?: string;
  endDate?: string;
  address: string;
  phone: string;
  occupation: string;
  age: number;
  reference: string;
  sex: string;
  colony: string;
  delegation: string;
  postalCode: string;
  tutor?: string;
  
  // Información del doctor
  assignedDoctor: string;
  
  // Historia Clínica
  clinicalHistory: {
    physicalState: 'good' | 'bad' | 'regular';
    dentalState: 'good' | 'bad' | 'regular';
  };
  
  // Antecedentes
  pathologicalHistory: {
    tonsillitis: boolean;
    adenoids: boolean;
    herpes: boolean;
    flu: boolean;
    respiratoryProblems: boolean;
  };
  
  nonPathologicalHistory: {
    lip: boolean;
    tongue: boolean;
    objects: boolean;
    finger: boolean;
    other: string;
  };
  
  habitFrequency: string;
  habitDuration: string;
  habitIntensity: string;
  receivedMedicalAttention: boolean;
  medicalAttentionCause: string;
  
  // Examen de la Cara
  faceExam: {
    form: 'symmetric' | 'asymmetric' | '';
    profile: string;
    ears: string;
    tic: string;
    rictus: string;
    bipupilarLine: string;
  };
  
  // Línea de Holdaway
  holdawayLine: {
    labialMusculature: 'weak' | 'normal' | 'strong' | '';
    mentonianHyperactivity: boolean;
  };
  
  // Examen Bucal
  oralExam: {
    molarRelation: string;
    canineRelation: string;
    incisalRelation: string;
    overJet: string;
    overBite: string;
    openBite: string;
    midline: string;
    absentTeeth: string;
    malformedTeeth: string;
    teethWithCavities: string;
    temporaryTeeth: string;
    posteriorCrossbite: 'unilateral' | 'bilateral' | '';
    brushingTechnique: 'good' | 'bad' | 'regular' | '';
    periodontalState: 'good' | 'bad' | 'regular' | '';
  };
  
  // Examen Radiográfico
  radiographicExam: {
    cephalography: string;
    orthoradial: string;
    palmar: string;
    occlusal: string;
    oblique: string;
    orthopantography: string;
    mesioradial: string;
    congenitalAbsence: string;
    supernumerary: string;
    cysts: string;
    periapicalLesions: string;
    inclusions: string;
    radicularResorption: string;
    thirdMolars: string;
    dwarfRoots: string;
    abnormalRoots: string;
  };
  
  // Firmas
  patientSignature?: string; // Base64 de la firma
  legalGuardianSignature?: string; // Base64 de la firma
  
  observations: string;
  
  // Control de citas
  appointmentHistory: {
    number: number;
    date: string;
    activity: string;
    doctor: string;
  }[];
}

export const medicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '4',
    patientName: 'Juan Pérez',
    createdDate: '2026-01-15',
    startDate: '2026-01-15',
    address: 'Calle Principal 123, Centro',
    phone: '5512345678',
    occupation: 'Ingeniero',
    age: 32,
    reference: 'Recomendación familiar',
    sex: 'Masculino',
    colony: 'Centro',
    delegation: 'Cuauhtémoc',
    postalCode: '06000',
    assignedDoctor: 'Dr. Carlos Méndez',
    clinicalHistory: {
      physicalState: 'good',
      dentalState: 'good',
    },
    pathologicalHistory: {
      tonsillitis: false,
      adenoids: false,
      herpes: false,
      flu: false,
      respiratoryProblems: false,
    },
    nonPathologicalHistory: {
      lip: false,
      tongue: false,
      objects: false,
      finger: false,
      other: '',
    },
    habitFrequency: 'Nunca',
    habitDuration: 'Nunca',
    habitIntensity: 'Nunca',
    receivedMedicalAttention: false,
    medicalAttentionCause: '',
    faceExam: {
      form: 'symmetric',
      profile: 'Normal',
      ears: 'Normales',
      tic: 'No',
      rictus: 'Normal',
      bipupilarLine: 'Normal',
    },
    holdawayLine: {
      labialMusculature: 'normal',
      mentonianHyperactivity: false,
    },
    oralExam: {
      molarRelation: 'Normal',
      canineRelation: 'Normal',
      incisalRelation: 'Normal',
      overJet: 'Normal',
      overBite: 'Normal',
      openBite: 'No',
      midline: 'Normal',
      absentTeeth: 'Ninguna',
      malformedTeeth: 'Ninguna',
      teethWithCavities: 'Ninguna',
      temporaryTeeth: 'Ninguna',
      posteriorCrossbite: '',
      brushingTechnique: 'good',
      periodontalState: 'good',
    },
    radiographicExam: {
      cephalography: 'Normal',
      orthoradial: 'Normal',
      palmar: 'Normal',
      occlusal: 'Normal',
      oblique: 'Normal',
      orthopantography: 'Normal',
      mesioradial: 'Normal',
      congenitalAbsence: 'Ninguna',
      supernumerary: 'Ninguna',
      cysts: 'Ninguna',
      periapicalLesions: 'Ninguna',
      inclusions: 'Ninguna',
      radicularResorption: 'Ninguna',
      thirdMolars: 'Ninguna',
      dwarfRoots: 'Ninguna',
      abnormalRoots: 'Ninguna',
    },
    observations: 'Paciente con buena salud dental general. Se recomienda limpieza cada 6 meses.',
    appointmentHistory: [
      {
        number: 1,
        date: '2026-01-15',
        activity: 'Revisión inicial',
        doctor: 'Dr. Carlos Méndez',
      },
      {
        number: 2,
        date: '2026-01-20',
        activity: 'Limpieza dental',
        doctor: 'Dr. Carlos Méndez',
      },
    ],
  },
];

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age?: number;
  sex?: string;
  address?: string;
  colony?: string;
  delegation?: string;
  municipality?: string;
  tutor?: string;
  occupation?: string;
  patientType?: string;
  workCenter?: string; // Sucursal del paciente
  registrationDate: string;
  isNewPatient?: boolean; // Indica si es un paciente nuevo registrado por recepción
}

export const patients: Patient[] = [
  {
    id: '4',
    name: 'Juan Pérez',
    email: 'paciente@example.com',
    phone: '5512345678',
    age: 32,
    sex: 'Masculino',
    address: 'Calle Principal 123',
    colony: 'Centro',
    delegation: 'Cuauhtémoc',
    municipality: 'Cuauhtémoc',
    occupation: 'Ingeniero',
    patientType: 'Regular',
    workCenter: 'Pénjamo',
    registrationDate: '2026-01-15',
    isNewPatient: false,
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
    delegation: 'Miguel Hidalgo',
    municipality: 'Miguel Hidalgo',
    occupation: 'Diseñadora',
    patientType: 'Regular',
    workCenter: 'Pénjamo',
    registrationDate: '2026-01-20',
    isNewPatient: false,
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
    delegation: 'Benito Juárez',
    municipality: 'Benito Juárez',
    occupation: 'Abogada',
    patientType: 'Primera vez',
    workCenter: 'Valle de Santiago',
    registrationDate: '2026-02-01',
    isNewPatient: false,
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
    delegation: 'Coyoacán',
    municipality: 'Coyoacán',
    tutor: 'Roberto Martínez',
    occupation: 'Estudiante',
    patientType: 'Pediátrico',
    workCenter: 'Abasolo',
    registrationDate: '2026-02-05',
    isNewPatient: false,
  },
];

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'receptionist' | 'doctor' | 'admin';
  phone: string;
  specialty?: string;
  workCenter?: string;
  hireDate: string;
  status: 'active' | 'inactive';
}

export const employees: Employee[] = [
  {
    id: '1',
    name: 'Administrador Principal',
    email: 'admin@dentalwhite.com',
    role: 'admin',
    phone: '5500000000',
    hireDate: '2025-01-01',
    status: 'active',
  },
  {
    id: '2',
    name: 'María González',
    email: 'recepcion@dentalwhite.com',
    role: 'receptionist',
    phone: '5511111111',
    workCenter: 'Sucursal Centro',
    hireDate: '2025-03-01',
    status: 'active',
  },
  {
    id: '3',
    name: 'Dr. Carlos Méndez',
    email: 'doctor@dentalwhite.com',
    role: 'doctor',
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
    role: 'doctor',
    phone: '5533333333',
    specialty: 'Endodoncia',
    workCenter: 'Sucursal Norte',
    hireDate: '2025-04-01',
    status: 'active',
  },
];