/**
 * TIPOS DE BASE DE DATOS - DENTAL WHITE
 * Sistema de Gestión Dental
 * VERSION: 3.0 - Estructura Completa con Catálogos
 */

// ============================================
// CAT

ÁLOGOS - INTERFACES
// ============================================

export interface CatTipoPaciente {
  id: number;
  nombre_tipo: string;
  descripcion?: string;
  activo: boolean;
  created_at: Date;
}

export interface CatSucursal {
  id: number;
  nombre: string;
  direccion: string;
  telefono_contacto1: string;
  telefono_contacto2?: string;
  whatsapp: string;
  email: string;
  url_google_maps?: string;
  hora_apertura: string; // TIME "HH:MM:SS"
  hora_cierre: string; // TIME "HH:MM:SS"
  foto_url?: string;
  activa: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CatNacionalidad {
  id: number;
  codigo_iso: string; // 3 caracteres
  gentilicio: string;
  pais: string;
  activo: boolean;
}

export interface CatRol {
  id: number;
  nombre_rol: string;
  descripcion?: string;
  activo: boolean;
  created_at: Date;
}

export interface CatEspecialidad {
  id: number;
  nombre_especialidad: string;
  descripcion?: string;
  activa: boolean;
  created_at: Date;
}

export interface CatServicio {
  id: number;
  id_especialidad: number;
  nombre_servicio: string;
  descripcion?: string;
  costo_base: number;
  duracion_estimada: string; // INTERVAL "HH:MM:SS"
  requiere_fotos: boolean;
  activa: boolean;
  created_at: Date;
  updated_at: Date;
  // Relaciones
  especialidad?: CatEspecialidad;
}

export interface CatMedioContacto {
  id: number;
  nombre_medio: string;
  activo: boolean;
}

export interface CatEstadoCita {
  id: number;
  nombre_estado: string;
  descripcion?: string;
  color?: string;
  activo: boolean;
}

export interface CatTipoAntecedente {
  id: number;
  nombre_categoria: string;
  descripcion?: string;
  activo: boolean;
}

// ============================================
// TABLAS PRINCIPALES
// ============================================

export interface Usuario {
  id: number;
  nombre_completo: string;
  curp?: string; // 18 caracteres
  rfc?: string; // 13 caracteres
  id_nacionalidad: number;
  id_rol: number;
  email1: string;
  email2?: string;
  telefono1: string;
  telefono2?: string;
  whatsapp: string;
  passwd_encript: string; // No enviar al frontend
  activo: boolean;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
  // Relaciones
  nacionalidad?: CatNacionalidad;
  rol?: CatRol;
}

export interface Paciente {
  id: number;
  id_usuario: number;
  id_tipo_paciente: number;
  id_sucursal_frecuente?: number;
  fecha_nacimiento: Date;
  sexo?: 'Masculino' | 'Femenino' | 'No binario' | 'No informar';
  direccion_completa?: string;
  ocupacion?: string;
  nombre_tutor?: string;
  firma_digitalizada?: string; // Base64
  activo: boolean;
  created_at: Date;
  updated_at: Date;
  // Relaciones
  usuario?: Usuario;
  tipo_paciente?: CatTipoPaciente;
  sucursal_frecuente?: CatSucursal;
}

export interface Empleado {
  id: number;
  id_usuario: number;
  id_sucursal_asignada: number;
  cedula_profesional?: string;
  especialidad_principal?: string;
  biografia_resumen?: string;
  foto_perfil_url?: string;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
  // Relaciones
  usuario?: Usuario;
  sucursal_asignada?: CatSucursal;
  especialidades?: CatEspecialidad[];
}

export interface Cita {
  id: number;
  id_paciente: number;
  id_doctor: number;
  id_sucursal: number;
  id_servicio: number;
  id_medio_contacto: number;
  id_estado: number;
  fecha_cita: Date;
  hora_cita: string; // TIME "HH:MM:SS"
  motivo_consulta?: string;
  notas_adicionales?: string;
  created_at: Date;
  updated_at: Date;
  // Relaciones
  paciente?: Paciente;
  doctor?: Empleado;
  sucursal?: CatSucursal;
  servicio?: CatServicio;
  medio_contacto?: CatMedioContacto;
  estado?: CatEstadoCita;
}

export interface BloqueoAgenda {
  id: number;
  id_sucursal: number;
  id_doctor?: number;
  fecha_bloqueo: Date;
  hora_inicio?: string; // TIME
  hora_fin?: string; // TIME
  motivo?: string;
  es_festivo: boolean;
  created_by?: number;
  created_at: Date;
  // Relaciones
  sucursal?: CatSucursal;
  doctor?: Empleado;
  creador?: Usuario;
}

export interface Consulta {
  id: number;
  id_cita: number;
  id_paciente: number;
  id_doctor: number;
  // Campos clínicos
  reconocimiento_hallazgos?: string;
  diagnostico?: string;
  tratamiento_indicaciones?: string;
  // Signos vitales
  peso_kg?: number;
  talla_cm?: number;
  temperatura_c?: number;
  presion_arterial?: string;
  pulso_bpm?: number;
  glucosa_mgdl?: number;
  // Control
  fecha_consulta: Date;
  // Relaciones
  cita?: Cita;
  paciente?: Paciente;
  doctor?: Empleado;
}

export interface ConsultaFoto {
  id: number;
  id_consulta: number;
  url_foto: string;
  etiqueta_servicio?: string;
  tipo_foto?: 'Antes' | 'Durante' | 'Después';
  fecha_foto: Date;
  // Relaciones
  consulta?: Consulta;
}

export interface Receta {
  id: number;
  id_consulta: number;
  id_doctor: number;
  id_paciente: number;
  folio: string;
  // Signos vitales (copia histórica)
  peso_receta?: number;
  presion_receta?: string;
  pulso_receta?: number;
  glucosa_receta?: number;
  // Indicaciones
  indicaciones_generales?: string;
  fecha_emision: Date;
  // Relaciones
  consulta?: Consulta;
  doctor?: Empleado;
  paciente?: Paciente;
  medicamentos?: RecetaMedicamento[];
}

export interface RecetaMedicamento {
  id: number;
  id_receta: number;
  nombre_medicamento: string;
  presentacion?: string;
  dosis: string;
  duracion: string;
}

export interface HistorialClinico {
  id: number;
  id_paciente: number;
  id_categoria: number;
  descripcion_padecimiento: string;
  es_activo: boolean;
  fecha_diagnostico?: Date;
  notas_adicionales?: string;
  created_at: Date;
  updated_at: Date;
  // Relaciones
  paciente?: Paciente;
  categoria?: CatTipoAntecedente;
}

export interface ConsentimientoPaciente {
  id: number;
  id_paciente: number;
  id_servicio: number;
  id_cita?: number;
  texto_legal_aceptado: string;
  firma_base64: string;
  fecha_firma: Date;
  ip_registro?: string;
  // Relaciones
  paciente?: Paciente;
  servicio?: CatServicio;
  cita?: Cita;
}

// ============================================
// VISTAS
// ============================================

export interface VistaCitaCompleta {
  id: number;
  fecha_cita: Date;
  hora_cita: string;
  motivo_consulta?: string;
  // Paciente
  id_paciente: number;
  nombre_paciente: string;
  email_paciente: string;
  telefono_paciente: string;
  whatsapp_paciente: string;
  fecha_nacimiento: Date;
  sexo?: string;
  tipo_paciente: string;
  // Doctor
  id_doctor: number;
  nombre_doctor: string;
  especialidad_principal?: string;
  cedula_profesional?: string;
  // Sucursal
  id_sucursal: number;
  nombre_sucursal: string;
  direccion_sucursal: string;
  telefono_sucursal: string;
  // Servicio
  nombre_servicio: string;
  costo_base: number;
  duracion_estimada: string;
  nombre_especialidad: string;
  // Estado y medio
  estado_cita: string;
  color_estado?: string;
  medio_contacto: string;
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export interface VistaPacienteCompleto {
  id: number;
  id_usuario: number;
  nombre_completo: string;
  curp?: string;
  rfc?: string;
  email1: string;
  telefono1: string;
  whatsapp: string;
  fecha_nacimiento: Date;
  edad: number;
  sexo?: string;
  direccion_completa?: string;
  ocupacion?: string;
  nombre_tutor?: string;
  tipo_paciente: string;
  sucursal_frecuente?: string;
  nacionalidad: string;
  pais: string;
  total_citas: number;
  ultima_cita?: Date;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface VistaEmpleadoCompleto {
  id: number;
  id_usuario: number;
  nombre_completo: string;
  email1: string;
  telefono1: string;
  whatsapp: string;
  rol: string;
  cedula_profesional?: string;
  especialidad_principal?: string;
  biografia_resumen?: string;
  foto_perfil_url?: string;
  sucursal_asignada: string;
  direccion_sucursal: string;
  especialidades?: string; // Lista separada por comas
  total_citas_atendidas: number;
  activo: boolean;
  created_at: Date;
}

// ============================================
// DTOs (Data Transfer Objects)
// ============================================

export interface RegistroUsuarioDTO {
  nombre_completo: string;
  curp?: string;
  rfc?: string;
  id_nacionalidad: number;
  id_rol: number;
  email1: string;
  email2?: string;
  telefono1: string;
  telefono2?: string;
  whatsapp: string;
  password: string; // Sin encriptar (se encripta en backend)
}

export interface RegistroPacienteDTO {
  // Datos de usuario
  usuario: RegistroUsuarioDTO;
  // Datos de paciente
  id_tipo_paciente: number;
  id_sucursal_frecuente?: number;
  fecha_nacimiento: Date;
  sexo?: 'Masculino' | 'Femenino' | 'No binario' | 'No informar';
  direccion_completa?: string;
  ocupacion?: string;
  nombre_tutor?: string;
}

export interface RegistroEmpleadoDTO {
  // Datos de usuario
  usuario: RegistroUsuarioDTO;
  // Datos de empleado
  id_sucursal_asignada: number;
  cedula_profesional?: string;
  especialidad_principal?: string;
  biografia_resumen?: string;
  foto_perfil_url?: string;
  especialidades_ids?: number[];
}

export interface CrearCitaDTO {
  id_paciente: number;
  id_doctor: number;
  id_sucursal: number;
  id_servicio: number;
  id_medio_contacto: number;
  fecha_cita: Date;
  hora_cita: string;
  motivo_consulta?: string;
  notas_adicionales?: string;
}

export interface ActualizarCitaDTO {
  id_estado?: number;
  fecha_cita?: Date;
  hora_cita?: string;
  motivo_consulta?: string;
  notas_adicionales?: string;
}

export interface CrearConsultaDTO {
  id_cita: number;
  id_paciente: number;
  id_doctor: number;
  reconocimiento_hallazgos?: string;
  diagnostico?: string;
  tratamiento_indicaciones?: string;
  peso_kg?: number;
  talla_cm?: number;
  temperatura_c?: number;
  presion_arterial?: string;
  pulso_bpm?: number;
  glucosa_mgdl?: number;
}

export interface CrearRecetaDTO {
  id_consulta: number;
  id_doctor: number;
  id_paciente: number;
  folio: string;
  peso_receta?: number;
  presion_receta?: string;
  pulso_receta?: number;
  glucosa_receta?: number;
  indicaciones_generales?: string;
  medicamentos: Array<{
    nombre_medicamento: string;
    presentacion?: string;
    dosis: string;
    duracion: string;
  }>;
}

export interface CrearBloqueoDTO {
  id_sucursal: number;
  id_doctor?: number;
  fecha_bloqueo: Date;
  hora_inicio?: string;
  hora_fin?: string;
  motivo?: string;
  es_festivo?: boolean;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  usuario: Usuario;
  empleado?: Empleado;
  paciente?: Paciente;
}

// ============================================
// FILTROS Y BÚSQUEDAS
// ============================================

export interface FiltroCitas {
  fecha_desde?: Date;
  fecha_hasta?: Date;
  id_sucursal?: number;
  id_doctor?: number;
  id_paciente?: number;
  id_estado?: number;
  id_servicio?: number;
}

export interface FiltroPacientes {
  busqueda?: string; // Nombre, email, teléfono, CURP
  id_tipo_paciente?: number;
  id_sucursal_frecuente?: number;
  edad_minima?: number;
  edad_maxima?: number;
  activo?: boolean;
}

export interface FiltroEmpleados {
  busqueda?: string;
  id_rol?: number;
  id_sucursal?: number;
  id_especialidad?: number;
  activo?: boolean;
}

export interface FiltroConsultas {
  fecha_desde?: Date;
  fecha_hasta?: Date;
  id_paciente?: number;
  id_doctor?: number;
  id_sucursal?: number;
}

// ============================================
// ESTADÍSTICAS Y REPORTES
// ============================================

export interface EstadisticasCitas {
  total: number;
  pendientes: number;
  confirmadas: number;
  atendidas: number;
  canceladas: number;
  no_asistio: number;
}

export interface EstadisticasSucursal {
  id_sucursal: number;
  nombre_sucursal: string;
  total_citas: number;
  citas_atendidas: number;
  ingresos_totales: number;
  pacientes_unicos: number;
  servicios_mas_solicitados: Array<{
    nombre_servicio: string;
    cantidad: number;
    ingresos: number;
  }>;
}

export interface EstadisticasDoctor {
  id_doctor: number;
  nombre_doctor: string;
  total_citas_atendidas: number;
  pacientes_atendidos: number;
  especialidades: string[];
  servicios_realizados: Array<{
    nombre_servicio: string;
    cantidad: number;
  }>;
}

export interface HorarioDisponible {
  hora: string;
  disponible: boolean;
  motivo_no_disponible?: string;
}

export interface AgendaDiaria {
  fecha: Date;
  sucursal: CatSucursal;
  doctor: Empleado;
  citas: VistaCitaCompleta[];
  horarios_bloqueados: BloqueoAgenda[];
  horarios_disponibles: HorarioDisponible[];
}

// ============================================
// TIPOS DE UTILIDAD
// ============================================

export type TipoSexo = 'Masculino' | 'Femenino' | 'No binario' | 'No informar';
export type TipoFoto = 'Antes' | 'Durante' | 'Después';

export interface RangoDuracion {
  horas: number;
  minutos: number;
  segundos: number;
}

export interface CalendarioCita {
  fecha: Date;
  es_habil: boolean;
  es_bloqueado: boolean;
  total_citas: number;
  capacidad_disponible: number;
}

// ============================================
// CONSTANTES
// ============================================

export const ROLES = {
  ADMIN: 1,
  DOCTOR: 2,
  RECEPCIONISTA: 3,
  PACIENTE: 4,
} as const;

export const ESTADOS_CITA = {
  PENDIENTE: 1,
  CONFIRMADA: 2,
  ATENDIDA: 3,
  CANCELADA: 4,
  NO_ASISTIO: 5,
} as const;

export const MEDIOS_CONTACTO = {
  PAGINA_WEB: 1,
  WHATSAPP: 2,
  TELEFONO: 3,
  PRESENCIAL: 4,
} as const;

export const TIPOS_PACIENTE = {
  REGULAR: 1,
  PEDIATRICO: 2,
  PRIMERA_VEZ: 3,
} as const;

export const TIPOS_ANTECEDENTES = {
  HEREDOFAMILIARES: 1,
  PATOLOGICOS: 2,
  NO_PATOLOGICOS: 3,
  ALERGIAS: 4,
  QUIRURGICOS: 5,
} as const;

// ============================================
// HELPERS
// ============================================

export function calcularEdad(fechaNacimiento: Date): number {
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }
  return edad;
}

export function parseDuracion(intervalo: string): RangoDuracion {
  // Formato: "HH:MM:SS"
  const [horas, minutos, segundos] = intervalo.split(':').map(Number);
  return { horas, minutos, segundos };
}

export function formatDuracion(rango: RangoDuracion): string {
  const h = String(rango.horas).padStart(2, '0');
  const m = String(rango.minutos).padStart(2, '0');
  const s = String(rango.segundos).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function formatHora(time: string): string {
  // Formato: "HH:MM:SS" -> "HH:MM"
  return time.substring(0, 5);
}
