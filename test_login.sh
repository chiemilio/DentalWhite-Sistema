#!/bin/bash
curl -s -X POST 'http://localhost:8000/api/v1/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"paciente@example.com","password":"password123"}'