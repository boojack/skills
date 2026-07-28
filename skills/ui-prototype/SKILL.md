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
  Requires Bash with mktemp, Node.js ^20.19 or >=22.12, npm/npx, network access
  during project initialization or component installation, and a modern
  browser for validation. Existing projects must use React, Vite, Tailwind CSS
  4, and shadcn/ui configured with Base UI.
metadata:
  owner: "boojack"
  version: "1.0.0"
  last-reviewed: "2026-07-28"
  evaluation: "manual-trigger-structural-tests-and-browser-smoke-pass"
---

# UI Prototype

Turn a UI/UX idea into a focused interactive prototype that makes its
structure, states, and behavior tangible, then deliver it as one portable
HTML file with no sibling-file or hosted-asset dependency.

## Contract

| Item | Requirement |
| --- | --- |
| Activation | The user explicitly invokes or names ui-prototype through the host agent's manual skill mechanism |
| Inputs | A UI/UX idea, product flow, interaction concept, design brief, or compatible existing project |
| Purpose | Make an interface decision, workflow, or interaction model visible and testable |
| Workspace | Host-provided isolated session workspace when available; otherwise a task-specific system temporary directory |
| UI stack | Tailwind CSS 4 and shadcn/ui components backed by Base UI |
| Output | Exactly one verified HTML in the host's deliverables directory when available; otherwise a separate temporary delivery directory |
| Static resources | JavaScript, CSS, fonts, icons, and imported media embedded in the HTML |
| External data | Allowed only when the user explicitly accepts a runtime network dependency |

Non-negotiable invariants:

```
MAKE THE SPECIFIC UI/UX IDEA VISIBLE THROUGH REALISTIC STATES AND INTERACTIONS.
KEEP SCRATCH FILES, BUILD OUTPUTS, AND DEFAULT DELIVERABLES OUTSIDE THE REPOSITORY.
USE SHADCN COMPONENTS BACKED BY BASE UI.
USE TAILWIND UTILITIES AND GENERATED DESIGN TOKENS.
DO NOT HAND-ROLL UI PRIMITIVES OR RAW CSS.
DO NOT DELIVER UNTIL BUILD AND BROWSER VERIFICATION PASS.
```

## Workflow

| Phase | Gate |
| --- | --- |
| Frame | Explicit invocation is confirmed and the prototype question is clear. |
| Prepare | The project uses the required stack and single-file overlay. |
| Compose | The idea is observable through realistic UI, states, and interactions built from the required design system. |
| Package | The mechanical verifier accepts exactly one HTML file. |
| Exercise | Playwright shows correct behavior, zero console errors, and no extra static requests. |
| Deliver | The user receives the verified HTML through the host's handoff mechanism with relevant runtime caveats. |

### 1. Confirm Invocation And Frame The Idea

Proceed only when the user explicitly invokes or names `ui-prototype` using
the host agent's manual skill mechanism. Valid forms may include
`$ui-prototype`, `/ui-prototype`, or a direct request to use the named skill.
Do not infer activation from an ordinary request to design, visualize,
prototype, or build frontend UI.

Frame the work before implementation:

- Identify the product or design question the prototype should make concrete.
- Identify the audience, scenario, primary path, and most important state
  changes.
- Preserve supplied product terminology and use realistic interface content.
- Choose one coherent direction unless the user asks to compare alternatives.
- Treat the result as a decision and communication artifact, not production
  architecture.

The result must fit one client-side entry point. Choose another delivery model
if it requires multiple pages, SSR, server-only secrets, History API fallback
routing, cookies, service workers, worklets, or required assets too large to
embed safely.

Run a script's `--help` before its first use.

### 2. Prepare The Project

Resolve the writable workspace in this order:

1. Use the host agent's documented isolated session or artifact workspace when
   it is available and outside the user's repository.
2. Otherwise create a task-specific system temporary workspace:

```bash
PROTOTYPE_TEMP_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/ui-prototype.XXXXXX")"
PROTOTYPE_PROJECT="$PROTOTYPE_TEMP_ROOT/app"
bash scripts/init-project.sh "$PROTOTYPE_PROJECT" [preset]
```

Do not guess or hardcode a vendor-specific cache path. Do not initialize,
configure, install dependencies, or build inside the user's repository or
ordinary working directory.

The default preset is `nova`. Supported official presets are `nova`, `vega`,
`maia`, `lyra`, `mira`, `luma`, `sera`, and `rhea`. The script rejects targets
inside a Git worktree unless `--allow-repo` is explicitly passed; this skill
must not pass that option without a direct user request to retain source files.

Treat an existing repository as reference input. Inspect its UI and product
behavior, then reproduce only the prototype-relevant surface in the temporary
project. If direct adaptation is necessary, work on a temporary copy that
excludes `.git`, `node_modules`, and generated output; never run
`configure-project.sh` against the source repository.

For a compatible temporary copy:

```bash
bash scripts/configure-project.sh "$PROTOTYPE_PROJECT"
```

Preview stateful changes with `--dry-run`. Do not pass `--force` until an
existing `vite.singlefile.config.ts` has been inspected and replacement is
intentional.

### 3. Inspect And Extend The Design System

Run shadcn commands from the project root:

```bash
npx shadcn@4.16.0 info
npx shadcn@4.16.0 docs <component>
npx shadcn@4.16.0 add <component...> --yes
```

- Search shadcn before creating reusable UI.
- Prefer installed shadcn components, blocks, and documented compositions.
- Use direct Base UI primitives only when shadcn has no suitable component.
- Never paste a remembered implementation of Button, Card, Dialog, Form,
  navigation, feedback, overlay, or other UI primitives.
- Let the CLI generate code matching the project's Base UI preset.

### 4. Compose The Application

- Make the primary workflow immediately understandable from the initial state.
- Implement the interactions and state transitions needed to communicate the
  idea; avoid unrelated product surface.
- Include the important loading, empty, error, blocked, selected, or completed
  states when they affect the idea being explored.
- Prefer realistic labels and data over generic placeholder copy.
- Compose layout with Tailwind utilities.
- Use semantic tokens such as `bg-background`, `text-foreground`,
  `border-border`, and `text-muted-foreground`.
- Use component variants and the configured Lucide icons.
- Keep generated components and theme variables as the source of truth.
- Do not add raw CSS files, CSS-in-JS, inline style objects, or another design
  system. Change generated theme tokens only when product requirements demand
  it.
- Use hash-based or in-memory navigation. A locally opened HTML file has no
  server fallback for History API routes.

### 5. Make Resources Embeddable

- Import static resources through source modules so Vite can inline them.
- Do not put required resources in `public/`; the single-file overlay disables
  `publicDir`.
- Import SVGs or inline their markup. Do not reference sibling SVG sprites.
- Keep remote API calls explicit and separate from static-resource loading.
- Confirm expected output size before embedding large media.

### 6. Build And Mechanically Verify

```bash
bash scripts/build-single-html.sh "$PROTOTYPE_PROJECT" [output.html]
```

The command typechecks when available, builds into a task-specific system
temporary directory, requires that directory to contain only `index.html`,
rejects external runtime resource references in HTML/CSS, and writes the
verified HTML to a separate temporary delivery directory by default. Pass the
host's documented deliverables path as `output.html` when such a directory is
available. The command prints the absolute delivery path.

If it fails, fix the cause and rerun the same command. Do not bypass the
verifier or copy files beside the HTML. Never substitute a project-local
`.single-html/`, `dist/`, or `bundle.html` path for the temporary defaults.

### 7. Serve And Exercise With Playwright

Playwright CLI blocks direct `file://` navigation. Serve only the verified HTML
through the bundled Node test server:

```bash
node scripts/serve-single-html.mjs <output.html> 4173
```

Use Playwright CLI through the host's available command or wrapper:

```bash
playwright-cli -s=single-html open http://127.0.0.1:4173/
playwright-cli -s=single-html snapshot
playwright-cli -s=single-html console warning
playwright-cli -s=single-html requests --static
```

Exercise critical interactions using refs from the latest snapshot. Repeat the
console and request checks after meaningful state changes.

Pass criteria:

- Required content and interactions work.
- Console contains zero errors.
- The static request list contains only the served HTML.
- Fonts, icons, and media render without additional requests.
- Reloading preserves expected behavior.

Stop the Node server after validation. It is a test harness, not part of the
deliverable.

### 8. Deliver

State which UI/UX idea or flow the prototype makes tangible. Prefer the host
agent's native file or artifact handoff mechanism. Also return the absolute
path when the host exposes filesystem paths, report the file size, and disclose
any intentional runtime API dependency or browser limitation. Do not include
source code, a local server, or sibling resources as required deliverables.
Copy the HTML to another persistent destination only when the user explicitly
requests one.

## Failure Recovery

| Failure | Recovery |
| --- | --- |
| Prototype question is unclear | Reduce it to the interface decision, primary path, and state change the user needs to see. |
| Project configuration is rejected | Use a clean shadcn Base UI Vite project or migrate outside this skill first. |
| A generated path appears in `git status` | Stop, remove only the generated artifact, recreate the workspace in the host's isolated workspace or system temporary fallback, and rerun. |
| Build produces extra files | Import the resource from `src/`; remove `public/` or runtime path references. |
| Verifier finds an external reference | Replace it with an imported asset, data URL, or explicit accepted API call. |
| Browser makes another static request | Inspect `requests --static`, fix the source reference, rebuild, and retry. |
| Console or interaction check fails | Fix the application, then repeat package and browser verification. |

## Red Flags

Stop and correct course if you are about to:

- produce a generic component showcase instead of visualizing the supplied
  idea;
- turn a disposable prototype into unrequested production architecture;
- create a project, install dependencies, or emit build output inside the
  user's repository or ordinary working directory;
- hand-write a primitive already available from shadcn;
- add a raw stylesheet to avoid using Tailwind or theme tokens;
- place a required resource in `public/`;
- switch back to Parcel plus `html-inline`;
- ignore verifier output or a console error;
- claim "self-contained" while the browser loads another static resource; or
- ship the Node server as part of the output.

## Resources

These scripts implement the fragile, deterministic parts of the workflow.
Execute them; do not reproduce their logic manually.

- `scripts/init-project.sh`: scaffold a new pinned shadcn Base UI Vite project.
- `scripts/configure-project.sh`: add or refresh the single-file build overlay.
- `scripts/build-single-html.sh`: typecheck, build, verify, and copy the output.
- `scripts/serve-single-html.mjs`: serve only the verified HTML for browser QA.
- `scripts/verify-single-html.mjs`: validate the one-file invariant and resource references.

For maintenance, run `node --test tests/*.test.mjs`. Use
`evals/triggers.md` when changing the description and `evals/tasks.md` when
changing the workflow or scripts.
