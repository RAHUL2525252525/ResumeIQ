#!/bin/sh
set -e

echo "Waiting for database at ${DB_HOST:-db}:${DB_PORT:-5432}..."
python - << 'PYEOF'
import os, socket, time
host = os.environ.get("DB_HOST", "db")
port = int(os.environ.get("DB_PORT", "5432"))
for _ in range(60):
    try:
        socket.create_connection((host, port), timeout=2).close()
        break
    except OSError:
        time.sleep(1)
else:
    raise SystemExit("Database never became available")
PYEOF

echo "Applying migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput || true

echo "Starting server..."
if [ "$DJANGO_DEBUG_SERVER" = "1" ]; then
    exec python manage.py runserver 0.0.0.0:8000
else
    exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
fi
