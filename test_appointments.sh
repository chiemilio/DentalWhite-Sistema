#!/bin/bash
TOKEN=$(wsl -d Ubuntu-24.04 bash test_login.sh | wsl -d Ubuntu-24.04 python3 -c "import sys, json; data = json.load(sys.stdin); print(data['access_token'])")
echo "Token: $TOKEN"
curl -s "http://localhost:8000/api/v1/appointments/?paciente_id=9" -H "Authorization: Bearer $TOKEN"