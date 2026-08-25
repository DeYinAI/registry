---
name: local-vision
description: Describe images on-device with Ollama moondream (~1.7 GB). Use when the user attaches screenshots or photos and cloud vision routing is off.
---

# Local Vision (Ollama + moondream)

## Setup (once)

1. Install [Ollama](https://ollama.com).
2. Pull the vision model (~1.7 GB RAM at inference):

   ```bash
   ollama pull moondream
   ```

3. Enable this plugin in **Settings → Capabilities → Plugins**.

Optional plugin variables:

- `OLLAMA_BASE_URL` — default `http://127.0.0.1:11434`
- `OLLAMA_VISION_MODEL` — default `moondream`

## When sending messages

With **Auto route to cloud vision** off (default), Deyin describes composer attachments locally before your text model runs. You will see:

> 📷 Vision: described locally with moondream.

## Agent tools (MCP)

- `describe_image` — `{ "image_base64": "...", "prompt": "optional focus" }`
- `vision_status` — check Ollama + model availability

Use `describe_image` when you need a fresh look at a workspace screenshot or a picture the user referenced by path (read and base64-encode first).

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Ollama not reachable | Start Ollama (`ollama serve` or the desktop app) |
| Model missing | `ollama pull moondream` |
| Out of memory | moondream targets ~1–2 GB; close other GPU/RAM-heavy apps |
