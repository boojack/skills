---
name: ui-prototype
description: >
  Manually invoked capability for turning a UI/UX idea, product flow,
  interaction model, or interface concept into a polished interactive
  prototype delivered as one verified, self-contained HTML file. Use only when
  the user explicitly invokes or names the ui-prototype skill through the host
  agent's manual skill mechanism. Never activate automatically for ordinary
  design, frontend, visualization, prototyping, or single-HTML requests.
compatibility: >
  Requires Bash, Node.js ^20.19 or >=22.12, npm/npx, network access during
  project initialization or component installation, and a modern browser.
metadata:
  owner: "boojack"
  version: "1.2.0"
  last-reviewed: "2026-07-28"
  evaluation: "manual-trigger-structural-tests-browser-layout-and-interaction-pass"
---

# UI Prototype

Build the smallest polished prototype that makes the supplied UI decision
visible and testable, then deliver one verified, self-contained HTML file.

Proceed only after an explicit `$ui-prototype`, `/ui-prototype`, or direct
request to use the named skill.

## Outcome

- Work in the host artifact workspace or a task-specific temporary directory,
  never in the user's repository.
- Use React, Tailwind CSS 4, and shadcn/ui backed by Base UI.
- Focus on the changed product surface; do not recreate unrelated application
  chrome.
- Ship one coherent visual theme with embedded scripts, styles, fonts, icons,
  and media.
- Deliver exactly one HTML after typecheck, single-file verification, and one
  bounded real-browser pass.

## Scope First

Choose the mode before implementation:

### Focused mode

Use one realistic stage for one proposed direction. Include only the product
context required to understand where the change lives.

### Comparison mode

Use one shared baseline and keep every approach's design guide visible; do not
hide the decision evidence behind tabs. Each guide needs a concise name,
hypothesis, use-when statement, benefit, cost, and failure risk. Mark a
recommendation when the evidence supports one.

Prefer one shared interactive stage over repeating a large interface. Fully
implement the recommended path; alternatives need only the state transitions
that distinguish them.

For either mode:

- Implement only interactions that communicate the decision. Skip generic
  editing, persistence, reset, navigation, and edge cases unless they change
  the recommendation or the user requests them.
- Preserve supplied terminology and realistic data.
- Identify the primary path, one most demanding state, and the critical
  surfaces before coding.
- Mark each critical panel, dialog, sheet, editor, or comparison surface with
  `data-critical-surface="<name>"`. Mark intentional scrolling with
  `data-allow-overflow`.

## Visual System

Treat theme as context, not a feature. Follow a supplied product's light, dark,
or brand scheme. Without a reference, use the starter default. Do not add a
theme switch, theme comparison, or system-theme synchronization unless the user
explicitly requests it.

Inherit the supplied palette, typography, density, spacing, radii, borders,
elevation, and control proportions. Without those signals, use neutral tokens,
Geist, and at most one intentional accent.

Keep the layout task-aligned and appropriately compact. Do not default to
purple accents, decorative gradients, Inter, centered marketing composition,
uniform large radii, or a wall of Cards. Prefer typography, spacing, background
layers, borders, and dividers before containers and shadows. Reserve fully
rounded pills for compact statuses, tags, or filters. Use semantic theme
tokens and Lucide icons; make interaction states understandable without color
alone.

In comparison mode, keep type scale, spacing, dimensions, and visual weight
consistent so styling does not bias the decision.

## Build

Run each bundled script's `--help` before its first use.

Initialize the fast starter outside the repository:

```bash
PROTOTYPE_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/ui-prototype.XXXXXX")"
bash scripts/init-project.sh "$PROTOTYPE_ROOT/app" nova
```

The bundled `nova` starter is the default. Use `--fresh` only when maintaining
the starter; use another preset only when its visual language matters.

Treat an existing project as reference input. If direct adaptation is
necessary, copy it outside the repository without `.git`, `node_modules`, or
generated output, then run `scripts/configure-project.sh` on that copy. Preview
with `--dry-run`; use `--force` only after inspecting an existing overlay.
Never configure the source repository.

Before installing components, inspect `src/components/ui`. Add all missing
shadcn components in one command and do not include already-installed
components:

```bash
npx shadcn@4.16.0 add <missing-components...> --yes
```

Use generated shadcn components, Tailwind utilities, semantic tokens, and
imported source assets. Do not hand-roll available primitives, add raw
stylesheets, or place required assets in `public/`. Use in-memory or hash
navigation. Add runtime network calls only when the user accepts that
dependency.

Build after the source is composed:

```bash
bash scripts/build-single-html.sh "$PROTOTYPE_ROOT/app" [output.html]
```

The first build must typecheck. After that pass, a layout-only packaging retry
may use `--skip-typecheck`. The script builds outside the project, verifies
that only `index.html` exists, rejects external static resources, and copies
the verified HTML to the requested output or a temporary delivery directory.
Do not reproduce this logic manually.

## One Browser Pass

Test the verified HTML, not both the development server and the final bundle:

```bash
node scripts/serve-single-html.mjs <output.html> 4173
```

Default QA budget:

1. At `1440x900`, take one snapshot and exercise the primary path plus at most
   one decision-defining alternative or destructive state.
2. Capture the most demanding state at `1440x900` and `390x844`, and inspect
   both screenshots visually.
3. In one consolidated geometry check, use `getBoundingClientRect()`,
   `scrollWidth`, and `scrollHeight` for every `data-critical-surface`.
4. Check console warnings/errors and `requests --static`.

Do not exhaustively click every approach or repeat the complete suite after
each edit. Add checks only for user-requested behavior or a failure that
reveals a specific risk.

Required pass conditions:

- The primary interaction works and comparison guides remain directly
  comparable against the shared baseline.
- Critical overlays and required actions are complete, legible, and inside the
  viewport. Long document sections may use normal vertical page scrolling.
- No horizontal overflow or clipped descendants exist unless their nearest
  region is marked `data-allow-overflow`.
- Focused mode does not recreate unrelated application chrome.
- Console has zero errors and the static request list contains only the HTML.

If QA fails, inspect all visible issues, correct them in one edit, rebuild, and
rerun only the failed interaction or geometry check plus the final
console/request checks. Stop the server after verification.

## Deliver

Return the HTML through the host's artifact or file handoff mechanism. State
what decision it demonstrates, its absolute path and file size when available,
the verified viewports, and any intentional runtime network dependency.
Deliver no source tree, server, or sibling resource.

## Resources

- `templates/base-nova/`: pinned neutral shadcn Base UI starter.
- `scripts/init-project.sh`: fast starter copy or explicit fresh scaffold.
- `scripts/configure-project.sh`: single-file overlay for a compatible
  temporary project copy.
- `scripts/build-single-html.sh`: typecheck, bundle, verify, and deliver.
- `scripts/serve-single-html.mjs`: single-artifact browser test server.
- `scripts/verify-single-html.mjs`: one-file and static-resource verifier.

For maintenance, run `node --test tests/*.test.mjs`. Update
`evals/triggers.md` when activation changes and `evals/tasks.md` when workflow
or quality behavior changes.
