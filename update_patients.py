from sqlalchemy import text
from app.database import SessionLocal

db = SessionLocal()

patients = db.execute(text('SELECT id FROM pacientes WHERE numero_expediente IS NULL')).fetchall()
for i, (row,) in enumerate(patients, 1):
    num_exp = f'PAC-{i:06d}'
    db.execute(text('UPDATE pacientes SET numero_expediente = :num WHERE id = :id'), {'num': num_exp, 'id': row})
db.commit()

result = db.execute(text('SELECT id, usuario_id, numero_expediente FROM pacientes')).fetchall()
for r in result:
    print(f'ID: {r[0]}, usuario_id: {r[1]}, numero: {r[2]}')
db.close()