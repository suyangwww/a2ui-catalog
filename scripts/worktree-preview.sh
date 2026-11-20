#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="${ROOT_DIR}/.tmp"
LOG_FILE="${TMP_DIR}/preview.log"
mkdir -p "${TMP_DIR}"

HASH_NUM="$(printf '%s' "${ROOT_DIR}" | cksum | awk '{print $1}')"
DEFAULT_PORT="$(( 4100 + (HASH_NUM % 800) ))"
PORT="${PREVIEW_PORT:-${DEFAULT_PORT}}"

printf '{"ts":"%s","event":"preview_starting","worktree":"%s","requestedPort":%d}\n' \
  "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "${ROOT_DIR}" "${PORT}" >> "${LOG_FILE}"

echo "{\"status\":\"starting\",\"url\":\"http://127.0.0.1:${PORT}\",\"log\":\"${LOG_FILE}\"}"

exec pnpm --dir "${ROOT_DIR}" exec vite --config "${ROOT_DIR}/src/preview/vite.config.ts" --host 127.0.0.1 --port "${PORT}"
