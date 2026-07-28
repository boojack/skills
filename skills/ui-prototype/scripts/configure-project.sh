#!/usr/bin/env bash
set -euo pipefail

VITE_SINGLEFILE_VERSION="2.3.3"

usage() {
  cat <<'EOF'
Usage:
  bash scripts/configure-project.sh <project-directory> [--force] [--dry-run]

Install the pinned single-file Vite plugin and create the single-file build
overlay for an existing Vite + Tailwind 4 + shadcn Base UI project.

Options:
  --force            Replace an existing vite.singlefile.config.ts.
  --dry-run          Validate and print planned changes without writing.
  -h, --help         Show this help.

Example:
  bash scripts/configure-project.sh /tmp/ui-prototype-demo --dry-run
EOF
}

if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
  usage
  exit 0
fi

if [ "$#" -lt 1 ]; then
  usage
  exit 1
fi

PROJECT_INPUT="$1"
shift

FORCE=false
DRY_RUN=false

for argument in "$@"; do
  case "$argument" in
    --force) FORCE=true ;;
    --dry-run) DRY_RUN=true ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Error: unknown option '$argument'." >&2
      usage >&2
      exit 1
      ;;
  esac
done

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

if [ "$DRY_RUN" = true ]; then
  echo "Dry run: would install vite-plugin-singlefile@$VITE_SINGLEFILE_VERSION."
else
  echo "Installing vite-plugin-singlefile@$VITE_SINGLEFILE_VERSION..."
  if [ -f "$PROJECT_DIR/pnpm-lock.yaml" ]; then
    (
      cd "$PROJECT_DIR"
      pnpm add --save-dev --save-exact "vite-plugin-singlefile@$VITE_SINGLEFILE_VERSION"
    )
  elif [ -f "$PROJECT_DIR/yarn.lock" ]; then
    (
      cd "$PROJECT_DIR"
      yarn add --dev --exact "vite-plugin-singlefile@$VITE_SINGLEFILE_VERSION"
    )
  elif [ -f "$PROJECT_DIR/bun.lock" ] || [ -f "$PROJECT_DIR/bun.lockb" ]; then
    (
      cd "$PROJECT_DIR"
      bun add --dev --exact "vite-plugin-singlefile@$VITE_SINGLEFILE_VERSION"
    )
  else
    (
      cd "$PROJECT_DIR"
      npm install --save-dev --save-exact "vite-plugin-singlefile@$VITE_SINGLEFILE_VERSION"
    )
  fi
fi

CONFIGURE_ARGS=("$PROJECT_DIR")
if [ "$FORCE" = true ]; then
  CONFIGURE_ARGS+=("--force")
fi
if [ "$DRY_RUN" = true ]; then
  CONFIGURE_ARGS+=("--dry-run")
fi

node "$SCRIPT_DIR/configure-project.mjs" "${CONFIGURE_ARGS[@]}"
