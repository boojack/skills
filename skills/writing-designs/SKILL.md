---
name: writing-designs
description: Researches how the industry solves a defined issue, collects references from engineering blogs, open-source projects, and technical articles, then produces a design document with industry baseline, research summary, design goals, non-goals, and proposed design. Use when an issue definition exists in docs/issues/ and a concrete design is needed before implementation begins.
---

# Writing Designs

Takes an issue definition (`definition.md`) from `docs/issues/YYYY-MM-DD-<slug>/` as input. Produces a design document grounded in research, not speculation.

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

Read `definition.md` from the issue folder (`docs/issues/YYYY-MM-DD-<slug>/`).

- If no folder is specified, list available folders and ask which one to use
- Extract: background, issue statement, current state, non-goals, open questions
- Note open questions that affect design decisions

Write the file path under: **## Issue Reference**

### Step 2: Research

Search for how the industry solves this issue:

1. **Web search**: Engineering blogs, technical articles, documentation
2. **GitHub**: Open-source implementations, issues, PRs showing patterns

Prioritize primary sources from companies that have solved this issue at scale (e.g., Google, GitHub, Linear, Stripe, Meta, Netflix engineering blogs; conference talks; academic papers).

Use at least 3 distinct search queries. Record URL, title, and one-line relevance summary.

Write under: **## References**

Rules:
- At least 5 references total
- Every reference must include a URL you actually visited
- Use `WebFetch` to verify each URL loads before including it
- Do NOT fabricate URLs or include URLs you haven't verified

**Example:**

> ## References
>
> - [Behavior Trees for AI](https://www.gamedeveloper.com/programming/behavior-trees-for-ai-how-they-work) — Behavior tree pattern for game AI
> - [mineflayer](https://github.com/PrismarineJS/mineflayer) — Minecraft bot framework, event-driven model
> - [Goal-Oriented Action Planning](https://alumni.media.mit.edu/~jorkin/goap.html) — GOAP for real-time action selection

### Step 3: Industry Baseline

Identify the standard approach to this issue from research.

- Common/default solution and widely adopted patterns
- Trade-offs and known limitations

Cite references by title. Write under: **## Industry Baseline**

**Example:**

> ## Industry Baseline
>
> Game AI action selection uses behavior trees or GOAP. Behavior trees are the default for real-time decision-making ("Behavior Trees for AI"). GOAP offers flexible planning but introduces latency ("Goal-Oriented Action Planning").
>
> **Standard trade-off**: Behavior trees sacrifice flexibility for predictable latency.

### Step 4: Research Summary

Synthesize findings into actionable insights.

- Key patterns across sources
- Which approaches fit the current issue and codebase
- What research suggests about the issue's open questions

Write under: **## Research Summary**

**Example:**

> ## Research Summary
>
> 1. **Behavior trees dominate real-time AI**: 4/5 references prefer them over GOAP for predictable latency.
> 2. **Event-driven beats polling**: mineflayer shows event listeners outperform tick-based polling.
>
> For this issue, behavior trees fit because latency is primary and action space is bounded.

### Step 5: Design Goals & Non-Goals

**Design Goals** — derive from issue statement, order by priority.

Each goal must be **verifiable**: either a measurable metric (latency < 100ms) or a testable assertion (all keys renamed = no orphaned keys remain).

**Non-Goals** — inherit all from issue definition, add any discovered during research.

Write under: **## Design Goals** and **## Non-Goals**

**Example:**

> ## Design Goals
>
> 1. Reduce task execution latency to under 100ms (metric: p95 latency)
> 2. Action selection produces correct behavior for 95%+ of multi-action states (metric: test suite pass rate)
>
> ## Non-Goals
>
> - Redesigning the action system architecture (inherited)
> - Supporting concurrent task execution

### Step 6: Proposed Design

Present a concrete design addressing the design goals.

- Reference specific files/modules from issue definition's current state
- Explain key decisions and why alternatives were rejected (cite research)
- Include interface definitions or data flows where helpful

Rules:
- Every decision traces to a design goal
- Do NOT introduce scope beyond design goals
- Make decisions, don't leave ambiguous choices
- **Pseudocode acceptable; implementation code is not:**
  - ✓ Pseudocode: `for each key in keysToMigrate: newKey = key.replace(oldSuffix, newSuffix)`
  - ❌ Implementation: `keys.forEach((key) => localStorage.setItem(key.replace(old, new), val))`
  - ✓ Showing existing code to explain current state is acceptable
  - ❌ Writing new code ready to copy-paste is not

Write under: **## Proposed Design**

### Step 7: Validate Output

1. Issue Reference points to existing file (verify with `Read`)
2. References has 5+ entries with verified URLs (each visited via `WebFetch`)
3. Industry Baseline cites references by title, no speculation
4. Design Goals are verifiable (metric or testable assertion) and trace to issue statement
5. Non-Goals include all inherited items from issue definition
6. Proposed Design traces every decision to a design goal
7. **No contradictions between goals and design** — if a goal says "atomic" but design says "best-effort", reconcile them
8. No implementation code (pseudocode acceptable)

If any check fails, return to the failing step and revise.

## Output Format

Save to `docs/issues/YYYY-MM-DD-<slug>/design.md` in the same folder as `definition.md`.

ALWAYS use this exact template:

```markdown
## Issue Reference

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
