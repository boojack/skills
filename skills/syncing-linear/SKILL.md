---
name: syncing-linear
description: Syncs issue artifacts (definition, design) to Linear. Creates or updates a Linear issue with a summarized title and structured description, and uploads full definition and design as linked documents. Use after any issue pipeline stage to push current state to Linear.
---

# Syncing to Linear

Syncs `docs/issues/YYYY-MM-DD-<slug>/` artifacts to Linear.

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

- If an argument is provided, use it; otherwise list directories and ask
- Verify `definition.md` exists — if missing, STOP

### Step 2: Initialize

Read `linear.json` from the issue directory if it exists:

```json
{
  "issueId": "uuid",
  "issueIdentifier": "TEAM-123",
  "issueUrl": "https://linear.app/...",
  "team": "team-name-or-id",
  "documents": { "definition": "doc-id", "design": "doc-id" }
}
```

Resolve team: `linear.json` → `--team` argument → auto-detect via `list_teams`.

Read artifacts: `definition.md` (required), `design.md` (optional).

### Step 3: Sync Issue

Generate from `definition.md`:

- **Title**: under 70 characters, imperative or noun-phrase style
- **Description**: three headers — Background (3-5 sentences), Problem (2-4 sentences), Impact (bulleted list). No hard line breaks within paragraphs. No code references, no solution/approach, plain language only.

If `issueId` in state: `update_issue`. Otherwise: `create_issue` and record ID, identifier, URL.

### Step 4: Sync Documents

| Artifact | Title format | Source |
|---|---|---|
| Definition | `Full Definition: <title>` | `definition.md` |
| Design | `Design: <title>` | `design.md` (skip if missing) |

`<title>`: slug with hyphens → spaces, title case. Example: `non-env-database-migration-eligibility` → `Non Env Database Migration Eligibility`.

If `documents.<type>` in state: `update_document`. Otherwise: `create_document` with `issue` set to identifier, record document ID.

No cross-references between sibling artifacts. No placeholder documents.

### Step 5: Finalize

Write `linear.json` (same schema as Step 2). Only include document keys for documents actually synced.

## Output

```
Synced to Linear:
- Issue: TEAM-123 — <title> (<url>)
- Definition document: created | updated
- Design document: created | updated | skipped (not found)
```

## Anti-patterns

- ❌ Full definition in description → ✓ condensed plain-language summary
- ❌ File paths in description → ✓ code details stay in linked documents
- ❌ Placeholder documents → ✓ skip missing artifacts
- ❌ Duplicate issues/documents → ✓ check state, update instead
- ❌ Modifying definition.md or design.md → ✓ only linear.json is written
