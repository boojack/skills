# Skills

Turn vague words into shipping code — through definition, design, and execution.

## Define before you build

"Make the API faster." "Add dark mode." — Users describe intent, not implementation. The gap between what's said and what an agent needs is context: which files, which functions, what exists today, what's out of scope.

`defining-issues` bridges that gap. It scans the codebase, documents current behavior, and produces a `definition.md` — the single source of truth that execution builds on.

```
User: "add dark mode"
                ↓
definition.md:
  - Background:     React app using styled-components, no theme system
  - Current state:  src/styles/global.ts exports hardcoded color tokens
  - Non-goals:      system preference detection, per-component overrides
  - Open questions: persist preference? (default: localStorage)
  - Scope:          M — extends existing styled-components pattern
```

The precision comes from the definition — not from the user having to spell it out.

## Install

Works with Claude Code, Gemini CLI, Cursor, Copilot, and [40+ agents](https://skills.sh/).

```bash
npx skills add boojack/skills

# update to latest
npx skills update boojack/skills
```

## How it works

Two stages. Define the problem, then build the solution.

### `defining-issues` → `definition.md` + `design.md`

> No solution language — define the problem, not the fix.

Explores the codebase and converts a vague request into a grounded definition — real file paths, current behavior, non-goals, open questions with defaults, and a scope assessment (S/M/L).

For L-scope tasks (new subsystems, novel problems), the skill continues into a research and design phase — collecting industry references and producing a `design.md` grounded in cited sources. S/M tasks skip design entirely.

### `executing-tasks` → `plan.md` + `execution.md`

> Plan it, then build it — stop on semantic deviations.

Takes the definition (and design, if present), breaks it into ordered tasks, presents the plan for review, then executes each task with validation. Minor path corrections (renames, shifted line numbers) are noted and continued. Semantic deviations stop execution and record a blocker.

### `syncing-linear`

> The most important output isn't code — it's the artifacts.

Runs independently after either stage. Creates or updates a Linear issue with a condensed summary and uploads all artifacts as linked documents.

All artifacts save to `docs/issues/YYYY-MM-DD-<slug>/`.
