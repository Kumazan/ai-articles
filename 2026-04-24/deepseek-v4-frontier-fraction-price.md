---
title: "DeepSeek V4：幾乎站上前沿，價格卻只要一小部分"
description: "DeepSeek 推出 V4 Pro 與 Flash 兩款 1M context 的預覽模型，主打更大的稀疏參數、更低的推論成本與長上下文效率，直接把前沿模型的價格戰再往前推。"
date: 2026-04-24
author: Simon Willison
layout: post
permalink: /2026-04-24/deepseek-v4-frontier-fraction-price.html
image: /2026-04-24/og-deepseek-v4-frontier-fraction-price.png
---

<div class="hero-badge">AI News · 2026-04-24</div>

![](/ai-articles/2026-04-24/og-deepseek-v4-frontier-fraction-price.png)

**原文連結：** [DeepSeek V4—almost on the frontier, a fraction of the price](https://simonwillison.net/2026/Apr/24/deepseek-v4/)

## 摘要

- DeepSeek 發布 V4 系列的兩個預覽模型：V4-Pro 與 V4-Flash。
- 兩者都支援 100 萬 token context，定位是長上下文推論。
- V4-Pro 共有 1.6T 總參數、49B 活躍參數；V4-Flash 則是 284B 總參數、13B 活躍參數。
- DeepSeek 宣稱兩款模型都採 MIT 授權，進一步降低使用門檻。
- 價格非常激進：Flash 的輸入成本是 $0.14/M，輸出 $0.28/M。
- 作者認為 V4-Pro 已是目前最大的開源權重模型之一，而且在成本上明顯壓過其他前沿模型。

<div class="sep">· · ·</div>

24 日，DeepSeek 釋出了大家期待已久的 V4 系列第一波預覽模型：DeepSeek-V4-Pro 與 DeepSeek-V4-Flash。

這兩個模型都採用 100 萬 token context 的 Mixture of Experts 架構。Pro 版本共有 1.6T 總參數、49B 活躍參數；Flash 版本則是 284B 總參數、13B 活躍參數。兩者都使用標準 MIT 授權。

作者認為，這代表 DeepSeek-V4-Pro 可能已經是新的最大開源權重模型。它比 Kimi K2.6（1.1T）和 GLM-5.1（754B）都更大，也比 DeepSeek V3.2（685B）大上許多。

Pro 版本在 Hugging Face 上的檔案大小是 865GB，Flash 則是 160GB。作者希望輕量量化後的 Flash 可以在 128GB 的 M5 MacBook Pro 上跑起來；Pro 也許有機會透過把必要的活躍專家從磁碟串流進來而運作。

目前作者先透過 OpenRouter 試跑這些模型，搭配 llm-openrouter：

```bash
llm install llm-openrouter
llm openrouter refresh
llm -m openrouter/deepseek/deepseek-v4-pro 'Generate an SVG of a pelican riding a bicycle'
```

下面是 DeepSeek-V4-Flash 生成的鵜鶘：

接著是 DeepSeek-V4-Pro 的版本：

如果要比較，可以再看看作者在 2025 年 12 月、2025 年 8 月，以及 2025 年 3 月用 DeepSeek V3.2、V3.1 與 V3-0324 做出來的鵜鶘圖。

不過真正值得注意的不是鵜鶘畫得多好，而是成本。DeepSeek V4 非常、非常便宜。

作者引用 DeepSeek 的定價頁如下：Flash 的輸入價格是每百萬 token $0.14，輸出價格是 $0.28；Pro 則是每百萬 token $1.74 輸入、$3.48 輸出。

| 模型 | 輸入（每百萬 token） | 輸出（每百萬 token） |
|---|---:|---:|
| DeepSeek V4 Flash | $0.14 | $0.28 |
| GPT-5.4 Nano | $0.20 | $1.25 |
| Gemini 3.1 Flash-Lite | $0.25 | $1.50 |
| Gemini 3 Flash Preview | $0.50 | $3 |
| GPT-5.4 Mini | $0.75 | $4.50 |
| Claude Haiku 4.5 | $1 | $5 |
| DeepSeek V4 Pro | $1.74 | $3.48 |
| Gemini 3.1 Pro | $2 | $12 |
| GPT-5.4 | $2.50 | $15 |
| Claude Sonnet 4.6 | $3 | $15 |
| Claude Opus 4.7 | $5 | $25 |
| GPT-5.5 | $5 | $30 |

DeepSeek-V4-Flash 是目前最便宜的小模型，甚至壓過 OpenAI 的 GPT-5.4 Nano。DeepSeek-V4-Pro 則是大型前沿模型裡價格最低的那一批。

作者也引用了 DeepSeek 論文中的一段話，說明為什麼這次定價可以壓得這麼低，特別是在長上下文場景：

> 在 1M token context 的情境下，即使是活躍參數較多的 DeepSeek-V4-Pro，相較於 DeepSeek-V3.2，其單 token FLOPs（以等效 FP8 FLOPs 計）只有 27%，KV cache 大小只有 10%。而活躍參數更少的 DeepSeek-V4-Flash 把效率再往前推一步：在 1M token context 下，它的單 token FLOPs 只有 DeepSeek-V3.2 的 10%，KV cache 也只有 7%。

DeepSeek 論文中的自評 benchmark 顯示，Pro 模型在多項指標上已經能和其他前沿模型競爭。不過論文也補了一句：

> 透過增加 reasoning token，DeepSeek-V4-Pro-Max 在標準推理 benchmark 上優於 GPT-5.2 與 Gemini-3.0-Pro。儘管如此，它的表現仍略低於 GPT-5.4 與 Gemini-3.1-Pro，表示它大約落後最新前沿模型 3 到 6 個月。

作者表示，自己會持續關注 Hugging Face 上的 unsloth/models，因為預期 Unsloth 團隊很快會釋出一批量化版本。接下來最有趣的事，會是看看 Flash 模型在本機上到底能跑得多好。

<div class="sep">· · ·</div>

## 成本戰已經不只是「更便宜」，而是「用更少算力做到差不多前沿」

DeepSeek V4 這次最狠的地方，不是單純把價格砍低，而是把「長上下文 + frontier 級別能力」包在一起賣。當 1M token 成為賣點時，真正的差異就不只在模型分數，而是整套推論效率、KV cache 與活躍參數的工程設計。

這也意味著一個很現實的趨勢：前沿模型之間的競爭，越來越像雲端成本與部署彈性的競賽。誰能在足夠接近頂尖表現的前提下，把每千 token 的成本壓到最低，誰就更容易吃到大量工作負載。DeepSeek V4 的訊號很清楚——開源權重陣營已經不只是追趕，而是在某些價格區間直接改寫遊戲規則。