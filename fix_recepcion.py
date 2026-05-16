import psycopg2
import bcrypt

# Generate hash for recep123
password_hash = bcrypt.hashpw(b'recep123', bcrypt.gensalt()).decode()
print(f"Generated hash for recep123: {password_hash}")

# Connect to database
conn = psycopg2.connect(host="postgres", port=5432, database="dental_white", user="dental_admin", password="dental_secret_2026")
cur = conn.cursor()

# Update recepcion user
cur.execute("UPDATE usuarios SET password_hash = %s WHERE email = 'recepcion@dentalwhite.com'", (password_hash,))
conn.commit()
print(f"Updated {cur.rowcount} users")

# Verify
cur.execute("SELECT id, email, password_hash FROM usuarios WHERE email = 'recepcion@dentalwhite.com'")
row = cur.fetchone()
print(f"recepcion hash: {row[2][:50]}...")

cur.close()
conn.close()

# Test login
import urllib.request, json

data = json.dumps({'email': 'recepcion@dentalwhite.com', 'password': 'recep123'}).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/api/v1/auth/login', data=data)
req.add_header('Content-Type', 'application/json')
try:
    r = urllib.request.urlopen(req)
    resp = json.loads(r.read().decode('utf-8'))
    print(f"SUCCESS: role={resp['user']['role']}, name={resp['user']['name']}")
except urllib.error.HTTPError as e:
    print(f"FAIL: {e.code} - {e.read().decode()}")