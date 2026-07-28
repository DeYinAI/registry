---
name: write-readme
description: Write or improve a project README from the actual codebase. Use when the user asks for a README, project documentation, or better onboarding docs.
---

# Write a README

Write a README that reflects the code as it exists — verify every claim against the
repository before writing it.

## 1. Gather facts from the repo

- Manifests: name, description, entry points, scripts (package.json, pyproject.toml, go.mod, ...).
- How to install and run: the actual commands that work, including required tool versions.
- What it does: read the main entry point and one or two core modules; skim existing docs.
- License, badges, existing conventions in sibling projects.

Never invent features, commands, or configuration that the code does not have.

## 2. Structure

```markdown
# Project Name

One-sentence value proposition, then a short paragraph of what it does and who it is for.

## Features            # 3-7 bullets, concrete
## Installation        # exact commands, prerequisites with versions
## Usage               # the smallest working example first, then common tasks
## Configuration       # only options that exist, with defaults
## Development         # install, build, test commands for contributors
## License
```

Trim sections that do not apply; add ones the project genuinely needs (API reference,
architecture, deployment).

## 3. Style

- Lead with what the reader can do, not the project's history.
- Every command must be copy-pasteable and correct for a fresh clone — test the
  install/build/test commands when feasible.
- Prefer one great example over three shallow ones.
- Keep it scannable: short paragraphs, code blocks, no walls of text.

## 4. Verify

Re-read as a newcomer: can they install, run, and do the first useful thing without
leaving the README? Fix whatever fails that test, then report what changed.
