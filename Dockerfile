FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY prompt_template.txt ./prompt_template.txt

CMD uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8080}
