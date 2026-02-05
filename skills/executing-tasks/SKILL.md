---
name: executing-tasks
description: Executes an approved task plan exactly as written, producing code changes, running validations, and recording completion status for each task. Use when a task plan exists in docs/plans/ with readiness status "Ready for execution" and implementation work should begin.
---

# Executing Tasks

Takes a task plan from `docs/plans/` as input. Executes each task exactly as specified, validates results, and records outcomes.

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

Read the task plan from `docs/plans/`.

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
**Deviations**: None (or describe if any)
```

Deviations MUST be "None". Any deviation is a failure.

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
- Do NOT attempt to fix by modifying the plan
- Do NOT skip the failing task

## Output Format

Save to `docs/executions/YYYY-MM-DD-<slug>.md` where `<slug>` matches the plan.

Create `docs/executions/` if it doesn't exist.

ALWAYS use this exact template:

```markdown
## Plan Reference

## Execution Log

## Completion Declaration
```

Missing any section invalidates the output.
