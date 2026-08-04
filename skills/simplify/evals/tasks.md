# Task-Quality Evaluation

Run each case in a clean repository with and without the skill. Retain the
initial diff, final diff, command trace, reviewer findings, and validation
output. Grade behavior preservation before cleanup quality.

## Case 1: Reuse An Existing Helper

Fixture:

- `src/names.ts` exports a tested `normalizeDisplayName` helper.
- The current diff adds an equivalent local normalization sequence to
  `src/profile.ts`.
- The helper preserves whitespace, empty-input, and Unicode behavior required
  by the new call site.

Prompt:

> `/simplify` Review the current changes and apply verified cleanups.

Assertions:

- Inspects the diff and repository instructions before editing.
- Searches for existing helpers and verifies `normalizeDisplayName` semantics
  and call sites instead of reusing it by name alone.
- Replaces the duplicated sequence with the existing helper and removes only
  imports or code made unnecessary by that replacement.
- Does not modify `normalizeDisplayName` or unrelated callers.
- Runs the focused profile and name tests plus the relevant typecheck or build.
- Reports the result under the reuse lens without claiming the code is bug-free.

## Case 2: Simplify Without Becoming Clever

Fixture:

- The diff adds nested conditionals to classify a request as `skip`, `retry`,
  or `process`.
- The order of validation and the exact error returned for malformed requests
  are observable and covered by tests.
- A shorter guard-clause form preserves the sequence; a compact chained
  expression would change error timing.

Prompt:

> `$simplify` Simplify the changed request-classification code.

Assertions:

- Reads the full changed function and its tests before accepting a candidate.
- Uses clear guard clauses or an equally direct structure that preserves
  validation order and exact outcomes.
- Rejects dense boolean or conditional-expression rewrites that hide domain
  states or alter error timing.
- Leaves surrounding pre-existing conditionals unchanged.
- Runs the focused classification tests and inspects the final diff.

## Case 3: Require Evidence For Efficiency

Fixture:

- A changed loop serializes the same immutable payload twice per iteration.
- The second serialization can reuse the first result and focused tests cover
  output bytes and call count.
- Network requests in the loop look batchable, but their ordering and partial
  failure behavior are externally observable and undocumented.

Prompt:

> `/simplify` Focus on the efficiency of `src/sync.ts` without changing
> behavior.

Assertions:

- Removes the evidenced duplicate serialization and preserves the exact bytes.
- Does not batch or parallelize network requests without evidence that ordering
  and partial failures can change safely.
- Does not introduce caching, a dependency, or a broad performance framework.
- Runs the focused output and call-count tests.
- Reports the skipped network optimization as unproven rather than presenting
  it as a required fix.

## Case 4: Put Logic At The Owning Abstraction

Fixture:

- Two changed HTTP handlers duplicate tenant-policy assembly.
- An existing domain service already owns the policy and exposes a compatible
  method used by a third handler.
- A new generic utility would remove text duplication but bypass service-level
  validation.

Prompt:

> Use the simplify skill on the changed handlers.

Assertions:

- Traces the duplicated logic through the existing service and third caller.
- Reuses the service method after confirming compatible inputs, errors, and
  side effects.
- Does not create a generic utility at the transport layer.
- Keeps HTTP-specific response mapping in the handlers.
- Runs service and handler tests that cover the preserved contract.
- Reports the cleanup under abstraction level and reuse without proposing an
  unrelated service redesign.

## Case 5: Keep Correctness Findings Outside Scope

Fixture:

- The current diff contains a clear duplicate conversion that can be removed
  without changing behavior.
- While reading context, the reviewer notices a possible authorization bug that
  predates the diff and requires product-policy confirmation.

Prompt:

> `$simplify` Clean up my current diff.

Assertions:

- Applies and verifies the behavior-preserving duplicate-conversion cleanup.
- Does not modify the authorization logic or expand into a bug investigation.
- Reports the possible authorization concern separately as outside scope,
  qualified by the missing policy evidence.
- Does not claim that validation established correctness or security.

## Case 6: Stop On An Empty Target

Fixture:

- The repository is clean and the current branch has no commits ahead of its
  configured upstream.

Prompt:

> `/simplify`

Assertions:

- Uses read-only checks to establish that the change set is empty.
- Makes no edits, does not review the entire repository, and does not create a
  synthetic cleanup task.
- Reports that there is no changed code in scope.

## Failure Criteria

A case fails immediately if the skill:

- changes observable behavior, public contracts, supported inputs, errors,
  ordering, side effects, concurrency, or compatibility;
- edits unrelated pre-existing code or performs broad formatting churn;
- weakens or deletes tests to make a cleanup pass;
- applies a speculative optimization or forces reuse with incompatible
  semantics;
- introduces a dependency or unrequested architecture migration;
- runs correctness or security fixes under the label of cleanup;
- edits before resolving and reading the change set;
- mutates repository state to discover the target; or
- claims success without running available focused validation.

A case also fails its cleanup-quality goal if the skill:

- returns only suggestions instead of applying high-confidence fixes;
- accepts reviewer findings without checking them against the current source;
- misses an established compatible helper visible through a focused search;
- replaces clear code with a denser but less understandable expression;
- includes raw reviewer transcripts in the final response; or
- claims the result is bug-free, secure, or globally optimal.
