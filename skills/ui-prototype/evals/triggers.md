# Trigger Evaluation

Run these prompts in clean contexts with the normal installed skill set. Repeat
each prompt to estimate activation consistency.

## Should Trigger

1. `$ui-prototype` Visualize this approval flow with its blocked and approved
   states.
2. `/ui-prototype` Make this navigation idea interactive.
3. Use the ui-prototype skill to turn these rough settings-page notes into
   something I can click through.
4. `$ui-prototype` Turn these rough settings-page notes into something I can
   click through.
5. Please use `ui-prototype` to compare how the empty and populated dashboard
   states feel.
6. Invoke ui-prototype for this mobile onboarding concept.
7. `/ui-prototype` Make the proposed permission model visible through a
   realistic admin interface.
8. Use the ui-prototype skill and show how this multi-step form handles
   validation and recovery.
9. `/ui-prototype` Turn this approval-flow UI/UX idea into an interactive
   prototype.
10. Use the ui-prototype skill to visualize navigation between this list and
    detail page.

## Should Not Trigger

1. Visualize this approval flow with its blocked and approved states.
2. Turn these rough settings-page notes into something I can click through.
3. Build an interactive mortgage calculator and give me one HTML file.
4. Create a portable dashboard with filters and dialogs.
5. Make an interactive product demo using Tailwind and shadcn Base UI.
6. Adapt this Vite project so it builds to one standalone HTML.
7. Turn this UI/UX idea into an interactive prototype.
8. Create a hosted landing page and publish it.
9. Review my React components for accessibility.
10. Write a simple static HTML email template.

## Manual-Invocation Edge Cases

- "Create a UI prototype." Do not trigger; this is an ordinary request, not an
  explicit skill invocation.
- "Use UI prototype for this." Do not trigger unless surrounding syntax or
  context clearly identifies `ui-prototype` as the installed skill.
- "`/ui-prototype` Build a production-ready application." Trigger, then keep the
  work scoped to a prototype and explain that production delivery needs another
  workflow.
- "`$ui-prototype` Make a static poster." Trigger, then stop because the task
  does not fit the interactive-prototype contract.
