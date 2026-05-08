# Tipos TypeScript - Dental White

## Versión 2.0 - Tipos en Español

Este archivo contiene todas las interfaces y tipos TypeScript para el sistema Dental White, completamente en español y alineado con el esquema de base de datos v2.0.

---

## Estructura

### 📊 Tipos de Catálogo
Enumeraciones para valores fijos del sistema:
- `NombreRol` - paciente | recepcionista | medico | administrador
- `EstadoCita` - agendada | confirmada | completada | cancelada | no_asistio
- `TipoPago` - completo | a_cuotas
- `MetodoPago` - efectivo | tarjeta | transferencia | otro
- `EstadoEmpleado` - activo | inactivo | permiso
- `TipoPaciente` - primera_vez | regular | pediatrico
- `Sexo` - Masculino | Femenino | Otro
- `EstadoFisico` - bueno | regular | malo

### 🗂️ Interfaces de Catálogo
Interfaces para tablas de catálogo con prefijo `Cat`:
- `CatRol`
- `CatEstadoCita`
- `CatTipoPago`
- `CatMetodoPago`
- `CatEstadoEmpleado`
- `CatTipoPaciente`
- `CatSexo`
- `CatEstadoFisico`

### 📋 Interfaces Principales
Interfaces para entidades principales del sistema:
- `Usuario`
- `CentroTrabajo`
- `Servicio`
- `Empleado`
- `Paciente`
- `Cita`
- `Pago`
- `ExpedienteMedico`
- `HistorialCita`
- `DiaBloqueado`
- `HorarioBloqueado`

### 📊 Interfaces de Vistas
Interfaces para vistas de base de datos:
- `VistaCitaCompleta` - Cita con todos los datos relacionados
- `VistaPacienteCompleto` - Paciente con estadísticas

### 📦 DTOs (Data Transfer Objects)
Interfaces para peticiones y respuestas de API:
- `LoginRequest` / `LoginResponse`
- `CrearPacienteRequest`
- `CrearCitaRequest`
- `ActualizarCitaRequest`
- `RegistrarPagoRequest`
- `BloquearDiaRequest`
- `BloquearHorarioRequest`

### 🔧 Tipos de Utilidad
Interfaces auxiliares para filtros, estadísticas y reportes:
- `FiltrosCitas`
- `FiltrosPacientes`
- `EstadisticasCitas`
- `EstadisticasPagos`
- `HorarioDisponible`
- `ReporteCitas`
- `ReporteSucursal`

---

## Uso en el Código

### Importar Tipos

```typescript
import { 
  Usuario, 
  Paciente, 
  Cita, 
  EstadoCita,
  MAPEO_ESTADOS_CITA 
} from '@/types';
```

### Ejemplo: Crear Estado de Componente

```typescript
import { useState } from 'react';
import { Paciente, VistaCitaCompleta } from '@/types';

function CitasDelDia() {
  const [citas, setCitas] = useState<VistaCitaCompleta[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  
  // ...
}
```

### Ejemplo: Tipar Props de Componente

```typescript
import { Cita, Paciente } from '@/types';

interface CitaCardProps {
  cita: Cita;
  paciente: Paciente;
  onEditar: (cita: Cita) => void;
  onCancelar: (idCita: number) => void;
}

export function CitaCard({ cita, paciente, onEditar, onCancelar }: CitaCardProps) {
  // ...
}
```

### Ejemplo: Petición API con DTO

```typescript
import { CrearCitaRequest, Cita } from '@/types';

async function crearNuevaCita(datos: CrearCitaRequest): Promise<Cita> {
  const response = await fetch('/api/citas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  
  return response.json();
}
```

### Ejemplo: Usar Mapeos de Catálogos

```typescript
import { Cita, MAPEO_ESTADOS_CITA, COLORES_ESTADOS_CITA } from '@/types';

function CitaBadge({ cita }: { cita: Cita }) {
  const nombreEstado = MAPEO_ESTADOS_CITA[cita.id_estado];
  const colorEstado = COLORES_ESTADOS_CITA[nombreEstado];
  
  return (
    <span style={{ backgroundColor: colorEstado }}>
      {nombreEstado}
    </span>
  );
}
```

---

## Relaciones Populadas

Algunas interfaces incluyen campos opcionales para relaciones populadas. Ejemplo:

```typescript
interface Cita {
  id_cita: number;
  id_paciente: number;
  // ... otros campos
  
  // Relaciones opcionales (solo si se incluyen en el JOIN)
  paciente?: Paciente;
  servicio?: Servicio;
  centro?: CentroTrabajo;
  medico?: Empleado;
}
```

**Uso:**
```typescript
// Cita sin relaciones populadas
const citaBasica: Cita = {
  id_cita: 1,
  id_paciente: 5,
  // ...
};

// Cita con relaciones populadas (desde vista o JOIN)
const citaCompleta: Cita = {
  id_cita: 1,
  id_paciente: 5,
  paciente: {
    id_paciente: 5,
    nombre_completo: 'Juan Pérez',
    // ...
  },
  // ...
};
```

---

## Datos JSON en Expedientes

Los expedientes médicos incluyen campos JSON con estructuras definidas:

```typescript
import { 
  ExpedienteMedico, 
  AntecedentesPatologicos,
  ExamenBucal 
} from '@/types';

const expediente: ExpedienteMedico = {
  id_expediente: 1,
  id_paciente: 5,
  // ...
  antecedentes_patologicos: {
    diabetes: true,
    hipertension: false,
    alergias: true,
    detalle_alergias: 'Penicilina',
  },
  examen_bucal: {
    labios: 'Normal',
    lengua: 'Normal',
    encias: 'Inflamación leve',
  },
};
```

---

## Fechas y Horas

### Campos de Fecha
```typescript
fecha_cita: Date;
fecha_creacion: Date;
```

### Campos de Hora (formato "HH:MM")
```typescript
hora_cita: string; // "09:30", "14:00", etc.
```

**Importante:** Al recibir datos de la API, convertir strings a Date:
```typescript
const citaDesdeAPI = await fetch('/api/citas/1').then(r => r.json());
const citaTipada: Cita = {
  ...citaDesdeAPI,
  fecha_cita: new Date(citaDesdeAPI.fecha_cita),
  fecha_creacion: new Date(citaDesdeAPI.fecha_creacion),
};
```

---

## Constantes Disponibles

### Mapeos de IDs a Valores
```typescript
MAPEO_ROLES[1] // 'paciente'
MAPEO_ESTADOS_CITA[2] // 'confirmada'
MAPEO_TIPOS_PAGO[1] // 'completo'
MAPEO_METODOS_PAGO[1] // 'efectivo'
```

### Colores para UI
```typescript
COLORES_ESTADOS_CITA['agendada'] // '#FFA500'
COLORES_ESTADOS_CITA['confirmada'] // '#4CAF50'
COLORES_ESTADOS_CITA['completada'] // '#2196F3'
```

### Sucursales
```typescript
SUCURSALES // ['Pénjamo', 'Valle de Santiago', 'Abasolo']
type Sucursal = 'Pénjamo' | 'Valle de Santiago' | 'Abasolo';
```

### Horarios
```typescript
HORARIOS_ATENCION.inicio // '09:00'
HORARIOS_ATENCION.fin // '18:00'
HORARIOS_ATENCION.intervalo_minutos // 30

DURACION_MINIMA_CITA // 30 minutos
DURACION_MAXIMA_CITA // 180 minutos
```

---

## Type Guards

Puedes crear type guards para validar tipos en runtime:

```typescript
import { Usuario, NombreRol } from '@/types';

function esAdministrador(usuario: Usuario): boolean {
  return usuario.id_rol === 4; // rol administrador
}

function esPaciente(usuario: Usuario): boolean {
  return usuario.id_rol === 1; // rol paciente
}

function esEmpleado(usuario: Usuario): boolean {
  return [2, 3, 4].includes(usuario.id_rol); // recepcionista, medico, admin
}
```

---

## Validación con Zod (Opcional)

Para validación en runtime, puedes usar Zod:

```typescript
import { z } from 'zod';

const CrearPacienteSchema = z.object({
  nombre_completo: z.string().min(3, 'Nombre muy corto'),
  correo_electronico: z.string().email('Email inválido'),
  telefono: z.string().regex(/^\d{10}$/, 'Teléfono debe tener 10 dígitos'),
  edad: z.number().min(0).max(120).optional(),
  id_sexo: z.number().min(1).max(3).optional(),
});

// Usar para validar
const resultado = CrearPacienteSchema.safeParse(datos);
if (resultado.success) {
  // datos validados en resultado.data
} else {
  // errores en resultado.error
}
```

---

## Migración desde Versión Antigua

### Cambios de Nombres

| Antiguo | Nuevo |
|---------|-------|
| `User` | `Usuario` |
| `email` | `correo_electronico` |
| `role` | `id_rol` (ahora es ID numérico) |
| `WorkCenter` | `CentroTrabajo` |
| `name` | `nombre_centro` |
| `Patient` | `Paciente` |
| `patient_code` | `codigo_paciente` |
| `Appointment` | `Cita` |
| `appointment_date` | `fecha_cita` |
| `status` | `id_estado` (ahora es ID numérico) |
| `MedicalRecord` | `ExpedienteMedico` |

### Ejemplo de Migración

```typescript
// ANTES (v1.0)
interface User {
  id: number;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  full_name: string;
}

// DESPUÉS (v2.0)
interface Usuario {
  id_usuario: number;
  correo_electronico: string;
  id_rol: number; // 1, 2, 3, 4
  nombre_completo: string;
  rol?: CatRol; // relación opcional
}
```

---

## Buenas Prácticas

### ✅ DO

```typescript
// Usar tipos específicos
const paciente: Paciente = obtenerPaciente();

// Tipar funciones completamente
function procesarCita(cita: Cita): VistaCitaCompleta {
  // ...
}

// Usar DTOs para peticiones
const datos: CrearCitaRequest = { /* ... */ };
await crearCita(datos);

// Usar mapeos en lugar de strings hardcodeados
const estado = MAPEO_ESTADOS_CITA[cita.id_estado];
```

### ❌ DON'T

```typescript
// NO usar any
const usuario: any = obtenerUsuario(); // ❌

// NO hardcodear valores de catálogos
if (cita.id_estado === 2) { // ❌ Qué es 2?
  // mejor: cita.id_estado === ID del catálogo 'confirmada'
}

// NO omitir tipos en funciones
function procesarCita(cita) { // ❌ Sin tipo
  return cita.paciente; // ❌ Sin tipo de retorno
}

// NO usar strings en lugar de enums cuando existen
const estado: string = 'agendada'; // ❌
const estado: EstadoCita = 'agendada'; // ✅
```

---

## Recursos Adicionales

- **Esquema de BD:** `/database/postgresql_schema_es.sql`
- **Mapeo de Campos:** `/database/MAPEO_CAMPOS.md`
- **Documentación BD:** `/database/README.md`

---

## Soporte TypeScript

Para mejor experiencia de desarrollo:

1. **Habilitar strict mode** en `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "strictNullChecks": true,
       "noImplicitAny": true
     }
   }
   ```

2. **Usar ESLint** con reglas TypeScript

3. **Configurar alias de imports:**
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/types": ["./src/app/types"],
         "@/types/*": ["./src/app/types/*"]
       }
     }
   }
   ```

---

## Changelog

### Versión 2.0 (Abril 2026)
- ✅ Traducción completa a español
- ✅ Alineación con esquema BD v2.0
- ✅ Interfaces de catálogos
- ✅ DTOs para API
- ✅ Mapeos de constantes
- ✅ Tipos de utilidad
- ✅ Documentación completa

### Versión 1.0 (Marzo 2026)
- Tipos iniciales en inglés
- Interfaces básicas
