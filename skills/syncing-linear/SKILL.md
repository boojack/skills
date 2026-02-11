---
name: syncing-linear
description: Syncs issue artifacts (definition, design) to Linear. Creates or updates a Linear issue with a summarized title and structured description, and uploads full definition and design as linked documents. Use after any issue pipeline stage to push current state to Linear.
---

# Syncing to Linear

Takes `definition.md` and `design.md` (optional) from `docs/issues/YYYY-MM-DD-<slug>/` as input. Syncs to Linear as an issue with linked documents.

Does NOT modify local files except `linear.json`. Output is a Linear issue, linked documents, and `linear.json` state only.

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

Read `linear.json` from the issue directory if it exists (see Output Format for schema).

Resolve team: `linear.json` → `--team` argument → auto-detect via `linear-server:list_teams`.

Read artifacts: `definition.md` (required), `design.md` (optional).

### Step 3: Sync Issue

Generate from `definition.md`:

- **Title**: under 70 characters, imperative or noun-phrase style
- **Description** structure (in this exact order):

  **Problem** (required): Open with one **bold sentence** stating the core issue. Follow with 1-2 plain sentences on specific consequences. No code references, no solution/approach, plain language only.

  **Impact** (required): Bulleted list. Each bullet starts with a **bold lead phrase** followed by ` — ` and a supporting detail. Example: `- **Wrong authorization scope** — tasks run under a different project than originally approved`.

  **Background** (required): Wrap in a collapsible section (`>>>` syntax). 3-5 sentences of context for readers who need it. No hard line breaks within paragraphs.

**Example output:**

```markdown
## Problem
**Webhook payloads are delivered without signature verification, allowing any network peer to forge event notifications.**

Consumers have no way to distinguish legitimate platform events from spoofed requests. Replay attacks are also possible since payloads carry no timestamp or nonce.

## Impact
- **Forged deployments** — attackers can trigger production deploys by sending crafted webhook events
- **Data poisoning** — pipeline consumers ingest unverified payloads as trusted input
- **Silent failures** — no logging or alerting when signature validation is absent

>>> Background
The platform dispatches webhook events to registered consumer endpoints on state changes (deploy, build, rollback). Consumers receive a JSON payload over HTTPS but the request includes no HMAC signature header. Without a shared secret and signature check, consumers cannot authenticate the sender.

Most webhook providers (GitHub, Stripe, Slack) sign payloads with HMAC-SHA256 and include the signature in a header. This project currently skips that step entirely.
>>>
```

If `issueId` in state: `linear-server:update_issue`. Otherwise: `linear-server:create_issue` and record ID, identifier, URL.

### Step 4: Sync Documents

| Artifact | Title format | Source |
|---|---|---|
| Definition | `Full Definition: <title>` | `definition.md` |
| Design | `Design: <title>` | `design.md` (skip if missing) |

`<title>`: slug with hyphens → spaces, title case. Example: `non-env-database-migration-eligibility` → `Non Env Database Migration Eligibility`.

If `documents.<type>` in state: `linear-server:update_document`. Otherwise: `linear-server:create_document` with `issue` set to identifier, record document ID.

No cross-references between sibling artifacts. No placeholder documents.

### Step 5: Finalize

Write `linear.json` to the issue directory. See Output Format for schema.

## Output Format

Save `linear.json` to the issue directory. Only include document keys for documents actually synced.

```json
{
  "issueId": "uuid",
  "issueIdentifier": "TEAM-123",
  "issueUrl": "https://linear.app/...",
  "team": "team-name-or-id",
  "documents": { "definition": "doc-id", "design": "doc-id" }
}
```

Console summary:

```
Synced to Linear:
- Issue: TEAM-123 — <title> (<url>)
- Definition document: created | updated
- Design document: created | updated | skipped (not found)
```

Missing `linear.json` or console summary invalidates the output.

## Anti-patterns

- ❌ Full definition in description → ✓ condensed plain-language summary
- ❌ File paths in description → ✓ code details stay in linked documents
- ❌ Placeholder documents → ✓ skip missing artifacts
- ❌ Duplicate issues/documents → ✓ check state, update instead
- ❌ Modifying definition.md or design.md → ✓ only linear.json is written
