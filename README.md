# Skills

Reusable agent skills for defining, planning, and executing engineering work.

## Install

```bash
npx skills add boojack/skills
```

Update to the latest version:

```bash
npx skills update boojack/skills
```

## Current Skills

### `defining-issues`

Use when a vague request needs to become a grounded issue definition before implementation.

Produces:
- `docs/plans/YYYY-MM-DD-<slug>/definition.md`
- `docs/plans/YYYY-MM-DD-<slug>/design.md` for L-scope tasks

### `executing-tasks`

Use when a defined issue is ready to be planned and implemented.

Uses:
- `definition.md`
- `design.md` for L-scope tasks

Produces:
- `docs/plans/YYYY-MM-DD-<slug>/plan.md`
- `docs/plans/YYYY-MM-DD-<slug>/execution.md`
