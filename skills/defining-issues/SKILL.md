---
name: defining-issues
description: >
  Converts vague requests into precise issue definitions grounded in the
  codebase, then researches and designs a solution for complex tasks. Produces
  definition.md (always) and design.md (for L-scope). Use when an issue needs
  to be clarified, scoped, or prepared before implementation — such as unclear
  requirements, vague feature requests, ambiguous bug reports, or undefined
  scope boundaries. Also triggers on: "what should we build", "scope this",
  "write up an issue", "define the problem", "clarify requirements", "design
  this", "how should we build this", "research solutions", "design doc".
  For implementation after definition, see executing-tasks.
---

# Defining Issues

Explores the codebase and converts a vague request into a grounded definition. For complex tasks, researches industry solutions and produces a design.

Does NOT implement code, create PRs, or make architectural changes. Output is definition (always) and design (L-scope only).

## Phase 1: Definition

```
NO SOLUTION LANGUAGE — DEFINE THE PROBLEM, NOT THE FIX
```

### Step 1: Background & Context

- Describe the domain, system, or user scenario
- Include history or prior attempts if known
- Keep factual — no editorializing or solution advocacy

### Step 2: Issue Statement

- Precise engineering language and codebase terminology
- No subjective, aspirational, or solution-proposing language
- Single paragraph

### Step 3: Current State

- List exact file paths (verify with `Glob` or `Read`)
- Include line numbers for specific functions or definitions
- Describe current behavior, not desired behavior
- If section exceeds 30 lines, summarize and move details to a reference appendix
- If nothing relevant exists: "No existing implementation found."

### Step 4: Non-Goals

When in doubt, mark it a non-goal.

- What is explicitly out of scope
- What parts of the system must NOT be redesigned
- What adjacent issues are intentionally excluded

### Step 5: Open Questions

Each item must include a default so downstream work can proceed.

Format: `Question? (default: answer)`

### Step 6: Scope

Assess the size of the work:

- **S** — single file, <30 lines, known pattern, clear solution
- **M** — 2-3 files, some ambiguity but existing patterns apply
- **L** — new subsystem, novel problem, multiple viable approaches

State the scope with a one-sentence justification referencing the current state.

### Step 7: Validate Definition

| Check | Criteria |
|---|---|
| Background & Context | Factual, no editorializing or solution advocacy |
| Issue Statement | Precise, single paragraph, no solution words ("should", "need to", "by adding X") |
| Current State | Real file paths verified with `Glob`/`Read`, current behavior only |
| Non-Goals | Specific exclusions, conservative scope |
| Open Questions | Each has a `(default: answer)` |
| Scope | S/M/L with justification referencing current state |

If any check fails, return to the failing step and revise.

### Save Definition

Save to `docs/plans/YYYY-MM-DD-<slug>/definition.md`:

```markdown
## Background & Context

## Issue Statement

## Current State

## Non-Goals

## Open Questions

## Scope
```

Missing any section invalidates the output.

**If scope is S or M**: definition is complete. Proceed to `executing-tasks`.

**If scope is L**: continue to Phase 2.

---

## Phase 2: Design (L-scope only)

```
NO DESIGN DECISION WITHOUT A CITED REFERENCE
```

### Step 8: Research

1. **Web search**: Engineering blogs, technical articles, documentation
2. **GitHub**: Open-source implementations, issues, PRs showing patterns

Prioritize primary sources from companies that have solved this at scale. Use at least 3 distinct search queries.

Rules:
- At least 3 references, each with a URL you actually visited
- Verify each URL loads via `WebFetch` before including — if verification fails after 2 attempts, note as "unverified" and move on
- Do NOT fabricate URLs
- Quality over quantity — 3 highly relevant references beat 5 tangential ones

### Step 9: Industry Baseline

- Common/default solution and widely adopted patterns
- Trade-offs and known limitations
- Cite references by title

### Step 10: Research Summary

- Key patterns across sources
- Which approaches fit the current issue and codebase
- What research suggests about the issue's open questions

### Step 11: Design Goals & Non-Goals

**Design Goals** — derive from issue statement, order by priority. Each must be **verifiable**: a measurable metric or testable assertion.

**Non-Goals** — inherit all from definition, add any discovered during research.

### Step 12: Proposed Design

- Reference specific files/modules from definition's current state
- Explain key decisions and why alternatives were rejected (cite research)
- Include interface definitions or data flows where helpful
- Every decision traces to a design goal
- Pseudocode acceptable; implementation code is not

### Step 13: Validate Design

| Check | Criteria |
|---|---|
| References | 3+ entries with URLs (verified or marked "unverified") |
| Industry Baseline | Cites references by title, no speculation |
| Design Goals | Verifiable, trace to issue statement |
| Non-Goals | All inherited items from definition included |
| Proposed Design | Every decision traces to a goal, no implementation code |

If any check fails, return to the failing step and revise.

### Save Design

Save to `docs/plans/YYYY-MM-DD-<slug>/design.md`:

```markdown
## References

## Industry Baseline

## Research Summary

## Design Goals

## Non-Goals

## Proposed Design
```

Missing any section invalidates the output.

---

## Anti-patterns

### Definition
- ❌ "We need to add X" → ✓ "No X exists"
- ❌ "The system lacks X" (solution wearing a mask) → ✓ "Behavior Y occurs because Z"
- ❌ "There is no caching layer" (implies one is needed) → ✓ "Queries hit the database on every request; p95 latency is Nms"
- ❌ Listing systems not affected → ✓ only code paths exhibiting the issue
- ❌ "Not changing unrelated code" → ✓ specific exclusions
- ❌ "Should we log?" → ✓ "Should we log? (default: no)"

**Solution language test**: Re-read the Issue Statement. If removing it would make a reader think "so what?", it describes a problem. If removing it would make a reader think "OK, so we won't build that" — it describes a solution. Rewrite.

### Design
- ❌ "Most apps probably use X" → ✓ "PDF.js uses X (PR #7793)"
- ❌ `keys.filter(k => ...)` → ✓ "Collect keys ending with suffix"
- ❌ Unverified URLs → ✓ every URL visited via `WebFetch`
- ❌ Features not traced to goals → ✓ every decision references a goal

## Red Flags - STOP

If you catch yourself thinking:
- "I'll suggest a solution in the background section"
- "This issue is obvious, I can skip the codebase scan"
- "The open questions don't need defaults"
- "This is clearly L-scope" (without checking current state for existing patterns)
- "This pattern is common enough, I don't need a reference"
- "I'll skip URL verification, it's a well-known source"
- "The definition didn't mention this, but I'll add it to the design"
- "I'll include implementation code to make it clearer"

**All of these mean: STOP. Revisit the step and follow the process.**

## Related Skills

- `executing-tasks` — next stage: plans and executes tasks from definition/design
