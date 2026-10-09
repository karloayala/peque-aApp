#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if curl -fsS http://localhost:8080/ >/dev/null 2>&1; then
  echo "Backend ya disponible en http://localhost:8080"
else
  nohup gradle -p "$ROOT_DIR/backend" bootRun > /tmp/conversor-backend.log 2>&1 < /dev/null &
  echo "Iniciando backend; registro: /tmp/conversor-backend.log"
fi

if curl -fsS http://localhost:5173/ >/dev/null 2>&1; then
  echo "Frontend ya disponible en http://localhost:5173"
else
  nohup npm --prefix "$ROOT_DIR/frontend" run dev -- --host 0.0.0.0 > /tmp/conversor-frontend.log 2>&1 < /dev/null &
  echo "Iniciando frontend; registro: /tmp/conversor-frontend.log"
fi
