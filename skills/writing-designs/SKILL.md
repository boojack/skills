---
name: writing-designs
description: Researches how the industry solves a defined problem, collects references from Google, GitHub, GitLab, and Linear, then produces a design document with industry baseline, research summary, design goals, non-goals, and proposed design. Use when a problem definition exists in docs/problems/ and a concrete design is needed before implementation begins.
---

# Writing Designs

Takes a problem definition from `docs/problems/` as input. Produces a design document grounded in research, not speculation.

Does NOT implement code, create PRs, or make architectural changes. Output is a design document only.

## Workflow

Execute all steps in order. Skipping a step is not allowed.

```
Design Document Progress:
- [ ] Step 1: Load Problem Definition
- [ ] Step 2: Research
- [ ] Step 3: Industry Baseline
- [ ] Step 4: Research Summary
- [ ] Step 5: Design Goals & Non-Goals
- [ ] Step 6: Proposed Design
- [ ] Step 7: Validate Output
```

### Step 1: Load Problem Definition

Read the problem definition file from `docs/problems/`.

- If no file is specified, list available files and ask which one to use
- Extract: background, problem statement, current state, non-goals, open questions
- Note open questions that affect design decisions

Write the file path under: **## Problem Reference**

### Step 2: Research

Search for how the industry solves this problem across:

1. **Google**: Engineering blogs, technical articles
2. **GitHub**: Open-source implementations, patterns
3. **GitLab**: Project solutions, architectural patterns
4. **Linear**: Public issue discussions, solution approaches

For each platform, use at least 2 search queries. Record URL, title, and one-line relevance summary.

Write under: **## References**

Rules:
- At least 5 references total
- Every reference must include a working URL
- Do NOT fabricate URLs

**Example:**

> ## References
>
> - [Behavior Trees for AI](https://www.gamedeveloper.com/programming/behavior-trees-for-ai-how-they-work) — Behavior tree pattern for game AI
> - [mineflayer](https://github.com/PrismarineJS/mineflayer) — Minecraft bot framework, event-driven model
> - [Goal-Oriented Action Planning](https://alumni.media.mit.edu/~jorkin/goap.html) — GOAP for real-time action selection

### Step 3: Industry Baseline

Identify the standard approach to this problem from research.

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
- Which approaches fit the current problem and codebase
- What research suggests about the problem's open questions

Write under: **## Research Summary**

### Step 5: Design Goals & Non-Goals

**Design Goals** — derive from problem statement, must be measurable, order by priority.

**Non-Goals** — inherit all from problem definition, add any discovered during research.

Write under: **## Design Goals** and **## Non-Goals**

**Example:**

> ## Design Goals
>
> 1. Reduce task execution latency to under 100ms
> 2. Action selection produces correct behavior for 95%+ of multi-action states
>
> ## Non-Goals
>
> - Redesigning the action system architecture (inherited)
> - Supporting concurrent task execution

### Step 6: Proposed Design

Present a concrete design addressing the design goals.

- Reference specific files/modules from problem definition's current state
- Explain key decisions and why alternatives were rejected (cite research)
- Include interface definitions or data flows where helpful

Rules:
- Every decision traces to a design goal
- Do NOT introduce scope beyond design goals
- Make decisions, don't leave ambiguous choices
- Pseudocode acceptable; implementation code is not

Write under: **## Proposed Design**

### Step 7: Validate Output

1. Problem Reference points to existing file
2. References has 5+ entries with working URLs
3. Industry Baseline cites references, no speculation
4. Design Goals are measurable and trace to problem statement
5. Non-Goals include all inherited items
6. Proposed Design traces every decision to a design goal
7. No implementation code (pseudocode acceptable)

If any check fails, return to the failing step and revise.

## Output Format

Save to `docs/designs/YYYY-MM-DD-<slug>.md` where `<slug>` matches the problem definition.

Create `docs/designs/` if it doesn't exist.

ALWAYS use this exact template:

```markdown
## Problem Reference

## References

## Industry Baseline

## Research Summary

## Design Goals

## Non-Goals

## Proposed Design
```

Missing any section invalidates the output.
