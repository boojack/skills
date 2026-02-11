---
name: writing-designs
description: Researches how the industry solves a defined issue, collects references from engineering blogs, open-source projects, and technical articles, then produces a design document with industry baseline, research summary, design goals, non-goals, and proposed design. Use when an issue definition exists in docs/issues/ and a concrete design is needed before implementation begins.
---

# Writing Designs

Takes `definition.md` from `docs/issues/YYYY-MM-DD-<slug>/` as input. Produces a design document grounded in research, not speculation.

Does NOT implement code, create PRs, or make architectural changes. Output is a design document only.

## Workflow

Execute all steps in order. Skipping a step is not allowed.

```
Design Document Progress:
- [ ] Step 1: Load Issue Definition
- [ ] Step 2: Research
- [ ] Step 3: Industry Baseline
- [ ] Step 4: Research Summary
- [ ] Step 5: Design Goals & Non-Goals
- [ ] Step 6: Proposed Design
- [ ] Step 7: Validate Output
```

### Step 1: Load Issue Definition

Read `definition.md` from the issue folder.

- If no folder is specified, list available folders and ask which one to use
- Extract: background, issue statement, current state, non-goals, open questions
- Note open questions that affect design decisions

### Step 2: Research

Search for how the industry solves this issue:

1. **Web search**: Engineering blogs, technical articles, documentation
2. **GitHub**: Open-source implementations, issues, PRs showing patterns

Prioritize primary sources from companies that have solved this at scale. Use at least 3 distinct search queries.

Write under: **## References**

Rules:
- At least 5 references, each with a URL you actually visited
- Verify each URL loads via `WebFetch` before including
- Do NOT fabricate URLs

### Step 3: Industry Baseline

Identify the standard approach from research.

- Common/default solution and widely adopted patterns
- Trade-offs and known limitations
- Cite references by title

Write under: **## Industry Baseline**

### Step 4: Research Summary

Synthesize findings into actionable insights.

- Key patterns across sources
- Which approaches fit the current issue and codebase
- What research suggests about the issue's open questions

Write under: **## Research Summary**

### Step 5: Design Goals & Non-Goals

**Design Goals** — derive from issue statement, order by priority. Each must be **verifiable**: a measurable metric or testable assertion.

**Non-Goals** — inherit all from issue definition, add any discovered during research.

Write under: **## Design Goals** and **## Non-Goals**

### Step 6: Proposed Design

Present a concrete design addressing the design goals.

- Reference specific files/modules from issue definition's current state
- Explain key decisions and why alternatives were rejected (cite research)
- Include interface definitions or data flows where helpful

Rules:
- Every decision traces to a design goal
- No scope beyond design goals
- Make decisions, don't leave ambiguous choices
- Pseudocode acceptable; implementation code is not

Write under: **## Proposed Design**

### Step 7: Validate Output

1. References has 5+ entries with verified URLs
2. Industry Baseline cites references by title, no speculation
3. Design Goals are verifiable and trace to issue statement
4. Non-Goals include all inherited items from issue definition
5. Proposed Design traces every decision to a design goal
6. No contradictions between goals and design
7. No implementation code (pseudocode acceptable)

If any check fails, return to the failing step and revise.

## Output Format

Save to `docs/issues/YYYY-MM-DD-<slug>/design.md` in the same folder as `definition.md`.

Template:

```markdown
## References

## Industry Baseline

## Research Summary

## Design Goals

## Non-Goals

## Proposed Design
```

Missing any section invalidates the output.

## Anti-patterns

- ❌ Speculation: "Most apps probably use X" → ✓ "PDF.js uses X (PR #7793)"
- ❌ Goal-design contradiction: atomic goal + best-effort design → ✓ reconcile them
- ❌ Implementation code: `keys.filter(k => ...)` → ✓ "Collect keys ending with suffix"
- ❌ Unverified URLs → ✓ every URL visited via `WebFetch`
- ❌ Scope creep: features not traced to goals → ✓ every decision references a goal
