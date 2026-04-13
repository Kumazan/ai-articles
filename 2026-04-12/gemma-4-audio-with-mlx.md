---
title: "Gemma 4 可以用 MLX 在 macOS 上做音訊轉錄"
description: "Simon Willison 實測 Gemma 4 E2B 搭配 MLX，在 macOS 上直接把 .wav 檔轉成文字；雖然辨識還會把 right 聽成 front，但已經足以看出本地多模態模型的實用性。"
date: 2026-04-12
author: Simon Willison
layout: post
permalink: /2026-04-12/gemma-4-audio-with-mlx.html
image: /2026-04-12/og-gemma-4-audio-with-mlx.png
---

<div class="hero-badge">AI News · 2026-04-12</div>

![](/ai-articles/2026-04-12/og-gemma-4-audio-with-mlx.png)

**原文連結：** [Gemma 4 audio with MLX](https://simonwillison.net/2026/Apr/12/mlx-audio/)

## 摘要

- Simon Willison 示範如何在 macOS 上用 Gemma 4 E2B 搭配 MLX，直接轉錄音檔
- 指令核心很簡單，`uv run` 加上 `mlx_vlm` 就能讓本機模型吃進 `.wav` 檔
- 14 秒範例音檔的結果大致可用，但「right」還是被誤聽成「front」
- 這讓 Gemma 4 的價值不只停在 benchmark，而是走進可實際執行的本地工作流
- 對重視離線、隱私與 Apple Silicon 開發的人，這是一個很實用的起點

<div class="sep">· · ·</div>

## macOS 本機轉錄測試

感謝 Rahim Nathwani 提供提示，這裡可以用一個簡單的 `uv run` 指令，在 macOS 上透過 10.28 GB 的 [Gemma 4 E2B 模型](https://huggingface.co/google/gemma-4-E2B)、MLX 與 [mlx-vlm](https://github.com/Blaizzy/mlx-vlm) 來轉錄音訊檔：

```bash
uv run --python 3.13 --with mlx_vlm --with torchvision --with gradio \
 mlx_vlm.generate \
 --model google/gemma-4-e2b-it \
 --audio file.wav \
 --prompt "Transcribe this audio" \
 --max-tokens 500 \
 --temperature 1.0
```

它拿來測試一個 14 秒的 `.wav` 檔時，輸出大致如下：

> This front here is a quick voice memo. I want to try it out with MLX VLM. Just going to see if it can be transcribed by Gemma and how that works.

不過，原本應該是：

> This right here...  
> ... how well that works

也就是說，它大致聽懂了，但還是把幾個詞聽歪了。

<div class="sep">· · ·</div>

## 延伸評論

Gemma 4 這類開放模型，真正值得關注的地方，不只是分數表現，而是它開始能直接嵌進開發者日常工具鏈。當模型可以在本機處理音訊、保留資料在裝置上，很多原本只能靠雲端 API 才能做的功能，就會變得更容易試，也更容易落地。

對想做離線助理、隱私優先工作流，或 Apple Silicon 本地推理的人來說，這種「小步但能跑」的範例，比空泛的 demo 更有價值。
