---
name: postgres-dev
description: Explore and query PostgreSQL databases safely. Use when the user asks about schema, tables, SQL, or database inspection.
---

# PostgreSQL development

## Setup

1. Install this plugin from the DeYinAI registry.
2. Open **Settings → Plugins → Configure secrets** and set `DATABASE_URL` (e.g. `postgresql://user:pass@localhost:5432/mydb`).
3. Enable the plugin if it is off.

The plugin starts the reference Postgres MCP server at agent run time via `npx`.

## Safety

- Prefer **read-only** queries (`SELECT`, `EXPLAIN`, `\d` style introspection) unless the user explicitly requests writes.
- Never print connection strings or passwords in chat output.
- Confirm destructive operations (`DELETE`, `DROP`, `TRUNCATE`) with the user first.

## Workflow

1. List schemas and tables to understand structure.
2. Use targeted `SELECT` with `LIMIT` for sampling data.
3. Explain query plans with `EXPLAIN` when performance is the question.
4. Summarize findings in plain language with table/column names cited.

## Troubleshooting

- **Connection refused** — verify Postgres is running and `DATABASE_URL` host/port are correct.
- **Auth failed** — re-check credentials in plugin secrets.
- **MCP tools missing** — ensure the plugin is enabled and `DATABASE_URL` is set (not empty).
