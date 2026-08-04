# Trigger Evaluation

Run these prompts in clean contexts with the normal installed skill set. Repeat
each prompt to estimate activation consistency.

## Should Trigger

1. `$simplify` Clean up the changes on this branch and apply the fixes.
2. `/simplify` Review `src/auth` for reuse, simplicity, and efficiency.
3. Use the simplify skill on my current diff.
4. Invoke `simplify` for PR 482 and preserve behavior.
5. `$simplify` Check whether this new parser uses the right abstraction.
6. Apply the simplify skill to the staged changes, then run focused tests.
7. `/simplify` Simplify `main...feature/cache` without hunting for bugs.
8. Use the simplify skill to remove duplicated work from the files I changed.
9. `$simplify` Review this patch through all four cleanup lenses.
10. Invoke the simplify skill on `packages/api/src/routes.ts`.

## Should Not Trigger

1. Simplify the code I just changed.
2. Refactor this module to use the strategy pattern.
3. Review this pull request for correctness bugs.
4. Run a security audit on the authentication changes.
5. Format and lint the files in `src/`.
6. Make this SQL query faster.
7. Explain why this function is difficult to understand.
8. Fix the failing tests on my branch.
9. Reduce the bundle size by 20 percent.
10. Find dead code throughout the repository.

## Manual-Invocation Edge Cases

- "Can you simplify code?" Do not trigger; this is an ordinary cleanup request,
  not an explicit invocation of the installed skill.
- "Claude Code has a simplify command." Do not trigger; mentioning a related
  command is not a request to run this skill.
- "Use simplify here." Do not trigger unless the surrounding syntax or context
  clearly identifies `simplify` as the installed skill.
- "`$simplify` Fix every bug in this pull request." Trigger, then explain
  that bug hunting is outside the cleanup-only contract and do not reframe the
  request as cleanup.
- "`/simplify` Rewrite the entire service into a new architecture."
  Trigger, then keep the work to behavior-preserving cleanup or stop if no such
  target exists.
