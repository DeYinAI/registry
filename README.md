# Deyin Registry

The official plugin catalog for [Deyin](https://deyin.dev). The Deyin desktop app fetches
`registry.json` from this repository and lists its entries in **Settings → Plugins**,
where they can be installed with one click.

## How installs work

A plugin is a Git repository (or a subdirectory of one) containing:

```
my-plugin/
├── .deyin-plugin/plugin.json   # manifest: { "name", "description", "version", "variables" }
├── skills/<name>/SKILL.md      # skills (auto-discovered)
├── commands/<name>.md          # slash commands
├── agents/<name>.md            # subagents
├── hooks/hooks.json            # lifecycle hooks
└── mcp.json                    # MCP servers ({ "mcpServers": { ... } })
```

Only the manifest is required — component folders are auto-discovered. A root `SKILL.md`
makes a single-skill plugin. Deyin downloads the repo tarball (no git needed on the
client), unpacks it into the user's plugin library, and merges its components into the
capability registry.

## registry.json schema

```json
{
  "version": 1,
  "plugins": [
    {
      "name": "starter-pack",
      "description": "One line shown in the catalog.",
      "repo": "owner/repo | owner/repo@ref | owner/repo/subdir | github.com URL",
      "version": "0.1.0",
      "kind": "plugin | skill | mcp"
    }
  ]
}
```

## Submitting a plugin

Open a pull request that adds your entry to `registry.json`. Requirements:

- The plugin repository is public and open source.
- The manifest declares a kebab-case `name` and a clear `description`.
- Secrets are declared as `variables` in the manifest and referenced as `${VAR}`
  placeholders — never committed values.
- Skills follow the SKILL.md conventions (frontmatter `name` + `description` that says
  what the skill does and when to use it).

Entries are reviewed before merging.

## In this repository

- `plugins/starter-pack` — the first-party starter plugin, installable as
  `DeYinAI/registry/plugins/starter-pack`.
