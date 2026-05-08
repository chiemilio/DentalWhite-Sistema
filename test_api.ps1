$baseUrl = "http://localhost:8000/api/v1"

Write-Host "=== TESTING API ENDPOINTS ===" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get
    Write-Host "   OK: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $_" -ForegroundColor Red
}

# Test 2: Login
Write-Host "`n2. Login..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@dentalwhite.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $login.access_token
    Write-Host "   OK: Token received" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $_" -ForegroundColor Red
    $token = $null
}

# Test 3: Search Patients (no auth needed based on our changes)
Write-Host "`n3. Search Patients..." -ForegroundColor Yellow
try {
    $patients = Invoke-RestMethod -Uri "$baseUrl/patients/search?q=a" -Method Get
    Write-Host "   OK: Found $($patients.Count) patients" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $_" -ForegroundColor Red
}

# Test 4: Get Catalogos
Write-Host "`n4. Get Catalogos..." -ForegroundColor Yellow
try {
    $services = Invoke-RestMethod -Uri "$baseUrl/catalogos/servicios" -Method Get
    Write-Host "   OK: Found $($services.Count) services" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $_" -ForegroundColor Red
}

# Test 5: Get Sucursales
Write-Host "`n5. Get Sucursales..." -ForegroundColor Yellow
try {
    $branches = Invoke-RestMethod -Uri "$baseUrl/catalogos/sucursales" -Method Get
    Write-Host "   OK: Found $($branches.Count) branches" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $_" -ForegroundColor Red
}

# Test 6: Create Appointment (with auth)
if ($token) {
    Write-Host "`n6. Create Appointment..." -ForegroundColor Yellow
    $headers = @{ Authorization = "Bearer $token" }
    $appointmentBody = @{
        paciente_id = 1
        servicio_id = 1
        sucursal_id = 1
        fecha = "2026-05-10"
        hora = "10:00"
    } | ConvertTo-Json
    
    try {
        $appointment = Invoke-RestMethod -Uri "$baseUrl/appointments/" -Method Post -Body $appointmentBody -ContentType "application/json" -Headers $headers
        Write-Host "   OK: Appointment created with ID $($appointment.id)" -ForegroundColor Green
    } catch {
        Write-Host "   ERROR: $_" -ForegroundColor Red
    }
}

Write-Host "`n=== TESTS COMPLETED ===" -ForegroundColor Cyan