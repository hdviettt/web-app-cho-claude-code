# ─────────────────────────────────────────────────────────────
# Backend Dockerfile cho Railway.
#
# Railway tự build image này khi push commit lên GitHub.
# `${PORT}` được Railway tự inject — uvicorn listen đúng port đó.
# ─────────────────────────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Cài deps trước (tận dụng layer cache khi code đổi nhưng deps không đổi)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Health check để Railway biết khi nào service sẵn sàng
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:${PORT:-8000}/health').read()" || exit 1

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
