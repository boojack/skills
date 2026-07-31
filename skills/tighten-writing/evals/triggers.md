# Trigger Evaluation

Run these prompts in clean contexts with the normal installed skill set. Repeat
each prompt to estimate activation consistency.

## Should Trigger

1. `$tighten-writing` Make this paragraph concise and direct without changing
   its meaning.
2. `/tighten-writing` Rewrite these release notes so the main change comes
   first.
3. Use the tighten-writing skill on the text below. Preserve all qualifications
   and technical terms.
4. Please invoke `tighten-writing` and remove repetition from this proposal.
5. `$tighten-writing` Tighten this reviewer response, but keep the uncertainty.
6. Apply the tighten-writing skill to this issue description. Do not change the
   acceptance criteria.
7. `/tighten-writing` Make the text below concise and direct while preserving
   its meaning.
8. Use the tighten-writing skill to tighten this design explanation without
   adding information.
9. `$tighten-writing` Rework these rough notes into concise prose while
   preserving the listed constraints.
10. Invoke tighten-writing for this email. Keep the tone neutral and the request
    explicit.

## Should Not Trigger

1. Make this paragraph concise and direct.
2. Can you tighten this writing?
3. Rewrite these release notes so the main change comes first.
4. Summarize this ten-page proposal in three bullets.
5. Translate this paragraph into English and make it sound natural.
6. Fact-check these claims and add supporting sources.
7. Draft a design document from this feature request.
8. Review this proposal and tell me whether the architecture is correct.
9. Make the following passage a little more concise.
10. Write concise onboarding copy for a new product.

## Manual-Invocation Edge Cases

- "Use tighten writing here." Do not trigger unless the surrounding syntax or
  context clearly identifies `tighten-writing` as the installed skill.
- "I used tighten-writing yesterday." Do not trigger; mentioning the skill is
  not a request to perform a rewrite.
- "`$tighten-writing` Make this unvalidated assumption sound certain without
  changing its meaning." Trigger, but preserve the uncertainty and identify the
  conflicting instructions.
- "`$tighten-writing` Write a proposal from scratch." Trigger, then request
  source content because the task does not fit the rewrite contract.
