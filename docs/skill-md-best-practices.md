# SKILL.md Best Practices

Last researched: **July 28, 2026**

A good skill is not the longest, strictest, or most installed skill. It is a
small, reusable capability that:

1. activates for the right requests and stays out of adjacent work;
2. adds knowledge, procedure, or tooling the agent would otherwise lack;
3. improves real task results over no skill or the previous version;
4. makes fragile work safe and verifiable; and
5. remains understandable, portable, and maintainable.

This guide follows the current open
[Agent Skills specification](https://agentskills.io/specification), current
[Agent Skills authoring guidance](https://agentskills.io/skill-creation/best-practices),
and current OpenAI and Anthropic host guidance. Popular skills are useful
examples, but install counts are not evidence that a skill triggers accurately
or improves task quality.

Evidence is weighted in this order:

1. the open specification for portable format requirements;
2. current host documentation for host-specific behavior;
3. current first-party repositories for implementation patterns; and
4. ecosystem popularity only for discovery, never as proof of quality.

---

## 1. Start With A Real, Repeatable Job

Create a skill when successful work depends on reusable context or procedure:

- project-specific conventions, schemas, APIs, or policies;
- a multi-step workflow whose order matters;
- recurring corrections or non-obvious edge cases;
- a required output contract or review standard;
- deterministic parsing, transformation, validation, or packaging; or
- a tool integration the agent must use in a particular way.

Start from completed work, not a blank-page prompt. Capture:

- the user goal and inputs;
- the steps that actually worked;
- corrections the user or reviewer made;
- decisions that depend on context;
- required outputs and success criteria;
- failure modes and recovery paths; and
- repeated code that should become a tested script.

Useful source material includes runbooks, code, schemas, API specifications,
review comments, incident reports, issue history, and real execution traces.
Generic advice such as "follow best practices" or "handle errors" rarely adds
value.

Do not create a skill when the base agent already performs the task reliably
and the skill adds no measurable lift. A normal prompt, project documentation,
an `AGENTS.md`, or a standalone tool may be the better abstraction.

---

## 2. Define One Coherent Capability

A skill should own a coherent job, similar to a well-scoped function.

- **Too narrow:** one user task requires several tiny skills, increasing
  discovery overhead and the chance of conflicting instructions.
- **Too broad:** the description becomes vague, the body accumulates unrelated
  branches, and the skill steals work from adjacent skills.
- **Good scope:** the inputs, workflow, outputs, and boundaries can be explained
  in a short paragraph.

For example, querying a product database and formatting the result may be one
capability. Combining that with database administration, schema migrations,
dashboard design, and incident response is probably too broad.

Before writing, collect at least three examples:

1. a normal request that should use the skill;
2. a difficult or ambiguous request that should use it; and
3. a near-miss that should not use it.

These examples become the first trigger and task evaluations.

---

## 3. Treat Discovery And Execution As Separate Problems

Skills use progressive disclosure:

| Stage | Loaded content | Design goal |
| --- | --- | --- |
| Discovery | `name` and `description` | Select without loading the body |
| Activation | The full `SKILL.md` | Load the core workflow |
| Execution | Referenced files and scripts | Use task-specific resources |

This creates two independent quality questions:

1. **Does the description activate correctly?**
2. **Once activated, does the body improve the task?**

A well-written workflow with a vague description will be missed. A broad
description with a poor workflow will trigger often and make results worse.
Evaluate both.

OpenAI currently limits Codex's initial skill list to at most 2% of the context
window, or 8,000 characters when the context size is unknown. Codex may shorten
descriptions or omit skills when many are installed. Front-load the essential
use case and boundary rather than hiding them at the end. See
[OpenAI's current skill-loading behavior](https://learn.chatgpt.com/docs/build-skills#how-chatgpt-and-codex-use-skills).

---

## 4. Write Portable, Valid Frontmatter

The open specification requires YAML frontmatter followed by Markdown.

```yaml
---
name: incident-postmortems
description: >
  Turn incident evidence into a structured postmortem with a timeline, root
  cause, contributing factors, action items, and source links. Use when the
  user asks to draft or revise a postmortem from logs, tickets, chat, or notes.
  Do not use for live incident response or implementation work.
---
```

### Required fields

- `name`: 1-64 characters; lowercase letters, digits, and hyphens; no leading,
  trailing, or consecutive hyphens; must match the directory name.
- `description`: 1-1,024 characters; describes what the skill does and when to
  use it.

### Optional open-spec fields

- `license`: license name or bundled license-file reference.
- `compatibility`: runtime, product, package, network, or environment
  requirements; maximum 500 characters.
- `metadata`: string key-value metadata for clients or maintainers.
- `allowed-tools`: experimental, host-dependent pre-approval declaration.

Keep the portable frontmatter minimal. Optional fields are not uniformly
interpreted by every host, and `allowed-tools` is explicitly experimental.
Never treat metadata as a substitute for runtime permission or safety policy.

### Host-specific metadata belongs outside portable frontmatter

OpenAI supports an optional `agents/openai.yaml` for UI metadata, invocation
policy, and tool dependencies:

```yaml
interface:
  display_name: "Incident Postmortems"
  short_description: "Draft evidence-backed incident reviews"
  default_prompt: "Create a postmortem from the supplied incident evidence."

policy:
  allow_implicit_invocation: true
```

Keep it synchronized with `SKILL.md`. Set
`allow_implicit_invocation: false` when a sensitive or specialized skill should
only run after explicit selection. Treat this file as an OpenAI extension, not
part of the portable Agent Skills specification.

---

## 5. Make The Description A Precise Routing Contract

The description carries the main burden of implicit activation. It should
answer, in this order:

1. **What outcome does the skill enable?**
2. **Which user intents, inputs, or situations need it?**
3. **Which nearby tasks should not activate it?**

Good descriptions:

- lead with the capability rather than background;
- use the vocabulary users put in requests;
- include implicit intents, file types, or task contexts that matter;
- state a boundary when neighboring skills could compete; and
- stay readable instead of becoming a keyword dump.

Poor descriptions:

```yaml
description: Helps with incidents.
```

```yaml
description: >
  Use for incidents, errors, outages, bugs, logs, alerts, support, reliability,
  debugging, monitoring, production, root causes, reports, and engineering.
```

The first is too vague. The second will over-trigger and gives no outcome or
boundary.

Do not rely on a body section named "When to use." The agent reads the body only
after activation. A short scope reminder may help a human reader, but all
activation-critical information must be in `description`.

Style conventions differ by host: some guidance prefers third-person
descriptions, while current open guidance often uses "Use this skill when..."
phrasing. Trigger accuracy matters more than grammatical dogma. Follow the
target host's convention, then test the result.

### Evaluate descriptions, do not merely review them

For a mature skill, build a trigger set with roughly:

- 8-10 realistic requests that should activate it; and
- 8-10 realistic near-misses that should not.

Vary phrasing, detail, explicitness, complexity, file paths, typos, and casual
language. Near-misses should share vocabulary with the skill while requiring a
different capability.

Run each query more than once because activation is nondeterministic. When
tuning descriptions, use a fixed training set and a held-out validation set so
you improve the general routing boundary rather than overfit exact phrases. See
[Optimizing skill descriptions](https://agentskills.io/skill-creation/optimizing-descriptions).

---

## 6. Put Only Core Procedure In `SKILL.md`

Once activated, the entire body competes with the conversation, system
instructions, and other active skills. Add what the agent is likely to get
wrong without the skill:

- required order of operations;
- project or domain facts;
- decision criteria and defaults;
- non-obvious gotchas;
- safety and approval boundaries;
- input and output contracts;
- validation and recovery loops; and
- conditional pointers to bundled resources.

Omit:

- generic domain introductions;
- motivational prose;
- exhaustive API documentation;
- every theoretically possible edge case;
- duplicated content from reference files;
- process history, changelogs, and author notes; and
- explanations the base model already handles correctly.

The open guidance recommends keeping `SKILL.md` below roughly **500 lines and
5,000 tokens**. This is a ceiling and diagnostic signal, not a target. A
100-line skill can still be bloated, while a complex workflow may justify more
content if evaluations show that it earns the cost.

### Match control to fragility

Use different degrees of freedom within one skill:

| Task shape | Instruction style |
| --- | --- |
| Several approaches are valid | State goals, heuristics, and reasons |
| A preferred pattern exists | Give a default and a short escape hatch |
| Fragile or risky operation | Give exact steps, gates, and stop conditions |

Prefer defaults over menus:

```markdown
Use `pdfplumber` for text extraction. For scanned documents, fall back to OCR
with `pdf2image` and `pytesseract`.
```

Avoid presenting four equivalent libraries and forcing the agent to rediscover
the project's preferred choice.

### Use high-signal instruction patterns

- **Workflow with gates:** Say what must be true before moving to the next step.
- **Decision points:** Route meaningful variants explicitly.
- **Gotchas:** Record facts that violate reasonable assumptions.
- **Output templates:** Show the required shape when formatting matters.
- **Examples:** Use concise input/output pairs when quality depends on imitation.
- **Validation loops:** Run a check, fix failures, and repeat.
- **Plan-validate-execute:** For batch, destructive, or high-stakes work, validate
  a structured intermediate plan before changing state.

Strong words such as `MUST`, `NEVER`, and "stop" are appropriate for real
invariants and safety boundaries. Repeating them everywhere makes priority
unclear and can over-constrain good judgment. Explain why a rule exists when
that reason helps the agent apply it correctly.

---

## 7. Use Progressive Disclosure Deliberately

A typical skill can contain:

```text
skill-name/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── scripts/
├── references/
├── assets/
└── evals/
```

Only `SKILL.md` is required. `agents/openai.yaml` is an OpenAI extension, and
`evals/` is an authoring convention rather than an open-spec requirement.

### `references/`

Use for information the agent may need to read:

- API or schema documentation;
- policies and domain rules;
- variant-specific instructions;
- detailed examples; and
- long checklists or format references.

Link every relevant reference directly from `SKILL.md` and say when to read it:

```markdown
- Read `references/api-errors.md` if the API returns a non-2xx response.
- Read `references/aws.md` only when the selected provider is AWS.
```

"See `references/`" is too weak. Avoid reference chains where one secondary
file points to another; agents may preview rather than fully read deeply nested
material. Give long references a table of contents and useful search terms.

### `scripts/`

Use for deterministic or repeatedly reinvented logic. Scripts can often run
without loading their source into the context window.

### `assets/`

Use for files consumed or copied into outputs, such as templates, images,
fonts, boilerplate, and sample documents. Do not use `assets/` as a second
documentation folder.

### Choose a shape that matches the job

There is no universal ideal section structure:

| Shape | Best for |
| --- | --- |
| Procedural workflow | Ordered, stateful, or risky work |
| Reference router | Several domains, providers, frameworks, or formats |
| Rule guide | Review standards and prioritized checks |
| Behavioral guide | Judgment, tone, or design principles |
| Tool-backed workflow | Deterministic transforms, validation, or packaging |

Mix shapes only when the capability genuinely needs them.

---

## 8. Design Scripts For Agents

OpenAI currently recommends instruction-only skills by default. Add a script
when it provides determinism, removes repeated generated code, or wraps external
tooling more safely.

Good skill scripts:

- are non-interactive;
- expose concise `--help` with examples;
- accept explicit flags, environment variables, or stdin;
- use structured stdout and send diagnostics to stderr;
- validate inputs and return actionable errors;
- use meaningful, documented exit codes;
- are idempotent or safe to retry;
- support `--dry-run` for stateful or destructive work;
- default to bounded output or pagination;
- pin tool and package versions when reproducibility matters;
- document runtime and network prerequisites; and
- include tests for their important behavior.

Make execution intent explicit:

```markdown
Run `python3 scripts/validate.py plan.json` and fix every reported error before
applying the plan.
```

If the source is explanatory rather than executable, say "Read
`scripts/validate.py` for the validation algorithm." Do not make the agent guess.

Use relative paths from the skill root and forward slashes. Never hard-code a
developer's home directory, credentials, or machine-specific temporary path.
See [Using scripts in skills](https://agentskills.io/skill-creation/using-scripts).

---

## 9. Make Verification Part Of The Workflow

Verification should be an instruction, not an aspiration.

For mechanical outputs, prefer machine checks:

- parse generated JSON, YAML, XML, or archives;
- compile or typecheck code;
- run focused tests;
- validate schemas and links;
- render visual artifacts and inspect them;
- compare counts, dimensions, checksums, or invariants; and
- reject unexpected external dependencies.

For subjective outputs, combine a concrete rubric with human review. Do not
pretend an LLM judge or a checklist can fully replace judgment about writing,
visual design, or product usefulness.

A robust high-risk workflow is:

```text
inspect source → draft structured plan → validate plan → execute → verify output
```

Validation errors should explain what failed, what was expected, and how the
agent can recover.

---

## 10. Evaluate The Skill As A Product

Static linting is necessary but insufficient. A production-ready skill needs
four evaluation layers.

### Layer 1: Structural validation

- Validate frontmatter and naming with
  `skills-ref validate ./path/to/skill`.
- Check relative links and referenced files.
- Run tests and `--help` checks for bundled scripts.
- Scan for hard-coded paths, secrets, unpinned dependencies, and stale metadata.

### Layer 2: Trigger evaluation

- Test should-trigger prompts.
- Test realistic near-misses that should not trigger.
- Test ambiguous prompts where another skill could win.
- Repeat runs to estimate trigger rate.
- Test with the other skills users normally have installed.

### Layer 3: Task-quality evaluation

Start with two or three realistic tasks, including an edge case. Run each in a
clean context:

1. with the new skill; and
2. without the skill, or with the previous version.

Define observable success criteria. Use scripts for mechanical assertions and
human review for subjective quality. Record evidence for each pass or failure.
Compare:

- correctness and completeness;
- user-visible output quality;
- skipped or wasted steps in the trace;
- time and token cost; and
- safety or approval behavior.

A skill that passes but adds large latency or context cost for negligible
quality improvement may not be worthwhile.

### Layer 4: Portability and coexistence

- Test every model and host you intend to support.
- Test available and missing dependencies.
- Test offline or restricted-network behavior when relevant.
- Test skill-name collisions and neighboring descriptions.
- Test the full installed skill set for routing regressions.

The current evaluation guidance recommends retaining outputs by iteration,
grading assertions with concrete evidence, performing blind comparisons when
useful, and reading execution traces rather than only final answers. See
[Evaluating skill output quality](https://agentskills.io/skill-creation/evaluating-skills).

### Iterate on evidence

When an evaluation fails:

- fix the general cause, not the exact test phrase;
- move high-value gotchas earlier;
- remove instructions that create wasted work;
- add a default where the agent explores too many options;
- add or improve a validator where errors are mechanical;
- bundle code that every run reinvents; and
- narrow or broaden the description based on trigger failures.

Rerun the complete suite after each meaningful change. Keep a held-out set to
catch overfitting.

---

## 11. Review Skills Like Executable Software

A skill can direct an agent to read files, execute code, call tools, access the
network, or send data. Treat installation and distribution with the same care
as software.

Before trusting a skill:

1. Read `SKILL.md`, every referenced file, and every bundled script.
2. Verify that script behavior matches the advertised purpose.
3. Search for network calls, external URLs, broad filesystem access, and
   credential handling.
4. Review MCP or other tool dependencies and their combined permissions.
5. Reject instructions that hide actions, bypass policy, or transmit data
   unexpectedly.
6. Run unfamiliar scripts in a sandbox with non-sensitive test data.
7. Confirm destructive actions have narrow targets, previews, and explicit
   authorization boundaries.

Never embed credentials. Use environment variables or the host's secure
credential mechanism. A scanner or marketplace review is useful defense in
depth, not a replacement for human and organizational review.

For shared skills, record an owner, version, dependencies, evaluation status,
and last review date. Re-evaluate after model, host, dependency, or workflow
changes.

---

## 12. A Practical Default Template

Use this as a starting point, then delete sections the skill does not need:

```yaml
---
name: skill-name
description: >
  [Outcome]. Use when [real user intents, inputs, and contexts].
  Do not use for [important adjacent boundary].
compatibility: [Only when the skill has real environment requirements.]
---
```

```markdown
# Skill Name

[One-sentence purpose and scope.]

## Contract

- Required inputs:
- Produced outputs:
- Invariants or approval boundaries:

## Workflow

1. Inspect [...]
2. Decide [...] using [...]
3. Execute [...]
4. Validate [...]
5. If validation fails, fix and repeat.

## Decision Points

- If [...], read `references/variant-a.md`.
- If [...], use the default [...]; use [...] only when [...].

## Gotchas

- [Non-obvious fact the agent otherwise gets wrong.]

## Resources

- Run `scripts/validate.py --help` before using the validator.
- Read `references/schema.md` when the task touches the data model.
```

The template is not a checklist to fill mechanically. The best structure is the
smallest one that reliably produces the desired behavior.

---

## 13. Release Checklist

### Discovery

- [ ] `name` is valid, specific, and matches the directory.
- [ ] `description` leads with the capability and includes real triggers.
- [ ] Adjacent boundaries are clear.
- [ ] Positive, negative, and ambiguous trigger prompts pass.

### Instructions

- [ ] The skill captures real expertise rather than generic advice.
- [ ] The workflow has clear inputs, outputs, defaults, and stop conditions.
- [ ] Control is strict only where the task is fragile.
- [ ] Important gotchas and safety boundaries are hard to miss.
- [ ] The body earns its context cost.

### Resources

- [ ] Every reference is linked directly with a condition for reading it.
- [ ] Scripts are deterministic, non-interactive, tested, and agent-friendly.
- [ ] Assets, references, and scripts are not duplicated.
- [ ] Paths are relative and portable.
- [ ] Dependencies and host-specific metadata are accurate.

### Quality and safety

- [ ] Structural validation passes.
- [ ] The skill beats the baseline on representative tasks.
- [ ] Outputs are mechanically verified where possible and human-reviewed where
      needed.
- [ ] Token, time, and trace regressions are acceptable.
- [ ] Coexistence with neighboring skills has been tested.
- [ ] All files, commands, network access, and tool permissions have been
      reviewed.

---

## Research Basis

Primary sources reviewed on July 28, 2026:

- [Agent Skills specification](https://agentskills.io/specification)
- [Best practices for skill creators](https://agentskills.io/skill-creation/best-practices)
- [Optimizing skill descriptions](https://agentskills.io/skill-creation/optimizing-descriptions)
- [Evaluating skill output quality](https://agentskills.io/skill-creation/evaluating-skills)
- [Using scripts in skills](https://agentskills.io/skill-creation/using-scripts)
- [OpenAI: Build skills](https://learn.chatgpt.com/docs/build-skills)
- [OpenAI: Skills in ChatGPT](https://help.openai.com/en/articles/20001066-skills-in-chatgpt)
- [OpenAI Plugins repository at the reviewed commit](https://github.com/openai/plugins/tree/11c74d6ba24d3a6d48f54a194cd00ef3beea18f9)
- [OpenAI `plugin-eval` at the reviewed commit](https://github.com/openai/plugins/tree/11c74d6ba24d3a6d48f54a194cd00ef3beea18f9/plugins/plugin-eval)
- [Anthropic skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Anthropic enterprise skill evaluation and governance](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/enterprise)
- [Anthropic `skill-creator` at the reviewed commit](https://github.com/anthropics/skills/tree/b29e7cf65e5cb78a5ac33d582270551bc74a14eb/skills/skill-creator)

The open-standard sources contributed the portable format, progressive
disclosure, script-interface, trigger-evaluation, and task-evaluation guidance.
OpenAI sources contributed current Codex discovery budgets,
`agents/openai.yaml`, invocation policy, and plugin distribution. Anthropic
sources contributed cross-model testing, enterprise security review, lifecycle
governance, and a current eval-driven authoring example. Install rankings were
treated as volatile, weak evidence and were not used to define quality.

The former
[`openai/skills`](https://github.com/openai/skills) catalog now identifies
itself as deprecated in favor of
[`openai/plugins`](https://github.com/openai/plugins) for current Codex skill
and plugin examples. Repository examples illustrate current practice; they are
not normative and should still be evaluated.
