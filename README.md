# Hijack

Curated skill collection providing a four-stage engineering pipeline and Linear sync.

## Install

```bash
npx skills add boojack/skills
```

<details>
<summary>Claude Code</summary>

```bash
# Add marketplace
/plugin marketplace add boojack/skills

# Install plugin
/plugin install hijack@hijack
```

</details>

<details>
<summary>Gemini CLI</summary>

```bash
gemini extensions install boojack/skills
```

</details>

## Skills

| Skill | Purpose |
|---|---|
| `defining-issues` | Converts vague requests into precise, grounded engineering issue definitions |
| `writing-designs` | Researches industry solutions and produces a design document grounded in references |
| `planning-tasks` | Translates a design into an ordered task plan with exact file paths and validation commands |
| `executing-tasks` | Executes a task plan exactly as written, running validations and recording outcomes |
| `syncing-linear` | Syncs issue artifacts to Linear — creates/updates issue, uploads definition and design as linked documents |

## Pipeline

Skills form a sequential pipeline. Each stage consumes the artifact from the previous stage:

```
defining-issues → writing-designs → planning-tasks → executing-tasks
```

`syncing-linear` is independent — run it after any stage to push current state to Linear.

### Artifact chain

All artifacts are saved to `docs/issues/YYYY-MM-DD-<slug>/`:

| Stage | Input | Output |
|---|---|---|
| defining-issues | User request | `definition.md` |
| writing-designs | `definition.md` | `design.md` |
| planning-tasks | `definition.md` + `design.md` | `plan.md` |
| executing-tasks | `plan.md` | `execution.md` |
| syncing-linear | `definition.md` + `design.md` (optional) | `linear.json` |

Start with `defining-issues` when an issue needs scoping. Progress through each stage in order.
