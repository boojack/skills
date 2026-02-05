---
name: planning-tasks
description: Translates an approved design document into a concrete, ordered task plan with exact file paths, implementation details, code examples, and validation commands suitable for direct execution by coding agents. Use when a design document exists in docs/designs/ and executable implementation tasks are needed before coding begins.
---

# Planning Tasks

Takes a design document from `docs/designs/` and its corresponding problem definition from `docs/problems/` as input. Produces a task plan detailed enough for a coding agent to execute without re-deriving implementation from the design.

Does NOT introduce new design decisions, modify the design, or write production code. Output is a task plan only.

## Workflow

Execute all steps in order. Skipping a step is not allowed.

Copy this checklist and track progress:

```
Task Plan Progress:
- [ ] Step 1: Load Inputs
- [ ] Step 2: Explore Codebase
- [ ] Step 3: Break Design into Tasks
- [ ] Step 4: Order Tasks & Dependencies
- [ ] Step 5: Identify Out-of-Scope Tasks
- [ ] Step 6: Surface Open Execution Questions
- [ ] Step 7: Declare Readiness
- [ ] Step 8: Validate Output
```

### Step 1: Load Inputs

Read both upstream documents:

1. **Design document** from `docs/designs/`
2. **Problem definition** from `docs/problems/` (path in design's Problem Reference)

Extract: design goals, non-goals, proposed design, and current state.

Write file paths under: **## Problem Reference** and **## Design Reference**

### Step 2: Explore Codebase

Before writing tasks, read actual files to ground the plan in reality.

- Read files referenced in problem definition's current state
- Identify patterns, naming conventions, testing style
- Locate exact insertion points for new code

No output section. Purpose: ensure tasks reference real paths and patterns.

### Step 3: Break Design into Tasks

Each task MUST use this exact format:

```
### T<N>: <short imperative title>

**Objective**: One outcome, traceable to a design element.

**Files**:
- Create: `exact/path/to/new_file.ts`
- Modify: `exact/path/to/existing.ts`
- Test: `tests/path/to/test.test.ts`

**Implementation**:

1. In `path/to/file.ts`:
   - Add import X from Y
   - Add interface (show code)
   - Modify `functionName()` to do Z

2. In `tests/path/to/test.test.ts`:
   - Test: "should X" — assert Y

**Boundaries**: What this task must NOT do

**Dependencies**: T<N> | None

**Expected Outcome**: Observable result (file exists, test passes, etc.)

**Validation**: `exact command` — expected output
```

Write all tasks under: **## Task List**

**Example:**

> ### T1: Add timing instrumentation to task runner
>
> **Objective**: Record latency between command receipt and action initiation (design goal #1).
>
> **Files**:
> - Create: `src/agent/metrics.ts`
> - Modify: `src/agent/task_runner.ts`
> - Test: `tests/agent/metrics.test.ts`
>
> **Implementation**:
>
> 1. Create `src/agent/metrics.ts`:
>    ```typescript
>    export interface MetricsEntry {
>      command: string;
>      startTime: number;
>      actionInitTime: number;
>      latencyMs: number;
>    }
>
>    export function recordMetric(entry: MetricsEntry): void {
>      // Append JSON line to logs/metrics.log
>    }
>    ```
>
> 2. Modify `src/agent/task_runner.ts`:
>    - Add import: `import { recordMetric } from './metrics'`
>    - In `executeTask()` (~line 45), capture `Date.now()` before processing
>    - After action initiated (~line 62), capture second timestamp
>    - Call `recordMetric()` with computed latency
>
> 3. Create `tests/agent/metrics.test.ts`:
>    - "writes entry to metrics.log" — assert JSON contains expected fields
>    - "creates logs directory if missing" — assert dir exists after call
>
> **Boundaries**: Must NOT change task queue logic or add external deps
>
> **Dependencies**: None
>
> **Expected Outcome**: Each task execution writes `{ command, startTime, actionInitTime, latencyMs }` to `logs/metrics.log`.
>
> **Validation**:
> - `npm test -- --grep "metrics"` — tests pass
> - `tail -1 logs/metrics.log` after bot command — shows JSON entry

### Step 4: Order Tasks & Dependencies

Explain why tasks are sequenced. Identify sequential vs parallelizable tasks.

Write under: **## Task Ordering Rationale**

### Step 5: Identify Out-of-Scope Tasks

List tasks that might be assumed necessary but are excluded. Reference design non-goals.

Write under: **## Out-of-Scope Tasks**

### Step 6: Surface Open Execution Questions

List execution uncertainties (tooling, environment, access). Do NOT resolve — only list.

Write "No open execution questions identified." if none exist.

Write under: **## Open Execution Questions**

### Step 7: Declare Readiness

Use exactly one:
- **Ready for execution**
- **Blocked pending clarification**
- **Requires design update**

Write under: **## Readiness Declaration**

### Step 8: Validate Output

1. References point to existing files
2. Every task has all 7 fields (Objective, Files, Implementation, Boundaries, Dependencies, Expected Outcome, Validation)
3. Implementation shows specific changes per file with code examples
4. Every task traces to the proposed design
5. No vague outcomes ("improved", "refactored")
6. Validation has exact commands with expected output
7. File paths match actual codebase (from Step 2)

If any check fails, return to the failing step and revise.

## Output Format

Save to `docs/plans/YYYY-MM-DD-<slug>.md` where `<slug>` matches the problem/design documents.

Create `docs/plans/` if it doesn't exist.

ALWAYS use this exact template:

```markdown
## Problem Reference

## Design Reference

## Task List

## Task Ordering Rationale

## Out-of-Scope Tasks

## Open Execution Questions

## Readiness Declaration
```

Missing any section invalidates the output.
