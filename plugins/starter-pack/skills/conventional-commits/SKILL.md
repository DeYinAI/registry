---
name: conventional-commits
description: Write conventional commit messages. Use when staging changes, writing git commits, or the user asks for commit message help.
---

# Conventional commits

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<optional scope>): <short summary>

<optional body>

<optional footer>
```

## Types

- **feat** — new feature
- **fix** — bug fix
- **docs** — documentation only
- **style** — formatting, no logic change
- **refactor** — code change that is neither feat nor fix
- **perf** — performance improvement
- **test** — adding or correcting tests
- **chore** — maintenance (deps, CI, tooling)

## Workflow

1. Run `git status` and `git diff` (staged and unstaged).
2. Identify the primary intent of the change set.
3. Pick the narrowest correct type and an optional scope (package or area name).
4. Write an imperative summary under 72 characters (e.g. "add user auth middleware").
5. Add a body when the *why* is not obvious from the diff.

## Examples

- `feat(auth): add device-code OAuth flow`
- `fix(indexer): skip binary files during chunking`
- `docs: update plugin install instructions`

Do not mention tool names in the commit message unless the user asks.
