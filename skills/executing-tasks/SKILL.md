---
name: executing-tasks
description: Executes an approved task plan exactly as written, producing code changes, running validations, and recording completion status for each task. Use when a task plan exists in docs/plans/ with readiness status "Ready for execution" and implementation work should begin.
---

# Executing Tasks

Takes `plan.md` from `docs/problems/YYYY-MM-DD-<slug>/` as input. Executes each task exactly as specified, validates results, and records outcomes.

Does NOT modify the plan, merge/split/reorder tasks, introduce new tasks, make design decisions, or perform opportunistic refactors. The plan is immutable.

## Workflow

Execute tasks one at a time in plan order. For each task:

```
Task Execution Loop:
- [ ] Confirm task
- [ ] Execute
- [ ] Validate
- [ ] Record
```

### Step 1: Load Plan

Read `plan.md` from the problem folder.

- Verify Readiness Declaration is "Ready for execution"
- If blocked or requires update, STOP — do not execute

Write the file path under: **## Plan Reference**

### Step 2: Execute Tasks

For each task in order:

#### 2a. Confirm

Before executing, restate:
- Task ID and objective
- Files in scope
- Boundaries (what NOT to do)
- Dependencies satisfied? (yes/no)

If dependencies not satisfied, STOP.

#### 2b. Execute

- Perform only the actions in the Implementation section
- Touch only files declared in Files section
- Follow existing code conventions
- Do NOT "improve" beyond task scope

#### 2c. Validate

Run the exact validation commands from the task.

- If validation passes, proceed to record
- If validation fails, STOP — record failure, do not attempt fixes

#### 2d. Record

After each task, record under **## Execution Log**:

```
### T<N>: <title>

**Status**: Completed | Failed | Skipped
**Files Changed**: list of files
**Validation**: `command` — PASS/FAIL
**Deviations**: None | (describe — then STOP, this is a failure)
```

**Deviations field catches drift, not justifies changes.** Anything other than "None" = failure. STOP and record.

**Example (success):**
> **Status**: Completed | **Files Changed**: `metrics.ts`, `task_runner.ts` | **Validation**: PASS | **Deviations**: None

**Example (failure):**
> **Status**: Failed | **Files Changed**: None | **Validation**: Not run
> **Deviations**: Cannot add to `auth.ts` — has dependencies preventing isolated testing
> **Blocker for planner**: Move to separate utility file

### Step 3: Declare Completion

After all tasks (or on failure), declare exactly one:

- **All tasks completed successfully**
- **Execution halted at T<N> due to failure** — describe what failed
- **Execution blocked pending clarification** — describe what's needed

Write under: **## Completion Declaration**

## Failure Rules

Execution MUST stop if:
- Task cannot be completed as written
- Validation fails
- Required information is missing
- Task conflicts with codebase state

On failure:
- Record the failure in Execution Log
- Include **Blocker for planner**: what information/change would allow the plan to succeed
- Do NOT attempt to fix by modifying the plan
- Do NOT skip the failing task
- Do NOT rationalize deviations as acceptable ("moved to different file for testability" = failure, not success)

## Output Format

Save to `docs/problems/YYYY-MM-DD-<slug>/execution.md` in the same folder as `plan.md`.

ALWAYS use this exact template:

```markdown
## Plan Reference

## Execution Log

## Completion Declaration
```

Missing any section invalidates the output.

## Anti-patterns

- ❌ Rationalizing deviations: "Completed (with deviation)" → ✓ "Failed" + blocker
- ❌ Fixing plan during execution → ✓ stop, record what prevents following plan
- ❌ Skipping validation: "obviously correct" → ✓ run exact command, record result
- ❌ Continuing after failure → ✓ STOP at first failure
- ❌ Improving beyond scope → ✓ touch only declared files
