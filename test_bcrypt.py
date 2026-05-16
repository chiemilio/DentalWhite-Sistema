import bcrypt

# Get the hash from database
hashes = {
    "doctor": "$2b$12$CGKUy8uAlvre8YG8qx4Bs.Vp.pjWtkjYEiCrP3CcT70t/bV4NnkvG",
}

passwords = ["doctor123", "admin123", "recep123", "paciente123"]

print("Testing password verification:")
for pwd in passwords:
    result = bcrypt.checkpw(pwd.encode('utf-8'), hashes["doctor"].encode('utf-8'))
    print(f"  '{pwd}' vs doctor hash: {result}")