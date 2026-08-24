---
name: github-dev
description: Work with GitHub repositories, issues, pull requests, and code search via MCP. Use when the user mentions GitHub, PRs, issues, or remote repo operations.
---

# GitHub development

## Setup (choose one)

### Option A — Plugin secret (this plugin)

1. Create a [GitHub personal access token](https://github.com/settings/tokens) with scopes for your workflow (typically `repo`, `read:org` for private repos).
2. **Settings → Plugins → GitHub Dev → Configure secrets** → set `GITHUB_PERSONAL_ACCESS_TOKEN`.

### Option B — MCP catalog OAuth

1. **Settings → MCP** → install **GitHub** from the catalog.
2. Complete OAuth in the MCP auth card.
3. You may disable this plugin's bundled MCP if the catalog server is sufficient.

## Workflow

- Identify owner/repo from the workspace remote (`git remote -v`) when not specified.
- For PR reviews: summarize changed files, risk areas, and open questions.
- For issues: use clear titles, repro steps, and expected vs actual behavior.
- Prefer read operations first; confirm before creating or merging on the user's behalf.

## Token hygiene

Never echo tokens in chat. If MCP returns 401, prompt the user to refresh the token or re-authenticate via Settings.
