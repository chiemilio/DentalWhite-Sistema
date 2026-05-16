-- Agregar columna horario_id a bloqueos_agenda si no existe
ALTER TABLE bloqueos_agenda ADD COLUMN IF NOT EXISTS horario_id INTEGER REFERENCES cat_horarios(id);

-- Verificar la estructura de bloqueos_agenda
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bloqueos_agenda' 
ORDER BY ordinal_position;

-- Ver registros actuales de bloqueos_agenda
SELECT id, sucursal_id, empleado_id, fecha_inicio, fecha_fin, hora_inicio, hora_fin, motivo, horario_id, activo 
FROM bloqueos_agenda 
WHERE activo = true 
LIMIT 10;