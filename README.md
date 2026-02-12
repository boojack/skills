# Skills

Turn vague words into shipping code — through definition, design, planning, and execution.

## Define before you design

"Make the API faster." "Add dark mode." — Users describe intent, not implementation. The gap between what a user says and what an agent needs to know is context: which files, which functions, what exists today, what's out of scope.

`defining-issues` bridges that gap. It scans the codebase, locates the relevant code paths, documents current behavior, and produces a `definition.md` — the single source of truth that every downstream stage builds on.

```
User: "add dark mode"
                ↓
definition.md:
  - Background:     React app using styled-components, no theme system
  - Current state:  src/styles/global.ts exports hardcoded color tokens
  - Non-goals:      system preference detection, per-component overrides
  - Open questions:  persist preference? (default: localStorage)
```

Design, planning, and execution all read from this artifact. The precision comes from the definition — not from the user having to spell it out.

## Install

Works with Claude Code, Gemini CLI, Cursor, Copilot, and [40+ agents](https://skills.sh/).

```bash
npx skills add boojack/skills

# update to latest
npx skills update boojack/skills
```

## How it works

Four stages, each with one job and one hard constraint. The constraint is what makes the output trustworthy — and what separates this from "just asking the agent to build it."

All artifacts are saved to `docs/issues/YYYY-MM-DD-<slug>/`. Review and annotate each artifact before moving to the next stage.

### `defining-issues` → `definition.md`

> No solution language — define the problem, not the fix.

Converts a vague request into a grounded issue definition. Explores the codebase to find real file paths and current behavior. Produces background, issue statement, current state, non-goals, and open questions with defaults.

This is the most important stage. Everything downstream inherits the context gathered here. A weak definition means design researches the wrong problem, planning targets imaginary files, and execution writes code that doesn't fit.

### `writing-designs` → `design.md`

> No design decision without a cited reference.

Takes `definition.md` and researches how the industry solves the defined problem — engineering blogs, open-source implementations, technical articles. Produces an industry baseline, research summary, and proposed design where every decision traces to a goal and cites a source.

Prevents the agent from inventing solutions. If a pattern isn't backed by real-world usage, it doesn't belong in the design.

### `planning-tasks` → `plan.md`

> Every task must have exact file paths, implementation outline, and validation command.

Takes `definition.md` + `design.md` and breaks the design into ordered tasks. Each task declares which files to create or modify, what the implementation looks like (signatures and outlines, not full code), boundaries, dependencies, expected outcomes, and how to validate.

Resolves every ambiguity before execution begins. If the executing agent would need to make a judgment call, the plan isn't ready.

### `executing-tasks` → `execution.md`

> The plan is immutable — stop on any deviation.

Takes `plan.md` and implements each task exactly as written. Runs validation commands, records pass/fail. If anything deviates from the plan — a file doesn't exist, a test fails, a boundary would be crossed — execution stops and records a blocker for the planner.

No improvisation, no "quick fixes while I'm here," no reordering. The plan either works as written or it goes back for revision.

### `syncing-linear`

Runs independently after any stage. Creates or updates a Linear issue with a summarized title and structured description, and uploads the current definition and design as linked documents.
