# SKILL.md Best Practices

Analysis based on the actual SKILL.md files from the **top 20+ most popular skills** on [skills.sh](https://skills.sh/) (191K–8K installs), covering repos from Vercel, Anthropic, Remotion, obra/superpowers, Supabase, Expo, better-auth, Next.js, and coreyhaines31/marketingskills.

---

## 1. Frontmatter: The Activation Trigger

Every skill **must** have YAML frontmatter with `name` and `description`. The `description` is the single most important field — it's the **only thing agents see at startup** to decide whether to activate a skill (~100 tokens per skill).

### Observed frontmatter patterns across top skills

**Minimal (obra/superpowers — 9K-17K installs):**

```yaml
---
name: systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes
---
```

**Rich with metadata (Vercel — 35K-121K installs):**

```yaml
---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimization, or performance improvements.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---
```

**Keyword-rich with cross-references (marketing — 7K-17K installs):**

```yaml
---
name: seo-audit
version: 1.0.0
description: When the user wants to audit, review, or diagnose SEO issues on their site. Also use when the user mentions "SEO audit," "technical SEO," "why am I not ranking," "SEO issues," "on-page SEO," "meta tags review," or "SEO health check." For building pages at scale to target keywords, see programmatic-seo. For adding structured data, see schema-markup.
---
```

### Description patterns

| Pattern | Who Uses It | Example |
|---|---|---|
| **"Use when..."** trigger phrases | obra, Vercel, Supabase | `"Use when encountering any bug..."` |
| **Keyword enumeration** for discoverability | marketingskills | `"Also use when the user mentions 'SEO audit,' 'technical SEO'..."` |
| **Cross-referencing** other skills | marketingskills | `"For email copy, see email-sequence"` |
| **Scope + trigger + content summary** | Vercel, Anthropic | `"Contains 57 rules across 8 categories, prioritized by impact"` |

---

## 2. Body Patterns — 5 Distinct Archetypes

### Archetype A: Rule Index

**Used by:** Vercel (121K), Supabase (16K), Remotion (84K) — highest install counts

The SKILL.md is a **scannable catalog** pointing to individual rule files. The body itself stays lean.

```markdown
# Skill Name
{1-line summary with rule count}

## When to Apply
{Bullet list of trigger scenarios}

## Rule Categories by Priority
{Table: Priority | Category | Impact | Prefix}

## Quick Reference
{Grouped rule summaries, one line each}

## How to Use
{Pointer to rules/ directory and AGENTS.md}
```

**Structure:** `SKILL.md` (index) → `rules/*.md` (details) → `AGENTS.md` (compiled all-in-one)

**Why it works:** The main file is ~130 lines (Vercel react-best-practices) while supporting 57+ detailed rules via progressive disclosure. Agents load only the rule files they need.

### Archetype B: Procedural Workflow

**Used by:** obra/superpowers (6K-17K installs)

The SKILL.md is a **step-by-step process** with strong behavioral constraints.

```markdown
# Skill Name

## Overview
{1-2 sentences. Core principle stated emphatically.}

## The Iron Law / Core Rule
{Non-negotiable constraint in a code block}

## When to Use
{Mandatory/optional/exceptions}

## The Phases/Process
### Phase 1: ...
### Phase 2: ...

## Red Flags - STOP
{List of rationalizations that mean "go back to Phase 1"}

## Common Rationalizations
{Table: Excuse | Reality}

## Quick Reference
{Table: Phase | Key Activities | Success Criteria}
```

**Distinctive features:**

- **Iron Laws** — non-negotiable rules in code blocks (`NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST`)
- **Red Flags** — explicit list of bad thoughts that mean "STOP"
- **Rationalization tables** — preemptive counter-arguments to skipping the process
- **Cross-skill references** — `Use superpowers:test-driven-development for...`
- **"Announce at start"** directives — `"I'm using the writing-plans skill"`

### Archetype C: Creative/Behavioral Guide

**Used by:** Anthropic (30K-61K installs)

The SKILL.md shapes the agent's **identity and aesthetic judgment** rather than providing steps.

```markdown
# (No heading — starts directly with instructions)

{Identity statement and context}

## Design Thinking / Decision Framework
{Questions to answer before acting}

## Guidelines
{Detailed do/don't rules}

## NEVER / Anti-patterns
{Explicit blacklist with strong language}
```

**Distinctive features:**

- Uses **CRITICAL**, **IMPORTANT**, **NEVER** markers extensively
- **No numbered steps** — behavioral guidance, not process
- Emphatic tone: "Don't hold back", "NEVER converge on common choices"
- Relatively flat — `frontend-design` is just 42 lines with no external files

### Archetype D: Comprehensive Reference

**Used by:** marketingskills (10K-17K), better-auth (10K)

The SKILL.md is a **complete domain guide** with sections, checklists, and output format specs.

```markdown
# Skill Name

You are an expert in {domain}.

## Before Starting / Initial Assessment
{Context gathering questions}

## Framework / Principles
{Core methodology}

## Detailed Sections
{Extensive domain-specific checklists}

## Output Format
{Exact report structure}

## Related Skills
{Cross-references}
```

**Distinctive features:**

- **Role assignment** — "You are an expert conversion copywriter"
- **Context-first design** — "Check for product-marketing-context.md first"
- **Shared context files** — `.claude/product-marketing-context.md` reused across skills
- **Output format specifications** — exact report templates
- Often 200-400 lines (pushing the recommended limit)

### Archetype E: Thin Router to References

**Used by:** Next.js (10K), Expo (9K)

The SKILL.md is a **pure table of contents** delegating everything to reference files.

```markdown
# Skill Name

Apply these rules when {doing X}.

## Topic 1
See [topic-1.md](./topic-1.md) for:
- Point A
- Point B

## Topic 2
See [topic-2.md](./topic-2.md) for:
- Point C
- Point D
```

**Distinctive features:**

- Main SKILL.md is **extremely lean** (~150 lines for Next.js covering 15+ topics)
- Each section is 3-5 lines: heading + "See [file]" + bullet summary
- All substance lives in co-located `.md` files (not in `references/` — just alongside SKILL.md)
- `user-invocable: false` flag (Next.js) — always-on, never manually triggered

---

## 3. Directory Structure Patterns

| Pattern | Used By | Structure |
|---|---|---|
| **rules/ dir** | Vercel, Remotion, Supabase | `SKILL.md` + `rules/*.md` + `AGENTS.md` |
| **references/ dir** | Anthropic, Supabase, Expo | `SKILL.md` + `references/*.md` |
| **scripts/ dir** | Anthropic (pdf, webapp-testing, mcp-builder) | `SKILL.md` + `scripts/*.py` |
| **examples/ dir** | Anthropic (webapp-testing) | `SKILL.md` + `examples/*.py` |
| **assets/ dir** | Remotion (code snippets), Anthropic (canvas fonts) | `SKILL.md` + `rules/assets/*.tsx` |
| **Co-located .md** | Next.js, obra/superpowers | `SKILL.md` + `*.md` alongside it |
| **Single file** | Anthropic (frontend-design), obra (brainstorming) | Just `SKILL.md` |

---

## 4. Progressive Disclosure in Practice

The official spec recommends 3 tiers. Here's how the top skills actually implement it:

| Tier | Budget | What Goes Here | Real Examples |
|---|---|---|---|
| **1. Metadata** | ~100 tokens | `name` + `description` only | Vercel packs trigger keywords; obra keeps it terse |
| **2. SKILL.md body** | <500 lines | Index, workflow, core rules | Vercel: 137 lines indexing 57 rules. Next.js: 154 lines routing to 15 files |
| **3. Resources** | Unlimited | Reference files, scripts, assets | Supabase: 30+ reference MDs. Anthropic PDF: 8 Python scripts |

### Skills that stay lean

- Remotion: 58 lines — just links to 31 rule files
- Vercel web-design-guidelines: 39 lines — fetches rules from URL at runtime
- Next.js: 154 lines — pure TOC for 15+ reference files
- Anthropic frontend-design: 42 lines — no external files needed

### Skills that push the boundary (and still work)

- obra/systematic-debugging: 296 lines — detailed but self-contained
- obra/test-driven-development: 371 lines — heavy on persuasion/counter-arguments
- marketingskills/seo-audit: ~395 lines — comprehensive checklist
- Expo/building-native-ui: 320 lines — code examples inline

---

## 5. Practices Observed Across Top Skills

| Practice | Evidence |
|---|---|
| **Description says what + when + trigger keywords** | All top 10 skills |
| **"When to Apply/Use" section near the top** | Vercel, Remotion, obra, Supabase |
| **Priority tables for rules** | Vercel (3 skills), Supabase — all use `Priority \| Category \| Impact \| Prefix` |
| **One-line rule summaries with prefixed IDs** | Vercel: `async-parallel`, `bundle-barrel-imports`; Supabase: `query-`, `conn-` |
| **Iron Laws / Non-negotiable constraints** | obra: "NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST" |
| **Rationalization counter-tables** | obra (systematic-debugging, TDD) — preempts agent shortcuts |
| **Cross-skill references** | obra: `superpowers:test-driven-development`; marketing: `see email-sequence` |
| **"Check context file first"** | marketingskills: `.claude/product-marketing-context.md` |
| **Scripts as black boxes** | Anthropic webapp-testing: "Run `--help` first. DO NOT read the source." |
| **AGENTS.md as compiled all-in-one** | Vercel (react-best-practices, composition-patterns) |
| **NEVER/anti-pattern blocks** | Anthropic (frontend-design), obra (TDD, debugging) |
| **Output format specification** | marketingskills, obra/writing-plans — exact templates |
| **Related Skills section** | marketingskills (every skill), obra (every skill) |

---

## 6. The Ideal SKILL.md Structure

Based on what the most popular skills actually do:

```yaml
---
name: my-skill-name
description: >
  {What it does}. Use when {trigger conditions}.
  Also triggers on {keyword list}.
  For {adjacent task}, see {other-skill}.
license: MIT                    # optional
metadata:                       # optional
  author: org-name
  version: "1.0.0"
---
```

```markdown
# Skill Name

{1-2 sentence summary. Scope boundary: what this does NOT do.}

## When to Apply
{Bullet list of activation scenarios}

## [Core Content]
# Pick the archetype that fits:
# Rule Index:    → Priority table + quick reference + pointers to rules/
# Workflow:      → Iron Law + numbered phases + red flags
# Behavioral:   → Design thinking + guidelines + NEVER list
# Reference:    → Framework + checklists + output format
# Router:       → TOC with "See [file.md]" + 2-3 bullet summaries each

## How to Use / Quick Reference
{Table or pointer to detailed files}

## Anti-patterns / Red Flags
{❌ Bad → ✓ Good}  or  {Excuse | Reality table}

## Related Skills
{Cross-references to complementary skills}
```

---

## Sources

- [skills.sh](https://skills.sh/) — skill directory and install counts
- [agentskills.io/specification](https://agentskills.io/specification) — official Agent Skills spec
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) — react-best-practices, web-design-guidelines, composition-patterns, react-native-skills
- [vercel-labs/skills](https://github.com/vercel-labs/skills) — find-skills
- [vercel-labs/next-skills](https://github.com/vercel-labs/next-skills) — next-best-practices
- [remotion-dev/skills](https://github.com/remotion-dev/skills) — remotion-best-practices
- [anthropics/skills](https://github.com/anthropics/skills) — frontend-design, skill-creator, pdf, webapp-testing, mcp-builder, canvas-design
- [obra/superpowers](https://github.com/obra/superpowers) — brainstorming, systematic-debugging, writing-plans, test-driven-development, executing-plans, requesting-code-review
- [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) — seo-audit, copywriting
- [supabase/agent-skills](https://github.com/supabase/agent-skills) — supabase-postgres-best-practices
- [expo/skills](https://github.com/expo/skills) — building-native-ui
- [better-auth/skills](https://github.com/better-auth/skills) — better-auth-best-practices
