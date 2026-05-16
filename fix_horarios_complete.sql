-- Script completo para agregar columna hora y datos de horarios

-- 1. Agregar la columna hora si no existe
ALTER TABLE cat_horarios ADD COLUMN IF NOT EXISTS hora VARCHAR(5);

-- 2. Actualizar registros existentes con hora basada en hora_inicio
UPDATE cat_horarios 
SET hora = TO_CHAR(hora_inicio, 'HH24:MI')
WHERE hora IS NULL OR hora = '';

-- 3. Insertar horarios para sucursal 1 (Pénjamo)
INSERT INTO cat_horarios (sucursal_id, hora, hora_inicio, hora_fin, duracion_minutos, activo) VALUES
(1, '09:00', '09:00:00', '18:00:00', 30, true),
(1, '09:30', '09:00:00', '18:00:00', 30, true),
(1, '10:00', '09:00:00', '18:00:00', 30, true),
(1, '10:30', '09:00:00', '18:00:00', 30, true),
(1, '11:00', '09:00:00', '18:00:00', 30, true),
(1, '11:30', '09:00:00', '18:00:00', 30, true),
(1, '12:00', '09:00:00', '18:00:00', 30, true),
(1, '12:30', '09:00:00', '18:00:00', 30, true),
(1, '13:00', '09:00:00', '18:00:00', 30, true),
(1, '13:30', '09:00:00', '18:00:00', 30, true),
(1, '14:00', '09:00:00', '18:00:00', 30, true),
(1, '14:30', '09:00:00', '18:00:00', 30, true),
(1, '15:00', '09:00:00', '18:00:00', 30, true),
(1, '15:30', '09:00:00', '18:00:00', 30, true),
(1, '16:00', '09:00:00', '18:00:00', 30, true),
(1, '16:30', '09:00:00', '18:00:00', 30, true),
(1, '17:00', '09:00:00', '18:00:00', 30, true),
(1, '17:30', '09:00:00', '18:00:00', 30, true)
ON CONFLICT DO NOTHING;

-- 4. Insertar horarios para sucursal 2 (Valle de Santiago)
INSERT INTO cat_horarios (sucursal_id, hora, hora_inicio, hora_fin, duracion_minutos, activo) VALUES
(2, '09:00', '09:00:00', '17:00:00', 30, true),
(2, '09:30', '09:00:00', '17:00:00', 30, true),
(2, '10:00', '09:00:00', '17:00:00', 30, true),
(2, '10:30', '09:00:00', '17:00:00', 30, true),
(2, '11:00', '09:00:00', '17:00:00', 30, true),
(2, '11:30', '09:00:00', '17:00:00', 30, true),
(2, '12:00', '09:00:00', '17:00:00', 30, true),
(2, '12:30', '09:00:00', '17:00:00', 30, true),
(2, '13:00', '09:00:00', '17:00:00', 30, true),
(2, '13:30', '09:00:00', '17:00:00', 30, true),
(2, '14:00', '09:00:00', '17:00:00', 30, true),
(2, '14:30', '09:00:00', '17:00:00', 30, true),
(2, '15:00', '09:00:00', '17:00:00', 30, true),
(2, '15:30', '09:00:00', '17:00:00', 30, true),
(2, '16:00', '09:00:00', '17:00:00', 30, true),
(2, '16:30', '09:00:00', '17:00:00', 30, true)
ON CONFLICT DO NOTHING;

-- 5. Insertar horarios para sucursal 3 (Abasolo)
INSERT INTO cat_horarios (sucursal_id, hora, hora_inicio, hora_fin, duracion_minutos, activo) VALUES
(3, '10:00', '10:00:00', '18:00:00', 30, true),
(3, '10:30', '10:00:00', '18:00:00', 30, true),
(3, '11:00', '10:00:00', '18:00:00', 30, true),
(3, '11:30', '10:00:00', '18:00:00', 30, true),
(3, '12:00', '10:00:00', '18:00:00', 30, true),
(3, '12:30', '10:00:00', '18:00:00', 30, true),
(3, '13:00', '10:00:00', '18:00:00', 30, true),
(3, '13:30', '10:00:00', '18:00:00', 30, true),
(3, '14:00', '10:00:00', '18:00:00', 30, true),
(3, '14:30', '10:00:00', '18:00:00', 30, true),
(3, '15:00', '10:00:00', '18:00:00', 30, true),
(3, '15:30', '10:00:00', '18:00:00', 30, true),
(3, '16:00', '10:00:00', '18:00:00', 30, true),
(3, '16:30', '10:00:00', '18:00:00', 30, true),
(3, '17:00', '10:00:00', '18:00:00', 30, true),
(3, '17:30', '10:00:00', '18:00:00', 30, true)
ON CONFLICT DO NOTHING;

-- 6. Verificar resultados
SELECT 'Sucursal 1 - Pénjamo' as sucursal, COUNT(*) as horarios FROM cat_horarios WHERE sucursal_id = 1 AND hora IS NOT NULL
UNION ALL
SELECT 'Sucursal 2 - Valle de Santiago', COUNT(*) FROM cat_horarios WHERE sucursal_id = 2 AND hora IS NOT NULL
UNION ALL
SELECT 'Sucursal 3 - Abasolo', COUNT(*) FROM cat_horarios WHERE sucursal_id = 3 AND hora IS NOT NULL
UNION ALL
SELECT 'TOTAL', COUNT(*) FROM cat_horarios WHERE hora IS NOT NULL;

-- 7. Ver los primeros registros
SELECT id, sucursal_id, hora, hora_inicio, hora_fin FROM cat_horarios WHERE hora IS NOT NULL LIMIT 10;