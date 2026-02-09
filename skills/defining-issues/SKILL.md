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
- Keep factual — do NOT editorialize or advocate for a solution

Write under: **## Background & Context**

**Example:**

Input: "The bot is kinda slow when it tries to do stuff and it gets confused a lot"

> ## Background & Context
> The Minecraft bot uses a task execution pipeline to translate high-level commands into sequences of in-game actions. Users have reported perceived latency between issuing commands and observing bot behavior, as well as instances where the bot selects an incorrect action given the current game state.

### Step 2: Issue Statement

Translate the vague request into a precise engineering issue statement.

- Use precise engineering language and codebase terminology
- Remove subjective or aspirational wording
- Do NOT add requirements beyond what was stated
- Do NOT propose solutions

Write a single paragraph under: **## Issue Statement**

**Example:**

> ## Issue Statement
> The bot's task execution pipeline introduces measurable latency between receiving a command and initiating the corresponding action. Additionally, the bot's action selection logic fails to choose the correct behavior when multiple valid actions exist for a given game state.

### Step 3: Current State

Anchor the issue in the real codebase.

- List exact file paths (use `Glob` or `Read` to verify they exist before including)
- Include line numbers for specific functions or definitions
- Note existing abstractions and patterns
- Describe current behavior, not desired behavior

If the section exceeds 30 lines, summarize patterns and move full enumerations to a reference appendix.

If nothing relevant exists, write: "No existing implementation found."

Write under: **## Current State**

**Example:**

> ## Current State
> Task execution is handled in `src/agent/task_runner.ts`, which processes commands sequentially through a queue. Action selection uses a rule-based system in `src/agent/actions/` with one file per action type.

### Step 4: Non-Goals

Prevent scope creep in downstream phases. When in doubt, mark it a non-goal.

- What is explicitly out of scope
- What parts of the system must NOT be redesigned
- What adjacent issues are intentionally excluded

Write under: **## Non-Goals**

**Example:**

> ## Non-Goals
> - Redesigning the action system architecture
> - Adding new action types
> - Optimizing network latency between bot and game server

### Step 5: Open Questions

Expose uncertainty. For each item, provide a default so downstream work can proceed.

Format: `Question? (default: answer)`

Write under: **## Open Questions**

**Example:**

> ## Open Questions
>
> - "Slow" refers to latency, not throughput? (default: latency)
> - Acceptable latency threshold? (default: 100ms)
> - Which tasks trigger confusion? (default: all multi-step tasks)

### Step 6: Validate Output

1. All five sections present and non-empty
2. Background & Context and Issue Statement contain no solution language:
   - No "should", "need to", "must implement", "we will"
   - No specific technologies or patterns proposed as fixes
   - No "by adding/creating/implementing X" phrases
3. Current State references real files (verify paths exist with `Glob` or `Read`)
4. Non-Goals scopes conservatively (when uncertain, mark as non-goal)
5. Open Questions items each have a default recommendation

If any check fails, return to the failing step and revise.

## Output Format

Save to `docs/issues/YYYY-MM-DD-<slug>/definition.md` where `<slug>` is a short kebab-case summary (e.g., `task-execution-latency`).

Create the folder if it doesn't exist.

ALWAYS use this exact template:

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
