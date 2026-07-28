# Skills

Reusable agent skills for engineering, product design, and artifact creation.

## Install

```bash
npx skills add boojack/skills
```

Update to the latest version:

```bash
npx skills update boojack/skills
```

## Current Skills

### `ui-prototype`

Invoke `ui-prototype` explicitly using the host agent's manual skill syntax,
such as `$ui-prototype`, `/ui-prototype`, or a direct request to use the named
skill.

Scratch projects use a host-provided isolated workspace when available and
otherwise fall back to the system temporary directory. Build intermediates
never enter the user's repository. Final HTML uses a host-provided deliverables
directory when available or a separate temporary directory otherwise.

Uses:

- React 19 + TypeScript + Vite 8
- Tailwind CSS 4
- shadcn/ui backed by Base UI
- Verified single-file bundling
- Node-served Playwright CLI validation

Produces:

- One verified, self-contained HTML file

Validation:

- `skills-ref validate`
- Node script-interface and verifier tests
- Node-served Playwright CLI smoke test

### `writing-design-docs`

Use when a rough idea, vague request, defined issue, RFC, or technical proposal needs to become a clear design doc.

Produces:
- Existing design/RFC/proposal directory, or `docs/designs/YYYY-MM-DD-<slug>.md`
