---
name: syncing-linear
description: >
  Syncs issue artifacts (definition, design, plan, execution) to Linear. Creates
  or updates a Linear issue with a summarized title and structured description,
  and uploads full artifacts as linked documents. Use after any pipeline stage to
  push current state to Linear. Also triggers on: "sync to linear", "push to
  linear", "create linear issue", "update the ticket", "track this in linear".
  Reads artifacts produced by defining-issues and executing-tasks.
---

# Syncing to Linear

Takes artifacts from `docs/issues/YYYY-MM-DD-<slug>/` as input. Syncs to Linear as an issue with linked documents.

Supported artifacts: `definition.md` (required), `design.md`, `plan.md`, `execution.md` (all optional).

Does NOT modify local files except `linear.json`.

```
NO LOCAL FILE MODIFICATIONS EXCEPT linear.json
```

## Workflow

```
- [ ] Step 1: Locate Issue Directory
- [ ] Step 2: Initialize
- [ ] Step 3: Sync Issue
- [ ] Step 4: Sync Documents
- [ ] Step 5: Finalize
```

### Step 1: Locate Issue Directory

If an argument is provided, use it; otherwise list directories and ask. Verify `definition.md` exists — if missing, STOP.

### Step 2: Initialize

Read `linear.json` if it exists. Resolve team: `linear.json` → `--team` argument → auto-detect via `linear-server:list_teams`. Read artifacts: `definition.md` (required), `design.md`, `plan.md`, `execution.md` (all optional).

### Step 3: Sync Issue

Generate from `definition.md`:

- **Title**: under 70 characters, imperative or noun-phrase style
- **Description** (in this exact order):

  **Problem** (required): One **bold sentence** stating the core issue, then 1-2 plain sentences on consequences. No code references, no solution language.

  **Impact** (required): Bulleted list. Each bullet: **bold lead phrase** ` — ` supporting detail.

  **Background** (required): Collapsible section (`>>>` syntax). 3-5 sentences of context.

**Example:**

```markdown
## Problem
**Webhook payloads are delivered without signature verification, allowing any network peer to forge event notifications.**

Consumers cannot distinguish legitimate events from spoofed requests.

## Impact
- **Forged deployments** — attackers trigger production deploys via crafted webhook events
- **Data poisoning** — pipeline consumers ingest unverified payloads as trusted input

>>> Background
The platform dispatches webhook events over HTTPS but includes no HMAC signature header. Most providers (GitHub, Stripe, Slack) sign payloads with HMAC-SHA256. This project skips that step.
>>>
```

If `issueId` in state: `update_issue`. Otherwise: `create_issue` and record ID, identifier, URL.

### Step 4: Sync Documents

| Artifact | Title format | Source |
|---|---|---|
| Definition | `Full Definition: <title>` | `definition.md` |
| Design | `Design: <title>` | `design.md` (skip if missing) |
| Plan | `Plan: <title>` | `plan.md` (skip if missing) |
| Execution | `Execution: <title>` | `execution.md` (skip if missing) |

`<title>`: slug → spaces → title case.

If document exists in state: `update_document`. Otherwise: `create_document` with `issue` set to identifier. No placeholder documents.

### Step 5: Finalize

Write `linear.json` and print console summary.

## Output

`linear.json` in the issue directory. Only include document keys for documents actually synced.

```json
{
  "issueId": "uuid",
  "issueIdentifier": "TEAM-123",
  "issueUrl": "https://linear.app/...",
  "team": "team-name-or-id",
  "documents": { "definition": "doc-id", "design": "doc-id", "plan": "doc-id", "execution": "doc-id" }
}
```

```
Synced to Linear:
- Issue: TEAM-123 — <title> (<url>)
- Definition document: created | updated
- Design document: created | updated | skipped (not found)
- Plan document: created | updated | skipped (not found)
- Execution document: created | updated | skipped (not found)
```

## Anti-patterns

- ❌ Full definition in description → ✓ condensed plain-language summary
- ❌ File paths in description → ✓ code details stay in linked documents
- ❌ Placeholder documents → ✓ skip missing artifacts
- ❌ Duplicate issues/documents → ✓ check state, update instead
- ❌ Modifying definition.md or design.md → ✓ only linear.json is written

## Related Skills

- `defining-issues` — produces definition.md and design.md
- `executing-tasks` — produces plan.md and execution.md
