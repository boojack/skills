# Task-Quality Evaluation

Run each case in a clean context with and without the skill. Grade meaning
preservation before writing quality. Reference rewrites show an acceptable
shape; do not require exact wording.

## Case 1: Remove Indirect Language

Prompt:

> `$tighten-writing` Rewrite this for a design review.
>
> We would like to propose a new commenting framework. Under this proposal, the
> frontend will send the selected statement revision and line range with every
> comment. These fields will allow the backend to resolve comments after the
> statement changes. It is important to note that the backend will need to
> store these additional values for every comment.

Reference rewrite:

> Proposal: The frontend will send the selected statement revision and line
> range with each comment. These fields will allow the backend to resolve
> comments after the statement changes. The backend will need to store the
> additional values for each comment.

Assertions:

- Leads with the proposed behavior.
- Names the frontend and backend actions directly.
- Preserves the revision, line-range, statement-change, and storage facts.
- Removes indirect phrases such as "we would like to" and "it is important to
  note."
- Preserves the proposal and future modality instead of presenting the behavior
  as current.
- Does not add a storage schema, remapping algorithm, performance claim, or
  other implementation detail.
- Returns only the rewritten content.

## Case 2: Preserve Claim Status

Prompt:

> `/tighten-writing` Rewrite this for a design review. Keep the status of each
> statement explicit.
>
> At the moment, the backend saves only `start_line` and `end_line`. We think a
> comment belongs to one statement revision, but we have not validated that
> yet. We want the frontend to send `revision_id` with new comments. This will
> add one stored identifier per comment. We still need to decide what happens
> to existing comments.

Reference rewrite:

> Current behavior: The backend stores only `start_line` and `end_line`.
>
> Assumption: A comment belongs to exactly one statement revision. This
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
- Uses labels because the prompt asks for explicit status distinctions.

## Case 3: Avoid Rewriting For Its Own Sake

Prompt:

> `$tighten-writing` Tighten this paragraph. It may already be concise.
>
> Clients created after 2026-07-01 must include `requiredRevisionId` when
> updating a change. Legacy clients may omit it. If the field is absent, the
> server does not infer a revision and returns `INVALID_ARGUMENT`. See
> [UpdateChange](https://example.com/update-change).

Assertions:

- An unchanged answer is acceptable.
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

## Case 5: Preserve Tone And Pragmatic Intent

Prompt:

> `/tighten-writing` Make this email concise and direct without making it
> abrupt.
>
> Hi Maya, I just wanted to reach out and see if you might possibly have some
> time to take a look at the attached budget proposal sometime before Friday.
> It would be really helpful because I need your approval before I can submit
> it, but please let me know if that timing is difficult.

Reference rewrite:

> Hi Maya, could you review the attached budget proposal before Friday? I need
> your approval before submitting it. Please let me know if that timing is
> difficult.

Assertions:

- Preserves the recipient, attachment, review request, before-Friday deadline,
  approval dependency, and option to challenge the timing.
- Keeps the request polite rather than turning it into a command.
- Removes hedging and throat-clearing that do not change the request.
- Does not imply that Maya has approved or will approve the proposal.
- Returns only the rewritten email.

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
  terminology without instruction.
- Changes the source language without instruction.

A case also fails its writing-quality goal if the output:

- Presents an unsupported evaluative claim as objective fact instead of
  preserving its status. It flags missing evidence only when the user requested
  review or fact-checking.
- Hides the conclusion after background when the source contains a clear
  conclusion.
- Uses passive or ambiguous phrasing when the source identifies the actor.
- Adds unnecessary headings, bullets, repetition, preamble, or process
  commentary.
- Becomes materially longer without preserving necessary nuance or exposing a
  source ambiguity.
- Rewrites already concise text without a concrete clarity improvement.

Pass only when there are no meaning-integrity failures and every case-specific
assertion holds.
