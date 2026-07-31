---
name: tighten-writing
description: >
  Manually invoked rewriting capability for making supplied prose or notes
  concise, direct, and precise without changing their meaning or claim status.
  Use only when the user explicitly invokes the skill. It rewrites supplied
  content; do not activate it for ordinary requests whose only task is
  rewriting, summarization, translation, fact-checking, or writing from
  scratch.
metadata:
  owner: "boojack"
  version: "1.0.0"
  last-reviewed: "2026-07-31"
  evaluation: "trigger-and-task-evals-defined"
---

# Tighten Writing

Rewrite the supplied content so each sentence carries necessary information
and the main point is easy to find.

Proceed only after an explicit `$tighten-writing`, `/tighten-writing`, or
request to use the named skill for rewriting.

## Contract

- Work from supplied prose, notes, or a clearly identified passage. Do not
  create missing substance.
- Preserve the source language unless the user requests another language.
- Preserve meaning, claim status, scope, terminology, and required tone.
- Edit the smallest requested scope. Do not rewrite surrounding content merely
  for stylistic consistency.
- Return only the rewritten content by default. Explain edits, compare
  versions, or show unresolved questions only when requested or when an
  ambiguity would otherwise change the meaning.

## Rewrite

1. Identify the passage's main point, audience, claims, constraints, and fixed
   terminology.
2. Internally distinguish current behavior, facts, assumptions, proposals,
   trade-offs, and open questions. Do not turn one category into another.
3. Put the main conclusion, decision, or action before supporting detail when
   the source allows it.
4. Name the actor and action when known. Prefer direct verbs and concrete
   subjects over nominalizations, passive constructions, and vague references.
5. Remove throat-clearing, repetition, empty transitions, empty intensifiers,
   and phrases that merely announce importance.
6. Use one term for one concept. Preserve domain terms instead of replacing
   them with stylistic synonyms.
7. Describe observable behavior, conditions, or outcomes. Replace vague praise
   only when the source provides the facts needed to do so. Otherwise keep the
   claim qualified; do not silently delete it. Flag missing support only when
   the user also requests review or fact-checking.
8. Keep costs, limitations, uncertainty, exceptions, and counterarguments that
   affect the conclusion.
9. Preserve the useful structure of headings, lists, tables, links, and code.
   Reformat only when it makes the requested passage materially easier to read.

## Fidelity Gates

Before returning the rewrite, verify all of the following:

- Every factual statement is supported by the supplied source or context.
- Numbers, names, dates, links, code, identifiers, and quoted material remain
  accurate.
- Negation, sequence, causality, ownership, and conditions have not changed.
- Modality is preserved: `must`, `should`, `may`, `can`, `will`, `does`, and
  `is expected to` are not interchangeable.
- A prediction, preference, or assumption has not become a fact.
- Concision has not removed a claim, requirement, trade-off, limitation, or
  qualification.
- The opening sentence communicates the passage's purpose when the source
  supports a clear lead.
- No sentence repeats a point without adding information.

If a precise rewrite requires information the source does not contain, do not
guess. Keep the statement appropriately qualified. When the ambiguity
materially affects the result, add a short `Needs clarification:` note after
the rewrite unless the user requested output-only text.

Rewriting does not validate external facts. If the user also requests
fact-checking, treat that as a separate task and use appropriate sources before
tightening the verified content.

## Examples

Input:

> The server will process a lower number of requests after this change is
> applied.

Output:

> The server will process fewer requests after this change.

The rewrite removes filler while preserving the prediction.

Input:

> The approach has several trade-offs. One of them is that the client will need
> to store the revision ID, which means that there will be some additional state
> to manage.

Output:

> The approach has several trade-offs. One is that the client will need to
> store the revision ID and manage additional state.

The rewrite preserves the plurality, modality, actor, and cost.

## Maintenance

Update `evals/triggers.md` when activation behavior changes. Update
`evals/tasks.md` when the rewrite contract or quality rubric changes. Evaluate
subjective quality with source-to-output comparison; structural validation
alone cannot prove semantic fidelity.
