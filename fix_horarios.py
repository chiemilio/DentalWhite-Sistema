"""
Script para agregar columna hora y datos de horarios
"""
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="clinica_dental",
    user="postgres",
    password="postgres"
)

cursor = conn.cursor()

try:
    # Agregar columna hora si no existe
    cursor.execute("ALTER TABLE cat_horarios ADD COLUMN hora VARCHAR(5);")
    print("Columna 'hora' agregada")
except Exception as e:
    print(f"Nota: {e}")

# Actualizar registros existentes con hora basada en hora_inicio
cursor.execute("""
    UPDATE cat_horarios 
    SET hora = TO_CHAR(hora_inicio, 'HH24:MI')
    WHERE hora IS NULL OR hora = '';
""")
print(f"Registros actualizados: {cursor.rowcount}")

# Insertar horarios de ejemplo para cada sucursal si no existen
cursor.execute("SELECT id FROM cat_sucursales WHERE activo = true;")
sucursales = cursor.fetchall()

horarios_base = {
    1: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
    2: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
    3: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']
}

for sucursal_id in sucursales:
    sid = sucursal_id[0]
    if sid in horarios_base:
        for hora in horarios_base[sid]:
            cursor.execute("""
                INSERT INTO cat_horarios (sucursal_id, hora, hora_inicio, hora_fin, duracion_minutos, activo)
                VALUES (%s, %s, %s::time, %s::time, 30, true)
                ON CONFLICT DO NOTHING
            """, (sid, hora, hora, hora.replace('00', '30')))
            if cursor.rowcount > 0:
                print(f"Insertado horario {hora} para sucursal {sid}")

conn.commit()

# Verificar
cursor.execute("SELECT COUNT(*) FROM cat_horarios WHERE hora IS NOT NULL;")
count = cursor.fetchone()[0]
print(f"\nTotal horarios con hora: {count}")

cursor.execute("SELECT sucursal_id, COUNT(*) FROM cat_horarios WHERE hora IS NOT NULL GROUP BY sucursal_id;")
print("Horarios por sucursal:", cursor.fetchall())

cursor.close()
conn.close()
print("\n¡Listo!")