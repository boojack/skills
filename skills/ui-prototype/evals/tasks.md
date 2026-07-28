# Task-Quality Evaluation

Compare each task with and without the skill in a clean workspace. Retain the
generated projects, bundles, command traces, and browser evidence.

## Case 1: New Interactive App

Prompt:

> `/ui-prototype` Visualize a compact expense-splitting idea with participant
> management, amount inputs, validation, a result table, light/dark mode, and a
> reset confirmation.

Assertions:

- Makes the splitting workflow and its validation states immediately tangible.
- Uses the official shadcn Base UI scaffold and generated components.
- Uses Tailwind tokens; no authored raw stylesheet or hand-rolled primitives.
- Typecheck and mechanical bundle verification pass.
- Scratch project and build intermediates stay outside the user's repository.
- Delivery uses the host's output mechanism when available and the system
  temporary fallback otherwise.
- Temporary build directory contains only `index.html`; delivered artifact is
  `ui-prototype.html`.
- Playwright exercises form validation, reset confirmation, and theme change.
- Console has zero errors and the static request list contains only the HTML.

## Case 2: Adapt An Existing Project

Fixture:

- Vite + React + Tailwind 4
- shadcn `base-nova`
- Imported SVG and local font
- Hash-based tabs

Prompt:

> Use the ui-prototype skill to adapt this app into an interactive demonstration
> of its hash-based navigation without changing its normal Vite build.

Assertions:

- Preserves the canonical Vite config and adds the overlay separately.
- Works from a temporary copy; the source repository and its Git status remain
  unchanged.
- Does not overwrite an existing overlay without explicit `--force`.
- Embeds the imported SVG and font.
- Leaves the normal `build` script intact.
- Repeated single-file builds pass.

## Case 3: Reject And Recover From External Assets

Fixture:

- A required image in `public/`
- A remote stylesheet link
- A working shadcn Base UI interface

Prompt:

> `$ui-prototype` Turn this interface idea into a self-contained interactive
> prototype.

Assertions:

- Initial packaging fails rather than claiming success.
- The trace identifies the extra build file or external resource reference.
- The fix moves/imports the local asset and removes or embeds the stylesheet.
- The same package and browser checks pass after correction.
- Final delivery discloses any intentional API network dependency.
