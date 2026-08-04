---
name: simplify
description: >
  Manually invoked code-cleanup capability that reviews changed code for reuse,
  simplification, efficiency, and abstraction-level issues, then applies
  verified behavior-preserving fixes. Use only when the user explicitly
  invokes or names the simplify skill. Do not activate for correctness or
  security review, bug fixing, formatting-only requests, or broad refactoring.
metadata:
  owner: "boojack"
  version: "1.0.0"
  last-reviewed: "2026-08-04"
  evaluation: "trigger-and-task-evals-defined"
---

# Simplify

Review the changed code through four cleanup lenses, apply only verified
behavior-preserving improvements, and validate the result.

Proceed only after an explicit `$simplify`, `/simplify`, or request to use the
named skill.

## Contract

- Review changed code, not the repository in general. Use a supplied path,
  diff, branch, commit range, or pull-request reference as the target when one
  is provided.
- Preserve externally observable behavior, supported inputs, outputs, errors,
  ordering, side effects, concurrency, and compatibility.
- Apply high-confidence cleanup fixes rather than returning a suggestion list.
- Preserve user-authored changes and keep unrelated files and lines untouched.
- Do not perform a general correctness, security, or style review. This skill
  does not establish that the code is bug-free.
- Do not add dependencies, redesign public APIs, or expand product behavior to
  make a cleanup possible.

## Establish The Change Set

1. Read the repository instructions that govern the target files.
2. Resolve the target without changing repository state:
   - Prefer the path, diff, branch, commit range, or pull request named by the
     user.
   - Otherwise inspect the current working-tree and index changes, plus branch
     commits ahead of the configured upstream when that relationship is
     available locally.
   - Include relevant untracked source files. Exclude generated output,
     vendored code, lockfiles, and binary assets unless the user targeted them.
3. Read the complete changed sections and enough surrounding code to understand
   contracts, conventions, call sites, and existing helpers.
4. Identify focused validation commands from repository documentation, build
   files, and nearby tests.

Do not fetch, switch branches, stash, reset, discard changes, or rewrite
history to establish the target. If there is no changed code in scope, stop and
say so without editing files.

## Run Four Cleanup Passes

When the host supports parallel agents, dispatch four read-only reviewers in
parallel. Otherwise perform the passes sequentially. Reviewers return findings
only; they must not edit files.

### Reuse

Look for new code that duplicates an existing helper, component, type,
constant, utility, or established pattern. Search before proposing reuse and
confirm that the existing abstraction has compatible semantics.

Do not force reuse when the apparent match has different error behavior,
lifecycle, ownership, performance constraints, or domain meaning.

### Simplification

Look for unnecessary control flow, indirection, state, conversions, wrappers,
comments, or abstractions introduced by the change. Prefer a smaller direct
expression when it preserves readability and every relevant behavior.

Do not compress code into clever expressions, erase useful domain names, or
combine operations whose ordering or failure boundaries matter.

### Efficiency

Look for repeated work, avoidable allocation, redundant I/O, duplicate
queries, unnecessary serialization, or algorithms that are clearly more
expensive than the codebase's existing approach.

Require evidence from the code path or tests. Reject speculative
micro-optimizations, caching without an invalidation model, and changes that
trade correctness or clarity for an unmeasured benefit.

### Abstraction Level

Check whether the change lives at the right level of abstraction. Prefer the
lowest existing layer that owns the rule and the narrowest abstraction that
removes real duplication.

Look for call-site logic that belongs in an existing domain boundary, and for
premature generic helpers created from a single use. Do not move behavior
across layers merely to make individual files shorter.

Each reviewer should report only actionable, high-confidence candidates with:

- the file and relevant code location;
- the cleanup problem and why it matters;
- the smallest behavior-preserving change;
- the evidence needed to verify it; and
- `No meaningful cleanup found` when there is no worthwhile candidate.

## Verify Candidates Before Editing

Re-read every candidate against the current source. Deduplicate overlapping
findings, search definitions and call sites, and reject a candidate when:

- it changes behavior, public contracts, supported inputs, error timing,
  ordering, side effects, or concurrency;
- it is preference-only churn or formatting already owned by tooling;
- it addresses unrelated pre-existing code;
- its benefit is speculative or negligible;
- it requires a new dependency or an unrequested architectural migration; or
- the evidence is insufficient to distinguish cleanup from a behavior change.

Prefer a small set of material fixes over exhaustive polishing. If reviewers
disagree, use the repository's established pattern and observable behavior as
the deciding evidence; otherwise skip the candidate.

## Apply The Cleanups

1. Apply accepted fixes in small, coherent groups.
2. Keep the patch inside the resolved change set and directly affected support
   code. Do not reformat surrounding files for consistency.
3. Update focused tests only when an internal shape changes while the asserted
   behavior remains the same. Do not weaken tests to make a cleanup pass.
4. Edit source files rather than generated outputs.
5. Inspect the resulting diff after each group and remove accidental churn.

If a correctness or security issue becomes apparent while reading the code,
do not silently fix it as cleanup. Leave it unchanged and report it separately
as outside this skill's scope. Stop applying a candidate when preserving the
current behavior would itself be unsafe or impossible to verify.

## Validate

Run the narrowest meaningful checks for the edited code, following repository
instructions:

1. Run focused tests that exercise the preserved behavior.
2. Run the relevant formatter, linter, typechecker, compiler, or build step.
3. Inspect the final diff against the original target for scope and accidental
   behavior changes.
4. Confirm that generated files, dependencies, public APIs, and unrelated code
   did not change unexpectedly.

If a check fails, determine whether the cleanup caused it. Correct or revert
only this skill's edits; never discard the user's existing work. Re-run the
failed checks after correction. Clearly report checks that cannot run and the
reason.

## Report

Return a concise summary containing:

- the material cleanups applied, grouped by the four lenses;
- the validation commands and results;
- any candidate deliberately skipped because behavior preservation was not
  provable; and
- any correctness or security concern noticed but left outside scope.

Do not claim the code is correct, secure, or globally optimal. Do not include
raw reviewer transcripts.

## Maintenance

Update `evals/triggers.md` when activation behavior changes. Update
`evals/tasks.md` when the cleanup contract, review lenses, or validation gates
change. Evaluate the skill on real diffs and compare the resulting patch,
tests, time, and token use against an unskilled cleanup pass.
