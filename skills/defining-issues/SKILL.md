---
name: defining-issues
description: Converts vague natural-language requests into precise, grounded engineering issue definitions with background, issue statement, current state, non-goals, and open questions. Use when an issue needs to be clarified, scoped, or prepared before research or design work begins — such as unclear requirements, vague feature requests, ambiguous bug reports, or undefined scope boundaries.
---

# Defining Issues

Does NOT propose solutions, design systems, or suggest architectures. Output is an issue definition only.

## Workflow

Execute all steps in order. Skipping a step is not allowed.

```
Issue Definition Progress:
- [ ] Step 1: Background & Context
- [ ] Step 2: Issue Statement
- [ ] Step 3: Current State
- [ ] Step 4: Non-Goals
- [ ] Step 5: Open Questions
- [ ] Step 6: Validate Output
```

### Step 1: Background & Context

Establish why this issue exists and what motivated the request.

- Describe the domain, system, or user scenario
- Include history or prior attempts if known
- Keep factual — no editorializing or solution advocacy

Write under: **## Background & Context**

### Step 2: Issue Statement

Translate the vague request into a precise engineering problem statement.

- Use precise engineering language and codebase terminology
- No subjective, aspirational, or solution-proposing language
- Single paragraph

Write under: **## Issue Statement**

### Step 3: Current State

Anchor the issue in the real codebase.

- List exact file paths (verify with `Glob` or `Read`)
- Include line numbers for specific functions or definitions
- Describe current behavior, not desired behavior
- If section exceeds 30 lines, summarize and move details to a reference appendix
- If nothing relevant exists: "No existing implementation found."

Write under: **## Current State**

### Step 4: Non-Goals

Prevent scope creep in downstream phases. When in doubt, mark it a non-goal.

- What is explicitly out of scope
- What parts of the system must NOT be redesigned
- What adjacent issues are intentionally excluded

Write under: **## Non-Goals**

### Step 5: Open Questions

Expose uncertainty. Each item must include a default so downstream work can proceed.

Format: `Question? (default: answer)`

Write under: **## Open Questions**

### Step 6: Validate Output

1. All five sections present and non-empty
2. Background & Issue Statement contain no solution language ("should", "need to", "must implement", "by adding/creating X")
3. Current State references real files (verified with `Glob` or `Read`)
4. Non-Goals scopes conservatively
5. Open Questions each have a default

If any check fails, return to the failing step and revise.

## Output Format

Save to `docs/issues/YYYY-MM-DD-<slug>/definition.md` where `<slug>` is a short kebab-case summary. Create the folder if it doesn't exist.

Template:

```markdown
## Background & Context

## Issue Statement

## Current State

## Non-Goals

## Open Questions
```

Missing any section invalidates the output.

## Anti-patterns

- ❌ Solution language: "We need to add X" → ✓ "No X exists"
- ❌ Scope creep: listing systems not affected → ✓ only code paths exhibiting the issue
- ❌ Vague non-goals: "Not changing unrelated code" → ✓ specific exclusions
- ❌ Missing defaults: "Should we log?" → ✓ "Should we log? (default: no)"
