---
name: writing-design-docs
description: >
  Use when rough engineering or product context needs to become a concise
  design doc, RFC, technical proposal, architecture decision, or design review
  artifact. Triggers on feature requests, bug reports, defined issues, vague
  ideas, architecture questions, approach comparisons, scoping, goals/non-goals,
  current-code research, comparable-product research, or written recommendations
  for a design decision. Not for implementation-only tasks.
---

# Writing Design Docs

Turn rough engineering context into a concise, decision-ready design doc. Do not write implementation code, task plans, PRs, or execution steps.

## Core Rule

```
CLARIFY THE PROBLEM BEFORE WRITING THE DESIGN
RESEARCH CURRENT CODE AND MAINSTREAM DESIGNS BEFORE PROPOSING
```

## Workflow

| Phase | Do not move on until |
| --- | --- |
| Understand | The product/system problem, actors, workflow, and known facts are clear. |
| Clarify | Remaining unknowns either have answers or explicit conservative defaults. |
| Research | Relevant current code/docs and comparable designs have been inspected. |
| Compare | Viable approaches and tradeoffs are fairly represented, unless one local fix is clearly enough. |
| Write | The doc shape matches the scope and avoids execution planning. |
| Review | Claims trace back to evidence, goals, constraints, or stated assumptions. |

### Phase 1: Understand The Problem

- Restate the user's problem in concrete product and engineering terms.
- Read the provided artifacts and cheap repo facts: issue text, specs, screenshots, product notes, obvious entry-point files.
- Identify the product area, actors, affected workflow, and current behavior.
- Separate facts from assumptions.
- If the user only wants an implementation, code review, or quick answer, do not force a design doc; this skill stops at design.

### Phase 2: Ask Clarifying Questions

For rough or ambiguous requests, use a direct question loop before researching deeply:

- Ask one question at a time.
- Prefer multiple-choice questions when the tradeoff is clear.
- Focus on purpose, constraints, success criteria, users, rollout, and non-goals.
- Do not ask questions whose answer can be found cheaply in the repo or provided artifacts.
- Use a conservative default when the question is minor and the default is easy to state.
- Stop asking when the remaining unknowns can be captured as open questions with defaults.

### Phase 3: Research

With scope settled, research only what materially affects the design:

- Inspect the current code and existing local patterns the design must fit.
- Research how mainstream products, frameworks, or comparable systems solve the same class of problem, when the design space is not already obvious.
- Capture the evidence that matters: file paths, API names, data model facts, existing UX behavior, prior docs, external references.
- Scale research to risk: small local changes may need only repo evidence; API, data model, security, UX, or cross-team designs need broader current-state and comparable-design evidence.
- Prefer concrete source notes over generic claims. "Similar products separate draft and published state" is weak; naming the products, flows, docs, or code paths that support the claim is strong.
- If the request spans multiple independent systems, recommend splitting into separate design docs before continuing.

Do not proceed to design until you can answer:

- What user or system problem is being solved?
- Why does the current behavior fall short?
- Which current code, docs, or product flows constrain the design?
- What mainstream or comparable designs are relevant?
- Which assumptions remain, and what conservative defaults should be used?

Then summarize before designing:

- Problem statement
- Research summary
- Goals
- Non-goals
- Important constraints
- Open questions with defaults

If this summary is likely controversial or high-impact, ask the user to confirm it before writing the design doc.

### Phase 4: Compare Approaches

Include 2-3 viable approaches unless the design is clearly small and local.

For each approach, capture:

- One-sentence summary
- Pros
- Cons
- Fit with goals and non-goals
- Risks or unknowns

Lead with a recommendation only after comparing the options. Do not include strawman options just to reach three; when one option is clearly worse, say why briefly and keep the comparison honest.

### Phase 5: Write The Design Doc

Save to `docs/design-docs/YYYY-MM-DD-<slug>.md` unless the user requests another path.

Use this structure by default:

```markdown
# <Short Descriptive Title>

Status: Draft
Authors: <name or team>
Reviewers: <names, teams, or TBD>
Last Updated: <date>

## TL;DR

## Background

## Problem Statement

## Goals & Non-Goals

## Current State

## Design

## Impact

## Open Questions
```

Section requirements:

| Section | Requirement |
| --- | --- |
| Title | Plain noun phrase, under 80 characters. |
| Metadata | Keep status, authors, reviewers, and date short. Use `TBD` only for reviewers when genuinely unknown. |
| TL;DR | 3-5 sentences: problem, recommendation, main tradeoff, expected outcome. |
| Background | Objective context, user workflow, related issues, research summary, prior work, and why this matters. Keep it succinct. |
| Problem Statement | One precise paragraph. Describe the broken behavior or gap, not the fix. |
| Goals & Non-Goals | Short bullets. Non-goals are plausible goals explicitly excluded, not negated goals. |
| Current State | Current behavior and relevant code/data/API facts. Include file paths, source docs, and local patterns when useful. |
| Design | Start with the proposal, then add only the details needed to understand decisions and tradeoffs. |
| Impact | Explain affected API, frontend, data model, users, compatibility, rollout, or operational behavior. Omit irrelevant surfaces. |
| Open Questions | Carry unresolved questions with recommended defaults. |

For small or incremental changes, write a mini design doc with only:

```markdown
# <Short Descriptive Title>

## TL;DR

## Background

## Problem Statement

## Goals & Non-Goals

## Design

## Impact And Open Questions
```

Use the full default structure when the design crosses teams, changes APIs/data models, introduces meaningful migration risk, or needs current-state evidence to be reviewed.

Add these optional sections only when the doc needs them:

| Optional section | Use when |
| --- | --- |
| Critical User Journeys | Product/UX flow matters, especially when multiple roles or entry points are involved. |
| Industry / Product Research | External patterns materially affect the design. |
| Approaches | There are 2-3 viable solutions that deserve fair comparison. |
| Comparison | A table makes tradeoffs clearer than prose. |
| Recommendation | The doc compares approaches and needs a clear final choice. |
| Risks & Cross-Cutting Concerns | Security, privacy, observability, reliability, migration, or support risks are material. |
| Release Plan / Rollout | Phasing, compatibility, or migration order matters. |
| Future Work | Useful follow-ups are explicitly out of scope. |
| References | The doc relies on external sources, prior PRs, or linked artifacts. |

In **Design**, use short subsections only when they clarify the design:

```markdown
### Current Behavior

### Proposed Change

### Key Decisions

### API / Interface

### Data Model

### UX / User Flow

### System Flow

### Ownership And Boundaries
```

Skip subsections that would be empty or ceremonial. Do not paste complete schemas, API definitions, or code unless the detail is necessary to explain a tradeoff.

Use this option format in **Approaches**:

```markdown
### Option A: <name>

<One-sentence summary.>

- Pros: <1-3 concise bullets>
- Cons: <1-3 concise bullets>
- Fit: <how it meets or misses the goals>
```

When the answer is a direct local fix and alternatives would be artificial, skip **Approaches** and put the reasoning under **Design > Key Decisions**.

### Phase 6: Self-Review

Before finishing, revise the doc against this checklist:

- The TL;DR is understandable without reading the full doc.
- The problem statement has no solution language like "add X" or "implement Y".
- The design is grounded in current code, existing docs, product behavior, or explicit user-provided context.
- Mainstream or comparable designs were researched when the problem space required it.
- The research summary names what was inspected, not just the conclusion drawn from it.
- Every proposed decision traces to a goal, constraint, or current-state fact.
- Options are compared, not dismissed, when multiple viable approaches exist.
- The recommendation and tradeoffs are explicit when the doc includes approaches.
- Goals and non-goals do not contradict each other.
- Open questions have defaults where possible.
- The doc uses the mini, default, or optional-section structure intentionally.
- Paragraphs are concise and easy to scan.
- No runnable code, implementation task list, commit plan, PR instructions, or execution handoff is included.

## Example: A Good Mini Design Doc

This shows the target altitude: grounded in real code, recommendation visible, tradeoffs explicit, no implementation steps.

```markdown
# Debounce Autosave In The Note Editor

## TL;DR

The note editor saves on every keystroke, producing heavy write traffic and
occasional lost updates when requests race. We recommend debouncing autosave to
800ms after the last edit, with a forced flush on blur and navigation, and an
edit sequence number to discard out-of-order responses. This cuts write volume
sharply and removes the race without changing the "saves automatically" UX.

## Background

`NoteEditor` calls `saveNote()` from its `onChange` handler
(`web/src/editor/NoteEditor.tsx:142`), so a 200-character paragraph issues ~200
PUTs. Support has logged three reports of notes reverting mid-edit; server logs
show overlapping PUTs completing out of order.

## Problem Statement

Per-keystroke saving generates redundant write load and lets concurrent in-flight
requests complete out of order, occasionally persisting stale content over newer
edits.

## Goals & Non-Goals

- Goal: Reduce autosave write volume during active typing.
- Goal: Prevent stale overwrites from out-of-order responses.
- Non-goal: Offline editing or local draft persistence.
- Non-goal: Adding a manual Save button or changing the autosave UX.

## Design

Debounce `saveNote()` to fire 800ms after the last edit, and force an immediate
flush on blur, route change, and `visibilitychange`. Tag each request with a
monotonically increasing `editSeq`; the client discards any response whose
`editSeq` is older than the latest sent, closing the race with no server change.
800ms balances perceived responsiveness against write reduction and stays
configurable if support data argues otherwise.

## Impact And Open Questions

Affects only the editor's save path; the `PUT /notes/:id` contract, data model,
and migrations are unchanged. Open: should a "Saving…/Saved" indicator accompany
the delay? (default: yes, reuse the existing `SaveStatus` badge.)
```

## Writing Standard

- Write for design review readers who know the product but have not read the code.
- Prefer plain language over abstract architecture terms.
- Keep paragraphs to 2-4 sentences.
- Use bullets for lists, tradeoffs, and decisions.
- Define project-specific terms the first time they appear.
- Use active voice and concrete nouns.
- Keep the recommendation visible in the TL;DR and Design or Recommendation section.
- Remove filler phrases like "in order to", "it is worth noting", and "as mentioned above".
- Avoid implementation-level detail unless it clarifies a design decision.
- Do not include complete code snippets; use small interface sketches only when necessary.
- Keep the doc short enough to be read by busy reviewers; split very large designs into smaller docs.

## Anti-Patterns

The Self-Review checklist covers the positive rules; these are the tempting traps to watch for.

- Asking a batch of questions instead of one focused question at a time.
- Asking the user what repo inspection could answer.
- Using vague claims like "better", "cleaner", or "more scalable" without evidence.
- Forcing 2-3 approaches when one local fix is obviously right — or hiding tradeoffs by showing only one option for M/L-scope work.
- Treating open questions as blockers when a conservative default exists.
- Creating every full-template section for a small local change.
- Sliding into a task plan, code, tests, or PR notes — this skill stops at the design.
