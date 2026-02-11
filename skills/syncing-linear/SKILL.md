---
name: syncing-linear
description: Syncs issue artifacts (definition, design) to Linear. Creates or updates a Linear issue with a summarized title and structured description, and uploads full definition and design as linked documents. Use after any issue pipeline stage to push current state to Linear.
---

# Syncing to Linear

Takes an issue folder from `docs/issues/YYYY-MM-DD-<slug>/` and syncs its artifacts to Linear. Creates a Linear issue from `definition.md` and links full documents for definition and design.

Does NOT modify local files except `linear.json`. Does NOT create or modify definition.md, design.md, or any other issue artifacts.

## Workflow

Execute all steps in order. Skipping a step is not allowed.

```
Linear Sync Progress:
- [ ] Step 1: Locate Issue Directory
- [ ] Step 2: Initialize
- [ ] Step 3: Sync Issue
- [ ] Step 4: Sync Documents
- [ ] Step 5: Finalize
```

### Step 1: Locate Issue Directory

Find the target issue directory under `docs/issues/`.

- If an argument is provided (directory name or path), use it
- If no argument, list directories in `docs/issues/` and ask which one to sync
- Verify `definition.md` exists — if missing, STOP.

### Step 2: Initialize

**Load state**: read `linear.json` from the issue directory if it exists. Start with empty state if missing.

```json
{
  "issueId": "uuid",
  "issueIdentifier": "TEAM-123",
  "issueUrl": "https://linear.app/team/issue/TEAM-123",
  "team": "team-name-or-id",
  "documents": {
    "definition": "document-id",
    "design": "document-id"
  }
}
```

**Resolve team** (in priority order):
1. `team` field in `linear.json`
2. `--team <name>` argument
3. Auto-detect via `list_teams` — if one team use it, if multiple ask

**Read artifacts**: `definition.md` (required), `design.md` (optional).

### Step 3: Sync Issue

Generate title and description from `definition.md`.

**Title**: Under 70 characters. Imperative or noun-phrase style summarizing the issue statement.

**Description**: Condensed summary — tracker entry, not a spec. Exactly three headers:

```markdown
## Background

Bytebase databases inherit their environment from the instance. Both
are nullable — a database can end up with no effective environment.

## Problem

No validation rejects non-env databases from ChangeDatabaseConfig plans.
Migration tasks are created with an empty environment string.

## Impact

- Tasks invisible in rollout API (filtered by environment map)
- Auto-rollout skips empty-environment tasks entirely
- Manual execution restricted to global admins only
- Rollout policies resolve to empty defaults
```

Rules:
- **2-4 lines per section** — extract and condense, do NOT copy verbatim
- **No code references** — no file paths, line numbers, or function names
- **Plain language** — readable without codebase context
- **No solution/approach** — that belongs in the design document

**Create or update**:
- If `issueId` in state: call `update_issue`
- Otherwise: call `create_issue` with team, title, description. Record returned ID, identifier, and URL.

### Step 4: Sync Documents

For each artifact that exists locally, sync as a linked document:

| Artifact | Title format | Source |
|---|---|---|
| Definition | `Definition: <title>` | `definition.md` |
| Design | `Design: <title>` | `design.md` (skip if missing) |

`<title>` is derived from the directory slug: replace hyphens with spaces, then apply title case. Example: `non-env-database-migration-eligibility` → `Non Env Database Migration Eligibility`.

- If `documents.<type>` exists in state: call `update_document`
- Otherwise: call `create_document` with `issue` set to issue identifier. Record returned document ID.

Content is the full file contents with **local path references replaced**:
- Replace local paths to sibling artifacts (e.g., `docs/issues/.../definition.md`) with the corresponding Linear document URL from state or from the just-created document.
- This means **Definition must be synced before Design**, since `design.md` commonly references `definition.md`.

Do NOT create placeholder documents for missing artifacts.

### Step 5: Finalize

**Update issue references**: regenerate the description from Step 3 and append:

```markdown
## References

- Definition: <document-title>
- Design: <document-title>
```

Only include entries for documents actually synced. Call `update_issue`.

**Save state**: write `linear.json` (same schema as Step 2). Only include document keys for documents actually synced.

## Output

```
Synced to Linear:
- Issue: TEAM-123 — <title> (<url>)
- Definition document: created | updated
- Design document: created | updated | skipped (not found)
```

## Anti-patterns

- ❌ Copying full definition into description → ✓ Condensed plain-language summary
- ❌ Including file paths in description → ✓ Code details stay in linked documents
- ❌ Creating placeholder documents → ✓ Skip missing artifacts
- ❌ Creating duplicates → ✓ Check state for existing IDs, update instead
- ❌ Modifying definition.md or design.md → ✓ Only linear.json is written
