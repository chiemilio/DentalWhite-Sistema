from sqlalchemy import text
from app.database import SessionLocal

db = SessionLocal()
result = db.execute(text('SELECT id, email, rol_id FROM usuarios')).fetchall()
for r in result:
    print(f'ID: {r[0]}, email: {r[1]}, rol_id: {r[2]}')
db.close()