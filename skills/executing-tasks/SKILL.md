---
name: executing-tasks
description: >
  Plans and executes implementation from a defined issue. Reads definition.md
  (and design.md if present), breaks work into tasks, then executes each task
  with validation. Use when a definition exists in docs/plans/ and
  implementation work should begin. Also triggers on: "build it", "implement
  this", "execute the plan", "start implementing", "do the work", "plan and
  execute", "break this into tasks and build it".
  Requires definition.md from defining-issues. For L-scope, also requires
  design.md.
---

# Executing Tasks

Takes `definition.md` (required) and `design.md` (optional, required for L-scope) from `docs/plans/YYYY-MM-DD-<slug>/` as input. Plans tasks, then executes each one with validation.

Does NOT make design decisions, skip validation, or perform opportunistic refactors.

## Phase 1: Planning

```
S-SIZE: 4 FIELDS — M/L-SIZE: ALL 8 FIELDS — NO EXCEPTIONS
```

### Step 1: Load Inputs

Read `definition.md` from the issue folder. Extract: issue statement, current state, non-goals, open questions, scope.

If `design.md` exists, also read it and extract: design goals, proposed design.

If scope is L and `design.md` is missing, STOP — direct user to `defining-issues` first.

### Step 2: Explore Codebase

- Read files referenced in definition's current state
- Identify patterns, naming conventions, testing style
- Locate exact insertion points for new code

### Step 3: Break into Tasks

Start **## Task List** with a **Task Index** — one line per task:

> `T1: Add timing instrumentation [S] — T2: Refactor task queue [M] — T3: Add action selector [L]`

**S-size tasks** (single file, <30 lines, no ambiguity) — compact format:

```
### T<N>: <short imperative title> [S]

**Objective**: One outcome, traceable to design or definition.
**Files**: `exact/path/to/file.ts`
**Implementation**: In `functionName()` (~line N), add X
**Validation**: `exact command` — expected output
```

**M/L-size tasks** (multi-file, moderate-to-complex logic) — full format:

```
### T<N>: <short imperative title> [M|L]

**Objective**: One outcome, traceable to design or definition.
**Size**: M (2-3 files, moderate logic) | L (multiple files, complex state/logic)
**Files**:
- Create: `exact/path/to/new_file.ts`
- Modify: `exact/path/to/existing.ts`
- Test: `tests/path/to/test.test.ts`
**Implementation**:
1. In `path/to/file.ts`: add import X, modify `functionName()` to do Z
2. In `tests/path/to/test.test.ts`: test "should X" — assert Y
**Boundaries**: What this task must NOT do
**Dependencies**: T<N> | None
**Expected Outcome**: Observable result (file exists, test passes, etc.)
**Validation**: `exact command` — expected output
```

**Code detail guidance:**
- ✓ Interfaces, type definitions, function signatures
- ✓ Key logic as pseudocode or commented outline
- ❌ Complete function bodies
- ❌ Complete test implementations

### Step 4: Review Plan

Present the full task list to the user. Wait for approval before executing.

If the user requests changes to the plan, adjust and re-present. Do NOT begin execution until the user approves.

---

## Phase 2: Execution

```
EXECUTE THE APPROVED PLAN — STOP ON SEMANTIC DEVIATIONS
```

### Path Corrections vs Deviations

**Continue** (record as path correction):
- File renamed but same purpose (e.g., `auth.ts` → `authentication.ts`)
- Line numbers shifted but function/block is identifiable
- Import path changed due to refactor

**STOP** (record as deviation):
- Function/module doesn't exist and isn't a rename
- The approach described in the plan doesn't fit the actual code
- A dependency (library, API, service) is missing or incompatible
- Task requires touching files not declared in the plan

### Step 5: Execute Tasks

For each task:

**Execute** — Perform only actions in Implementation. Touch only declared files.

**Validate** — Run exact validation commands. Pass → record. Fail → attempt to fix within scope. If fix fails, STOP.

**Record** under **## Execution Log**:

```
### T<N>: <title>

**Status**: Completed | Failed | Skipped
**Files Changed**: list
**Validation**: `command` — PASS/FAIL
**Path Corrections**: None | (describe minor corrections applied)
**Deviations**: None | (describe semantic deviation — then STOP)
```

On failure, include **Blocker**: what went wrong and what would need to change. Do NOT skip tasks or rationalize deviations.

### Step 6: Declare Completion

Exactly one:
- **All tasks completed successfully**
- **Execution halted at T\<N\> due to failure** — what failed
- **Execution blocked pending clarification** — what's needed

## Output

Save to `docs/plans/YYYY-MM-DD-<slug>/plan.md` (after Step 4) and `docs/plans/YYYY-MM-DD-<slug>/execution.md` (after Step 6).

**plan.md:**
```markdown
## Task List

## Out-of-Scope Tasks
```

**execution.md:**
```markdown
## Execution Log

## Completion Declaration
```

## Anti-patterns

### Planning
- ❌ 50-line function body → ✓ signature + outline
- ❌ "Update the function" → ✓ "In `executeTask()` (~line 45), add X"
- ❌ "Either add new RPC or extend existing" → ✓ pick one
- ❌ T1 has exact insertion points, T8 says "add component" → ✓ same depth for same size

### Execution
- ❌ "Completed (with deviation)" → ✓ "Failed" + blocker
- ❌ Skipping validation → ✓ run exact command, record result
- ❌ Touching undeclared files → ✓ only declared files
- ❌ "The plan says X but Y is clearly better" → ✓ execute as planned

## Red Flags - STOP

If you catch yourself thinking:
- "I'll make a design decision here to keep things moving"
- "I don't need to verify this file path exists"
- "I'll just fix this small thing while I'm here"
- "This validation is obviously correct, I'll skip it"
- "This is just a path correction" (when the approach itself changed)
- "This file isn't in scope but it needs updating too"
- "One more attempt should fix it"
- "L-scope but no design.md — I'll just plan from the definition"

**All of these mean: STOP. Record the issue. Do not continue.**

## Related Skills

- `defining-issues` — prerequisite: produces definition.md and design.md
