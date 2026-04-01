---
name: nano-banana-2
description: Generate images via Gemini 3.1 Flash Image (Nano Banana 2). API images have no visible watermark.
homepage: https://ai.google.dev/gemini-api/docs/image-generation
metadata:
  {
    "openclaw":
      {
        "emoji": "🍌✨",
        "requires": { "bins": ["uv"], "env": ["GEMINI_API_KEY"] },
        "primaryEnv": "GEMINI_API_KEY",
        "install":
          [
            {
              "id": "uv-brew",
              "kind": "brew",
              "formula": "uv",
              "bins": ["uv"],
              "label": "Install uv (brew)",
            },
          ],
      },
  }
---

# Nano Banana 2 🍌✨

Generate images via **Gemini 3.1 Flash Image** (`gemini-3.1-flash-image-preview`).
API 生成的圖片沒有可見浮水印，不需要額外去除步驟。

> **Note:** `{baseDir}` is a placeholder automatically resolved by OpenClaw to the absolute path of this skill's directory (i.e., the folder containing this SKILL.md). You do not need to replace it manually.

## Generate

```bash
uv run {baseDir}/scripts/generate_clean.py --prompt "your image description" --filename "output.png" --resolution 1K
```

## Edit image

```bash
uv run {baseDir}/scripts/generate_clean.py --prompt "edit instructions" --filename "output.png" -i "/path/input.png"
```

## Multi-image composition

```bash
uv run {baseDir}/scripts/generate_clean.py --prompt "combine these" --filename "output.png" -i a.png -i b.png
```

## Flags

- `--resolution` — `1K` (default), `2K`, `4K`
- `--api-key` — override `GEMINI_API_KEY` env var

## Notes

- Uses `gemini-3.1-flash-image-preview` (Nano Banana 2) for all image generation.
- Supports up to 14 input images for editing/composition.
- Auto-detects input resolution and upgrades output resolution if needed.
- Use timestamps in filenames: `yyyy-mm-dd-hh-mm-ss-name.png`.
- The script prints a `MEDIA:` line for OpenClaw to auto-attach on supported chat providers.
- Do not read the image back; report the saved path only.
- API key: `GEMINI_API_KEY` env var or `--api-key` flag.
