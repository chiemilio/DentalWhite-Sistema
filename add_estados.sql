INSERT INTO cat_estados_cita (id, nombre, activo) VALUES (5, 'Pagado Parcial', true), (6, 'Pagado Completo', true) ON CONFLICT (id) DO NOTHING;
SELECT * FROM cat_estados_cita ORDER BY id;