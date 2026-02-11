---
name: planning-tasks
description: Translates an approved design document into a concrete, ordered task plan with exact file paths, implementation details, code examples, and validation commands suitable for direct execution by coding agents. Use when a design document exists in docs/issues/ and executable implementation tasks are needed before coding begins.
---

# Planning Tasks

Takes `design.md` and `definition.md` from `docs/issues/YYYY-MM-DD-<slug>/` as input. Produces a task plan detailed enough for a coding agent to execute without re-deriving implementation from the design.

Does NOT introduce new design decisions, modify the design, or write complete implementations. Output is a task plan with enough detail to execute, not pre-written code to copy.

## Workflow

Execute all steps in order. Skipping a step is not allowed.

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

Read both upstream documents from the issue folder:

1. `design.md`
2. `definition.md`

Extract: design goals, non-goals, proposed design, and current state.

### Step 2: Explore Codebase

Read actual files to ground the plan in reality.

- Read files referenced in issue definition's current state
- Identify patterns, naming conventions, testing style
- Locate exact insertion points for new code

No output section. Purpose: ensure tasks reference real paths and patterns.

### Step 3: Break Design into Tasks

Each task MUST use this exact format:

```
### T<N>: <short imperative title> [S|M|L]

**Objective**: One outcome, traceable to a design element.

**Size**: S (single file, <30 lines) | M (2-3 files, moderate logic) | L (multiple files, complex state/logic)

**Files**:
- Create: `exact/path/to/new_file.ts`
- Modify: `exact/path/to/existing.ts`
- Test: `tests/path/to/test.test.ts`

**Implementation**:
1. In `path/to/file.ts`:
   - Add import X from Y
   - Modify `functionName()` to do Z
2. In `tests/path/to/test.test.ts`:
   - Test: "should X" — assert Y

**Boundaries**: What this task must NOT do

**Dependencies**: T<N> | None

**Expected Outcome**: Observable result (file exists, test passes, etc.)

**Validation**: `exact command` — expected output
```

**Code detail guidance:**
- ✓ Interfaces, type definitions, function signatures (they define contracts)
- ✓ Key logic as pseudocode or commented outline
- ❌ Complete function bodies (executing agent writes these)
- ❌ Complete test implementations (describe what to test, not full test code)

**Detail consistency**: All tasks must have the same depth of specificity. If a task requires the executing agent to choose between approaches, the task is underspecified — resolve the choice or flag it in Open Execution Questions.

Start **## Task List** with a **Task Index** — one line per task for quick scanning:

> `T1: Add timing instrumentation [S] — T2: Refactor task queue [M] — T3: Add action selector [L]`

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

1. Every task has all 8 fields (Objective, Size, Files, Implementation, Boundaries, Dependencies, Expected Outcome, Validation)
2. Task Index present at top of Task List
3. Implementation shows specific changes per file with code examples
4. Every task traces to the proposed design
5. No vague outcomes ("improved", "refactored")
6. Validation has exact commands with expected output
7. File paths match actual codebase (from Step 2)
8. Interfaces/signatures complete, function bodies are outlines not implementations
9. No task is significantly vaguer than others
10. No embedded design decisions — if "either X or Y", resolve or move to Open Execution Questions

If any check fails, return to the failing step and revise.

## Output Format

Save to `docs/issues/YYYY-MM-DD-<slug>/plan.md` in the same folder as `definition.md` and `design.md`.

Template:

```markdown
## Task List

## Task Ordering Rationale

## Out-of-Scope Tasks

## Open Execution Questions

## Readiness Declaration
```

Missing any section invalidates the output.

## Anti-patterns

- ❌ Complete implementations: 50-line function body → ✓ signature + outline
- ❌ Full test code → ✓ test descriptions with expected assertions
- ❌ Vague: "Update the function" → ✓ "In `executeTask()` (~line 45), add X"
- ❌ Untraceable: no goal reference → ✓ "Objective: ... (design goal #1)"
- ❌ Embedded design decisions: "Either add new RPC or extend existing" → ✓ pick one, or flag in Open Execution Questions
- ❌ Inconsistent detail: T1 has exact insertion points, T8 says "add component" → ✓ same depth across all tasks
