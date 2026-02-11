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

- If an argument is provided, use it
- If no argument, list directories and ask which one to sync
- Verify `definition.md` exists — if missing, STOP

### Step 2: Initialize

**Load state**: read `linear.json` from the issue directory if it exists.

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

**Resolve team**: `linear.json` team field → `--team` argument → auto-detect via `list_teams`.

**Read artifacts**: `definition.md` (required), `design.md` (optional).

### Step 3: Sync Issue

Generate title and description from `definition.md`.

**Title**: Under 70 characters. Imperative or noun-phrase style.

**Description**: Three headers — Background (3-5 sentences), Problem (2-4 sentences), Impact (bulleted list). Rules:
- No hard line breaks within paragraphs — one continuous line per paragraph
- No code references, no solution/approach, plain language only

**Create or update**: if `issueId` in state, `update_issue`; otherwise `create_issue` and record ID, identifier, URL.

### Step 4: Sync Documents

For each artifact that exists locally, sync as a linked document:

| Artifact | Title format | Source |
|---|---|---|
| Definition | `Full Definition: <title>` | `definition.md` |
| Design | `Design: <title>` | `design.md` (skip if missing) |

`<title>`: derive from directory slug — replace hyphens with spaces, apply title case. Example: `non-env-database-migration-eligibility` → `Non Env Database Migration Eligibility`.

Content is the full file contents. Do not include cross-references between sibling artifacts — the relationship is implicit via the parent issue. Do not create placeholder documents for missing artifacts.

If `documents.<type>` in state: `update_document`; otherwise `create_document` with `issue` set to issue identifier. Record document ID.

### Step 5: Finalize

**Update issue**: regenerate description from Step 3 and append a References section listing synced documents by title. Only include entries for documents actually synced.

**Save state**: write `linear.json` (same schema as Step 2). Only include document keys for documents actually synced.

## Output

```
Synced to Linear:
- Issue: TEAM-123 — <title> (<url>)
- Definition document: created | updated
- Design document: created | updated | skipped (not found)
```

## Anti-patterns

- ❌ Copying full definition into description → ✓ condensed plain-language summary
- ❌ Including file paths in description → ✓ code details stay in linked documents
- ❌ Creating placeholder documents → ✓ skip missing artifacts
- ❌ Creating duplicates → ✓ check state for existing IDs, update instead
- ❌ Modifying definition.md or design.md → ✓ only linear.json is written
