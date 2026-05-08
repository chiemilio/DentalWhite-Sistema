"""Query database directly"""
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="dentalwhite",
    user="postgres",
    password="postgres123"
)
cur = conn.cursor()
cur.execute("SELECT id, pago_id, monto, metodo_pago, numero_recibo, fecha_pago FROM pagos_parciales;")
for row in cur.fetchall():
    print(row)
conn.close()