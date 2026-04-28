---
title: "Microsoft VibeVoice：Whisper 式語音轉文字模型，還內建說話人分離"
description: "Microsoft 的 VibeVoice 是一款 Whisper 式語音轉文字模型，內建說話人分離；Simon Willison 實測顯示，它在 Mac 上可用 MLX 跑得相當順。"
date: 2026-04-28
author: Simon Willison
layout: post
permalink: /2026-04-28/microsoft-vibevoice-whisper-style-speech-to-text-with-speaker-diarization.html
image: /2026-04-28/og-microsoft-vibevoice-whisper-style-speech-to-text-with-speaker-diarization.png
---

<div class="hero-badge">AI News · 2026-04-28</div>

![](/ai-articles/2026-04-28/og-microsoft-vibevoice-whisper-style-speech-to-text-with-speaker-diarization.png)

**原文連結：** [Simon Willison - microsoft/VibeVoice](https://simonwillison.net/2026/Apr/27/vibevoice/)

## 摘要

- Microsoft 的 VibeVoice 是一款 Whisper 式語音轉文字模型，而且把說話人分離（speaker diarization）直接做進模型裡。
- Simon Willison 先前沒實際試過，這次用 Mac、uv、mlx-audio 和 4bit 的 MLX 轉換版做了本機測試。
- 他的測試對象是一小時長的 Podcast 音檔，結果跑完約花 8 分 45 秒。
- 這套流程峰值記憶體大約 30.44GB；在 Activity Monitor 裡，預填階段甚至看過 61.5GB 的使用量。
- 如果不手動調大 `--max-tokens`，預設值只夠大約 25 分鐘音檔，實務上得自己調整。
- 輸出的 JSON 會把逐句文字、時間戳與 speaker id 一起列出，後處理很方便。
- 這篇最有價值的地方，是它把「模型能不能用」這件事，直接拉回到本機部署、效能和工作流整合。

<div class="sep">· · ·</div>

[microsoft/VibeVoice](https://github.com/microsoft/VibeVoice)。VibeVoice 是 Microsoft 的 Whisper 式語音轉文字模型，採 MIT 授權，而且把說話人分離直接內建進模型中。

Microsoft 其實在 2026 年 1 月 21 日就釋出了它，但 Simon Willison 一直到今天才實際試用。這次他用 Mac、[uv](https://docs.astral.sh/uv/)、[mlx-audio](https://github.com/Blaizzy/mlx-audio)（作者是 Prince Canuma），以及 [mlx-community/VibeVoice-ASR-4bit](https://huggingface.co/mlx-community/VibeVoice-ASR-4bit) 這個 5.71GB 的 MLX 轉換版，去跑他最近一次和 Lenny Rachitsky 節目的錄音檔。

他下的指令如下：

```bash
uv run --with mlx-audio python -m mlx_audio.stt.generate \
 --model mlx-community/VibeVoice-ASR-4bit \
 --audio lenny.mp3 --output-path lenny \
 --format json --verbose --max-tokens 32768
```

工具回報的結果是：

- Processing time：524.79 秒
- Prompt：26615 tokens，50.718 tokens-per-sec
- Generation：20248 tokens，38.585 tokens-per-sec
- Peak memory：30.44 GB

也就是說，在一台 128GB 的 M5 Max MacBook Pro 上，處理一小時音檔大約要 8 分 45 秒。

他也測過 `.wav` 和 `.mp3`，兩種格式都能正常工作。

如果不加 `--max-tokens`，預設只會是 8192，這大概只夠處理 25 分鐘左右的音檔。這是他靠試錯才發現的，所以最後把它調大四倍，確保能完整跑完一小時內容。

那個指令雖然顯示峰值只用了 30.44GB RAM，但在 Activity Monitor 裡，他實際觀察到預填階段大約衝到 61.5GB，生成階段則掉到約 18GB。

輸出的 JSON 長這樣：

```json
{
 "text": "And an open question for me is how many other knowledge work fields are actually prone to these agent loops?",
 "start": 13.85,
 "end": 19.5,
 "duration": 5.65,
 "speaker_id": 0
},
{
 "text": "Now that we have this power, people almost underestimate what they can do with it.",
 "start": 19.5,
 "end": 22.78,
 "duration": 3.280000000000001,
 "speaker_id": 1
},
{
 "text": "Today, probably 95% of the code that I produce, I didn't type it myself. I write so much of my code on my phone. It's wild.",
 "start": 22.78,
 "end": 30.0,
 "duration": 7.219999999999999,
 "speaker_id": 0
}
```

因為這是一組物件陣列，所以也可以直接丟進 [Datasette Lite](https://lite.datasette.io/?json=https://gist.github.com/simonw/d2c716c008b3ba395785f865c6387b6f#/data/raw?_facet=speaker_id) 來瀏覽，比單純看原始 JSON 方便很多。

有趣的是，Datasette Lite 還顯示出三個 speaker：它辨識出對談中的 Lenny 和 Simon，另外還把 Lenny 旁白與贊助口播用的聲音辨識成另一個 speaker。

VibeVoice 最多只能處理一小時音檔，所以剛剛那個指令也只轉錄了前一小時。若要處理更長內容，就得把音檔切段，最好還要留一點重疊，避免切點把單字切爛；之後還得把不同段落的 speaker id 串接起來。

<div class="sep">· · ·</div>

## 延伸評論：語音 AI 真正的門檻不是準不準，而是整條鏈路順不順

這篇最實用的訊號，不是「Microsoft 又出了一個模型」，而是它提醒人：語音轉文字產品最後拼的從來不只是辨識率，還有長音檔處理、說話人分離、記憶體占用、切段重組與輸出格式。

對做 podcast、會議紀錄、訪談整理或客服分析的人來說，這種本機可跑、又能把 speaker metadata 一起吐出來的工具，往往比一個更會吹牛的 API 更有價值。