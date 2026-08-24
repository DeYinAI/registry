---
name: docs-lookup
description: Look up current library and framework documentation. Use when the user asks how to use an API, library, SDK, or CLI that may have changed since training data.
---

# Documentation lookup

## Tools

- **Context7** — resolves library IDs and fetches up-to-date docs for popular packages and frameworks.
- **Fetch** — retrieves a URL and converts HTML to markdown for ad-hoc documentation pages.

## Workflow

1. Prefer **Context7** for named libraries (React, Next.js, Prisma, Wrangler, etc.).
2. Use **Fetch** for one-off URLs, changelogs, or vendor docs not in Context7.
3. Cite the doc section you used; quote API signatures when they matter.
4. If docs conflict with local code, trust the repo and note the discrepancy.

## Do not

- Guess API shapes when docs are available — fetch them first.
- Treat blog posts as authoritative over official reference docs.
