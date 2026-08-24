---
name: playwright-testing
description: Write and run Playwright E2E tests and browser automation. Use for web testing, scraping localhost, or UI verification.
---

# Playwright testing

## Setup

Install this plugin. On first MCP connection, `npx` downloads `@playwright/mcp@latest` automatically. No API keys required.

## When to use Playwright MCP vs Deyin browser tools

- **Playwright MCP** — full browser automation outside the embedded preview; best for E2E test authoring and CI-style flows.
- **Deyin browser plugin (bundled)** — embedded workspace browser tab; best for localhost preview inside the app.

## Workflow

1. Navigate to the target URL and capture a snapshot before interacting.
2. Prefer stable selectors (`getByRole`, `getByTestId`) over brittle CSS.
3. Write tests with clear arrange/act/assert structure.
4. Run tests with the project's existing test runner (`npx playwright test`) when a config exists.

## Tips

- Start from user-visible behavior, not implementation details.
- Add `data-testid` attributes when selectors are fragile.
- Keep tests independent — no ordering assumptions between files.
