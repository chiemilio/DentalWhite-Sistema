import psycopg2

conn = psycopg2.connect(
    host="postgres",
    port=5432,
    database="dental_white",
    user="dental_admin",
    password="dental_secret_2026"
)
cur = conn.cursor()

# All users will have the same password hash for testing
password_hash = "$2b$12$CGKUy8uAlvre8YG8qx4Bs.Vp.pjWtkjYEiCrP3CcT70t/bV4NnkvG"

# Update all users
cur.execute("UPDATE usuarios SET password_hash = %s", (password_hash,))
conn.commit()

# Verify
cur.execute("SELECT id, email, password_hash FROM usuarios")
print("Updated passwords:")
for row in cur.fetchall():
    print(f"  ID {row[0]}: {row[1]} -> {row[2][:50]}...")

cur.close()
conn.close()