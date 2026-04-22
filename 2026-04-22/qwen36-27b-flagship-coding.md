---
title: "Qwen3.6-27B：27B 稠密模型也能做到旗艦級 coding"
description: "Qwen3.6-27B 以 27B 稠密架構挑戰前代 397B MoE，在 agentic coding 與本地部署上都交出驚人表現。"
date: 2026-04-22
author: Simon Willison
layout: post
permalink: /2026-04-22/qwen36-27b-flagship-coding.html
image: /2026-04-22/og-qwen36-27b-flagship-coding.png
---

<div class="hero-badge">AI News · 2026-04-22</div>

![](/ai-articles/2026-04-22/og-qwen36-27b-flagship-coding.png)

**原文連結：** [Flagship-Level Coding in a 27B Dense Model](https://simonwillison.net/2026/Apr/22/qwen36-27b/)

## 摘要

- Qwen3.6-27B 主打 agentic coding，官方說法是直接超越前一代 Qwen3.5-397B-A17B。
- 這次最誇張的地方，不是能力表現而已，而是模型體積只剩 55.6GB，遠小於前代的 807GB。
- Simon 用 16.8GB 的量化版在本機跑起來，證明它不只是雲端 demo，也有實際本地部署的可玩性。
- 文章展示了長達數千 token 的生成過程，速度與穩定度都很亮眼。
- 不過 Simon 也刻意提醒，單靠「畫隻鵜鶘騎腳踏車」這種題目，不能過度解讀模型真正的實用價值。
- 這篇的核心訊號很清楚，小模型不再只是便宜替代品，有些場景它已經能正面挑戰巨無霸模型。

<div class="sep">· · ·</div>

[Qwen3.6-27B: Flagship-Level Coding in a 27B Dense Model](https://qwen.ai/blog?id=qwen3.6-27b) 這篇一出來，最吸睛的不是又一個模型名稱，而是它的規模對比。Qwen 宣稱，Qwen3.6-27B 在旗艦級 agentic coding 表現上，已經超過上一代開源旗艦 Qwen3.5-397B-A17B。前者是 27B 稠密模型，後者是總參數 397B、啟用 17B 的 MoE，體積卻從 807GB 縮到 55.6GB。

Simon 直接拿 16.8GB 的 Unsloth 量化版 Qwen3.6-27B-GGUF:Q4_K_M 來試，並用 `llama-server` 跑起來：

```bash
llama-server \
 -hf unsloth/Qwen3.6-27B-GGUF:Q4_K_M \
 --no-mmproj \
 --fit on \
 -np 1 \
 -c 65536 \
 --cache-ram 4096 -ctxcp 2 \
 --jinja \
 --temp 0.6 \
 --top-p 0.95 \
 --top-k 20 \
 --min-p 0.0 \
 --presence-penalty 0.0 \
 --repeat-penalty 1.0 \
 --reasoning on \
 --chat-template-kwargs '{"preserve_thinking": true}'
```

第一次執行後，模型就被存到本機快取裡，接著他用「Generate an SVG of a pelican riding a bicycle」測試這個本地模型。結果相當亮眼：reading 20 tokens、0.4 秒、54.32 tokens/s，generation 4,444 tokens、2 分 53 秒、25.57 tokens/s。

他又補了一個「NORTH VIRGINIA OPOSSUM ON AN E-SCOOTER」測試，總共 6,575 tokens、4 分 25 秒、24.74 t/s。整體來看，這顆 16.8GB 的本地模型，已經不是只能「勉強能跑」的等級，而是能做出很像樣的複雜輸出。

但 Simon 也沒有把這種測試神化。這類 pelican 測試很適合看模型即興生成與工具使用的能力，卻不代表它在真實開發情境裡就一定全面勝出。真正值得注意的，是開源陣營正在把「夠小、夠快、夠能打」這三件事，同時往前推。

<div class="sep">· · ·</div>

## 延伸評論：小模型開始正面威脅代理式 coding 的成本假設

這篇最值得記住的，不是又一個 benchmark 數字，而是它在暗示一個更現實的轉折，代理式 coding 不一定要靠超大模型撐場。當 27B 稠密模型開始能碰到前代巨型 MoE 的旗艦級表現，開發者真正該重新估算的，是延遲、成本、部署彈性，而不只是分數。

對做 agent 或本地推論的人來說，這種模型最有價值的地方，是把「可用」和「可控」拉得更近。能塞進本機、能在有限資源上跑、還能維持不錯的 coding 能力，代表很多原本只能丟雲端的工作流，開始有機會回到自己手上。

但也別太快把它當成終局。小模型越強，越容易讓團隊以為可以少做驗證、少做監控、少做評估。真正的下一步，不是只看模型大小，而是把它放進完整工作流後，看看整體系統到底是更省，還是只是把成本換個地方藏起來。