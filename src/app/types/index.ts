/**
 * TIPOS Y INTERFACES - DENTAL WHITE
 * Sistema de Gestión Dental
 * VERSION: 2.0 - Todo en Español con Catálogos
 */

// ============================================
// CATÁLOGOS - TIPOS ENUMERADOS
// ============================================

export type NombreRol = 'paciente' | 'recepcionista' | 'medico' | 'administrador';

export type EstadoCita = 'agendada' | 'confirmada' | 'completada' | 'cancelada' | 'no_asistio';

export type TipoPago = 'completo' | 'a_cuotas';

export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'otro';

export type EstadoEmpleado = 'activo' | 'inactivo' | 'permiso';

export type TipoPaciente = 'primera_vez' | 'regular' | 'pediatrico';

export type Sexo = 'Masculino' | 'Femenino' | 'Otro';

export type EstadoFisico = 'bueno' | 'regular' | 'malo';

// ============================================
// INTERFACES DE CATÁLOGOS
// ============================================

export interface CatRol {
  id_rol: number;
  nombre_rol: NombreRol;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: Date;
}

export interface CatEstadoCita {
  id_estado_cita: number;
  nombre_estado: EstadoCita;
  descripcion?: string;
  color: string;
  activo: boolean;
  fecha_creacion: Date;
}

export interface CatTipoPago {
  id_tipo_pago: number;
  nombre_tipo: TipoPago;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: Date;
}

export interface CatMetodoPago {
  id_metodo_pago: number;
  nombre_metodo: MetodoPago;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: Date;
}

export interface CatEstadoEmpleado {
  id_estado_empleado: number;
  nombre_estado: EstadoEmpleado;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: Date;
}

export interface CatTipoPaciente {
  id_tipo_paciente: number;
  nombre_tipo: TipoPaciente;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: Date;
}

export interface CatSexo {
  id_sexo: number;
  nombre_sexo: Sexo;
  activo: boolean;
  fecha_creacion: Date;
}

export interface CatEstadoFisico {
  id_estado_fisico: number;
  nombre_estado: EstadoFisico;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: Date;
}

// ============================================
// INTERFACES PRINCIPALES
// ============================================

export interface Usuario {
  id_usuario: number;
  correo_electronico: string;
  contrasena_hash?: string; // Opcional para seguridad (no enviar al frontend)
  id_rol: number;
  nombre_completo: string;
  esta_activo: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  ultimo_acceso?: Date;
  // Relaciones populadas
  rol?: CatRol;
}

export interface CentroTrabajo {
  id_centro: number;
  nombre_centro: string;
  direccion: string;
  telefono?: string;
  correo_electronico?: string;
  esta_activo: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export interface Servicio {
  id_servicio: number;
  nombre_servicio: string;
  descripcion?: string;
  sucursal: string;
  duracion_minutos: number;
  esta_activo: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export interface Empleado {
  id_empleado: number;
  id_usuario?: number;
  codigo_empleado: string;
  especialidad?: string;
  id_centro?: number;
  fecha_contratacion: Date;
  id_estado: number;
  telefono?: string;
  contacto_emergencia?: string;
  telefono_emergencia?: string;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  // Relaciones populadas
  usuario?: Usuario;
  centro?: CentroTrabajo;
  estado?: CatEstadoEmpleado;
}

export interface Paciente {
  id_paciente: number;
  id_usuario?: number;
  codigo_paciente: string;
  nombre_completo: string;
  correo_electronico: string;
  telefono: string;
  edad?: number;
  id_sexo?: number;
  direccion?: string;
  colonia?: string;
  delegacion?: string;
  municipio?: string;
  codigo_postal?: string;
  tutor?: string;
  ocupacion?: string;
  id_tipo_paciente: number;
  es_nuevo: boolean;
  fecha_registro: Date;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  // Relaciones populadas
  usuario?: Usuario;
  sexo?: CatSexo;
  tipo_paciente?: CatTipoPaciente;
}

export interface Cita {
  id_cita: number;
  codigo_cita: string;
  id_paciente: number;
  id_servicio: number;
  id_centro: number;
  id_medico?: number;
  fecha_cita: Date;
  hora_cita: string; // TIME format "HH:MM"
  id_estado: number;
  // Información de pago
  precio_servicio?: number;
  monto_pagado: number;
  id_tipo_pago?: number;
  numero_pagos: number;
  pago_actual: number;
  // Notas y observaciones
  notas?: string;
  motivo_cancelacion?: string;
  // Confirmaciones enviadas
  correo_enviado: boolean;
  whatsapp_enviado: boolean;
  // Fechas de auditoría
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  fecha_confirmacion?: Date;
  fecha_completada?: Date;
  fecha_cancelacion?: Date;
  // Relaciones populadas
  paciente?: Paciente;
  servicio?: Servicio;
  centro?: CentroTrabajo;
  medico?: Empleado;
  estado?: CatEstadoCita;
  tipo_pago?: CatTipoPago;
}

export interface Pago {
  id_pago: number;
  id_cita: number;
  id_paciente: number;
  numero_pago: number;
  monto: number;
  fecha_pago: Date;
  id_metodo_pago?: number;
  numero_recibo?: string;
  notas?: string;
  id_creador?: number;
  fecha_creacion: Date;
  // Relaciones populadas
  cita?: Cita;
  paciente?: Paciente;
  metodo_pago?: CatMetodoPago;
  creador?: Empleado;
}

// Interfaces para datos JSON en expedientes médicos
export interface AntecedentesPatologicos {
  enfermedades_cardiovasculares?: boolean;
  diabetes?: boolean;
  hipertension?: boolean;
  alergias?: boolean;
  detalle_alergias?: string;
  otras_enfermedades?: string;
}

export interface AntecedentesNoPatologicos {
  tabaquismo?: boolean;
  alcoholismo?: boolean;
  drogas?: boolean;
  ejercicio?: boolean;
  dieta?: string;
  otros?: string;
}

export interface ExamenCara {
  forma?: string;
  simetria?: string;
  perfil?: string;
  atm?: string;
  musculos_masticadores?: string;
  observaciones?: string;
}

export interface LineaHoldaway {
  posicion?: string;
  angulo?: number;
  observaciones?: string;
}

export interface ExamenBucal {
  labios?: string;
  lengua?: string;
  paladar?: string;
  encias?: string;
  mucosa?: string;
  piso_boca?: string;
  observaciones?: string;
}

export interface ExamenRadiografico {
  tipo_radiografia?: string;
  fecha_radiografia?: Date;
  hallazgos?: string;
  observaciones?: string;
}

export interface ExpedienteMedico {
  id_expediente: number;
  id_paciente: number;
  numero_expediente: string;
  // Información personal
  direccion?: string;
  telefono?: string;
  ocupacion?: string;
  edad?: number;
  referencia?: string;
  id_sexo?: number;
  colonia?: string;
  delegacion?: string;
  codigo_postal?: string;
  tutor?: string;
  // Información del médico
  id_medico_asignado?: number;
  // Historia Clínica
  id_estado_fisico?: number;
  id_estado_dental?: number;
  // Antecedentes (JSON)
  antecedentes_patologicos?: AntecedentesPatologicos;
  antecedentes_no_patologicos?: AntecedentesNoPatologicos;
  // Hábitos
  frecuencia_habito?: string;
  duracion_habito?: string;
  intensidad_habito?: string;
  recibio_atencion_medica: boolean;
  motivo_atencion_medica?: string;
  // Exámenes (JSON)
  examen_cara?: ExamenCara;
  linea_holdaway?: LineaHoldaway;
  examen_bucal?: ExamenBucal;
  examen_radiografico?: ExamenRadiografico;
  // Firmas (Base64)
  firma_paciente?: string;
  firma_tutor_legal?: string;
  // Observaciones
  observaciones?: string;
  // Fechas
  fecha_inicio?: Date;
  fecha_fin?: Date;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  // Relaciones populadas
  paciente?: Paciente;
  medico_asignado?: Empleado;
  sexo?: CatSexo;
  estado_fisico?: CatEstadoFisico;
  estado_dental?: CatEstadoFisico;
}

export interface HistorialCita {
  id_historial: number;
  id_expediente: number;
  numero_cita: number;
  fecha_cita: Date;
  actividad: string;
  nombre_medico: string;
  notas?: string;
  fecha_creacion: Date;
  // Relaciones populadas
  expediente?: ExpedienteMedico;
}

export interface DiaBloqueado {
  id_bloqueo: number;
  fecha_bloqueada: Date;
  id_centro?: number;
  motivo?: string;
  es_festivo: boolean;
  id_bloqueador?: number;
  fecha_creacion: Date;
  // Relaciones populadas
  centro?: CentroTrabajo;
  bloqueador?: Empleado;
}

export interface HorarioBloqueado {
  id_horario_bloqueado: number;
  fecha_bloqueada: Date;
  hora_bloqueada: string; // TIME format "HH:MM"
  id_centro?: number;
  motivo?: string;
  id_bloqueador?: number;
  fecha_creacion: Date;
  // Relaciones populadas
  centro?: CentroTrabajo;
  bloqueador?: Empleado;
}

// ============================================
// INTERFACES DE VISTAS
// ============================================

export interface VistaCitaCompleta {
  id_cita: number;
  codigo_cita: string;
  fecha_cita: Date;
  hora_cita: string;
  estado: EstadoCita;
  color_estado: string;
  nombre_paciente: string;
  telefono_paciente: string;
  correo_paciente: string;
  nombre_servicio: string;
  duracion_minutos: number;
  nombre_centro: string;
  direccion_centro: string;
  codigo_medico?: string;
  nombre_medico?: string;
  precio_servicio?: number;
  monto_pagado: number;
  tipo_pago?: TipoPago;
  numero_pagos: number;
  pago_actual: number;
  notas?: string;
  fecha_creacion: Date;
  fecha_confirmacion?: Date;
  fecha_completada?: Date;
}

export interface VistaPacienteCompleto extends Paciente {
  nombre_sexo?: Sexo;
  tipo_paciente_nombre?: TipoPaciente;
  correo_usuario?: string;
  usuario_activo?: boolean;
  total_citas: number;
  fecha_ultima_cita?: Date;
}

// ============================================
// DTOs (Data Transfer Objects)
// ============================================

export interface LoginRequest {
  correo_electronico: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
  empleado?: Empleado;
  paciente?: Paciente;
}

export interface CrearPacienteRequest {
  nombre_completo: string;
  correo_electronico: string;
  telefono: string;
  edad?: number;
  id_sexo?: number;
  direccion?: string;
  colonia?: string;
  delegacion?: string;
  municipio?: string;
  codigo_postal?: string;
  tutor?: string;
  ocupacion?: string;
  id_tipo_paciente?: number;
}

export interface CrearCitaRequest {
  id_paciente: number;
  id_servicio: number;
  id_centro: number;
  id_medico?: number;
  fecha_cita: Date;
  hora_cita: string;
  precio_servicio?: number;
  id_tipo_pago?: number;
  numero_pagos?: number;
  notas?: string;
}

export interface ActualizarCitaRequest {
  id_estado?: number;
  fecha_cita?: Date;
  hora_cita?: string;
  notas?: string;
  motivo_cancelacion?: string;
}

export interface RegistrarPagoRequest {
  id_cita: number;
  id_paciente: number;
  numero_pago: number;
  monto: number;
  id_metodo_pago?: number;
  numero_recibo?: string;
  notas?: string;
}

export interface BloquearDiaRequest {
  fecha_bloqueada: Date;
  id_centro?: number;
  motivo?: string;
  es_festivo?: boolean;
}

export interface BloquearHorarioRequest {
  fecha_bloqueada: Date;
  hora_bloqueada: string;
  id_centro?: number;
  motivo?: string;
}

// ============================================
// TIPOS DE UTILIDAD
// ============================================

export interface FiltrosCitas {
  fecha_desde?: Date;
  fecha_hasta?: Date;
  id_centro?: number;
  id_medico?: number;
  id_estado?: number;
  id_paciente?: number;
}

export interface FiltrosPacientes {
  busqueda?: string; // Buscar por nombre, email, teléfono, código
  id_tipo_paciente?: number;
  es_nuevo?: boolean;
  fecha_registro_desde?: Date;
  fecha_registro_hasta?: Date;
}

export interface EstadisticasCitas {
  total_citas: number;
  citas_agendadas: number;
  citas_confirmadas: number;
  citas_completadas: number;
  citas_canceladas: number;
  citas_no_asistio: number;
}

export interface EstadisticasPagos {
  total_ingresos: number;
  ingresos_efectivo: number;
  ingresos_tarjeta: number;
  ingresos_transferencia: number;
  pagos_pendientes: number;
  monto_pendiente: number;
}

export interface HorarioDisponible {
  hora: string;
  disponible: boolean;
  motivo_no_disponible?: string;
}

export interface ReporteCitas {
  fecha: Date;
  total_citas: number;
  por_estado: Record<EstadoCita, number>;
  por_centro: Record<string, number>;
  ingresos_dia: number;
}

export interface ReporteSucursal {
  id_centro: number;
  nombre_centro: string;
  total_citas: number;
  total_ingresos: number;
  citas_por_estado: EstadisticasCitas;
  servicios_mas_solicitados: Array<{
    nombre_servicio: string;
    cantidad: number;
  }>;
}

// ============================================
// MAPEO DE IDs A VALORES (Para uso en frontend)
// ============================================

export const MAPEO_ROLES: Record<number, NombreRol> = {
  1: 'paciente',
  2: 'recepcionista',
  3: 'medico',
  4: 'administrador',
};

export const MAPEO_ESTADOS_CITA: Record<number, EstadoCita> = {
  1: 'agendada',
  2: 'confirmada',
  3: 'completada',
  4: 'cancelada',
  5: 'no_asistio',
};

export const MAPEO_TIPOS_PAGO: Record<number, TipoPago> = {
  1: 'completo',
  2: 'a_cuotas',
};

export const MAPEO_METODOS_PAGO: Record<number, MetodoPago> = {
  1: 'efectivo',
  2: 'tarjeta',
  3: 'transferencia',
  4: 'otro',
};

export const MAPEO_ESTADOS_EMPLEADO: Record<number, EstadoEmpleado> = {
  1: 'activo',
  2: 'inactivo',
  3: 'permiso',
};

export const MAPEO_TIPOS_PACIENTE: Record<number, TipoPaciente> = {
  1: 'primera_vez',
  2: 'regular',
  3: 'pediatrico',
};

export const MAPEO_SEXOS: Record<number, Sexo> = {
  1: 'Masculino',
  2: 'Femenino',
  3: 'Otro',
};

export const MAPEO_ESTADOS_FISICOS: Record<number, EstadoFisico> = {
  1: 'bueno',
  2: 'regular',
  3: 'malo',
};

// ============================================
// COLORES PARA UI
// ============================================

export const COLORES_ESTADOS_CITA: Record<EstadoCita, string> = {
  agendada: '#FFA500',
  confirmada: '#4CAF50',
  completada: '#2196F3',
  cancelada: '#F44336',
  no_asistio: '#9E9E9E',
};

// ============================================
// CONSTANTES
// ============================================

export const SUCURSALES = ['Pénjamo', 'Valle de Santiago', 'Abasolo'] as const;
export type Sucursal = typeof SUCURSALES[number];

export const HORARIOS_ATENCION = {
  inicio: '09:00',
  fin: '18:00',
  intervalo_minutos: 30,
};

export const DURACION_MINIMA_CITA = 30; // minutos
export const DURACION_MAXIMA_CITA = 180; // minutos
