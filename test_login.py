import psycopg2

conn = psycopg2.connect(
    host="postgres",
    port=5432,
    database="dental_white",
    user="dental_admin",
    password="dental_secret_2026"
)
cur = conn.cursor()

# The hash that matches "doctor123"
password_hash = "$2b$12$CGKUy8uAlvre8YG8qx4Bs.Vp.pjWtkjYEiCrP3CcT70t/bV4NnkvG"

# Update all users to use "doctor123"
cur.execute("UPDATE usuarios SET password_hash = %s WHERE id IN (1,2,3,4)", (password_hash,))
conn.commit()

print("All users updated to password: doctor123")
print("Testing login...")

import urllib.request
import json

import urllib.request
import urllib.error

base_url = "http://localhost:8000/api/v1"

users = [
    {"email": "doctor@dentalwhite.com", "password": "doctor123"},
    {"email": "admin@dentalwhite.com", "password": "doctor123"},
    {"email": "recepcion@dentalwhite.com", "password": "doctor123"},
    {"email": "paciente@example.com", "password": "doctor123"},
]

for user in users:
    data = json.dumps(user).encode('utf-8')
    req = urllib.request.Request(f"{base_url}/auth/login", data=data)
    req.add_header('Content-Type', 'application/json')
    try:
        r = urllib.request.urlopen(req)
        resp = json.loads(r.read().decode('utf-8'))
        print(f"  ✓ {user['email']}: SUCCESS - role={resp['user']['role']}")
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        print(f"  ✗ {user['email']}: FAILED - {e.code}")

cur.close()
conn.close()