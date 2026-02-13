---
name: nano-banana-pro-clean
description: Generate images via Gemini 3 Pro Image with automatic watermark removal via Gemini 3 Flash (same technique as gwr.gh.miniasp.com).
homepage: https://gwr.gh.miniasp.com/
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

# Nano Banana Pro Clean 🍌✨

Generate images via Gemini 3 Pro Image, then **automatically remove SynthID watermark** via Gemini 3 Flash.
Same watermark-removal technique as [Gemini 無"印"良品](https://gwr.gh.miniasp.com/).

## Generate (with auto watermark removal)

```bash
uv run {baseDir}/scripts/generate_clean.py --prompt "your image description" --filename "output.png" --resolution 1K
```

## Edit image (with auto watermark removal)

```bash
uv run {baseDir}/scripts/generate_clean.py --prompt "edit instructions" --filename "output.png" -i "/path/input.png"
```

## Multi-image composition

```bash
uv run {baseDir}/scripts/generate_clean.py --prompt "combine these" --filename "output.png" -i a.png -i b.png
```

## Remove watermark only (from existing image, e.g. downloaded from web Gemini)

```bash
uv run {baseDir}/scripts/generate_clean.py --clean-only --filename "clean.png" -i "/path/watermarked.png"
```

Or use the standalone script:

```bash
uv run {baseDir}/scripts/remove_watermark.py -i "/path/watermarked.png" -o "clean.png"
```

## Generate without watermark removal

```bash
uv run {baseDir}/scripts/generate_clean.py --prompt "description" --filename "output.png" --no-clean
```

## Flags

- `--no-clean` — skip watermark removal step (same as original nano-banana-pro)
- `--clean-only` — only remove watermark from input image (no generation)
- `--resolution` — `1K` (default), `2K`, `4K`

## Notes

- Uses `gemini-3-pro-image-preview` for generation and `gemini-3-flash-preview` for watermark removal.
- Use timestamps in filenames: `yyyy-mm-dd-hh-mm-ss-name.png`.
- The script prints a `MEDIA:` line for OpenClaw to auto-attach on supported chat providers.
- Do not read the image back; report the saved path only.
- API key: `GEMINI_API_KEY` env var or `--api-key` flag.

## When to use this vs original nano-banana-pro

**Use this skill (nano-banana-pro-clean)** — it replaces nano-banana-pro entirely. Same generation capabilities, but with automatic watermark removal.
