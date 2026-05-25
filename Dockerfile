FROM python:3.12-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

CMD python seed_catalogs.py && python seed_users.py && python seed_horarios.py && uvicorn app.main:app --host 0.0.0.0 --port $PORT
