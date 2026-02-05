---
name: defining-problems
description: Converts vague natural-language requests into precise, grounded engineering problem definitions with background, problem statement, current state, non-goals, and open questions. Use when a problem needs to be clarified, scoped, or prepared before research or design work begins — such as unclear requirements, vague feature requests, ambiguous bug reports, or undefined scope boundaries.
---

# Defining Problems

Does NOT propose solutions, design systems, optimize performance, or suggest architectures. Output is a problem definition only.

## Workflow

Execute all steps in order. Skipping a step is not allowed.

Copy this checklist and track progress:

```
Problem Definition Progress:
- [ ] Step 1: Background & Context
- [ ] Step 2: Problem Statement
- [ ] Step 3: Current State
- [ ] Step 4: Non-Goals
- [ ] Step 5: Open Questions
- [ ] Step 6: Validate Output
```

### Step 1: Background & Context

Establish why this problem exists and what motivated the request.

- Describe the domain, system, or user scenario
- Include history or prior attempts if known
- Reference business or technical drivers
- Keep factual — do NOT editorialize or advocate for a solution

Write under: **## Background & Context**

**Example:**

Input: "The bot is kinda slow when it tries to do stuff and it gets confused a lot"

Output:
> ## Background & Context
> The Minecraft bot uses a task execution pipeline to translate high-level commands into sequences of in-game actions. Users have reported perceived latency between issuing commands and observing bot behavior, as well as instances where the bot selects an incorrect action given the current game state. These reports have increased since the addition of multi-step task support.

### Step 2: Problem Statement

Translate the vague request into a precise engineering problem statement.

- Use precise engineering language
- Prefer terminology already used in the codebase
- Remove subjective or aspirational wording
- Do NOT add requirements beyond what was stated
- Do NOT propose solutions

Write a single paragraph under: **## Problem Statement**

**Example:**

> ## Problem Statement
> The bot's task execution pipeline introduces measurable latency between receiving a command and initiating the corresponding action. Additionally, the bot's action selection logic fails to choose the correct behavior when multiple valid actions exist for a given game state.

### Step 3: Current State

Anchor the problem in the real codebase and its current behavior.

- Identify relevant modules, directories, and files
- List exact file paths (verify they exist)
- Note existing abstractions, patterns, or conventions
- Describe current behavior, not desired behavior

If nothing relevant exists, write: "No existing implementation found."

Write under: **## Current State**

**Example:**

> ## Current State
> Task execution is handled in `src/agent/task_runner.ts`, which processes commands sequentially through a queue. Action selection uses a rule-based system in `src/agent/actions/` with one file per action type. The bot currently logs action decisions to `logs/actions.log` but does not expose timing metrics.

### Step 4: Non-Goals

Prevent scope creep in downstream phases.

- What is explicitly out of scope
- What parts of the system must NOT be redesigned
- What adjacent problems are intentionally excluded

When in doubt, mark it a non-goal.

Write under: **## Non-Goals**

**Example:**

> ## Non-Goals
> - Redesigning the action system architecture
> - Adding new action types
> - Optimizing network latency between bot and game server
> - Changing the command input format

### Step 5: Open Questions

Expose uncertainty instead of silently resolving it.

List:
1. Assumptions made due to missing information
2. Questions that MUST be answered by a human before work begins

Rules:
- Do NOT answer the questions
- Do NOT resolve assumptions
- At least 3 items total

Write under: **## Open Questions**

**Example:**

> ## Open Questions
>
> **Assumptions:**
> - "Slow" refers to wall-clock latency, not throughput
> - The confusion behavior is non-deterministic, not consistently wrong
>
> **Questions:**
> - What is the acceptable latency threshold for task execution?
> - Which specific tasks trigger the confused behavior?
> - Is the confusion observed in single-player or multiplayer contexts?

### Step 6: Validate Output

Review the completed output before delivering:

1. All five sections are present and non-empty
2. Background & Context is factual with no solution language
3. Problem Statement contains no solution language and no added requirements
4. Current State references real files (verify paths exist)
5. Non-Goals scopes conservatively
6. Open Questions has at least 3 items and does not answer its own questions

If any check fails, return to the failing step and revise.

## Output Format

Save to `docs/problems/YYYY-MM-DD-<slug>.md` where:
- `YYYY-MM-DD` is today's date
- `<slug>` is a short kebab-case summary (e.g., `task-execution-latency`)

Create `docs/problems/` if it doesn't exist.

ALWAYS use this exact template:

```markdown
## Background & Context

## Problem Statement

## Current State

## Non-Goals

## Open Questions
```

Missing any section invalidates the output.
