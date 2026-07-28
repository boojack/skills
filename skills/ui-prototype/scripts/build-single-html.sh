#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  bash scripts/build-single-html.sh <project-directory> [output.html]

Typecheck, build, and verify a configured single-HTML project. The default
output is ui-prototype.html in a task-specific system temporary directory.
Build intermediates are also temporary and are removed after verification.

Example:
  bash scripts/build-single-html.sh /tmp/ui-prototype-demo
EOF
}

if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
  usage
  exit 0
fi

if [ "$#" -lt 1 ] || [ "$#" -gt 2 ]; then
  usage
  exit 1
fi

CALLER_DIR="$(pwd)"
PROJECT_INPUT="$1"
OUTPUT_INPUT="${2:-}"
TEMP_BASE="${TMPDIR:-/tmp}"
TEMP_BASE="${TEMP_BASE%/}"

if [ ! -d "$PROJECT_INPUT" ]; then
  echo "Error: project directory not found: $PROJECT_INPUT" >&2
  exit 1
fi

PROJECT_DIR="$(cd "$PROJECT_INPUT" && pwd)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "$PROJECT_DIR/package.json" ]; then
  echo "Error: package.json not found in $PROJECT_DIR" >&2
  exit 1
fi

if [ ! -f "$PROJECT_DIR/vite.singlefile.config.ts" ]; then
  echo "Error: vite.singlefile.config.ts not found." >&2
  echo "Run configure-project.sh first." >&2
  exit 1
fi

if [ ! -d "$PROJECT_DIR/node_modules" ]; then
  echo "Error: node_modules not found. Install dependencies from the lockfile first." >&2
  exit 1
fi

if [ -z "$OUTPUT_INPUT" ]; then
  DELIVERY_DIR="$(mktemp -d "$TEMP_BASE/ui-prototype-output.XXXXXX")"
  OUTPUT_PATH="$DELIVERY_DIR/ui-prototype.html"
elif [[ "$OUTPUT_INPUT" = /* ]]; then
  OUTPUT_PATH="$OUTPUT_INPUT"
else
  OUTPUT_PATH="$CALLER_DIR/$OUTPUT_INPUT"
fi

BUILD_DIR="$(mktemp -d "$TEMP_BASE/ui-prototype-build.XXXXXX")"

cleanup_build_directory() {
  case "$BUILD_DIR" in
    "$TEMP_BASE"/ui-prototype-build.*)
      rm -rf -- "$BUILD_DIR"
      ;;
    *)
      echo "Warning: refusing to clean unexpected build path: $BUILD_DIR" >&2
      ;;
  esac
}

trap cleanup_build_directory EXIT

if [ -f "$PROJECT_DIR/pnpm-lock.yaml" ]; then
  PACKAGE_MANAGER="pnpm"
elif [ -f "$PROJECT_DIR/yarn.lock" ]; then
  PACKAGE_MANAGER="yarn"
elif [ -f "$PROJECT_DIR/bun.lock" ] || [ -f "$PROJECT_DIR/bun.lockb" ]; then
  PACKAGE_MANAGER="bun"
else
  PACKAGE_MANAGER="npm"
fi

run_script() {
  local script_name="$1"
  (
    cd "$PROJECT_DIR"
    case "$PACKAGE_MANAGER" in
      pnpm) pnpm run "$script_name" ;;
      yarn) yarn "$script_name" ;;
      bun) bun run "$script_name" ;;
      npm) npm run "$script_name" ;;
    esac
  )
}

if node -e '
const pkg = require(process.argv[1])
process.exit(pkg.scripts?.typecheck ? 0 : 1)
' "$PROJECT_DIR/package.json"; then
  echo "Running typecheck..."
  run_script typecheck
fi

echo "Building the single-file application..."
export UI_PROTOTYPE_BUILD_DIR="$BUILD_DIR"
run_script build:single
unset UI_PROTOTYPE_BUILD_DIR

node \
  "$SCRIPT_DIR/verify-single-html.mjs" \
  "$BUILD_DIR" \
  "$OUTPUT_PATH"
