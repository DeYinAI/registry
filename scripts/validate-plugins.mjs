#!/usr/bin/env node
/**
 * Validates registry.json and every plugin under plugins/.
 * Run from the registry repo root: node scripts/validate-plugins.mjs
 */
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function validateSkill(path) {
  const raw = await readFile(path, "utf8");
  if (!raw.startsWith("---")) fail(`${path}: SKILL.md missing YAML frontmatter`);
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!match) fail(`${path}: invalid frontmatter block`);
  const fm = match[1];
  if (!/^name:\s*\S+/m.test(fm)) fail(`${path}: frontmatter missing name`);
  if (!/^description:\s*.+/m.test(fm)) fail(`${path}: frontmatter missing description`);
}

async function validatePlugin(slug) {
  const dir = join(root, "plugins", slug);
  const manifestPath = join(dir, ".deyin-plugin", "plugin.json");
  if (!(await exists(manifestPath))) {
    fail(`plugins/${slug}: missing .deyin-plugin/plugin.json`);
    return null;
  }
  const manifest = await readJson(manifestPath);
  if (!manifest.name) fail(`plugins/${slug}: plugin.json missing name`);
  if (manifest.name !== slug) {
    fail(`plugins/${slug}: plugin.json name "${manifest.name}" must match directory "${slug}"`);
  }
  const skillsDir = join(dir, "skills");
  let hasSkill = false;
  if (await exists(skillsDir)) {
    for (const entry of await readdir(skillsDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const skillFile = join(skillsDir, entry.name, "SKILL.md");
      if (await exists(skillFile)) {
        hasSkill = true;
        await validateSkill(skillFile);
      }
    }
  }
  if (!hasSkill && !(await exists(join(dir, "SKILL.md")))) {
    fail(`plugins/${slug}: no skills/…/SKILL.md or root SKILL.md`);
  }
  for (const mcpName of ["mcp.json", ".mcp.json"]) {
    const mcpPath = join(dir, mcpName);
    if (!(await exists(mcpPath))) continue;
    const mcp = await readJson(mcpPath);
    if (!mcp.mcpServers || typeof mcp.mcpServers !== "object") {
      fail(`plugins/${slug}/${mcpName}: missing mcpServers object`);
    }
    for (const [serverName, cfg] of Object.entries(mcp.mcpServers ?? {})) {
      if (!cfg.command && !cfg.url) {
        fail(`plugins/${slug}/${mcpName}: server "${serverName}" needs command or url`);
      }
    }
    if (Array.isArray(manifest.variables)) {
      for (const v of manifest.variables) {
        const needle = `\${${v}}`;
        const text = JSON.stringify(mcp);
        if (!text.includes(needle)) {
          fail(`plugins/${slug}: variable ${v} declared but not referenced in MCP config`);
        }
      }
    }
  }
  return manifest;
}

async function main() {
  const registryPath = join(root, "registry.json");
  const registry = await readJson(registryPath);
  const schema = await readJson(join(root, "registry.schema.json"));

  if (!Array.isArray(registry.plugins) || registry.plugins.length === 0) {
    fail("registry.json must contain a non-empty plugins array");
  }

  const pluginDirs = (await readdir(join(root, "plugins"), { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const catalogNames = new Set();
  for (const entry of registry.plugins) {
    if (!entry.name || !entry.description || !entry.repo) {
      fail(`registry entry missing required fields: ${JSON.stringify(entry)}`);
    }
    if (catalogNames.has(entry.name)) fail(`duplicate catalog name: ${entry.name}`);
    catalogNames.add(entry.name);

    const expectedRepo = `DeYinAI/registry/plugins/${entry.name}`;
    if (entry.repo !== expectedRepo) {
      fail(`registry entry "${entry.name}": repo must be "${expectedRepo}"`);
    }
    if (!pluginDirs.includes(entry.name)) {
      fail(`registry lists "${entry.name}" but plugins/${entry.name}/ is missing`);
    }
  }

  for (const slug of pluginDirs) {
    if (slug.startsWith(".")) continue;
    await validatePlugin(slug);
    if (!catalogNames.has(slug)) {
      fail(`plugins/${slug} exists but is not listed in registry.json`);
    }
  }

  if (process.exitCode) {
    console.error("\nValidation failed.");
    process.exit(1);
  }
  console.log(`OK: ${registry.plugins.length} catalog entries, ${pluginDirs.length} plugin directories validated.`);
  void schema;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
