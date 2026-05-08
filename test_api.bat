@echo off
echo === TEST LOGIN ===
curl.exe -s -X POST http://localhost:8000/api/v1/auth/login -H "Content-Type: application/json" --data-binary "{\"email\":\"admin\",\"password\":\"admin123\"}"
echo.

echo === TEST HEALTH ===
curl.exe -s http://localhost:8000/health
echo.

echo === TEST SEARCH PATIENTS ===
curl.exe -s "http://localhost:8000/api/v1/patients/search?q=a"
echo.