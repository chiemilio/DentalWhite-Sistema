import urllib.request, json

# Test ALL users with 'doctor123'
users = [
    ('doctor@dentalwhite.com', 'doctor123'),
    ('admin@dentalwhite.com', 'doctor123'),
    ('recepcion@dentalwhite.com', 'doctor123'),
    ('paciente@example.com', 'doctor123'),
]

for email, pwd in users:
    data = json.dumps({'email': email, 'password': pwd}).encode('utf-8')
    req = urllib.request.Request('http://localhost:8000/api/v1/auth/login', data=data)
    req.add_header('Content-Type', 'application/json')
    try:
        r = urllib.request.urlopen(req)
        resp = json.loads(r.read().decode('utf-8'))
        print(f'OK: {email} -> {resp["user"]["role"]}')
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f'FAIL: {email} -> {e.code}: {body}')
    except Exception as e:
        print(f'ERROR: {email} -> {e}')

# Check database hashes
import psycopg2
conn = psycopg2.connect(host="postgres", port=5432, database="dental_white", user="dental_admin", password="dental_secret_2026")
cur = conn.cursor()
cur.execute("SELECT id, email, password_hash FROM usuarios ORDER BY id")
print("\nDatabase hashes:")
for row in cur.fetchall():
    print(f"  {row[0]}: {row[1]} -> {row[2][:60]}")
cur.close()
conn.close()