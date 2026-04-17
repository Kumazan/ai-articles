---
title: "Boris Cherny 拆解 Claude Opus 4.7，6 個把 agent workflow 拉滿的實戰技巧"
description: "Anthropic 的 Boris Cherny 分享他過去幾週 dogfood Claude Opus 4.7 的 6 個實戰技巧，涵蓋 auto mode、recap、focus、effort 與 verification，重點不在模型發布，而在工作流怎麼真正變快。"
date: 2026-04-17
author: Boris Cherny
layout: post
permalink: /2026-04-17/boris-cherny-opus-4-7-tips.html
---

<div class="hero-badge">AI News · 2026-04-17</div>

**原文連結：** [Boris Cherny on X, Opus 4.7 tips thread](https://x.com/i/status/2044847848035156457)

## 摘要

- Anthropic 的 Boris Cherny 表示，過去幾週用 Claude Opus 4.7 dogfood 後，整體工作效率明顯提升，關鍵在於工作流要跟著調整
- 這串貼文整理出 6 個實戰技巧，包含 auto mode、減少權限提示、recaps、focus mode、effort 設定與 verification
- 核心訊息不是「模型更強」而已，而是 Opus 4.7 已經更適合長流程、低監工密度的 agent 式工作
- Boris 特別強調 verification，認為只要替 Claude 建好自我驗證路徑，長任務成功率可以拉高 2 到 3 倍
- 這篇內容和產品發布文不同，重點是第一線使用者如何真的把 Opus 4.7 用進日常開發流程

<div class="sep">· · ·</div>

Anthropic 的 Boris Cherny 在 X 上分享，過去幾週持續用 Claude Opus 4.7 做內部 dogfooding 後，感受到一種「異常高效」的工作節奏。他認為，這一代模型的價值不只在基準分數變高，而是只要把使用方式稍微改掉，整個 coding 與 research workflow 都會更像是在帶一個能長時間自主工作的 agent。

這串貼文整理了 6 個具體做法。第一個是 **auto mode**。Boris 認為，Opus 4.7 特別適合長流程任務，例如深度研究、重構、功能開發與 benchmark。auto mode 透過分類器自動放行安全命令，減少人工逐次批准的摩擦，讓使用者不必一直守在旁邊，也不必直接切到高風險的完全跳過權限模式。對同時開多個 Claude session 的人來說，這種差異很實際。

![](/ai-articles/2026-04-17/opus47-principle-1-auto-mode.jpg)

第二個是 **`/fewer-permission-prompts` skill**。如果暫時不想開 auto mode，這個 skill 會掃描 session 歷史，找出那些反覆出現、其實安全但總是被要求確認的 bash 或 MCP 指令，然後建議加入 allowlist。它的價值在於把「每次都要按同意」這種碎片摩擦，變成一次性的流程優化。

![](/ai-articles/2026-04-17/opus47-principle-2-fewer-prompts.jpg)

第三個是 **recaps**。Boris 把它描述成恢復長任務上下文的關鍵工具。當一個 session 跑了很久，中間暫停幾分鐘甚至幾小時，再回來時如果只能重新翻紀錄，成本其實很高。recap 的作用，就是快速交代 Claude 做了什麼、現在卡在哪裡、下一步是什麼，讓長流程工作能無痛續接。

![](/ai-articles/2026-04-17/opus47-principle-3-recaps.jpg)

第四個是 **focus mode**。在 CLI 裡，這個模式會把中間推理與步驟細節收起來，只看最後結果。這代表 Anthropic 對 Opus 4.7 的執行穩定度已經更有信心，使用者也可以更自然地把 Claude 當成真正的執行者，而不是每一步都要盯哨的助手。對只想看交付結果的人來說，這種介面改變其實就是工作方式的改變。

![](/ai-articles/2026-04-17/opus47-principle-4-focus-mode.jpg)

第五個是 **effort level 調整**。Boris 提到，Opus 4.7 採用更具彈性的 thinking 模式，不是固定死板的推理額度，而是可以透過 `/effort` 調整投入程度。低 effort 比較快、也比較省，高 effort 則更聰明。他自己的慣例是大多數任務開到 xhigh，最難的任務才切 max。這也說明，新的工作流不是把所有事情都丟到最高檔，而是根據任務難度做資源分配。

![](/ai-articles/2026-04-17/opus47-principle-5-effort-level.jpg)

第六個，也是 Boris 最強調的一點，是 **verification**。他的經驗是，只要幫 Claude 建好可自我測試的路徑，成效可能提升 2 到 3 倍。後端任務可以用 bash 做驗證，前端可以接 Chromium extension，應用程式則可以透過 computer use 檢查實際操作結果。Boris 給出的典型流程是先讓 Claude 完成任務，再要求它自行測試、簡化結果，最後整理成 PR。這樣一來，長流程任務不只是「看起來完成」，而是真的有更高機率在回來時已經是可工作的狀態。

![](/ai-articles/2026-04-17/opus47-principle-6-verification.jpg)

整串貼文最後的落點很明確，Opus 4.7 確實比 4.6 更聰明、更 agentic、也更精準，但這種升級的價值，只有在使用者願意把 workflow 往更長、更自主、更少中途打斷的方向調整時，才會真正放大。換句話說，這不是單純的新模型介紹，而是一份針對新操作習慣的使用說明。

<div class="sep">· · ·</div>

## 延伸評論：真正的差距，開始來自工作流設計而不是模型規格

這串內容值得注意的地方，在於它補上了產品發布文通常沒有講清楚的一層，也就是模型變強之後，使用方式到底要怎麼跟著升級。4 月 16 日的官方發表文聚焦在 benchmark、能力提升與新功能上，但 Boris 這串實戰貼文回答的是另一個更貼近日常工作的問題：開發者要怎麼把這些能力轉成更高產出的具體操作。

從這 6 點可以看出，Claude Opus 4.7 的優勢不只是回答品質，而是它對長流程代理式工作的支撐度更高。permission 管理、session recap、焦點視圖、thinking 強度控制，以及最重要的 verification，全部都指向同一個方向，就是降低監工成本、提高長任務完成率。

因此，這篇內容和單純的「Claude Opus 4.7 發布了」不是同一主題。前者是產品層級新聞，後者則是工作流層級的實戰方法。對已經在使用 Claude Code、或正在把模型接進實際開發流程的團隊來說，後者往往更接近真正會改變日常效率的資訊。