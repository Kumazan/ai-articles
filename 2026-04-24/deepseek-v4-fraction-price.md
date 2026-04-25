---
title: "DeepSeek V4：幾乎站上前沿，價格卻只要一小部分"
description: "DeepSeek V4 以 1M context、MoE 架構與極低定價挑戰前沿模型市場，連帶把 open weights、推論效率與價格戰一起推向新一輪競爭。"
date: 2026-04-24
author: Simon Willison
layout: post
permalink: /2026-04-24/deepseek-v4-fraction-price.html
image: /2026-04-24/og-deepseek-v4-fraction-price.png
---

<div class="hero-badge">AI News · 2026-04-24</div>

![](/ai-articles/2026-04-24/og-deepseek-v4-fraction-price.png)

**原文連結：** [DeepSeek V4—almost on the frontier, a fraction of the price](https://simonwillison.net/2026/Apr/24/deepseek-v4/)

## 摘要

- DeepSeek 一口氣推出兩個 V4 預覽模型：DeepSeek-V4-Pro 與 DeepSeek-V4-Flash。
- 兩者都支援 1M token context，並採用 Mixture of Experts 架構，規模與成本都很有侵略性。
- Pro 版是 1.6T total parameters、49B active parameters；Flash 則是 284B total、13B active。
- Simon Willison 用「騎腳踏車的鵜鶘」測試比對新舊模型，認為這次的視覺生成品質明顯進步。
- 真正震撼的不是鵜鶘，而是定價：Flash 幾乎把小型前沿模型的價格打到地板，Pro 也比同級模型便宜很多。
- 這篇文章很適合做為「前沿能力不一定要前沿價格」的最新註腳。
- 對做產品與推論的人來說，DeepSeek V4 把效率、長上下文與成本控制綁成了一次很有壓迫感的展示。

<div class="sep">· · ·</div>

24th April 2026

Chinese AI lab DeepSeek’s last model release was V3.2 (and V3.2 Speciale) [last December](https://simonwillison.net/2025/Dec/1/deepseek-v32/). They just dropped the first of their hotly anticipated V4 series in the shape of two preview models, [DeepSeek-V4-Pro](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro) and [DeepSeek-V4-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash).

DeepSeek 中文 AI 實驗室上一次發布模型還是 V3.2（以及 V3.2 Speciale），時間要追溯到去年 12 月。這次他們一口氣丟出備受期待的 V4 系列第一波預覽模型：DeepSeek-V4-Pro 與 DeepSeek-V4-Flash。

Both models are 1 million token context Mixture of Experts. Pro is 1.6T total parameters, 49B active. Flash is 284B total, 13B active. They’re using the standard MIT license.

兩個模型都支援 100 萬 token context，並採用 Mixture of Experts（MoE）架構。Pro 版共有 1.6T total parameters、49B active parameters；Flash 版則是 284B total、13B active。兩者都採用標準 MIT 授權。

I think this makes DeepSeek-V4-Pro the new largest open weights model. It’s larger than Kimi K2.6 (1.1T) and GLM-5.1 (754B) and more than twice the size of DeepSeek V3.2 (685B).

這讓我認為 DeepSeek-V4-Pro 已經是新的最大 open weights 模型。它比 Kimi K2.6（1.1T）和 GLM-5.1（754B）都大，甚至比 DeepSeek V3.2（685B）還大出兩倍多。

Pro is 865GB on Hugging Face, Flash is 160GB. I’m hoping that a lightly quantized Flash will run on my 128GB M5 MacBook Pro. It’s possible the Pro model may run on it if I can stream just the necessary active experts from disk.

Pro 在 Hugging Face 上是 865GB，Flash 是 160GB。我希望稍微量化過的 Flash 可以跑在 128GB 的 M5 MacBook Pro 上。若能只從磁碟串流必要的 active experts，Pro 也有可能在那台機器上跑起來。

For the moment I tried the models out via [OpenRouter](https://openrouter.ai/), using [llm-openrouter](https://github.com/simonw/llm-openrouter):

目前我先透過 [OpenRouter](https://openrouter.ai/) 測試這些模型，並使用 [llm-openrouter](https://github.com/simonw/llm-openrouter)：

```bash
llm install llm-openrouter
llm openrouter refresh
llm -m openrouter/deepseek/deepseek-v4-pro 'Generate an SVG of a pelican riding a bicycle'
```

Here’s the pelican [for DeepSeek-V4-Flash](https://gist.github.com/simonw/4a7a9e75b666a58a0cf81495acddf529):

這是 DeepSeek-V4-Flash 產生的鵜鶘：[連結](https://gist.github.com/simonw/4a7a9e75b666a58a0cf81495acddf529)：

And [for DeepSeek-V4-Pro](https://gist.github.com/simonw/9e8dfed68933ab752c9cf27a03250a7c):

這是 DeepSeek-V4-Pro 產生的版本：[連結](https://gist.github.com/simonw/9e8dfed68933ab752c9cf27a03250a7c)：

For comparison, take a look at the pelicans I got from [DeepSeek V3.2 in December](https://simonwillison.net/2025/Dec/1/deepseek-v32/), [V3.1 in August](https://simonwillison.net/2025/Aug/22/deepseek-31/), and [V3-0324 in March 2025](https://simonwillison.net/2025/Mar/24/deepseek/).

拿來對照的話，可以看看我在 [去年 12 月的 DeepSeek V3.2](https://simonwillison.net/2025/Dec/1/deepseek-v32/)、[去年 8 月的 V3.1](https://simonwillison.net/2025/Aug/22/deepseek-31/)，以及 [2025 年 3 月的 V3-0324](https://simonwillison.net/2025/Mar/24/deepseek/) 產生的鵜鶘。

So the pelicans are pretty good, but what’s really notable here is the cost. DeepSeek V4 is a very, very inexpensive model.

所以鵜鶘表現其實相當不錯，但真正值得注意的是成本。DeepSeek V4 是一個非常非常便宜的模型。

This is [DeepSeek’s pricing page](https://api-docs.deepseek.com/quick_start/pricing). They’re charging $0.14/million tokens input and $0.28/million tokens output for Flash, and $1.74/million input and $3.48/million output for Pro.

這是 [DeepSeek 的定價頁](https://api-docs.deepseek.com/quick_start/pricing)。Flash 的價格是每百萬 input tokens $0.14、每百萬 output tokens $0.28；Pro 則是每百萬 input tokens $1.74、每百萬 output tokens $3.48。

Here’s a comparison table with the frontier models from Gemini, OpenAI and Anthropic:

下面這張表是拿 Gemini、OpenAI 與 Anthropic 的前沿模型來對照：

| Model | Input ($/M) | Output ($/M) |
| --- | ---: | ---: |
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

DeepSeek-V4-Flash is the cheapest of the small models, beating even OpenAI’s GPT-5.4 Nano. DeepSeek V4 Pro is the cheapest of the larger frontier models.

DeepSeek-V4-Flash 是小型模型裡最便宜的一個，連 OpenAI 的 GPT-5.4 Nano 都被它壓過。DeepSeek V4 Pro 則是大型前沿模型裡最便宜的選項。

This note from [the DeepSeek paper](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash/blob/main/DeepSeek_V4.pdf) helps explain why they can price these models so low—they’ve focused a great deal on efficiency with this release, especially for longer context prompts:

[DeepSeek 論文](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash/blob/main/DeepSeek_V4.pdf) 裡有一段註記，能解釋為什麼他們可以把價格壓得這麼低——這次發表特別強調效率，尤其是長上下文提示：

> In the scenario of 1M-token context, even DeepSeek-V4-Pro, which has a larger number of activated parameters, attains only 27% of the single-token FLOPs (measured in equivalent FP8 FLOPs) and 10% of the KV cache size relative to DeepSeek-V3.2. Furthermore, DeepSeek-V4-Flash, with its smaller number of activated parameters, pushes efficiency even further: in the 1M-token context setting, it achieves only 10% of the single-token FLOPs and 7% of the KV cache size compared with DeepSeek-V3.2.

> 在 100 萬 token context 的情境下，即使是 DeepSeek-V4-Pro，雖然啟用的參數更多，單 token FLOPs（以等效 FP8 FLOPs 計）也只相當於 DeepSeek-V3.2 的 27%，KV cache 也只需要 10%。而 DeepSeek-V4-Flash 因為啟用參數更少，效率又更進一步：在 100 萬 token context 設定下，單 token FLOPs 只有 DeepSeek-V3.2 的 10%，KV cache 只需要 7%。

DeepSeek’s self-reported benchmarks [in their paper](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash/blob/main/DeepSeek_V4.pdf) show their Pro model competitive with those other frontier models, albeit with this note:

DeepSeek 在論文中自行揭露的 benchmark [同樣收錄在這份 paper 裡](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash/blob/main/DeepSeek_V4.pdf)，顯示 Pro 版可以和其他前沿模型競爭，不過也附了一段註解：

> Through the expansion of reasoning tokens, DeepSeek-V4-Pro-Max demonstrates superior performance relative to GPT-5.2 and Gemini-3.0-Pro on standard reasoning benchmarks. Nevertheless, its performance falls marginally short of GPT-5.4 and Gemini-3.1-Pro, suggesting a developmental trajectory that trails state-of-the-art frontier models by approximately 3 to 6 months.

> 透過擴展 reasoning tokens，DeepSeek-V4-Pro-Max 在標準推理 benchmark 上相較於 GPT-5.2 與 Gemini-3.0-Pro 展現出更高表現。不過，它的表現仍略低於 GPT-5.4 與 Gemini-3.1-Pro，表示其發展軌跡大約落後目前最先進的前沿模型 3 到 6 個月。

I’m keeping an eye on [huggingface.co/unsloth/models](https://huggingface.co/unsloth/models) as I expect the Unsloth team will have a set of quantized versions out pretty soon. It’s going to be very interesting to see how well that Flash model runs on my own machine.

我會持續關注 [huggingface.co/unsloth/models](https://huggingface.co/unsloth/models)，因為我預期 Unsloth 團隊很快就會釋出一批量化版本。那個 Flash 模型在我的機器上到底能跑多好，會非常值得觀察。

<div class="sep">· · ·</div>

## 給做產品與推論的人：便宜到這種程度，競爭就不是同一場了

DeepSeek V4 這篇最有殺傷力的地方，不是它又多大，而是它把「前沿模型一定很貴」這件事打出裂痕。當 1M context、MoE、接近前沿的表現，能被壓到這種價格，接下來比的不只是哪家最強，而是誰能用最低的成本把能力穩定塞進產品。

這也會逼很多團隊重新算帳。以前只要把模型當黑盒接上去就好，現在得開始思考：長上下文值不值得、active parameters 要不要更克制、推論流水線能不能更省。模型競爭不再只是 benchmark 對決，而是整條系統誰比較會省。

更現實的是，這種價格會改變使用者的期待。當便宜模型已經夠好，大家就不會再容忍昂貴模型只是「大一點點更準」；真正的門檻會從能力差距，轉成整體效率與可部署性。