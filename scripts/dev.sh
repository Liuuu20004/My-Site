#!/usr/bin/env bash
set -euo pipefail
site_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$site_root"
if ! command -v node >/dev/null 2>&1; then
  bundled_node_dir="${HOME}/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin"
  if [[ -x "${bundled_node_dir}/node" ]]; then
    export PATH="${bundled_node_dir}:$PATH"
  else
    echo "Node.js is required. Install Node.js 24 and run pnpm install." >&2
    exit 1
  fi
fi
if [[ ! -f node_modules/astro/bin/astro.mjs ]]; then
  echo "Dependencies are missing. Run pnpm install first." >&2
  exit 1
fi
export ASTRO_TELEMETRY_DISABLED="${ASTRO_TELEMETRY_DISABLED:-1}"
exec node node_modules/astro/bin/astro.mjs dev "$@"
