---
title: "Claude Opus 4.7 正式上線，長流程 coding 與 agent 工作再升級"
description: "Anthropic 發布 Claude Opus 4.7，強化軟體工程、長流程 agent、影像理解與自我驗證，並同步推出 xhigh effort、task budgets 和 /ultrareview。"
date: 2026-04-16
author: Anthropic
layout: post
permalink: /2026-04-16/claude-opus-4-7.html
image: /2026-04-16/og-claude-opus-4-7.png
---

<div class="hero-badge">AI News · 2026-04-16</div>

![](/2026-04-16/og-claude-opus-4-7.png)

**原文連結：** [Claude Opus 4.7](https://www.anthropic.com/news/claude-opus-4-7)

## 摘要

- Claude Opus 4.7 正式 GA，主打更強的軟體工程能力、長流程任務穩定度與更高解析度的視覺理解
- Anthropic 強調，這一版能更精準跟隨指令，並且會在回報前先驗證自己的輸出
- 在 93 題 coding benchmark 上，Opus 4.7 比 4.6 提升 13%，還多解了 4 題前代與 Sonnet 4.6 都解不出的題目
- 內部 research-agent benchmark 顯示，它在多步驟工作與長上下文表現也更穩，finance 模組拿到 0.813 分
- Anthropic 同步推出 xhigh effort、task budgets 與 Claude Code 的 /ultrareview，明顯是在把 agent 執行層往 production 推
- 安全面上，Opus 4.7 先加上自動偵測與阻擋高風險 cyber 用途的保護機制

<div class="sep">· · ·</div>

Anthropic 的最新模型 Claude Opus 4.7 已經正式可用。相較於 Opus 4.6，這一版在高難度軟體工程任務上明顯更強，尤其是最難的那些題目。早期使用者回報，原本需要密切盯著的艱難 coding 工作，現在可以更放心地交給 Opus 4.7 處理。它在長時間、多步驟任務上更穩定，也更能遵守指令，還會在回報前主動檢查自己的輸出。

視覺能力也有顯著提升，能處理更高解析度的圖片。Anthropic 也提到，這一版在做專業工作時更有品味、也更有創意，輸出的介面、簡報和文件品質更高。雖然它的整體能力仍不及最強的 Claude Mythos Preview，但在多項 benchmark 上都比 Opus 4.6 更好。

上週 Anthropic 才剛發表 Project Glasswing，談的是 AI 模型在資安上的風險與好處。他們當時就表示，Claude Mythos Preview 會先維持有限釋出，並先在能力較低的模型上測試新的 cyber 防護。Opus 4.7 就是第一個採用這套策略的模型：它的 cyber 能力不如 Mythos Preview，而且在訓練過程中，Anthropic 還嘗試刻意削弱這類能力。這次釋出時，它內建了可自動偵測並阻擋高風險或禁止用途的安全防線，而這些真實世界的部署經驗，會反過來幫助他們未來把 Mythos 級模型更廣泛地開放。

如果是合法的資安用途，像漏洞研究、滲透測試與紅隊演練，安全專業人士可以加入 Anthropic 新的 Cyber Verification Program。Opus 4.7 已經可在 Claude 產品、API、Amazon Bedrock、Google Cloud Vertex AI 與 Microsoft Foundry 上使用，價格則維持 Opus 4.6 的水準，每百萬 input tokens 5 美元、每百萬 output tokens 25 美元。

## Claude Opus 4.7 的實測回饋

Anthropic 從早期測試者那裡收到了很強的回饋。以金融科技團隊為例，他們表示，Opus 4.7 在規劃階段就能抓出自己的邏輯錯誤，執行速度也更快，對需要在大規模環境下交付可信金融服務的團隊來說，這種速度與精準度可能會很關鍵。

Anthropic 也說，他們在 coding 模型上已經有很高標準，而 Opus 4.7 把這條線再往上推了一截。內部評估顯示，它不只原始能力更強，對真實世界常見的 async 工作流也更穩，像是 automation、CI/CD 與長時間任務。它還會更深入地思考問題，給出更有主張的回應，而不是只是順著使用者講。

在 93 題 coding benchmark 上，Claude Opus 4.7 相較於 Opus 4.6 提升了 13%，而且多解了 4 題前代與 Sonnet 4.6 都解不出的題目。再加上更快的中位延遲與更嚴格的指令遵從，這對複雜、長時間的 coding 工作特別有意義，因為它能減少多步驟任務中的摩擦，讓開發者更專心做事。

根據 Anthropic 的內部 research-agent benchmark，Claude Opus 4.7 在多步驟工作上的效率基準是他們看過最強的。它在六個模組的總分並列第一，拿到 0.715，也展現了他們測過最穩定的長上下文表現。以最大的 General Finance 模組來看，它從 0.767 提升到 0.813；而在過去 Opus 4.6 比較吃力的演繹邏輯上，Opus 4.7 也站得更穩。

整體來說，Opus 4.7 把模型能處理的任務往前推了一大步。Anthropic 顯然把重點放在長時間推理與持續執行上，而效果也反映在整體表現上。當工程師從一對一使用 agent，轉向同時管理多個 agent 時，這種 front-end 級別的能力升級，就會直接開出新工作流。

多模態理解也有明顯進步，從讀化學結構到解讀複雜技術圖表都更強。更高解析度的支援，讓 Solve Intelligence 這類團隊能做更好的生命科學專利工作流程，從撰寫、申請到侵權分析與無效性比對都能受惠。

Opus 4.7 也把長航程自治能力往上拉了一級。以 Devin 為例，它能連續穩定工作數小時，遇到難題也不會輕易放棄，讓過去不容易可靠跑起來的深度研究任務，變得更可行。

對 Replit 來說，這次升級幾乎是直接換上去就好。對他們的日常工作而言，Opus 4.7 在分析 logs、找 bug、提修正建議時，品質一樣好甚至更便宜，也更精準。Anthropic 的產品經理還提到，它在技術討論時會適時反駁，幫忙做出更好的決策，真的像是更好的同事。

## 更多外部回饋與 benchmark

- CursorBench 上，Opus 4.7 直接衝到 70%，而 Opus 4.6 只有 58%，顯示它在真實 coding 任務的提升不是小修小補。
- 在複雜多步驟工作上，它比 Opus 4.6 提升 14%，而且工具錯誤少了三分之一，這也是為什麼 Notion Agent 會把它視為更像「隊友」的原因。
- Rakuten-SWE-Bench 上，它解出的 production tasks 是 Opus 4.6 的 3 倍，對工程團隊來說這種差距很實際。
- Factory Droids 看到的 task success 提升落在 10% 到 15%，而且驗證步驟的跟進更穩。
- XBOW 的 computer-use benchmark 中，它拿到 98.5%，對比 Opus 4.6 的 54.5%，這直接改變了能不能把它拿去做 autonomous pentest。
- Harvey 的 BigLaw Bench 則看到 90.9% 的高 effort 成績，而且 review table 與文件編修判斷都更穩。
- Databricks 的 OfficeQA Pro 顯示它在 source-based 文書推理上比 4.6 少 21% 錯誤。
- 一些合作夥伴也提到，它在 1 in 18 的 query 上才會卡成 loop，整體 loop resistance 和 error recovery 都更好。

## 亮點與筆記

- 指令遵從更強，舊模型時代寫的 prompt，到了 Opus 4.7 可能會因為它太認真而得到不同結果，需要重新調整 harness。
- 多模態支援更好，高解析度圖片上限提升到 2,576 像素長邊，也就是約 3.75 megapixels，適合密集螢幕、複雜圖表與 pixel-perfect 參考。
- 在真實工作上更能扛，除了 finance agent 評測表現更好，內部測試也顯示它在分析與建模、簡報、跨任務整合上都更像能上線的工具。
- 記憶能力更好，能更有效利用 file system-based memory，跨多回合、長流程工作保留重要筆記。

## 安全與對齊

整體來說，Opus 4.7 的安全輪廓和 Opus 4.6 類似。Anthropic 的評估顯示，它在欺騙、諂媚、配合濫用等令人擔心的行為上，比例都很低。部分指標上，像是誠實度與抵抗惡意 prompt injection，Opus 4.7 還比 Opus 4.6 更好；但在其他項目上，例如對受管制物質提供過度詳細的 harm-reduction 建議，它則稍微弱一些。整體對齊評估認為，這個模型「大致上對齊且可信，但行為還不是完美的」。Anthropic 也提醒，Mythos Preview 仍是他們目前對齊表現最好的模型。

## 其他同步推出的更新

除了 Claude Opus 4.7 本身，Anthropic 也一起推出了幾項更新：

- **更多 effort 控制**：Opus 4.7 新增 xhigh（extra high）effort 等級，介於 high 與 max 之間，讓使用者更細緻控制推理深度與延遲的取捨。Claude Code 也把所有方案的預設 effort 提升到 xhigh。
- **Claude Platform（API）**：新增 task budgets 公測，讓開發者可以控制 Claude 的 token 花費，讓它在長流程工作中知道要怎麼分配資源。
- **Claude Code**：新的 `/ultrareview` 指令會開一個專門的 review session，直接讀變更並標出 bug 與設計問題。Pro 與 Max 用戶可以先免費試三次。另一方面，auto mode 也擴大到 Max 用戶，讓 Claude 可以代為做更多決策，減少執行長任務時的打斷。

## 從 Opus 4.6 升級到 Opus 4.7

Opus 4.7 可以視為 Opus 4.6 的直接升級，但有兩個變化值得特別注意，因為它們會影響 token 用量。第一，Opus 4.7 採用了新的 tokenizer，文本處理方式更好，但同一段輸入可能會對應到更多 tokens，大約是 1.0 到 1.35 倍，視內容而定。第二，Opus 4.7 在較高 effort 等級下會思考更多，尤其是 agentic 設定的後段回合。這會提升硬任務的可靠度，但也意味著輸出 tokens 會變多。

使用者可以用 effort 參數、task budgets，或要求模型更精簡來控制 token 用量。Anthropic 自己的測試顯示，整體效果是正面的，在內部 coding 評測上，不同 effort 等級的 token 使用都更划算；但他們也建議，實際上線前最好先用真實流量測一遍。

## 註解

1. 這是模型層級的變更，不是 API 參數，所以使用者送給 Claude 的圖片會直接以更高保真度處理。因為更高解析度也會消耗更多 tokens，不需要額外細節的情況下，可以先把圖片縮小再送進模型。

## 延伸評論：競爭焦點已經從模型本體，往執行層移動

Opus 4.7 這次最值得注意的地方，不只是「又更強了一點」，而是 Anthropic 把重點明確壓在長流程任務、工具使用、記憶、錯誤恢復和安全防護上。這代表真正的戰場已經不是單純的 benchmark 分數，而是誰能把模型包進一個更可控、更可恢復、也更適合 production 的執行框架。

對真的在做 agent 的團隊來說，xhigh effort、task budgets、ultrareview 這些看起來像小更新的東西，反而更可能改變日常工作流。接下來比的，會是誰能把「模型很會想」變成「系統真的跑得完、查得到、管得住」。
