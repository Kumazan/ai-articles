---
title: "AI 成本開始被精算：企業不想每件事都用最貴模型"
description: "Axios 報導指出，企業在 AI 帳單膨脹與 ROI 未明之下，開始把任務轉向較便宜模型、開源模型與模型路由，這也考驗前沿 AI labs 的高估值。"
date: 2026-05-30
author: Madison Mills, Axios
layout: post
permalink: /2026-05-30/ai-cost-model-routing-enterprise.html
image: /2026-05-30/og-ai-cost-model-routing-enterprise.png
---

<div class="hero-badge">Axios · 2026-05-29</div>

![](/ai-articles/2026-05-30/og-ai-cost-model-routing-enterprise.png)

**原文連結：** [CEOs go bargain hunting for AI](https://www.axios.com/2026/05/29/ceos-ai-cheaper-tokens)

## 摘要

- 企業開始把 AI 任務轉向更便宜的模型，原因是 AI 使用量正在推高 IT 預算，但投資報酬率仍不夠明確。
- 這股「找便宜模型」的趨勢，可能會衝擊幾家接近兆美元估值、準備迎向 IPO 的大型 AI labs。
- Anthropic 最新一輪募資達 650 億美元、估值來到 9,650 億美元，超過 OpenAI 的 7,300 億美元估值。
- 多位受訪高階主管表示，企業正在更嚴格監控 AI 使用量，也更願意把部分工作切到較便宜的模型、開源模型或特定用途 agents。
- Factory 的 CEO Matan Grinberg 指出，很多任務其實不需要 Claude Opus 這種最頂級模型；該公司客戶在過去一個月使用開源模型的比例，相對閉源模型已增加三倍。
- 但企業一旦把技能、任務與流程建在特定 AI 平台上，切換供應商並不容易；真正的關鍵會是模型路由與成本治理，而不是單純換一家供應商。

<div class="sep">· · ·</div>

企業正在尋找方法，把 AI 任務轉移到更便宜的模型上。原因很直接：AI 使用量正在把 IT 預算撐大，但投資報酬率還沒有穩定到足以說服所有人。

這件事的重要性在於，企業若開始尋找更便宜的訂閱與模型替代方案，可能會反過來威脅三大 AI labs 接近兆美元的估值。這些公司正接近創紀錄的 IPO 時刻，而它們的商業敘事高度依賴企業會持續為最強模型付費。

最新背景是 Anthropic 剛完成 650 億美元募資，估值來到 9,650 億美元，超過 OpenAI 最近的 7,300 億美元估值。

但同一時間，多位企業高階主管告訴 Axios，他們越來越擔心 AI 帳單。有些公司開始密切監控使用量，有些則開始把工作切到更便宜的模型，以控制成本。

這種張力可能會壓迫 AI 公司的營收預期，特別是在它們準備上市之際。

Factory 的 CEO Matan Grinberg 告訴 Axios，很多任務其實不需要使用 Claude 的 Opus 等級模型。他的公司提供一套專有路由器，會依照每次查詢與任務，自動選擇最划算的 AI 模型。

科技安全公司 Convergint 的執行副總裁 Eric Yunag 也說，客戶正在更精準、更有選擇地使用 AI。模型訓練公司 Micro1 的 CEO Ali Ansari 則表示，其他企業正在轉向開源模型，或轉向為特定使用情境打造的 agents；這些方案通常更便宜，而且有時表現更好。

Grinberg 說，他的客戶非常害怕被單一供應商綁住。企業不想只標準化在 OpenAI、Anthropic 或 Google 其中一家，因為這會讓它們未來更容易被價格牽著走。

Factory 的數據也反映出這個變化：過去一個月，相較於 OpenAI、Anthropic 等閉源模型，該平台上開源模型的使用量增加了三倍。

不過，切換並不總是容易。企業一旦把技能、任務與流程建立在某個 AI 平台上，即使每月 IT 帳單令人痛苦，也很難立刻搬家。

而且，前沿 AI labs 的企業營收仍在成長。

真正的底線是：就在 Anthropic 年化營收有望超過 470 億美元之際，它的客戶也正在尋找更便宜的替代方案。

<div class="sep">· · ·</div>

## AI 下一階段會比拚成本治理，不只是模型能力

這篇文章抓到一個很實際的轉折：AI 採用已經從「能不能做」進入「值不值得用最貴模型做」。前沿模型仍然重要，但如果每個工作流都預設丟給最強模型，成本會先失控，然後才輪到 ROI 被驗證。

對開發者來說，這代表模型選型不能再只看 benchmark。真正的工程問題會變成：哪些任務需要最高階推理，哪些任務只需要便宜、穩定、可控的模型，哪些任務應該交給特定用途 agent 或本地開源模型處理。模型路由、成本觀測、token 預算、fallback 策略，會變成 agent 系統的基礎設施。

這也解釋了為什麼「開源模型用量增加三倍」比單純的模型榜單更值得注意。企業不是突然不需要 frontier intelligence，而是開始把昂貴智慧拆成可管理的資源。最強模型會被留給高不確定性、高價值、高風險任務；其他大量可重複、可驗證、低風險任務，會被迫走向便宜化與專用化。

但文章也提醒了一個常被低估的鎖定效應：不是模型 API 能換，整套流程就真的能換。當 prompts、tools、permissions、evaluation、human review 和內部 SOP 都綁在某個平台上，轉換成本會快速累積。未來有競爭力的 AI workflow，不只要能調用模型，還要能保留遷移空間。
