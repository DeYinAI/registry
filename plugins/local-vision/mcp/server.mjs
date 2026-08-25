#!/usr/bin/env node
/**
 * Local Vision MCP — describes images via Ollama (default: moondream, ~1.7 GB).
 * Tools: describe_image, vision_status
 */
const DEFAULT_BASE = "http://127.0.0.1:11434";
const DEFAULT_MODEL = "moondream";

function baseUrl() {
  const raw = String(process.env.OLLAMA_BASE_URL ?? "").trim();
  if (!raw || raw.startsWith("${")) return DEFAULT_BASE;
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("bad protocol");
    if (host !== "localhost" && host !== "127.0.0.1" && host !== "[::1]" && host !== "::1") {
      throw new Error("remote host");
    }
    return raw.replace(/\/+$/, "");
  } catch {
    return DEFAULT_BASE;
  }
}

function modelName() {
  const raw = String(process.env.OLLAMA_VISION_MODEL ?? "").trim();
  if (!raw || raw.startsWith("${")) return DEFAULT_MODEL;
  return raw.split(":")[0];
}

function send(msg) {
  process.stdout.write(`${JSON.stringify(msg)}\n`);
}

async function checkHealth() {
  const root = baseUrl();
  const model = modelName();
  try {
    const res = await fetch(`${root}/api/tags`, { signal: AbortSignal.timeout(5_000) });
    if (!res.ok) return { reachable: false, modelAvailable: false, baseUrl: root, model };
    const body = await res.json();
    const names = (body.models ?? []).map((m) => String(m.name ?? "").split(":")[0]);
    return { reachable: true, modelAvailable: names.includes(model), baseUrl: root, model };
  } catch {
    return { reachable: false, modelAvailable: false, baseUrl: root, model };
  }
}

async function describeImage(imageBase64, prompt) {
  const root = baseUrl();
  const model = modelName();
  const res = await fetch(`${root}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal: AbortSignal.timeout(120_000),
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        {
          role: "user",
          content:
            prompt ??
            "Describe this image in detail for a developer assistant. Include visible text, UI elements, layout, and anything relevant.",
          images: [imageBase64],
        },
      ],
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Ollama vision failed (${res.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`);
  }
  const body = await res.json();
  const text = body.message?.content?.trim();
  if (!text) throw new Error("Ollama returned an empty description.");
  return text;
}

const handlers = {
  initialize: () => ({
    protocolVersion: "2024-11-05",
    capabilities: { tools: {} },
    serverInfo: { name: "local-vision", version: "1.0.0" },
  }),
  "tools/list": () => ({
    tools: [
      {
        name: "describe_image",
        description: "Describe an image using the local Ollama vision model (moondream by default).",
        inputSchema: {
          type: "object",
          properties: {
            image_base64: { type: "string", description: "Base64-encoded image bytes (no data: prefix)." },
            prompt: { type: "string", description: "Optional focus for the description." },
          },
          required: ["image_base64"],
        },
      },
      {
        name: "vision_status",
        description: "Check whether Ollama is running and the vision model is pulled.",
        inputSchema: { type: "object", properties: {} },
      },
    ],
  }),
  "tools/call": async (params) => {
    const name = params?.name;
    const args = params?.arguments ?? {};
    if (name === "vision_status") {
      const status = await checkHealth();
      return { content: [{ type: "text", text: JSON.stringify(status, null, 2) }] };
    }
    if (name === "describe_image") {
      const b64 = String(args.image_base64 ?? "").trim();
      if (!b64) throw new Error("image_base64 is required.");
      const text = await describeImage(b64, args.prompt ? String(args.prompt) : undefined);
      return { content: [{ type: "text", text }] };
    }
    throw new Error(`Unknown tool: ${name}`);
  },
};

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let idx;
  while ((idx = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    let req;
    try {
      req = JSON.parse(line);
    } catch {
      continue;
    }
    const id = req.id;
    void (async () => {
      try {
        const handler = handlers[req.method];
        if (!handler) throw new Error(`Method not found: ${req.method}`);
        const result = await handler(req.params);
        send({ jsonrpc: "2.0", id, result });
      } catch (err) {
        send({
          jsonrpc: "2.0",
          id,
          error: { code: -32603, message: err instanceof Error ? err.message : String(err) },
        });
      }
    })();
  }
});
