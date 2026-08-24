---
name: readme-writer
description: Draft or improve project README files. Use when the user asks for a README, project overview, or getting-started docs.
---

# README writer

Produce a clear README.md tailored to the repository. Inspect the codebase first (package.json, main entry points, existing docs).

## Recommended sections

1. **Title and one-line description**
2. **Features** — bullet list of what the project does
3. **Prerequisites** — runtime versions, API keys, OS notes
4. **Getting started** — install and first run (copy-paste commands)
5. **Usage** — common workflows with examples
6. **Configuration** — env vars and config files
7. **Development** — how to build, test, contribute
8. **License** — if a LICENSE file exists

## Style

- Lead with what the project *does*, not how it was built.
- Use fenced code blocks with language tags for commands.
- Keep setup steps verifiable — run commands when possible before documenting them.
- Do not invent features, badges, or links that are not in the repo.

When updating an existing README, preserve accurate sections and improve structure rather than replacing everything blindly.
