---
title: "AI 時代科技圈最後 4 種工作？其實更值得看的是 coding agent 基礎設施之戰"
description: "Latent Space 用一篇 AINews 串起 Claude Code、Hermes、Qwen3.5-Omni 與本地推論的最新動向，真正的主線不是模型分數，而是 agent harness、工作流與部署模式正在重寫開發現場。"
date: 2026-03-31
author: Latent Space / AINews
layout: post
permalink: /2026-03-31/last-4-jobs-in-tech-agent-harness-race.html
---

<div class="hero-badge">AI News · 2026-03-31</div>

**原文連結：** [https://www.latent.space/p/ainews-the-last-4-jobs-in-tech](https://www.latent.space/p/ainews-the-last-4-jobs-in-tech)

## 摘要

- 這篇表面上在談「AI 時代科技圈最後會剩哪些工作」，實際上更有價值的是它把 3/28 到 3/30 的 agent 生態變化整理成一張地圖。
- Anthropic 把 computer use 帶進 Claude Code，讓 coding agent 從「會寫」走向「會自己驗證 UI 與操作流程」。
- OpenAI 的 Codex 也開始能嵌進 Claude Code 內做 review、rescue 與對抗式檢查，顯示未來不是單一產品通吃，而是多 agent 組裝成工作流。
- Hermes Agent 快速崛起，重點不是又一個助手，而是把 memory、skills、history、gateway 變成可分身、可配置的 agent OS。
- 另一方面，Qwen3.5-Omni、GLM-5-Turbo、llama.cpp、Apple Silicon 本地推論等訊號都指出：模型能力差距在縮小，真正拉開體驗差異的是 harness、部署模式與成本結構。

<div class="sep">· · ·</div>

Latent Space 這篇 AINews 用一個很聳動的題目開頭，但真正值得翻的不是「最後 4 種工作」這句話本身，而是它把最近幾天 AI 工程圈最重要的變化串起來：**競爭主軸正在從模型本身，轉向 agent 的工作流、基礎設施與執行環境。**

先看最直接的變化：**Claude Code 加入 computer use**。這件事的意義不是多了一個酷炫 demo，而是 coding agent 開始具備「寫完之後自己動手驗證」的能力。以前 agent 常停在產生程式碼、跑測試、看 log；現在它可以真的開 app、點 UI、觀察畫面、回頭修 bug，再重新驗證。這讓整個 loop 更接近真人工程師的工作方式，也大幅提升「把東西做到能用」的機率。

同一時間，**OpenAI 推出可嵌入 Claude Code 的 Codex plugin**，能在 Anthropic 的工具鏈裡觸發 review、對抗式審查與 rescue flow。這代表一個更大的趨勢：未來的 AI 開發工具，不一定是某一家平台把全部功能包到滿，而更像是一組彼此可編排的 agent 與工具。產品邊界開始鬆動，工作流組裝能力變成核心競爭力。

原文也特別提到另一個現象：**harness quality 已經是一級變數**。也就是說，模型本身的能力差距雖然還存在，但實務上你用哪個 runtime、prompt 編排、review loop、記憶壓縮、工具接法，往往比 benchmark 上那幾分更影響結果。這點對所有做 agent 系統的人都很重要：你買的其實不只是模型，而是一整套「讓模型穩定完成任務」的外掛骨架。

這也是為什麼 **Hermes Agent** 在這幾天特別受關注。它的亮點不只是「又一個 OpenClaw 替代品」，而是把每個 agent 的 memory、skills、history、gateway connection 變成獨立可配置的 profile。換句話說，它開始把 assistant 做成一種可複用的作業系統抽象，而不是單一聊天機器人。圍繞 Hermes 出現的 traces、remote control、fine-tune successor、瀏覽器監控等周邊工具，也說明這個領域正在往完整生態系演進。

再來是模型層的訊號。**Qwen3.5-Omni** 代表多模態 agent 正在往更實用的方向走，不只是會看圖聽音，而是開始支援 web search、function calling，甚至能用語音＋視覺描述去做「audio-visual vibe coding」。而 **GLM-5-Turbo / AutoClaw** 這類產品則反映另一條路線：把模型調教成更適合 agent 工作流的形狀，而不是只追求通用 benchmark 的最高分。

本地推論也是這篇很重要的一條支線。**llama.cpp 破 100k stars**、Apple Silicon 上的 Flash-MoE、各種可在本機跑的 open model 與 runtime 優化，都在強化一個論點：對很多任務來說，不一定需要最大、最貴、雲端託管的 frontier model。只要 runtime 做得好、記憶與工具鏈設計得好，本地 agent 也可能達到夠用甚至很好用的程度。這讓「隱私、可控性、成本、可移植性」重新回到桌上。

原文後段還點到幾個更研究味但很關鍵的方向。例如把 harness engineering 當成一個獨立研究領域來做，或用自然語言 SOP 取代部分硬編碼 orchestration，甚至讓 agent 把超長上下文當成「可瀏覽的檔案系統」而不是硬塞進 context window。這些方向共同說明一件事：**agent 的未來，不只是更大的模型，而是更聰明的外部結構。**

如果把整篇濃縮成一句話，那就是：**2026 年的競爭，正從「誰的模型更強」轉成「誰能把模型放進更好的工作流裡」。** Claude Code 的 computer use、Codex 與 Claude 的互通、Hermes 的 profile 化、本地推論與 open runtime 的成熟，全部都在證明這件事。

對開發者來說，這篇最有價值的提醒不是哪個模型今天又贏了幾分，而是：**真正會留下來的優勢，可能不是模型 API 本身，而是你如何設計 agent 的 memory、tooling、review、execution 與 deployment。** 這也解釋了為什麼最近最有討論度的內容，越來越不是單一模型發表，而是那些能把 agent 變得更可靠、更便宜、更可組裝的系統層創新。