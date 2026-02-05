# Skills

A four-stage pipeline for turning vague requests into executed code changes.

```
defining-problems → writing-designs → planning-tasks → executing-tasks
      ↓                   ↓                 ↓                ↓
  docs/problems/     docs/designs/     docs/plans/     docs/executions/
```

## Pipeline Overview

| Stage | Skill | Input | Output | Purpose |
|-------|-------|-------|--------|---------|
| 1. Thinking | `defining-problems` | Vague request | Problem definition | Clarify what the problem actually is |
| 2. Choosing | `writing-designs` | Problem definition | Design document | Research and decide how to solve it |
| 3. Planning | `planning-tasks` | Design document | Task plan | Break design into executable tasks |
| 4. Doing | `executing-tasks` | Task plan | Code + execution log | Execute tasks exactly as written |

## Key Principles

**Separation of concerns** — Each skill does one thing. Thinking doesn't choose. Choosing doesn't plan. Planning doesn't execute.

**Authority flows downstream** — Each stage's output is authoritative for the next. Execution cannot modify the plan. Planning cannot modify the design.

**Immutability at boundaries** — Once a document is approved and passed downstream, it doesn't change. This makes AI execution safe to scale.

**Explicit non-goals** — Every stage declares what it will NOT do. Scope creep is prevented by design.

## Usage

Each skill triggers automatically based on context:

```
"The bot is slow and gets confused"     → defining-problems
"Design a solution for [problem]"        → writing-designs
"Create tasks for [design]"              → planning-tasks
"Execute the plan"                       → executing-tasks
```

Or invoke directly by name.

## Output Structure

```
docs/
├── problems/           # Problem definitions
│   └── 2026-01-15-task-execution-latency.md
├── designs/            # Design documents
│   └── 2026-01-15-task-execution-latency.md
├── plans/              # Task plans
│   └── 2026-01-15-task-execution-latency.md
└── executions/         # Execution logs
    └── 2026-01-15-task-execution-latency.md
```

Slugs are consistent across all stages for traceability.

## Skill Details

### defining-problems

Converts vague natural-language requests into precise engineering problem definitions.

**Sections:** Background & Context, Problem Statement, Current State, Non-Goals, Open Questions

**Does NOT:** Propose solutions, design systems, or suggest architectures

### writing-designs

Researches industry solutions and produces a design document grounded in evidence.

**Sections:** Problem Reference, References, Industry Baseline, Research Summary, Design Goals, Non-Goals, Proposed Design

**Does NOT:** Implement code, create PRs, or make architectural changes

### planning-tasks

Translates a design into concrete, ordered tasks with implementation details.

**Sections:** Problem Reference, Design Reference, Task List, Task Ordering Rationale, Out-of-Scope Tasks, Open Execution Questions, Readiness Declaration

**Does NOT:** Introduce new design decisions, modify the design, or write production code

### executing-tasks

Executes an approved task plan exactly as written.

**Sections:** Plan Reference, Execution Log, Completion Declaration

**Does NOT:** Modify the plan, merge/split/reorder tasks, introduce new tasks, or perform opportunistic refactors
