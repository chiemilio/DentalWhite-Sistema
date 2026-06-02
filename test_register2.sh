#!/bin/bash
echo "=== Register with proper data ==="
curl -s -D - -X POST 'https://dentalwhite-sistema-4.onrender.com/api/v1/auth/register/' \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://deltawhitetest.vercel.app' \
  -d '{"email":"nuevo2@test.com","password":"password123","nombre":"Nuevo","apellido_paterno":"Paciente","telefono":"5512345678"}'
echo ""
echo "=== Cleanup: delete test user ==="
curl -s -X POST 'https://dentalwhite-sistema-4.onrender.com/api/v1/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@dentalwhite.com","password":"admin123"}' > /tmp/login_resp.json
TOKEN=$(python3 -c "import json; print(json.load(open('/tmp/login_resp.json')).get('access_token',''))")
echo "Token: ${TOKEN:0:20}..."
