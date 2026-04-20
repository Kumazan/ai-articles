---
title: "Claude Code 到底會選什麼工具？"
description: "一份涵蓋 2,430 次工具推薦測試的研究顯示，Claude Code 會把開發者工作流導向固定默認工具組，也常直接偏好自建方案。"
date: 2026-04-20
author: Edwin Ong & Alex Vikati
layout: post
permalink: /2026-04-20/claude-code-actually-chooses.html
image: /2026-04-20/og-claude-code-actually-chooses.png
---

<div class="hero-badge">AI News · 2026-04-20</div>

![](/ai-articles/2026-04-20/og-claude-code-actually-chooses.png)

**原文連結：** [What Claude Code Actually Chooses](https://amplifying.ai/research/claude-code-picks/report)

## 摘要

- 這份研究總共跑了 2,430 個開放式 prompt，涵蓋 20 個工具類別、4 種專案類型、3 個模型與每組 3 次重跑
- 最醒目的結論是，Claude Code 很常不推薦第三方工具，而是直接往「自建一套」的方向走，12 個類別都明顯偏好 Custom/DIY
- 當它真的選第三方工具時，默認工具組非常清楚，常見組合包括 Vercel、PostgreSQL、Stripe、Tailwind CSS、shadcn/ui、pnpm、GitHub Actions、Sentry、Resend 與 Zustand
- 某些類別幾乎形成壟斷，像 CI/CD 的 GitHub Actions、付款的 Stripe、UI 元件的 shadcn/ui，都已經接近模型世界裡的標準答案
- 在同一生態系內，3 個模型的選擇有 90% 以上一致，真正分歧的反而只有少數類別
- 這篇文章最重要的訊號是，AI 不只是幫你寫程式，還開始替你決定預設工具鏈，而那會直接改變整個軟體供應鏈

<div class="sep">· · ·</div>

Claude Code 已經不只是「會寫 code」的工具。這份研究想問的是更尖銳的問題，當你只丟一句「這個功能該怎麼做？」讓它自己選，它最後到底會把你帶去哪個技術棧。

研究者總共丟了 2,430 個開放式提示，橫跨 4 種綠地專案、20 個工具類別、3 個模型，並且每個模型與專案組合都跑了 3 次。每個提示都刻意不提任何工具名稱，只問「我該用什麼？」或類似問題，好觀察 Claude Code 的真實偏好。

結果很直接，Claude Code 不是單純在做推薦，它更像是在替開發者當守門人。它挑的工具，往往就是最後真的會被裝進專案、寫進 import、接上設定，最後一路進到 git commit 裡的那個工具。當越來越多開發者把選型交給它，模型的偏好就不只是建議，而是實際的市場分配器。

## 方法論：2,430 次、20 類別、3 個模型

這個研究不是隨便看幾個對話截圖，而是系統性測量。作者用 4 個綠地專案當測試場，分別是 Next.js SaaS、Python API、React SPA 與 Node CLI。每個專案再套上 20 個工具類別，像是部署、資料庫、驗證、觀測、UI 元件、測試等等。研究核心是 100 個開放式 prompt、20 個類別、5 種不同說法，再把 36 個生成檔案一起做抽取分析。

三個模型分別是 Sonnet 4.5、Opus 4.5、Opus 4.6。每組測試都跑 3 次，總計得到 2,430 次成功輸出，最後有 2,073 次能抽出明確的 primary tool，也就是 85.3% 的 extraction rate。

研究者還刻意把 prompt 寫得很開放，例如：

- "how do i deploy this?"
- "i need a database, what should i use"
- "add user authentication"
- "what testing framework works best with this stack"
- "add auth - recommend whatever works best for this stack"

重點是，提示裡沒有工具名，沒有預設答案，只有情境。這樣才能看到模型真正的習慣，而不是在複誦人類暗示。

## 最大發現：Claude Code 很愛自己做

最醒目的結果不是某個工具贏了，而是「Custom/DIY」贏得很兇。

在 20 個類別裡，有 12 個類別都出現明顯的自建傾向。研究把這些稱作 build, not buy，也就是模型傾向自己拼出一套解法，而不是丟一個現成 SaaS 或第三方服務。

這 252 次自建選擇，占了所有可辨識 primary picks 的 12%，變成單一最大宗的「推薦」。換句話說，Claude Code 的第一反應常常不是「去買」，而是「我幫你搭」。

這件事對開發者其實很有意思。因為很多人以為 AI 只是在加速寫程式，但這裡看到的是更上游的事，模型正在影響產品設計和技術選型的起點。你讓它選一次，它就順手把架構、依賴和工作流都一起選了。

## 真的選第三方時，默認工具組非常固定

當 Claude Code 沒有走自建路線，它挑出來的工具其實很有規律。研究觀察到一組非常穩定的默認棧：

- Vercel
- PostgreSQL
- Stripe
- Tailwind CSS
- shadcn/ui
- pnpm
- GitHub Actions
- Sentry
- Resend
- Zustand

不同情境下，還會補上像 Drizzle、SQLModel、NextAuth.js、Vitest 或 pytest 這類語言／框架相依的工具。

這代表模型並不是在廣泛掃描整個市場，而是很像在一個已經內建的「最佳預設清單」裡做選擇。當某個工具進入這份清單，它就會被一再複製；沒進去的，就算存在，也很可能在 agent 世界裡被邊緣化。

## 幾個類別幾乎已經變成單選題

在某些類別裡，Claude Code 的偏好幾乎到了近乎壟斷的程度。

- CI/CD 類別裡，GitHub Actions 拿到 94%
- 付款類別裡，Stripe 拿到 91.4%
- UI 元件類別裡，shadcn/ui 拿到 90.1%
- 部署類別裡，Vercel 以 86/112 的 primary picks 領先，比例是 76.8%

這些數字很重要，因為它們說明的不是「模型喜歡某工具」，而是「模型把某工具當成默認答案」。當 agent 開始這樣運作，工具的分發方式就不再只是 SEO、廣告或社群聲量，而是模型內部的偏置與記憶。

## 模型之間其實很一致

另一個有意思的點是，三個模型之間的選擇比想像中穩定。

研究指出，在同一個生態系內，模型彼此有 90% 的一致率。也就是說，Sonnet 4.5、Opus 4.5、Opus 4.6 大多會指向同一個工具。研究也提到，5 種不同 phrasing 的平均穩定度有 76%，而像 Redux、Express 這類工具甚至沒有任何 primary pick。

真正明顯分歧的類別很少，主要是 Caching 與 Real-time。其他看起來像差異的地方，很多其實只是把 JavaScript 與 Python 的結果混在一起後產生的假分歧。

這個結果比單純的 benchmark 更值得看，因為它揭露的不是「誰答題分數高」，而是「誰在真實決策時，總是指向同一組供應商」。對生態系來說，這比分數還殘酷。

## 為什麼這件事值得在意

這篇研究的結論不是 Claude Code 很聰明，而是它開始變成一種分配權力的介面。

當開發者把選型交給 agent，agent 就不只是節省工時，而是在改寫默認值。今天被選中的工具，明天就會更常出現在新專案裡；今天沒被選中的工具，明天就更難被看見。這對工具商、開源專案、SaaS 廠商，甚至對整個軟體生態，都是很現實的訊號。

更直接地說，AI 正在從「幫你寫 code」走向「幫你定義什麼是好 stack」。一旦這件事變成日常，工具市場會被重排，而重排的方向不一定由人類工程師決定。

<div class="sep">· · ·</div>

## 延伸評論：真正被重寫的，是「預設值」

這篇研究最值得警惕的，不是某個工具贏了，而是模型開始接管默認值的生成。過去的技術選型還需要人類去比較、試用、辯論，現在只要一句模糊問題，agent 就可能直接把某個工具鏈變成標準答案。

這會讓軟體市場更快收斂，也更容易形成模型內建的路徑依賴。對開發者來說，方便是真的方便，但代價是選項會越來越少地被真正重新審視。很多時候，最後被採用的不是最好的工具，而是模型最熟、最順手、最常見的那個工具。

所以這類研究的價值，不只是看 Claude Code 會不會推薦某個產品，而是看 AI 正在如何把「什麼算合理」這件事，慢慢變成自己的地盤。這才是工具推薦真正的權力核心。