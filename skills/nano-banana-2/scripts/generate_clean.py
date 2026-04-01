#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "google-genai>=1.0.0",
#     "pillow>=10.0.0",
# ]
# ///
"""
Generate image with Gemini 3.1 Flash Image (Nano Banana 2).
API-generated images have no visible watermark.

Usage:
    uv run generate_clean.py --prompt "your image description" --filename "output.png" [--resolution 1K|2K|4K]
    uv run generate_clean.py --prompt "edit instructions" --filename "output.png" -i input.png
    uv run generate_clean.py --prompt "combine" --filename "output.png" -i a.png -i b.png
"""

import argparse
import os
import sys
from io import BytesIO
from pathlib import Path

MODEL = "gemini-3.1-flash-image-preview"


def get_api_key(provided_key):
    return provided_key or os.environ.get("GEMINI_API_KEY")


def save_image(image, output_path):
    from PIL import Image as PILImage
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if image.mode == 'RGBA':
        rgb = PILImage.new('RGB', image.size, (255, 255, 255))
        rgb.paste(image, mask=image.split()[3])
        rgb.save(str(output_path), 'PNG')
    elif image.mode == 'RGB':
        image.save(str(output_path), 'PNG')
    else:
        image.convert('RGB').save(str(output_path), 'PNG')


def main():
    parser = argparse.ArgumentParser(description="Generate images via Gemini 3.1 Flash Image (Nano Banana 2)")
    parser.add_argument("--prompt", "-p", required=True, help="Image description/prompt")
    parser.add_argument("--filename", "-f", required=True, help="Output filename")
    parser.add_argument("--input-image", "-i", action="append", dest="input_images", help="Input image(s)")
    parser.add_argument("--resolution", "-r", choices=["1K", "2K", "4K"], default="1K")
    parser.add_argument("--api-key", "-k", help="Gemini API key")
    args = parser.parse_args()

    api_key = get_api_key(args.api_key)
    if not api_key:
        print("Error: No API key. Set GEMINI_API_KEY or use --api-key.", file=sys.stderr)
        sys.exit(1)

    from google import genai
    from google.genai import types
    from PIL import Image as PILImage

    client = genai.Client(api_key=api_key)
    output_path = Path(args.filename)

    input_images = []
    output_resolution = args.resolution
    if args.input_images:
        if len(args.input_images) > 14:
            print("Error: Max 14 input images.", file=sys.stderr)
            sys.exit(1)
        max_dim = 0
        for p in args.input_images:
            img = PILImage.open(p)
            input_images.append(img)
            max_dim = max(max_dim, *img.size)
        if args.resolution == "1K" and max_dim > 0:
            if max_dim >= 3000: output_resolution = "4K"
            elif max_dim >= 1500: output_resolution = "2K"

    if input_images:
        contents = [*input_images, args.prompt]
        print(f"Editing {len(input_images)} image(s) at {output_resolution}...")
    else:
        contents = args.prompt
        print(f"Generating at {output_resolution}...")

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                response_modalities=["TEXT", "IMAGE"],
                image_config=types.ImageConfig(image_size=output_resolution)
            )
        )

        generated_img = None
        for part in response.parts:
            if part.text is not None:
                print(f"Model: {part.text}")
            elif part.inline_data is not None:
                image_data = part.inline_data.data
                if isinstance(image_data, str):
                    import base64
                    image_data = base64.b64decode(image_data)
                generated_img = PILImage.open(BytesIO(image_data))

        if not generated_img:
            print("Error: No image generated.", file=sys.stderr)
            sys.exit(1)

        save_image(generated_img, output_path)
        print(f"\nImage saved: {output_path.resolve()}")
        print(f"MEDIA: {output_path.resolve()}")

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
