---
name: conventional-commits
description: Write Conventional Commits messages from staged or described changes. Use when committing, when the user mentions commit messages, or when a project enforces the conventional format.
---

# Conventional Commits

Produce commit messages in the Conventional Commits format: `type(scope): subject`.

## 1. Understand the change

- Run `git status` and `git diff --staged` (or `git diff` when nothing is staged).
- Identify the primary intent — one commit should carry one logical change. If the diff
  mixes unrelated changes, propose splitting before writing a message.

## 2. Choose the type

| Type | Use for |
| --- | --- |
| feat | New user-facing capability |
| fix | Bug fix |
| refactor | Restructuring without behavior change |
| perf | Performance improvement |
| docs | Documentation only |
| test | Tests only |
| build | Build system, dependencies |
| ci | CI configuration |
| chore | Maintenance that fits nothing above |

Breaking changes: append `!` after the type/scope and add a `BREAKING CHANGE:` footer
explaining the migration.

## 3. Write the message

- Subject: imperative mood, no trailing period, at most ~70 characters, says WHY when
  the what is obvious from the diff.
- Scope: the touched module or area when the repo uses scopes (check `git log --oneline -15`
  for the house style first — match it).
- Body (optional): what changed and why, wrapped at ~72 columns. Skip restating the diff.

```
feat(settings): cache the model catalog for one week

Model lists rarely change and the /models call added ~800ms to every
composer open. Serve the cached list and refresh on demand.
```

## 4. Commit

Stage only the intended files, then commit with a heredoc so formatting survives:

```bash
git commit -m "$(cat <<'EOF'
type(scope): subject

Optional body.
EOF
)"
```

Verify with `git log -1 --stat` and report the subject line.
