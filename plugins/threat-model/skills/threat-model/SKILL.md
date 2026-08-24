---
name: threat-model
description: Produce a lightweight threat model for a feature or repo area — assets, trust boundaries, and top risks.
---

# Threat model

1. Identify assets (data, credentials, user accounts) and trust boundaries.
2. List entry points (HTTP routes, IPC, MCP tools, git hooks, automations, CLI commands).
3. Brainstorm STRIDE-style threats for each boundary (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege).
4. Map threats to existing controls and gaps; prioritize by likelihood and impact.
5. Summarize top 3 risks and recommended mitigations.

## Output format

```markdown
## Assets
- ...

## Trust boundaries
- ...

## Entry points
- ...

## Top threats
1. ...

## Recommendations
- ...
```

For automated code scanning, enable the bundled **Security** plugin or run `security_scan_repo` when available.
