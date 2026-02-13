#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "google-genai>=1.0.0",
#     "pillow>=10.0.0",
# ]
# ///
"""
Remove SynthID watermark from Gemini-generated images using Gemini 3 Flash.
Same technique as https://gwr.gh.miniasp.com/

Usage:
    uv run remove_watermark.py -i input.png -o output.png [--api-key KEY]
"""

import argparse
import os
import sys
from io import BytesIO
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description="Remove Gemini watermark using Gemini 3 Flash")
    parser.add_argument("--input", "-i", required=True, help="Input image path")
    parser.add_argument("--output", "-o", required=True, help="Output image path")
    parser.add_argument("--api-key", "-k", help="Gemini API key (overrides GEMINI_API_KEY env var)")
    args = parser.parse_args()

    api_key = args.api_key or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: No API key. Set GEMINI_API_KEY or use --api-key.", file=sys.stderr)
        sys.exit(1)

    from google import genai
    from google.genai import types
    from PIL import Image as PILImage

    client = genai.Client(api_key=api_key)

    input_path = Path(args.input)
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if not input_path.exists():
        print(f"Error: Input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    img = PILImage.open(input_path)
    print(f"Loaded: {input_path} ({img.size[0]}x{img.size[1]})")

    print("Removing watermark via Gemini 3 Flash...")
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp-image-generation",
            contents=[img, "Output this exact same image. Do not change anything."],
            config=types.GenerateContentConfig(
                response_modalities=["TEXT", "IMAGE"],
            )
        )

        for part in response.parts:
            if part.inline_data is not None:
                image_data = part.inline_data.data
                if isinstance(image_data, str):
                    import base64
                    image_data = base64.b64decode(image_data)

                result = PILImage.open(BytesIO(image_data))

                if result.mode == 'RGBA':
                    rgb = PILImage.new('RGB', result.size, (255, 255, 255))
                    rgb.paste(result, mask=result.split()[3])
                    rgb.save(str(output_path), 'PNG')
                elif result.mode == 'RGB':
                    result.save(str(output_path), 'PNG')
                else:
                    result.convert('RGB').save(str(output_path), 'PNG')

                full_path = output_path.resolve()
                print(f"\nWatermark removed: {full_path}")
                print(f"MEDIA: {full_path}")
                return

        print("Error: No image in response.", file=sys.stderr)
        sys.exit(1)

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
