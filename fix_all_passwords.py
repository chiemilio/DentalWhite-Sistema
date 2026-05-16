import psycopg2
import bcrypt

# Generate fresh hash for password 'doctor123'
password = 'doctor123'
salt = bcrypt.gensalt()
hash_bytes = bcrypt.hashpw(password.encode('utf-8'), salt)
password_hash = hash_bytes.decode('utf-8')

print(f"Generated hash: {password_hash}")

# Connect to database
conn = psycopg2.connect(host="postgres", port=5432, database="dental_white", user="dental_admin", password="dental_secret_2026")
cur = conn.cursor()

# Update all users
cur.execute("UPDATE usuarios SET password_hash = %s", (password_hash,))
conn.commit()
print(f"Updated {cur.rowcount} users")

# Verify by checking
cur.execute("SELECT id, email, password_hash FROM usuarios ORDER BY id")
print("\nDatabase hashes:")
for row in cur.fetchall():
    print(f"  {row[0]}: {row[1]} -> {row[2]}")

cur.close()
conn.close()

# Test all logins
import urllib.request, json

users = [
    ('doctor@dentalwhite.com', 'doctor123'),
    ('admin@dentalwhite.com', 'doctor123'),
    ('recepcion@dentalwhite.com', 'doctor123'),
    ('paciente@example.com', 'doctor123'),
]

print("\nTesting logins:")
for email, pwd in users:
    data = json.dumps({'email': email, 'password': pwd}).encode('utf-8')
    req = urllib.request.Request('http://localhost:8000/api/v1/auth/login', data=data)
    req.add_header('Content-Type', 'application/json')
    try:
        r = urllib.request.urlopen(req)
        resp = json.loads(r.read().decode('utf-8'))
        print(f"  OK: {email} -> {resp['user']['role']}")
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  FAIL: {email} -> {e.code}")