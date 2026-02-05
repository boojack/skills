# Skills Pipeline

A four-stage framework for converting vague requests into executed code changes through structured AI-safe workflows.

## Overview

This project implements a disciplined pipeline that separates **thinking**, **choosing**, **planning**, and **doing** into distinct stages. Each stage has clear boundaries, explicit non-goals, and validation requirements that prevent scope creep and ensure traceability.

```
defining-problems → writing-designs → planning-tasks → executing-tasks
```

## Directory Structure

```

skills/                  # Skill definitions
├── defining-problems/   # Stage 1: Problem definition
├── writing-designs/     # Stage 2: Design research
├── planning-tasks/      # Stage 3: Task planning
└── executing-tasks/     # Stage 4: Execution
docs/                    # Generated documents
└── problems/            # Problem artifacts
    └── YYYY-MM-DD-<slug>/
        ├── definition.md
        ├── design.md
        ├── plan.md
        └── execution.md
```

## The Four Stages

### Stage 1: Defining Problems

Converts vague requests into precise engineering problem definitions.

**Input:** Natural language request
**Output:** `docs/problems/YYYY-MM-DD-<slug>/definition.md`

Produces:
- Background & Context
- Problem Statement
- Current State
- Non-Goals
- Open Questions

Does NOT propose solutions or suggest architectures.

### Stage 2: Writing Designs

Researches industry solutions and produces evidence-based design documents.

**Input:** Problem definition
**Output:** `docs/problems/YYYY-MM-DD-<slug>/design.md`

Produces:
- References (5+ verified URLs)
- Industry Baseline
- Research Summary
- Design Goals (verifiable/measurable)
- Non-Goals
- Proposed Design

Does NOT write implementation code or create PRs.

### Stage 3: Planning Tasks

Translates designs into concrete, ordered executable tasks.

**Input:** Design document
**Output:** `docs/problems/YYYY-MM-DD-<slug>/plan.md`

Each task includes:
- Objective
- Files to modify
- Implementation details
- Boundaries
- Dependencies
- Expected Outcome
- Validation commands

Does NOT merge/split tasks or make design decisions.

### Stage 4: Executing Tasks

Executes an approved task plan exactly as written.

**Input:** Task plan with "Ready for execution" status
**Output:** `docs/problems/YYYY-MM-DD-<slug>/execution.md`

Records:
- Per-task completion status
- Files changed
- Validation results
- Any deviations (which indicate failure)

Does NOT modify the plan, reorder tasks, or refactor opportunistically.

## Key Principles

| Principle | Description |
|-----------|-------------|
| **Separation of Concerns** | Each stage does exactly one thing |
| **Authority Flows Downstream** | Each stage's output is authoritative for the next |
| **Immutability at Boundaries** | Documents don't change once passed downstream |
| **Explicit Non-Goals** | Every stage declares what it will NOT do |
| **Traceability** | Consistent slug naming across all stages |

## Usage

Each skill triggers based on context or can be invoked directly:

```
# Start with a vague request
"The bot is slow and gets confused"

# Stage 1 produces a problem definition
# Stage 2 researches and designs a solution
# Stage 3 creates an executable task plan
# Stage 4 executes the plan
```

## Anti-Patterns Prevented

- Solution language in problem statements
- Scope creep through vague non-goals
- Implementation code in design documents
- Skipping validation steps
- Modifying plans during execution
- Opportunistic refactoring during execution
- Unverified references in research
