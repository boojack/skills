#!/usr/bin/env bash
set -euo pipefail

SHADCN_VERSION="4.16.0"
DEFAULT_PRESET="nova"

usage() {
  cat <<'EOF'
Usage:
  bash scripts/init-project.sh <project-directory> [preset] [--dry-run] [--allow-repo]

Create a new Vite + React + Tailwind 4 project using shadcn components backed
by Base UI, then configure its single-HTML build. Targets inside a Git
worktree are rejected by default.

Arguments:
  project-directory  New directory to create; existing targets are rejected.
  preset             nova (default), vega, maia, lyra, mira, luma, sera, rhea.

Options:
  --dry-run          Validate inputs and print planned actions without writing.
  --allow-repo       Permit a target inside a Git worktree. Use only when the
                     user explicitly requests retained project source.
  -h, --help         Show this help.

Example:
  bash scripts/init-project.sh /tmp/ui-prototype-demo nova --dry-run
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

PRESET="$DEFAULT_PRESET"
PRESET_SET=false
DRY_RUN=false
ALLOW_REPO=false

for argument in "$@"; do
  case "$argument" in
    --dry-run)
      DRY_RUN=true
      ;;
    --allow-repo)
      ALLOW_REPO=true
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    -*)
      echo "Error: unknown option '$argument'." >&2
      usage >&2
      exit 1
      ;;
    *)
      if [ "$PRESET_SET" = true ]; then
        echo "Error: unexpected argument '$argument'." >&2
        usage >&2
        exit 1
      fi
      PRESET="$argument"
      PRESET_SET=true
      ;;
  esac
done

case "$PRESET" in
  nova|vega|maia|lyra|mira|luma|sera|rhea) ;;
  *)
    echo "Error: unsupported preset '$PRESET'." >&2
    usage >&2
    exit 1
    ;;
esac

if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js is required." >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1 || ! command -v npx >/dev/null 2>&1; then
  echo "Error: npm and npx are required." >&2
  exit 1
fi

node -e '
const [major, minor] = process.versions.node.split(".").map(Number)
const supported =
  (major === 20 && minor >= 19) ||
  (major === 22 && minor >= 12) ||
  major > 22
if (!supported) {
  console.error(
    `Error: Node ${process.versions.node} is unsupported. ` +
    "Use Node 20.19+, Node 22.12+, or a newer release."
  )
  process.exit(1)
}
'

PROJECT_PARENT="$(cd "$(dirname "$PROJECT_INPUT")" && pwd)"
PROJECT_NAME="$(basename "$PROJECT_INPUT")"
PROJECT_DIR="$PROJECT_PARENT/$PROJECT_NAME"

if [ "$ALLOW_REPO" = false ] &&
  command -v git >/dev/null 2>&1 &&
  git -C "$PROJECT_PARENT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: refusing to create prototype files inside a Git worktree: $PROJECT_PARENT" >&2
  echo "Use a task-specific temporary directory, or pass --allow-repo only when explicitly requested." >&2
  exit 1
fi

if [ -e "$PROJECT_DIR" ]; then
  echo "Error: target already exists: $PROJECT_DIR" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

STARTER_COMPONENTS=(
  button
  card
  input
  label
  textarea
  badge
  separator
  field
  select
  checkbox
  switch
  tabs
  dialog
  dropdown-menu
  tooltip
  table
)

if [ "$DRY_RUN" = true ]; then
  echo "Dry run: no files will be written."
  echo "Target: $PROJECT_DIR"
  echo "Preset: $PRESET"
  echo "shadcn: $SHADCN_VERSION"
  echo "Components: ${STARTER_COMPONENTS[*]}"
  echo "Next: configure the single-file overlay and run npm run typecheck."
  exit 0
fi

echo "Creating a shadcn Vite project with Base UI and the '$PRESET' preset..."
(
  cd "$PROJECT_PARENT"
  npx --yes "shadcn@$SHADCN_VERSION" init \
    --template=vite \
    --base=base \
    --preset="$PRESET" \
    --name="$PROJECT_NAME" \
    --no-monorepo \
    --yes \
    --pointer \
    "${STARTER_COMPONENTS[@]}"
)

bash "$SCRIPT_DIR/configure-project.sh" "$PROJECT_DIR"

echo "Running the generated typecheck..."
(
  cd "$PROJECT_DIR"
  npm run typecheck
)

echo
echo "Project ready: $PROJECT_DIR"
echo "Develop: cd \"$PROJECT_DIR\" && npm run dev"
echo "Bundle: bash \"$SCRIPT_DIR/build-single-html.sh\" \"$PROJECT_DIR\""
