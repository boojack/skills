# Skills

Turn vague words into shipping code — through definition, design, planning, and execution.

## Define before you design

"Make the API faster." "Add dark mode." — Users describe intent, not implementation. The gap between what's said and what an agent needs is context: which files, which functions, what exists today, what's out of scope.

`defining-issues` bridges that gap. It scans the codebase, documents current behavior, and produces a `definition.md` — the single source of truth every downstream stage builds on.

```
User: "add dark mode"
                ↓
definition.md:
  - Background:     React app using styled-components, no theme system
  - Current state:  src/styles/global.ts exports hardcoded color tokens
  - Non-goals:      system preference detection, per-component overrides
  - Open questions:  persist preference? (default: localStorage)
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

Four stages, each with one job and one hard constraint. The constraint makes the output trustworthy — and separates this from "just asking the agent to build it."

All artifacts save to `docs/issues/YYYY-MM-DD-<slug>/`. Review each before moving on.

### `defining-issues` → `definition.md`

> No solution language — define the problem, not the fix.

Explores the codebase and converts a vague request into a grounded definition — real file paths, current behavior, non-goals, and open questions with defaults.

The most important stage. A weak definition means design researches the wrong problem, planning targets imaginary files, and execution writes code that doesn't fit.

### `writing-designs` → `design.md`

> No design decision without a cited reference.

Takes `definition.md` and researches how the industry solves the problem — engineering blogs, open-source implementations, technical articles. Every decision traces to a goal and cites a source.

If a pattern isn't backed by real-world usage, it doesn't belong in the design.

### `planning-tasks` → `plan.md`

> Every task must have exact file paths, implementation outline, and validation command.

Breaks the design into ordered tasks. Each declares files to modify, implementation outline, boundaries, dependencies, and how to validate.

If the executing agent would need to make a judgment call, the plan isn't ready.

### `executing-tasks` → `execution.md`

> The plan is immutable — stop on any deviation.

Implements each task exactly as written. Runs validations, records pass/fail. If anything deviates — execution stops and records a blocker.

The plan either works as written or it goes back for revision.

### `syncing-linear`

> The most important output isn't code — it's the artifacts.

Runs independently after any stage. Creates or updates a Linear issue with a condensed summary and uploads artifacts as linked documents.

Agent conversations are means, not ends: the session closes, the context disappears, but the artifacts remain. Every issue needs a center — `syncing-linear` makes Linear that source of truth, **one place to define, plan, review, and monitor.**
