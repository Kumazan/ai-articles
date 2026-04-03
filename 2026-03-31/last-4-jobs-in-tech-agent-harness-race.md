---
title: "AI 時代科技圈最後 4 種工作？其實更值得看的是 coding agent 基礎設施之戰"
description: "AI coding agent 最新戰況：harness 競賽、本地推論崛起、模型廠商與工具鏈整合，真正的主線是部署與工作流模式的創新。"
date: 2026-03-31
author: Latent Space / AINews
layout: post
permalink: /2026-03-31/last-4-jobs-in-tech-agent-harness-race.html
image: /2026-03-31/og-last-4-jobs-in-tech-agent-harness-race.png
---

<div class="hero-badge">AI News · 2026-03-31</div>

![](/ai-articles/2026-03-31/og-last-4-jobs-in-tech-agent-harness-race.png)

**原文連結：** [https://www.latent.space/p/ainews-the-last-4-jobs-in-tech](https://www.latent.space/p/ainews-the-last-4-jobs-in-tech)

## 摘要

- 這篇 AINews 真正的主題，不是標題上的「最後 4 種工作」，而是最近幾天 AI 工程圈在 coding agents、agent harness 與本地推論上的關鍵變化。
- Claude Code 加入 computer use，讓 agent 從「會寫 code」進一步走向「會自己操作、驗證、修正、再測試」的閉環工作流。
- Codex plugin 可嵌進 Claude Code、Hermes Agent 的多 profile 架構，以及各種 traces / remote control / self-improvement 工具，都顯示 agent 生態正快速模組化。
- Qwen3.5-Omni、GLM-5-Turbo、AutoClaw、llama.cpp、Flash-MoE 等訊號共同指出：模型之外，runtime、tooling、部署與成本控制，正變成實務差異的核心來源。
- 原文最後也把自然語言 harness、非同步多 agent SWE 架構、把超長上下文當作檔案系統來瀏覽等研究方向串起來，說明 agent 的未來更像系統工程，而不只是模型競賽。

這篇文章雖然用「AI 時代科技圈最後 4 種工作」當標題，但內容真正更重要的部分，是把 2026/3/28 到 3/30 這幾天 AI 工程圈最值得注意的發展整理成一張地圖。

文章第一部分聚焦在 **Claude Code、Codex 互通，以及 coding-agent harness 的競賽**。

Anthropic 把 **computer use** 帶進 Claude Code，讓 agent 可以直接在 CLI 中開啟應用程式、點擊 UI，並親自測試它剛做好的東西，目前以 research preview 形式提供給 Pro / Max 使用者。原文指出，這件事最實際的意義是補上「閉環驗證」：從寫 code、執行、觀察 UI、修正，再重新測試。多位工程師都把這視為可靠 app iteration 缺少的最後一塊，尤其相較於那些比較開放、但未必穩定的桌面代理。

接著，原文提到 **跨 agent 組裝正逐漸成為標準做法**。OpenAI 推出可嵌入 Claude Code 的 Codex plugin，能直接在 Anthropic 的工具鏈裡觸發 review、adversarial review 與 rescue flow，而且依賴的是 ChatGPT 訂閱，而不是一套自己黏起來的客製 glue code。原文認為，這件事重要的地方不只是 plugin 新奇，而是它透露出 coding stack 正在從單體產品，變成可組裝的 harness。另有一個有趣訊號是，OpenAI 分享深夜啟動的 Codex 任務更容易跑超過 3 小時，這也呼應了越來越多重構與規劃工作被丟給背景 agent 的趨勢。

同一部分裡，原文也強調 **harness quality 已經明顯成為一級變數**。Theo 的觀點是，同樣的 Opus 模型在 Cursor 中的表現可能比在 Claude Code 高出約 20%，而更大的問題是，當 harness 是閉源時，社群很難有效診斷或修復回歸。這個主題在整期動態裡反覆出現：模型能力差距雖然仍存在，但工具鏈、prompt / runtime orchestration，以及 review loop，常常才是造成實務落差的關鍵。

第二部分談的是 **Hermes Agent 的快速崛起、多 agent profiles，以及開放式 harness 生態**。

Nous 推出一個重大 Hermes Agent 更新後，這一週出現一波從 OpenClaw 或類似架構遷移過去的案例。使用者特別提到它在 compaction、減少 bloated context、適應性與出貨速度上的優勢。原文認為，Hermes 這次最重要的更新，是新的 **multi-agent profiles**：每個 bot 都能擁有自己的 memory、skills、history 與 gateway connections。這讓 Hermes 開始從「個人助理」走向一種可重複利用的 agent OS abstraction。

原文也提到，Hermes 周圍正在長出完整的附屬生態。像 opentraces.ai 提供了 CLI / schema / review 流程，讓人可以清理並發佈 agent traces 到 Hugging Face，拿來做 analytics、evals、SFT 與 RL；也有人已經把約 4,000 條 GLM-5 Hermes traces 上傳到 HF。還有整合方案讓 agent 可以記錄自己的決策、匯出資料、根據歷史 fine-tune 更小的 successor model，再切換到更便宜的模型上運作；ARC 則加入遠端瀏覽器監控 / 控制與端對端加密。這些都說明，開放式 agent infra 的競爭已經不只是 inference 本身，而是整套營運與改進工具鏈。

第三部分聚焦在 **Qwen3.5-Omni、GLM-5-Turbo / AutoClaw，以及 local / agentic specialization 的推進**。

Alibaba 推出的 **Qwen3.5-Omni** 是這期最重要的多模態發布之一。它原生支援文字、圖片、音訊與影片理解，還有腳本級字幕、內建 web search 與 function calling。文中提到的一個亮眼 demo，是用語音加視覺指令完成「audio-visual vibe coding」，讓模型根據口語描述建立網站或遊戲。官方數據聲稱它支援 10 小時音訊、400 秒 720p 影片、113 種語音辨識語言與 36 種口語語言，並在音訊能力上超過 Gemini 3.1 Pro，在某些影音理解設定裡達到相近表現。不過原文也提醒一個有用的 caveat：這裡的「omni」主要指多模態理解，不代表它能任意完成所有形式的多模態生成。

另一條線是 **Z AI 持續把模型調向 agentic workloads**。Artificial Analysis 評估 GLM-5-Turbo 後發現，它在 AA Intelligence Index 上略低於 open-weight 的 GLM-5 (Reasoning)，但在 GDPval-AA 上反而更高，支持了這個模型更偏向真實 agent workflow，而不是追求通用 benchmark 最大化的說法。原文接著把這個趨勢延伸成更大的觀察：越來越多公司，未來可能會選擇在 proprietary data 上擁有並特化 open models，而不是永遠租用通用 API。支撐這個論點的例子，包括從 Claude 4.6 Opus 蒸餾出的 Qwen3.5-27B 模型、以及日益升高的 llama.cpp / MLX 本地 runtime 熱度。

第四部分是 **local inference 與系統層進展**。

原文把 **llama.cpp 破 100k GitHub stars** 視為一個象徵性里程碑。ggerganov 的觀點是，2026 很可能是 local agentic workflows 真正爆發的一年，因為有用的自動化並不必然需要 frontier-scale 的 hosted models，真正重要的是 portable runtime stack，以及不被單一硬體或供應商綁死的基礎設施。

另一個被大量轉貼的例子，是 **Apple Silicon 上的 Flash-MoE**。有人聲稱 Qwen3.5-397B 可以在 48GB MacBook Pro 上以純 C + Metal 引擎跑到 4.4 tok/s，透過從 SSD 串流權重、只載入 active experts，推論時只用到約 5.5GB RAM。再加上 anemll-flash-mlx 與 AI Toolkit 對 Apple Silicon 的支援，顯示 Mac 本地推論正逐漸從玩具變成有實務價值的路線。

同一區塊也涵蓋 web 與 serving stacks 的更新。例如 Transformers.js v4 帶來橫跨 browser / Node / Bun / Deno 的 WebGPU backend 與大幅效能提升；vLLM-Omni v0.18.0 則加入大量 commits、生產級 TTS / omni serving、統一量化與多個新模型支援；Cohere Transcribe 這類開源語音模型，也在速度與錯誤率上展現了很強的工程實用性。

第五部分談的是 **agent research**，也就是把 harness engineering 本身當成研究主題。

原文提到清華 / 深圳的一篇論文，提出用 **natural-language agent harness** 來執行 orchestration logic，也就是讓 LLM 直接依照 SOP 運作，而不是把全部規則硬編碼進 harness 裡。Meta 更進一步提出 **Meta-Harness**，嘗試針對 code、traces 與 scores 端到端最佳化 harness，而不只是調 base model。另一篇來自 CMU 的 **CAID** 論文則支持非同步、多 agent、隔離式 delegation 的 SWE 設計：由 manager agent 管理依賴圖、隔離 git worktrees、自我驗證並合併。相較單一 agent 多跑幾輪，這種並行與隔離策略在多個 benchmark 上都有明顯提升。

最後，原文也點到一個很有意思的 framing：**把 coding agents 當成 long-context processors**。有論文不是把海量文本硬塞進 context window，也不只靠 retrieval，而是把巨量語料視為目錄樹，讓現成 coding agents 用 shell 與 Python 去瀏覽。原文引用的結果顯示，這種方法在 BrowseComp-Plus 與超長 token 規模下都有不錯表現。這其實暗示了一個方向：未來 agent 不一定靠更大的 context window 解決一切，而可能靠更好的外部導航結構。

整體來看，這篇 AINews 的共同訊息很清楚：**模型能力仍重要，但真正把體驗拉開的，越來越是 harness、runtime、review loop、部署方式，以及能不能把 agent 放進一個更完整、更可靠、更便宜的工作流裡。**

<div class="sep">· · ·</div>

## 模型之外的競爭：harness、runtime 與工作流才是真正的戰場

Latent Space 這篇 AINews 用一個很聳動的題目開頭，但真正值得翻的不是「最後 4 種工作」這句話本身，而是它把最近幾天 AI 工程圈最重要的變化串起來：競爭主軸正在從模型本身，轉向 agent 的工作流、基礎設施與執行環境。

先看最直接的變化：Claude Code 加入 computer use。這件事的意義不是多了一個酷炫 demo，而是 coding agent 開始具備「寫完之後自己動手驗證」的能力。以前 agent 常停在產生程式碼、跑測試、看 log；現在它可以真的開 app、點 UI、觀察畫面、回頭修 bug，再重新驗證。這讓整個 loop 更接近真人工程師的工作方式，也大幅提升「把東西做到能用」的機率。

同一時間，OpenAI 推出可嵌入 Claude Code 的 Codex plugin，能在 Anthropic 的工具鏈裡觸發 review、對抗式審查與 rescue flow。這代表一個更大的趨勢：未來的 AI 開發工具，不一定是某一家平台把全部功能包到滿，而更像是一組彼此可編排的 agent 與工具。產品邊界開始鬆動，工作流組裝能力變成核心競爭力。

原文也特別提到另一個現象：harness quality 已經是一級變數。也就是說，模型本身的能力差距雖然還存在，但實務上你用哪個 runtime、prompt 編排、review loop、記憶壓縮、工具接法，往往比 benchmark 上那幾分更影響結果。這點對所有做 agent 系統的人都很重要：你買的其實不只是模型，而是一整套「讓模型穩定完成任務」的外掛骨架。

這也是為什麼 Hermes Agent 在這幾天特別受關注。它的亮點不只是「又一個 OpenClaw 替代品」，而是把每個 agent 的 memory、skills、history、gateway connection 變成獨立可配置的 profile。換句話說，它開始把 assistant 做成一種可複用的作業系統抽象，而不是單一聊天機器人。圍繞 Hermes 出現的 traces、remote control、fine-tune successor、瀏覽器監控等周邊工具，也說明這個領域正在往完整生態系演進。

再來是模型層的訊號。Qwen3.5-Omni 代表多模態 agent 正在往更實用的方向走，不只是會看圖聽音，而是開始支援 web search、function calling，甚至能用語音＋視覺描述去做「audio-visual vibe coding」。而 GLM-5-Turbo / AutoClaw 這類產品則反映另一條路線：把模型調教成更適合 agent 工作流的形狀，而不是只追求通用 benchmark 的最高分。

本地推論也是這篇很重要的一條支線。llama.cpp 破 100k stars、Apple Silicon 上的 Flash-MoE、各種可在本機跑的 open model 與 runtime 優化，都在強化一個論點：對很多任務來說，不一定需要最大、最貴、雲端託管的 frontier model。只要 runtime 做得好、記憶與工具鏈設計得好，本地 agent 也可能達到夠用甚至很好用的程度。這讓「隱私、可控性、成本、可移植性」重新回到桌上。

原文後段還點到幾個更研究味但很關鍵的方向。例如把 harness engineering 當成一個獨立研究領域來做，或用自然語言 SOP 取代部分硬編碼 orchestration，甚至讓 agent 把超長上下文當成「可瀏覽的檔案系統」而不是硬塞進 context window。這些方向共同說明一件事：agent 的未來，不只是更大的模型，而是更聰明的外部結構。

如果把整篇濃縮成一句話，那就是：2026 年的競爭，正從「誰的模型更強」轉成「誰能把模型放進更好的工作流裡」。Claude Code 的 computer use、Codex 與 Claude 的互通、Hermes 的 profile 化、本地推論與 open runtime 的成熟，全部都在證明這件事。

對開發者來說，這篇最有價值的提醒不是哪個模型今天又贏了幾分，而是：真正會留下來的優勢，可能不是模型 API 本身，而是你如何設計 agent 的 memory、tooling、review、execution 與 deployment。這也解釋了為什麼最近最有討論度的內容，越來越不是單一模型發表，而是那些能把 agent 變得更可靠、更便宜、更可組裝的系統層創新。
