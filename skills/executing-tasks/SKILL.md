---
name: executing-tasks
description: Executes an approved task plan exactly as written, producing code changes, running validations, and recording completion status for each task. Use when a task plan exists with readiness status "Ready for execution" and implementation work should begin.
---

# Executing Tasks

Takes `plan.md` from `docs/issues/YYYY-MM-DD-<slug>/` as input. Executes each task exactly as specified, validates results, and records outcomes.

Does NOT modify the plan, merge/split/reorder tasks, introduce new tasks, make design decisions, or perform opportunistic refactors. The plan is immutable.

## Workflow

Execute tasks one at a time in plan order.

```
Task Execution Loop:
- [ ] Confirm task
- [ ] Execute
- [ ] Validate
- [ ] Record
```

### Step 1: Load Plan

Read `plan.md` from the issue folder.

- Verify Readiness Declaration is "Ready for execution"
- If blocked or requires update, STOP

### Step 2: Execute Tasks

For each task in order:

#### 2a. Confirm

Before executing, restate:
- Task ID, objective, files in scope, boundaries
- Dependencies satisfied? (yes/no — if no, STOP)

#### 2b. Execute

- Perform only actions in the Implementation section
- Touch only files declared in Files section
- Follow existing code conventions
- Do NOT "improve" beyond task scope

#### 2c. Validate

Run the exact validation commands from the task.

- Pass → proceed to record
- Fail → STOP, record failure, do not attempt fixes

#### 2d. Record

After each task, record under **## Execution Log**:

```
### T<N>: <title>

**Status**: Completed | Failed | Skipped
**Files Changed**: list of files
**Validation**: `command` — PASS/FAIL
**Deviations**: None | (describe — then STOP, this is a failure)
```

Anything other than "None" in Deviations = failure. STOP and record.

### Step 3: Declare Completion

After all tasks (or on failure), declare exactly one:

- **All tasks completed successfully**
- **Execution halted at T\<N\> due to failure** — describe what failed
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
- Include **Blocker for planner**: what change would allow the plan to succeed
- Do NOT fix by modifying the plan, skip the task, or rationalize deviations

## Output Format

Save to `docs/issues/YYYY-MM-DD-<slug>/execution.md` in the same folder as `plan.md`.

Template:

```markdown
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
