---
name: cloudflare-workers
description: Develop and debug Cloudflare Workers, Wrangler configs, and bindings (KV, R2, D1). Use when the user mentions Workers, wrangler, or Cloudflare edge deployment.
---

# Cloudflare Workers

## Setup

1. Install this plugin.
2. On first agent run, if MCP returns unauthorized, open **Settings → MCP** and authenticate **Cloudflare Bindings** (OAuth via the MCP catalog auth card).
3. Alternatively install Cloudflare Bindings from **Settings → MCP** catalog directly and disable this plugin's MCP if redundant.

## Workflow

1. Read `wrangler.toml` / `wrangler.jsonc` and worker entry files before suggesting changes.
2. Use bindings MCP to inspect KV namespaces, R2 buckets, D1 databases when debugging env mismatches.
3. Prefer local `wrangler dev` and `wrangler deploy` commands the project already uses.
4. Cross-check binding names in config match deployed resources.

## Docs

Use the **docs-lookup** plugin or Context7 for current Wrangler and Workers API docs when unsure.
