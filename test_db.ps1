# Test: Base de datos Dental White
Write-Host "=== Test: Conexion a Base de Datos ===" -ForegroundColor Cyan
docker exec dental_white_db pg_isready -U dental_admin -d dental_white
Write-Host ""
Write-Host "=== Tabla: usuarios ===" -ForegroundColor Yellow
docker exec dental_white_db psql -U dental_admin -d dental_white -c "SELECT id, nombre, email, rol_id FROM usuarios LIMIT 5;"
Write-Host ""
Write-Host "=== Tabla: pacientes ===" -ForegroundColor Yellow
docker exec dental_white_db psql -U dental_admin -d dental_white -c "SELECT id, usuario_id, numero_expediente, fecha_nacimiento, sexo, ocupacion FROM pacientes LIMIT 5;"
Write-Host ""
Write-Host "=== Tabla: empleados ===" -ForegroundColor Yellow
docker exec dental_white_db psql -U dental_admin -d dental_white -c "SELECT id, usuario_id, puesto, especialidad_principal FROM empleados LIMIT 5;"
Write-Host ""
Write-Host "=== Tabla: citas ===" -ForegroundColor Yellow
docker exec dental_white_db psql -U dental_admin -d dental_white -c "SELECT id, paciente_id, empleado_id, fecha, hora, estado_cita_id FROM citas LIMIT 5;"
Write-Host ""
Write-Host "=== Catalogo: Estados de Cita ===" -ForegroundColor Yellow
docker exec dental_white_db psql -U dental_admin -d dental_white -c "SELECT * FROM cat_estados_cita;"
Write-Host ""
Write-Host "=== Campos nuevos en pacientes ===" -ForegroundColor Yellow
docker exec dental_white_db psql -U dental_admin -d dental_white -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'pacientes' AND column_name IN ('sexo', 'ocupacion', 'firma_digitalizada');"
Write-Host ""
Write-Host "=== Campos nuevos en empleados ===" -ForegroundColor Yellow
docker exec dental_white_db psql -U dental_admin -d dental_white -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'empleados' AND column_name IN ('especialidad_principal', 'biografia_resumen', 'foto_perfil_url');"
Write-Host ""
Write-Host "=== Test Completado ===" -ForegroundColor Green
