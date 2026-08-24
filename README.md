# DeYinAI Plugin Registry

Official catalog of **opt-in content plugins** for [Deyin](https://github.com/DeYinAI/deyin-desktop). Plugins install from **Settings → Plugins** on the desktop app — nothing here ships bundled by default.

## Catalog

`registry.json` lists every plugin. The desktop app fetches it from:

```
https://raw.githubusercontent.com/DeYinAI/registry/main/registry.json
```

Each entry's `repo` field uses the monorepo subpath form:

```
DeYinAI/registry/plugins/<plugin-name>
```

## Included plugins

| Plugin | Skills | MCP | Secrets |
|--------|--------|-----|---------|
| starter-pack | conventional-commits, readme-writer | — | — |
| conventional-commits | conventional-commits | — | — |
| postgres-dev | postgres-dev | postgres (stdio) | `DATABASE_URL` |
| playwright-testing | playwright-testing | playwright (stdio) | — |
| github-dev | github-dev | github (HTTP) | `GITHUB_PERSONAL_ACCESS_TOKEN` |
| docs-lookup | docs-lookup | context7, fetch | — |
| threat-model | threat-model | — | — |
| cloudflare-workers | cloudflare-workers | cloudflare-bindings (HTTP) | OAuth via Settings → MCP |

## Authoring a plugin

### Layout

```
plugins/my-plugin/
  .deyin-plugin/plugin.json    # required manifest
  skills/<name>/SKILL.md       # at least one skill (or root SKILL.md)
  commands/*.md                # optional slash commands
  agents/                      # optional subagent definitions
  hooks/hooks.json             # optional lifecycle hooks
  mcp.json                     # optional bundled MCP servers
  logo.svg                     # optional; reference from interface.logo
```

Copy [`template/`](template/) to `plugins/<your-plugin>/` and edit.

### Manifest (`plugin.json`)

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "One-line summary.",
  "variables": ["API_KEY"],
  "interface": {
    "displayName": "My Plugin",
    "shortDescription": "Card subtitle in Settings → Plugins.",
    "longDescription": "Longer marketplace description.",
    "category": "Developer Tools",
    "capabilities": ["Read"],
    "brandColor": "#6366F1",
    "defaultPrompt": ["Example prompt"]
  }
}
```

**Do not set `"bundled": true`** for registry plugins — bundled plugins ship inside the desktop app.

### Cursor / Codex compatibility

Deyin accepts the same layout with alternate manifest paths:

- `.cursor-plugin/plugin.json`
- `.codex-plugin/plugin.json`
- root `plugin.json`

Skills, commands, hooks, and `mcp.json` use the same discovery rules.

### Skills (`SKILL.md`)

```markdown
---
name: my-skill
description: Third-person description with trigger terms for when the agent should use this skill.
---

# My skill

Step-by-step instructions for the agent…
```

### Commands (`commands/*.md`)

Filename becomes the command name (e.g. `commands/ship.md` → `/ship`):

```markdown
---
name: ship
description: Ship the current branch.
---
Describe what to do. User args append as: $ARGUMENTS
```

### MCP config (`mcp.json`)

Cursor-compatible schema. Interpolation tokens:

| Token | Meaning |
|-------|---------|
| `${workspaceFolder}` | Current workspace root |
| `${pluginDir}` | Installed plugin directory |
| `${VAR}` | Plugin secret from Settings → Plugins (names in `variables`) |
| `${env:NAME}` | Process environment variable |
| `${userHome}` | User home directory |

**stdio example** (spawned at agent run time):

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "${DATABASE_URL}"]
    }
  }
}
```

Declare `"variables": ["DATABASE_URL"]` in `plugin.json`. Users enter values in **Settings → Plugins → Configure secrets** (encrypted at rest).

**HTTP example**:

```json
{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

### OAuth prerequisites

Some HTTP MCP servers require OAuth instead of (or in addition to) plugin secrets:

1. User installs your plugin (skills + optional `mcp.json`).
2. If MCP returns unauthorized, user opens **Settings → MCP**, installs the matching catalog server, and completes OAuth (PKCE).

Document this in your skill — see `plugins/cloudflare-workers/skills/cloudflare-workers/SKILL.md` and `plugins/github-dev/skills/github-dev/SKILL.md`.

### Listing a new plugin

1. Add `plugins/<name>/` following the layout above.
2. Add an entry to `registry.json` (name must match directory; repo must be `DeYinAI/registry/plugins/<name>`).
3. Run validation: `node scripts/validate-plugins.mjs`
4. Open a pull request.

CI runs the same validator on every push.

## Local validation

From this repo:

```bash
node scripts/validate-plugins.mjs
```

From a `deyin-desktop` checkout with this repo as a sibling (`../registry`):

```bash
bash scripts/verify-registry-plugins.sh
# or: REGISTRY_ROOT=/path/to/registry bash scripts/verify-registry-plugins.sh
```

The desktop script copies each plugin into a temp directory and runs `@deyin/agent-core` discovery (skills + MCP merge).

## Distribution model

- **Registry plugins** — GitHub tarball install, opt-in, not on npm.
- **Bundled plugins** — ship inside `deyin-desktop` (browser, security, etc.); not listed here as defaults.
- **MCP catalog** — separate one-click servers under Settings → MCP; plugins may wrap the same servers via `mcp.json`.

## License

Plugin content in this repository is licensed under the same terms as each plugin's upstream dependencies where applicable. See individual plugin folders for notes.
