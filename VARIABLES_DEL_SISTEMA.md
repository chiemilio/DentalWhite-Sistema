# 📋 VARIABLES DEL SISTEMA - DENTAL WHITE

Documentación completa de todas las variables, constantes, configuraciones y datos del sistema de gestión dental "Dental White".

**Fecha de actualización:** 25 de febrero de 2026  
**Versión del sistema:** 0.0.1

---

## 📑 TABLA DE CONTENIDO

1. [Información General del Sistema](#información-general-del-sistema)
2. [Usuarios y Roles](#usuarios-y-roles)
3. [Sucursales y Centros de Trabajo](#sucursales-y-centros-de-trabajo)
4. [Servicios Dentales](#servicios-dentales)
5. [Pacientes](#pacientes)
6. [Empleados](#empleados)
7. [Citas](#citas)
8. [Expedientes Médicos](#expedientes-médicos)
9. [Configuración de Tema y Estilos](#configuración-de-tema-y-estilos)
10. [Dependencias y Paquetes](#dependencias-y-paquetes)
11. [Assets e Imágenes](#assets-e-imágenes)
12. [Credenciales de Acceso](#credenciales-de-acceso)

---

## 🏥 INFORMACIÓN GENERAL DEL SISTEMA

### Datos de la Clínica

```typescript
NOMBRE_CLINICA: "Dental White"
SLOGAN: "Tu sonrisa, nuestra pasión"
NOMBRE_SISTEMA: "@figma/my-make-file"
VERSION: "0.0.1"
TIPO_PROYECTO: "module"
```

### Información de Contacto

```typescript
TELEFONO_1: "55 1234 5678"
TELEFONO_2: "55 8765 4321"
WHATSAPP: "+52 1 429 130 9742"
EMAIL_CONTACTO: "contacto@dentalwhite.com"
EMAIL_CITAS: "citas@dentalwhite.com"
DIRECCION_PRINCIPAL: "Calle primero de mayo #9, Pénjamo Gto"
```

### Información del Director

```typescript
DIRECTOR_NOMBRE: "Dr. Faustino Vázquez Rodríguez"
DIRECTOR_TITULO: "Cirujano Dentista"
DIRECTOR_UNIVERSIDAD: "Universidad Michoacana de San Nicolás de Hidalgo (UMSNH)"
DIRECTOR_ESPECIALIDAD: "Ortodoncia"
DIRECTOR_DIPLOMADOS: [
  "Implantología",
  "Rehabilitación sobre prótesis"
]
DIRECTOR_MAESTRIA: "Periodoncia con implantes - Universidad Francisco de Victoria, Madrid, España"
```

### Misión y Visión

```typescript
MISION: "Brindar atención odontológica para nuestros pacientes con un trato más cercano, honesto y respetuoso, ofreciendo soluciones mediante el uso de tecnología, procesos seguros y equipo capacitado, enfocados en la prevención de la salud bucal."

VISION: "Ser un consultorio dental reconocido por su profesionalismo, atención empática, actualización constante y compromiso para mejorar la calidad de vida de nuestros pacientes. Ser competentes dentro del área de salud."
```

---

## 👥 USUARIOS Y ROLES

### Tipos de Rol (UserRole)

```typescript
type UserRole = 'patient' | 'receptionist' | 'doctor' | 'admin'
```

### Interfaz de Usuario

```typescript
interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  age?: number;
  sex?: string;
  address?: string;
  colony?: string;
  delegation?: string;
  tutor?: string;          // Para menores de edad
  occupation?: string;
  patientType?: string;    // Solo para pacientes
}
```

### Usuarios Mock del Sistema

#### 1. Administrador Principal
```typescript
ID: "1"
EMAIL: "admin@dentalwhite.com"
PASSWORD: "admin123"
ROLE: "admin"
NAME: "Administrador Principal"
```

#### 2. Recepcionista
```typescript
ID: "2"
EMAIL: "recepcion@dentalwhite.com"
PASSWORD: "recep123"
ROLE: "receptionist"
NAME: "María González"
PHONE: "5511111111"
WORK_CENTER: "Sucursal Centro"
HIRE_DATE: "2025-03-01"
STATUS: "active"
```

#### 3. Doctor Principal
```typescript
ID: "3"
EMAIL: "doctor@dentalwhite.com"
PASSWORD: "doctor123"
ROLE: "doctor"
NAME: "Dr. Carlos Méndez"
PHONE: "5522222222"
SPECIALTY: "Odontología General"
WORK_CENTER: "Sucursal Centro"
HIRE_DATE: "2025-02-01"
STATUS: "active"
```

#### 4. Doctora - Especialista en Endodoncia
```typescript
ID: "7"
EMAIL: "laura.sanchez@dentalwhite.com"
PASSWORD: [No definida en mock de login]
ROLE: "doctor"
NAME: "Dra. Laura Sánchez"
PHONE: "5533333333"
SPECIALTY: "Endodoncia"
WORK_CENTER: "Sucursal Norte"
HIRE_DATE: "2025-04-01"
STATUS: "active"
```

#### 5. Paciente de Ejemplo
```typescript
ID: "4"
EMAIL: "paciente@example.com"
PASSWORD: "paciente123"
ROLE: "patient"
NAME: "Juan Pérez"
PHONE: "5512345678"
AGE: 32
SEX: "Masculino"
ADDRESS: "Calle Principal 123"
COLONY: "Centro"
DELEGATION: "Cuauhtémoc"
OCCUPATION: "Ingeniero"
PATIENT_TYPE: "Regular"
REGISTRATION_DATE: "2026-01-15"
```

---

## 🏢 SUCURSALES Y CENTROS DE TRABAJO

### Estructura de WorkCenter

```typescript
interface WorkCenter {
  id: string;
  name: string;
  address: string;
}
```

### Sucursales Disponibles

#### Sucursal 1: Centro
```typescript
ID: "1"
NAME: "Sucursal Centro"
ADDRESS: "Av. Juárez 100, Centro"
LOCATION: "Calle primero de mayo #9, Pénjamo Gto"
COLOR_THEME: "sky" (azul cielo)
SERVICES_AVAILABLE: [
  "Limpieza Dental",
  "Ortodoncia",
  "Endodoncia",
  "Extracción",
  "Blanqueamiento",
  "Prótesis Dentales",
  "Revisión General"
]
```

#### Sucursal 2: Norte (Valle de Santiago)
```typescript
ID: "2"
NAME: "Sucursal Norte"
ADDRESS: "Av. Insurgentes 200, Polanco"
LOCATION: "Centro, Valle de Santiago Gto"
COLOR_THEME: "blue" (azul)
SERVICES_AVAILABLE: [
  "Prótesis Dentales",
  "Implantes Dentales",
  "Cirugía Maxilofacial",
  "Periodoncia"
]
```

#### Sucursal 3: Sur (Abasolo)
```typescript
ID: "3"
NAME: "Sucursal Sur"
ADDRESS: "Av. Universidad 300, Coyoacán"
LOCATION: "Centro, Abasolo Gto"
COLOR_THEME: "cyan" (cian)
SERVICES_AVAILABLE: [
  "Odontopediatría",
  "Diseño de Sonrisa",
  "Coronas y Puentes",
  "Rehabilitación Oral"
]
```

---

## 🦷 SERVICIOS DENTALES

### Estructura de Service

```typescript
interface Service {
  id: string;
  name: string;
  description: string;
  price?: string;
  duration?: string;
  branch?: string;  // Sucursal
}
```

### Servicios por Sucursal

#### Servicios de Pénjamo (Sucursal Centro)

##### 1. Limpieza Dental
```typescript
ID: "1"
NAME: "Limpieza Dental"
DESCRIPTION: "Es el cuidado preventivo para mantener una buena higiene de la boca. La falta de higiene conllevar una acumulación excesiva de placa bacteriana y sarro en la boca que pueden desembocar en Enfermedades Dentales"
BRANCH: "Pénjamo"
PRECIO_EJEMPLO: 500 MXN
```

##### 2. Ortodoncia
```typescript
ID: "2"
NAME: "Ortodoncia"
DESCRIPTION: "Corrige la mala posición de los huesos y dientes mediante la aplicación de diferentes tipos de fuerzas con aparatos, su objetivo es alinear los dientes, corregir problemas de mordida, mejorar la estética y función bucal."
BRANCH: "Pénjamo"
PRECIO_EJEMPLO: 15000 MXN
```

##### 3. Endodoncia
```typescript
ID: "3"
NAME: "Endodoncia"
DESCRIPTION: "Consiste en eliminar una parte profunda del diente, la cual se encuentra lesionada o infectada, algunos de los principales motivos para realizarla es limpiar una parte del diente por dentro y rellenarla con otro material."
BRANCH: "Pénjamo"
PRECIO_EJEMPLO: 1500-2500 MXN
```

##### 4. Extracción
```typescript
ID: "4"
NAME: "Extracción"
DESCRIPTION: "Es la eliminación por completo un diente de su cavidad. Se realiza por caries severas, infecciones, enfermedad periodontal, fracturas o para ortodoncia."
BRANCH: "Pénjamo"
PRECIO_EJEMPLO: 800 MXN
```

##### 5. Blanqueamiento
```typescript
ID: "5"
NAME: "Blanqueamiento"
DESCRIPTION: "Es un tratamiento estético no invasivo para eliminar las manchas y la suciedad de los dientes, con el objetivo de tener un tono más blanco y brillante de las piezas."
BRANCH: "Pénjamo"
PRECIO_EJEMPLO: 3000 MXN
```

##### 6. Prótesis Dentales
```typescript
ID: "6"
NAME: "Prótesis Dentales"
DESCRIPTION: "Es un dispositivo artificial, diseñado para restaurar la funcionalidad y estética de la boca al sustituir uno o más dientes perdidos o dañados. Mejora la masticación, el habla y la apariencia facial, y puede ser fija o removible."
BRANCH: "Pénjamo"
```

##### 7. Revisión General
```typescript
ID: "7"
NAME: "Revisión General"
DESCRIPTION: "Examen exhaustivo y preventivo para evaluar el estado integral de la salud bucodental. Consiste en la inspección de dientes, encías, lengua, boca y articulación temporomandibular para detectar problemas antes de que causen dolor."
BRANCH: "Pénjamo"
PRECIO_EJEMPLO: 300 MXN
```

#### Servicios de Valle de Santiago (Sucursal Norte)

##### 8. Prótesis Dentales
```typescript
ID: "8"
NAME: "Prótesis Dentales"
DESCRIPTION: "Es un dispositivo artificial, diseñado para restaurar la funcionalidad y estética de la boca al sustituir uno o más dientes perdidos o dañados. Mejora la masticación, el habla y la apariencia facial, y puede ser fija o removible."
BRANCH: "Valle de Santiago"
```

##### 9. Implantes Dentales
```typescript
ID: "9"
NAME: "Implantes Dentales"
DESCRIPTION: "Son raíces artificiales de titanio que se colocan en el hueso maxilar para reemplazar dientes perdidos. Ofrecen una solución permanente y natural para recuperar la función masticatoria y estética dental."
BRANCH: "Valle de Santiago"
```

##### 10. Cirugía Maxilofacial
```typescript
ID: "10"
NAME: "Cirugía Maxilofacial"
DESCRIPTION: "Especialidad quirúrgica que trata enfermedades, lesiones y defectos en la cabeza, cuello, cara, mandíbulas y tejidos duros y blandos de la región oral y maxilofacial."
BRANCH: "Valle de Santiago"
```

##### 11. Periodoncia
```typescript
ID: "11"
NAME: "Periodoncia"
DESCRIPTION: "Tratamiento especializado de las encías y el hueso que soporta los dientes. Previene y trata enfermedades periodontales como gingivitis y periodontitis."
BRANCH: "Valle de Santiago"
```

#### Servicios de Abasolo (Sucursal Sur)

##### 12. Odontopediatría
```typescript
ID: "12"
NAME: "Odontopediatría"
DESCRIPTION: "Atención dental especializada para niños desde la infancia hasta la adolescencia. Cuidamos la salud bucal de los más pequeños con técnicas adaptadas a su edad."
BRANCH: "Abasolo"
```

##### 13. Diseño de Sonrisa
```typescript
ID: "13"
NAME: "Diseño de Sonrisa"
DESCRIPTION: "Tratamiento estético integral que combina diferentes procedimientos para lograr la sonrisa perfecta. Incluye carillas, blanqueamiento y alineación dental."
BRANCH: "Abasolo"
```

##### 14. Coronas y Puentes
```typescript
ID: "14"
NAME: "Coronas y Puentes"
DESCRIPTION: "Restauraciones dentales fijas que cubren o reemplazan dientes dañados o perdidos. Devuelven la funcionalidad y estética a tu sonrisa."
BRANCH: "Abasolo"
```

##### 15. Rehabilitación Oral
```typescript
ID: "15"
NAME: "Rehabilitación Oral"
DESCRIPTION: "Tratamiento integral que combina diferentes especialidades para restaurar la función, estética y salud de toda la boca."
BRANCH: "Abasolo"
```

---

## 👤 PACIENTES

### Estructura de Patient

```typescript
interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  sex: string;
  address: string;
  colony: string;
  municipality: string;
  tutor?: string;          // Para menores de edad
  occupation: string;
  patientType: string;     // Regular, Primera vez, Pediátrico
  registrationDate: string;
}
```

### Tipos de Paciente

```typescript
PATIENT_TYPES = [
  "Regular",
  "Primera vez",
  "Pediátrico"
]
```

### Pacientes de Ejemplo

#### Paciente 1: Juan Pérez
```typescript
ID: "4"
NAME: "Juan Pérez"
EMAIL: "paciente@example.com"
PHONE: "5512345678"
AGE: 32
SEX: "Masculino"
ADDRESS: "Calle Principal 123"
COLONY: "Centro"
MUNICIPALITY: "Cuauhtémoc"
OCCUPATION: "Ingeniero"
PATIENT_TYPE: "Regular"
REGISTRATION_DATE: "2026-01-15"
```

#### Paciente 2: María López
```typescript
ID: "5"
NAME: "María López"
EMAIL: "maria.lopez@example.com"
PHONE: "5523456789"
AGE: 28
SEX: "Femenino"
ADDRESS: "Av. Reforma 456"
COLONY: "Polanco"
MUNICIPALITY: "Miguel Hidalgo"
OCCUPATION: "Diseñadora"
PATIENT_TYPE: "Regular"
REGISTRATION_DATE: "2026-01-20"
```

#### Paciente 3: Ana Rodríguez
```typescript
ID: "6"
NAME: "Ana Rodríguez"
EMAIL: "ana.rodriguez@example.com"
PHONE: "5534567890"
AGE: 45
SEX: "Femenino"
ADDRESS: "Calle Norte 789"
COLONY: "Del Valle"
MUNICIPALITY: "Benito Juárez"
OCCUPATION: "Abogada"
PATIENT_TYPE: "Primera vez"
REGISTRATION_DATE: "2026-02-01"
```

#### Paciente 4: Carlos Martínez (Pediátrico)
```typescript
ID: "7"
NAME: "Carlos Martínez"
EMAIL: "carlos.martinez@example.com"
PHONE: "5545678901"
AGE: 12
SEX: "Masculino"
ADDRESS: "Calle Sur 321"
COLONY: "Coyoacán"
MUNICIPALITY: "Coyoacán"
TUTOR: "Roberto Martínez"
OCCUPATION: "Estudiante"
PATIENT_TYPE: "Pediátrico"
REGISTRATION_DATE: "2026-02-05"
```

---

## 👨‍⚕️ EMPLEADOS

### Estructura de Employee

```typescript
interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'receptionist' | 'doctor' | 'admin';
  phone: string;
  specialty?: string;      // Solo para doctores
  workCenter?: string;
  hireDate: string;
  status: 'active' | 'inactive';
}
```

### Empleados del Sistema

Consultar la sección [Usuarios y Roles](#usuarios-y-roles) para ver la lista completa de empleados con sus credenciales.

---

## 📅 CITAS

### Estructura de Appointment

```typescript
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  serviceId: string;
  serviceName: string;
  workCenterId: string;
  workCenterName: string;
  date: string;            // Formato: YYYY-MM-DD
  time: string;            // Formato: HH:MM
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  doctorId?: string;
  doctorName?: string;
  
  // Información de pago
  servicePrice?: number;
  amountPaid?: number;
  paymentType?: 'complete' | 'installment';
  numberOfPayments?: number;
  currentPayment?: number;
}
```

### Estados de Cita

```typescript
APPOINTMENT_STATUS = [
  'scheduled',   // Agendada
  'confirmed',   // Confirmada
  'completed',   // Completada
  'cancelled'    // Cancelada
]
```

### Tipos de Pago

```typescript
PAYMENT_TYPES = [
  'complete',      // Pago completo
  'installment'    // Pago a cuotas/parcialidades
]
```

### Ejemplo de Cita con Pago Completo

```typescript
ID: "1"
PATIENT_ID: "4"
PATIENT_NAME: "Juan Pérez"
SERVICE_ID: "1"
SERVICE_NAME: "Limpieza Dental"
WORK_CENTER_ID: "1"
WORK_CENTER_NAME: "Sucursal Centro"
DATE: "2026-02-15"
TIME: "10:00"
STATUS: "scheduled"
DOCTOR_ID: "3"
DOCTOR_NAME: "Dr. Carlos Méndez"
SERVICE_PRICE: 500
AMOUNT_PAID: 500
PAYMENT_TYPE: "complete"
```

### Ejemplo de Cita con Pago a Cuotas

```typescript
ID: "3"
PATIENT_ID: "6"
PATIENT_NAME: "Ana Rodríguez"
SERVICE_ID: "3"
SERVICE_NAME: "Endodoncia"
WORK_CENTER_ID: "2"
WORK_CENTER_NAME: "Sucursal Norte"
DATE: "2026-02-13"
TIME: "14:00"
STATUS: "scheduled"
DOCTOR_ID: "7"
DOCTOR_NAME: "Dra. Laura Sánchez"
SERVICE_PRICE: 1500
AMOUNT_PAID: 500
PAYMENT_TYPE: "installment"
NUMBER_OF_PAYMENTS: 3
CURRENT_PAYMENT: 1
```

---

## 📋 EXPEDIENTES MÉDICOS

### Estructura de MedicalRecord

```typescript
interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  createdDate: string;
  startDate?: string;
  endDate?: string;
  
  // Información personal
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
  
  // Antecedentes Patológicos
  pathologicalHistory: {
    tonsillitis: boolean;          // Amigdalitis
    adenoids: boolean;             // Adenoides
    herpes: boolean;
    flu: boolean;                  // Gripe
    respiratoryProblems: boolean;  // Problemas respiratorios
  };
  
  // Antecedentes No Patológicos (Hábitos)
  nonPathologicalHistory: {
    lip: boolean;      // Labio
    tongue: boolean;   // Lengua
    objects: boolean;  // Objetos
    finger: boolean;   // Dedo
    other: string;     // Otros hábitos
  };
  
  habitFrequency: string;  // Frecuencia del hábito
  habitDuration: string;   // Duración del hábito
  habitIntensity: string;  // Intensidad del hábito
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
    cephalography: string;         // Cefalometría
    orthoradial: string;           // Ortorradial
    palmar: string;                // Palmar
    occlusal: string;              // Oclusal
    oblique: string;               // Oblicua
    orthopantography: string;      // Ortopantografía
    mesioradial: string;           // Mesiorradial
    congenitalAbsence: string;     // Ausencia congénita
    supernumerary: string;         // Supernumerarios
    cysts: string;                 // Quistes
    periapicalLesions: string;     // Lesiones periapicales
    inclusions: string;            // Inclusiones
    radicularResorption: string;   // Resorción radicular
    thirdMolars: string;           // Terceros molares
    dwarfRoots: string;            // Raíces enanas
    abnormalRoots: string;         // Raíces anormales
  };
  
  // Firmas
  patientSignature?: string;       // Base64
  legalGuardianSignature?: string; // Base64
  
  observations: string;
  
  // Control de citas
  appointmentHistory: {
    number: number;
    date: string;
    activity: string;
    doctor: string;
  }[];
}
```

### Estados y Opciones

```typescript
PHYSICAL_STATES = ['good', 'bad', 'regular']
DENTAL_STATES = ['good', 'bad', 'regular']
FACE_FORMS = ['symmetric', 'asymmetric']
LABIAL_MUSCULATURE = ['weak', 'normal', 'strong']
CROSSBITE_TYPES = ['unilateral', 'bilateral']
TECHNIQUE_QUALITY = ['good', 'bad', 'regular']
```

---

## 🎨 CONFIGURACIÓN DE TEMA Y ESTILOS

### Variables CSS del Tema (Light Mode)

```css
--font-size: 16px;
--background: #ffffff;
--foreground: oklch(0.145 0 0);
--card: #ffffff;
--card-foreground: oklch(0.145 0 0);
--popover: oklch(1 0 0);
--popover-foreground: oklch(0.145 0 0);
--primary: #030213;
--primary-foreground: oklch(1 0 0);
--secondary: oklch(0.95 0.0058 264.53);
--secondary-foreground: #030213;
--muted: #ececf0;
--muted-foreground: #717182;
--accent: #e9ebef;
--accent-foreground: #030213;
--destructive: #d4183d;
--destructive-foreground: #ffffff;
--border: rgba(0, 0, 0, 0.1);
--input: transparent;
--input-background: #f3f3f5;
--switch-background: #cbced4;
--font-weight-medium: 500;
--font-weight-normal: 400;
--ring: oklch(0.708 0 0);
--radius: 0.625rem;
```

### Colores de Gráficos (Charts)

```css
--chart-1: oklch(0.646 0.222 41.116);
--chart-2: oklch(0.6 0.118 184.704);
--chart-3: oklch(0.398 0.07 227.392);
--chart-4: oklch(0.828 0.189 84.429);
--chart-5: oklch(0.769 0.188 70.08);
```

### Colores Institucionales de Dental White

```css
PRIMARY_BRAND_COLOR: "sky-600" (#0284c7)
SECONDARY_BRAND_COLOR: "sky-500" (#0ea5e9)
ACCENT_COLOR: "blue-600" (#2563eb)
BACKGROUND_GRADIENT: "from-sky-50 to-white"

/* Colores por sucursal */
PENJAMO_COLOR: "sky" (azul cielo)
VALLE_SANTIAGO_COLOR: "blue" (azul)
ABASOLO_COLOR: "cyan" (cian)
```

### Tipografía

```css
BASE_FONT_SIZE: 16px
FONT_WEIGHT_MEDIUM: 500
FONT_WEIGHT_NORMAL: 400

/* Tamaños de encabezados */
H1_SIZE: var(--text-2xl)
H2_SIZE: var(--text-xl)
H3_SIZE: var(--text-lg)
H4_SIZE: var(--text-base)
```

### Border Radius

```css
RADIUS_SM: calc(var(--radius) - 4px)    /* 0.375rem / 6px */
RADIUS_MD: calc(var(--radius) - 2px)    /* 0.475rem / 7.6px */
RADIUS_LG: var(--radius)                /* 0.625rem / 10px */
RADIUS_XL: calc(var(--radius) + 4px)    /* 0.875rem / 14px */
```

---

## 📦 DEPENDENCIAS Y PAQUETES

### Información del Proyecto

```json
NAME: "@figma/my-make-file"
VERSION: "0.0.1"
TYPE: "module"
PRIVATE: true
```

### Scripts

```json
BUILD: "vite build"
```

### Dependencias Principales

#### UI Components
```json
@radix-ui/react-*: (Múltiples componentes UI)
  - accordion: 1.2.3
  - alert-dialog: 1.1.6
  - avatar: 1.1.3
  - checkbox: 1.1.4
  - dialog: 1.1.6
  - dropdown-menu: 2.1.6
  - label: 2.1.2
  - select: 2.1.6
  - tabs: 1.1.3
  - tooltip: 1.1.8
```

#### Material-UI
```json
@mui/material: 7.3.5
@mui/icons-material: 7.3.5
@emotion/react: 11.14.0
@emotion/styled: 11.14.1
```

#### Utilities
```json
lucide-react: 0.487.0         // Iconos
recharts: 2.15.2              // Gráficos
date-fns: 3.6.0               // Manejo de fechas
sonner: 2.0.3                 // Notificaciones toast
clsx: 2.1.1                   // Utilidad de clases CSS
tailwind-merge: 3.2.0         // Merge de clases Tailwind
class-variance-authority: 0.7.1
```

#### Forms & Validation
```json
react-hook-form: 7.55.0
```

#### Drag & Drop
```json
react-dnd: 16.0.1
react-dnd-html5-backend: 16.0.1
```

#### PDF & Canvas
```json
jspdf: 4.1.0
html2canvas: 1.4.1
```

#### Animations
```json
motion: 12.23.24              // Framer Motion (nueva versión)
tw-animate-css: 1.3.8
```

#### Carousel & Layout
```json
embla-carousel-react: 8.6.0
react-slick: 0.31.0
react-responsive-masonry: 2.7.1
react-resizable-panels: 2.1.7
```

### Dev Dependencies

```json
@tailwindcss/vite: 4.1.12
@vitejs/plugin-react: 4.7.0
tailwindcss: 4.1.12
vite: 6.3.5
```

### Peer Dependencies

```json
react: 18.3.1
react-dom: 18.3.1
```

---

## 🖼️ ASSETS E IMÁGENES

### Logo
```typescript
PATH: "figma:asset/da6a072baf78bdc68ca5368ac2123d8644ed8db8.png"
USAGE: Logo rectangular de Dental White
DIMENSIONS: Rectangular (proporción aprox. 16:12)
```

### Imagen del Doctor
```typescript
PATH: "figma:asset/7fc5ebdb2d35bffb567c0b8e0cfaa57931319cdb.png"
USAGE: Foto del Dr. Faustino Vázquez Rodríguez
```

### Imagen de Promoción
```typescript
PATH: "figma:asset/6d65dfbab9e3b3e5a0f0c7e8e8f9d1959319b4ca.png"
USAGE: Banner de promoción por apertura
```

### Imágenes del Carousel de la Clínica
```typescript
CLINIC_IMAGE_1: "figma:asset/9e7301732c603d31964f65f6cf46f690c1180b7e.png"
CLINIC_IMAGE_2: "figma:asset/e6e4c220d725c1048ef64dcbcb5cfa603119322d.png"
CLINIC_IMAGE_3: "figma:asset/42b0afd7abc99fbcc119fca151c6748bdb2e634d.png"
```

---

## 🔐 CREDENCIALES DE ACCESO

### ⚠️ IMPORTANTE: Estas son credenciales de desarrollo/demo

### Administrador
```
EMAIL: admin@dentalwhite.com
PASSWORD: admin123
ROLE: admin
```

### Recepcionista
```
EMAIL: recepcion@dentalwhite.com
PASSWORD: recep123
ROLE: receptionist
```

### Doctor
```
EMAIL: doctor@dentalwhite.com
PASSWORD: doctor123
ROLE: doctor
```

### Paciente de Prueba
```
EMAIL: paciente@example.com
PASSWORD: paciente123
ROLE: patient
```

---

## 🔧 CONFIGURACIONES ADICIONALES

### Captcha
```typescript
CAPTCHA_LENGTH: 6
CAPTCHA_CHARS: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
// Excluye: O, 0, I, 1 para evitar confusión
```

### Formato de Fechas
```typescript
DATE_FORMAT: "YYYY-MM-DD"
TIME_FORMAT: "HH:MM"
DISPLAY_DATE_FORMAT: "DD/MM/YYYY"
```

### Límites del Sistema
```typescript
MAX_APPOINTMENTS_PER_DAY: Sin límite definido
MAX_PATIENTS: Sin límite definido
MAX_EMPLOYEES: Sin límite definido
SESSION_TIMEOUT: Sin timeout definido (mientras el navegador esté abierto)
```

### Rutas del Sistema
```typescript
ROUTE_HOME: "/"
ROUTE_LOGIN: "/login" (modal)
ROUTE_REGISTER: "/register" (modal)
ROUTE_DASHBOARD: Depende del rol del usuario
```

### Estados del Sistema
```typescript
LOADING_STATES: ['idle', 'loading', 'success', 'error']
TOAST_DURATION: Default de Sonner (4000ms)
```

---

## 📊 CARACTERÍSTICAS DEL PANEL ADMINISTRATIVO

### Reportes Disponibles
```typescript
REPORT_TYPES = [
  'Servicios más solicitados',
  'Ingresos por sucursal',
  'Citas por sucursal',
  'Total de consultas'
]
```

### Filtros de Reportes
```typescript
PERIOD_FILTERS = [
  'monthly',          // Mensual
  'annual',           // Anual
  'custom'            // Rango personalizado
]

BRANCH_FILTERS = [
  'all',              // Todas las sucursales
  'Sucursal Centro',
  'Sucursal Norte',
  'Sucursal Sur'
]
```

### Métricas Clave
```typescript
METRICS = [
  'Ingresos Totales',
  'Citas del Periodo',
  'Pacientes Nuevos',
  'Tasa de Asistencia'
]
```

---

## 📝 NOTAS FINALES

### Consideraciones de Seguridad
- Las contraseñas están en texto plano solo para propósitos de desarrollo
- En producción, implementar hashing de contraseñas (bcrypt, argon2)
- Implementar JWT o sesiones seguras para autenticación
- Validar todos los inputs en frontend y backend
- Implementar protección CSRF
- Usar HTTPS en producción

### Próximas Mejoras Sugeridas
1. Integración con base de datos real (Supabase sugerido)
2. Sistema de notificaciones por email/SMS
3. Recordatorios automáticos de citas
4. Exportación de reportes a PDF/Excel
5. Sistema de inventario de materiales
6. Chat en tiempo real con pacientes
7. Historial de pagos detallado
8. Sistema de facturación electrónica
9. Integración con calendario externo (Google Calendar)
10. App móvil para pacientes

---

## TIPOS DEL API REAL (api.ts)

Estos son los tipos TypeScript usados por el frontend para comunicarse con el backend:

```typescript
// BackendAppointment - Cita desde el API
interface BackendAppointment {
  id: number;
  paciente_id: number;
  empleado_id: number;
  servicio_id: number;
  sucursal_id: number;
  estado_cita_id: number;
  fecha_hora: string;              // ISO datetime
  duracion_minutos: number;
  motivo?: string;
  notas?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  paciente_nombre?: string;
  empleado_nombre?: string;
  servicio_nombre?: string;
  sucursal_nombre?: string;
  estado_nombre?: string;          // "Programada", "Confirmada", etc.
}

// BackendPatient - Paciente desde el API
interface BackendPatient {
  id: number;
  usuario_id: number;
  numero_expediente: string;
  tipo_paciente_id?: number;
  sexo_id?: number;
  fecha_nacimiento?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  estado_cita_id?: number;
  nombre?: string;                 // Del join con usuarios
}

// BackendEmployee - Empleado desde el API
interface BackendEmployee {
  id: number;
  usuario_id: number;
  numero_empleado: string;
  fecha_ingreso?: string;
  cedula_profesional?: string;
  salario?: number;
  notas?: string;
  activo: boolean;
  es_doctor?: boolean;
  usuario_nombre?: string;
  usuario_email?: string;
  rol_nombre?: string;
  centro_nombre?: string;
}

// BackendCatalogItem - Items de catalogo
interface BackendCatalogItem {
  id: number;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
  precio_base?: number;
  duracion_minutos?: number;
  color?: string;
  permisos?: Record<string, boolean>;
  sucursal_id?: number;
  hora?: string;
}

// CreateAppointmentDTO - Para crear cita
interface CreateAppointmentDTO {
  paciente_id: number;
  empleado_id: number;
  servicio_id: number;
  sucursal_id: number;
  estado_cita_id: number;
  fecha_hora: string;
  duracion_minutos?: number;
  motivo?: string;
  notas?: string;
}
```

---

**Documento actualizado:** 12 de junio de 2026
**Sistema:** Dental White v0.0.1

