# Task-Quality Evaluation

Run each case in a clean context with and without the skill. Grade semantic
fidelity first, then information hierarchy, relationship clarity, claim-status
clarity, and economy. A shorter output is not inherently better. Reference
rewrites show an acceptable shape; do not require exact wording.

## Case 1: Recover A Buried Proposal

Prompt:

> `$tighten-writing` Rewrite this for a design review.
>
> Plan and Rollout already own lifecycle status. The Release page also needs to
> show that status. One option is to copy it into Release, but that would create
> another source of truth.
>
> The approach we want is to keep Plan and Rollout as the owners and have the
> Release page query the linked Plan. This requires a Release-to-Plan lookup and
> defined behavior when a Release has no Plan. We have not decided whether that
> state should hide the Release or show a recovery action.

Reference rewrite:

> Proposal: Keep lifecycle status owned by Plan and Rollout. The Release page
> will query the linked Plan instead of copying status into Release.
>
> Rationale: Copying lifecycle status into Release would create another source
> of truth.
>
> Requirement: Support a Release-to-Plan lookup and define the state where a
> Release has no Plan.
>
> Open question: Should a Release without a Plan be hidden or show a recovery
> action?

Assertions:

- Leads with the proposal instead of preserving the source chronology.
- Keeps Plan and Rollout ownership, the Release-page query, and the rejection
  of copied status connected to the correct claims.
- Preserves the lookup requirement and zero-Plan state.
- Keeps the hide-versus-recovery behavior unresolved.
- Does not invent cardinality, storage, API, migration, or UI behavior.
- Returns only the rewritten content.

## Case 2: Separate Mixed Claim Status

Prompt:

> `/tighten-writing` Rewrite this for a design review.
>
> At the moment, the backend saves only `start_line` and `end_line`. We think a
> comment belongs to one statement revision, but we have not validated that
> yet. We want the frontend to send `revision_id` with new comments. This will
> add one stored identifier per comment. We still need to decide what happens
> to existing comments.

Reference rewrite:

> Current behavior: The backend stores only `start_line` and `end_line`.
>
> Assumption: A comment belongs to one statement revision. This
> assumption is not yet validated.
>
> Proposal: We want the frontend to send `revision_id` with each new comment.
>
> Trade-off: This will add one stored identifier per comment.
>
> Open question: How should the system handle existing comments?

Assertions:

- Keeps current behavior, assumption, proposal, trade-off, and open question
  distinct.
- Does not present the one-revision assumption as validated.
- Does not claim that existing comments will be migrated, rejected, or
  inferred.
- Preserves all three identifiers exactly.
- Makes the status distinctions visible without requiring the prompt to name
  them.

## Case 3: Reorder An Already Concise Rule

Prompt:

> `$tighten-writing` Tighten this paragraph.
>
> If the field is absent, the server does not infer a revision and returns
> `INVALID_ARGUMENT`. Legacy clients may omit it. Clients created after
> 2026-07-01 must include `requiredRevisionId` when updating a change. See
> [UpdateChange](https://example.com/update-change).

Reference rewrite:

> Clients created after 2026-07-01 must include `requiredRevisionId` when
> updating a change. Legacy clients may omit it. If the field is absent, the
> server does not infer a revision and returns `INVALID_ARGUMENT`. See
> [UpdateChange](https://example.com/update-change).

Assertions:

- Leads with the new-client requirement, then states the legacy exception and
  missing-field behavior.
- Preserves `must`, `may`, and `does not`; it does not weaken or strengthen
  modality.
- Preserves the date, identifiers, error code, link text, and URL exactly.
- Does not merge the new-client requirement with the legacy-client exception.
- Adds no heading, explanation, implementation detail, or process commentary.

## Case 4: Expose Rather Than Resolve A Conflict

Prompt:

> `$tighten-writing` Rewrite this concisely and directly without making the
> decision for me.
>
> We plan to change the cache refresh interval to 5 minutes. However, the
> rollout section below still says that the cache refreshes every 10 minutes.
> I am not sure which interval is the final decision.

Reference rewrite:

> Proposal: Change the cache refresh interval to 5 minutes.
>
> Conflict: The rollout section still specifies a 10-minute interval.
>
> Open question: Which interval is the final decision?

Assertions:

- Keeps the response in English.
- Preserves both 5 minutes and 10 minutes.
- Keeps 5 minutes as a proposal rather than a confirmed decision.
- Exposes the conflict and open question instead of selecting a value.
- Adds no rationale for either interval.

## Case 5: Lead With The Request

Prompt:

> `/tighten-writing` Make this email concise and direct without making it
> abrupt.
>
> Hi Maya, the finance team closes submissions on Friday. I cannot submit the
> attached budget proposal without your approval. I wanted to ask whether you
> might have time to review it before then, but please let me know if that timing
> is difficult.

Reference rewrite:

> Hi Maya, could you review the attached budget proposal before Friday? I need
> your approval before the finance team closes submissions. Please let me know
> if that timing is difficult.

Assertions:

- Preserves the recipient, attachment, review request, Friday finance-team
  deadline, approval dependency, and option to challenge the timing.
- Moves the request ahead of its background and keeps the rationale attached.
- Keeps the request polite rather than turning it into a command.
- Removes hedging and throat-clearing that do not change the request.
- Does not imply that Maya has approved or will approve the proposal.
- Returns only the rewritten email.

## Case 6: Redact Credential Values

Prompt:

> `$tighten-writing` Make this deployment note concise without changing the
> command.
>
> Before Friday, configure the deployment by running
> `export API_TOKEN="example-sensitive-token-do-not-use"` and then start the
> release. The same token, `example-sensitive-token-do-not-use`, is also in the
> rollback note.

Reference rewrite:

> Before Friday, run `export API_TOKEN="[REDACTED_API_TOKEN]"`, then start the
> release. The rollback note contains the same `[REDACTED_API_TOKEN]`.
>
> Redacted suspected credentials from the supplied text.

Assertions:

- Does not reproduce the supplied token or any fragment that distinguishes it.
- Preserves `API_TOKEN`, the shell syntax, the before-Friday deadline, the
  release action, and the rollback-note fact.
- Uses the same descriptive placeholder for both occurrences.
- Includes the required redaction notice.
- Does not claim that the example token is valid or attempt to validate it.

## Case 7: Leave Strong Structure Alone

Prompt:

> `$tighten-writing` Tighten this passage only where clarity improves.
>
> Proposal: Store the statement revision ID with each comment so the backend can
> resolve it against the original source after the statement changes.
>
> Trade-off: Each comment stores one additional identifier.
>
> Open question: How should the system handle existing comments?

Assertions:

- An unchanged answer is acceptable.
- Does not merge the proposal, trade-off, and open question merely to reduce
  line count.
- Preserves the causal relationship between the revision ID and original-source
  resolution.
- Adds no headings, rationale, implementation detail, or process commentary.

## Failure Criteria

A case fails immediately if the output:

- Invents a fact, reason, outcome, metric, implementation detail, exception, or
  decision not supported by the source.
- Changes an actor, action, object, sequence, condition, polarity, quantifier,
  date, number, or modality such as `must`, `should`, `may`, or `can`.
- Removes a material claim or changes its stated magnitude.
- Converts current behavior, an assumption, a proposal, or an open question
  into a different claim status.
- Removes a material constraint, trade-off, risk, exception, or unresolved
  question.
- Silently resolves ambiguity or contradiction.
- Changes technical identifiers, code spans, links, quoted text, or established
  terminology unless the credential-redaction rule requires changing a
  suspected secret value.
- Reproduces, transforms, validates, or partially reveals a suspected
  credential from the supplied text.
- Changes the source language without instruction.

A case also fails its writing-quality goal if the output:

- Presents an unsupported evaluative claim as objective fact instead of
  preserving its status. It flags missing evidence only when the user requested
  review or fact-checking.
- Preserves source order when it leaves a supported conclusion, decision,
  action, request, or proposal buried behind background.
- Leaves a reason, piece of evidence, constraint, consequence, or exception
  detached from the claim it modifies.
- Performs only sentence-level substitutions when paragraph or section
  relationships materially obstruct understanding.
- Uses passive or ambiguous phrasing when the source identifies the actor.
- Adds headings, labels, bullets, repetition, preamble, or process commentary
  that do not improve hierarchy or relationship clarity.
- Makes the output shorter at the cost of hierarchy, claim status, rationale,
  a constraint, or pragmatic intent.
- Makes the output longer without exposing a necessary relationship,
  distinction, constraint, or ambiguity.
- Rewrites already concise text without a concrete clarity improvement.

Pass only when there are no meaning-integrity failures, every case-specific
assertion holds, and the rewrite materially improves hierarchy, relationship
clarity, claim-status clarity, or economy unless the source is already strong.
