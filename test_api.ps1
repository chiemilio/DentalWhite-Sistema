$login = Invoke-RestMethod -Uri 'http://localhost:8000/api/v1/auth/login' -Method POST -ContentType 'application/json' -Body '{"email":"doctor@dentalwhite.com","password":"doctor123"}'
$token = $login.access_token
Write-Host "=== Login Exitoso ===" -ForegroundColor Green
Write-Host ""

Write-Host "=== Test: Sucursales ===" -ForegroundColor Cyan
$sucursales = Invoke-RestMethod -Uri 'http://localhost:8000/api/v1/catalogos/sucursales' -Method GET -Headers @{"Authorization"="Bearer $token"}
$sucursales | ConvertTo-Json -Depth 3

Write-Host ""
Write-Host "=== Test: Estados de Cita ===" -ForegroundColor Cyan
$estados = Invoke-RestMethod -Uri 'http://localhost:8000/api/v1/catalogos/estadoscita' -Method GET -Headers @{"Authorization"="Bearer $token"}
$estados | ConvertTo-Json -Depth 3

Write-Host ""
Write-Host "=== Test: Empleado (doctor) ===" -ForegroundColor Cyan
$empleado = Invoke-RestMethod -Uri 'http://localhost:8000/api/v1/employees/?usuario_id=8' -Method GET -Headers @{"Authorization"="Bearer $token"}
$empleado | ConvertTo-Json -Depth 5

Write-Host ""
Write-Host "=== Test: Citas del Doctor ===" -ForegroundColor Cyan
$citas = Invoke-RestMethod -Uri 'http://localhost:8000/api/v1/appointments/?empleado_id=4&estado_id=2' -Method GET -Headers @{"Authorization"="Bearer $token"}
$citas | ConvertTo-Json -Depth 3

Write-Host ""
Write-Host "=== Test Completado ===" -ForegroundColor Green
