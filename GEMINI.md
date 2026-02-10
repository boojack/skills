# Hijack

Curated skill collection providing a four-stage engineering pipeline.

## Skills

| Skill | Purpose |
|---|---|
| `defining-issues` | Converts vague requests into precise, grounded engineering issue definitions |
| `writing-designs` | Researches industry solutions and produces a design document grounded in references |
| `planning-tasks` | Translates a design into an ordered task plan with exact file paths and validation commands |
| `executing-tasks` | Executes a task plan exactly as written, running validations and recording outcomes |

## Pipeline

Skills form a sequential pipeline. Each stage consumes the artifact from the previous stage:

```
defining-issues → writing-designs → planning-tasks → executing-tasks
```

### Artifact chain

All artifacts are saved to `docs/issues/YYYY-MM-DD-<slug>/`:

| Stage | Input | Output |
|---|---|---|
| defining-issues | User request | `definition.md` |
| writing-designs | `definition.md` | `design.md` |
| planning-tasks | `definition.md` + `design.md` | `plan.md` |
| executing-tasks | `plan.md` | `execution.md` |

Start with `defining-issues` when an issue needs scoping. Progress through each stage in order — do not skip stages.
