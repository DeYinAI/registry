---
name: example-skill
description: When to use this skill — third person, include trigger terms the agent should match.
---

# Example skill

Replace this body with step-by-step instructions for the agent.

## Steps

1. ...
2. ...

## Optional MCP

Add `mcp.json` at the plugin root to bundle MCP servers:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "@scope/mcp-server"]
    }
  }
}
```

Use `${VAR}` for plugin secrets declared in `plugin.json` `variables`.
