---
title: "Claude Opus 4.8：小幅但有感的升級"
description: "Simon Willison 解讀 Claude Opus 4.8：亮點不只模型能力小幅進步，而是更誠實、支援對話中途 system 訊息，並降低 prompt cache 門檻。"
date: 2026-05-29
author: Simon Willison
layout: post
permalink: /2026-05-29/claude-opus-48-modest-improvement.html
image: /2026-05-29/og-claude-opus-48-modest-improvement.png
---

<div class="hero-badge">Simon Willison · 2026-05-28</div>

![](/ai-articles/2026-05-29/og-claude-opus-48-modest-improvement.png)

**原文連結：** [Claude Opus 4.8: “a modest but tangible improvement”](https://simonwillison.net/2026/May/28/claude-opus-4-8/)

## 摘要

- Simon Willison 認為 Claude Opus 4.8 最有趣的地方，不只是能力變強，而是 Anthropic 願意把它描述成「小幅但有感」的改進。
- 這次發布把「誠實」放在核心：Anthropic 表示 Opus 4.8 比前代更常承認不確定，也更不容易在程式碼有問題時假裝完成。
- Opus 4.8 價格維持每百萬 input tokens 5 美元、每百萬 output tokens 25 美元；fast mode 的價格則比 4.6 / 4.7 大幅降低。
- 模型的可靠知識截止與訓練資料截止都仍是 2026 年 1 月，context window 仍是 1,000,000 tokens，最大輸出仍是 128,000 tokens。
- 對開發者最值得注意的 API 變化，是可以在對話中途插入 `role: "system"` 訊息，讓長任務可以更新指令而不破壞 prompt cache。
- Prompt cache 的最低可快取長度也從 Opus 4.7 的 4,096 tokens 降到 1,024 tokens，這對 agentic loops 的成本與架構設計很實際。

<div class="sep">· · ·</div>

Anthropic 今天發布了 [Claude Opus 4.8](https://www.anthropic.com/news/claude-opus-4-8)。我最喜歡的是公告裡這段說法：

> 使用者會發現 Opus 4.8 相比前代是小幅但有感的改進。仍然還有很多事情要做：我們正在開發並發布能以更低成本提供許多 Opus 級能力的模型。

看到一家 AI lab 老實把一次發布描述成相對前一版的小幅增量改進，實在很清爽。

誠實似乎是這次的主題。公告裡另一段我很喜歡的文字是：

> Opus 4.8 最突出的改進之一是誠實性。我們訓練所有模型保持誠實，例如避免做出自己無法支持的主張。不過 AI 模型有一個普遍問題：它們有時會太快下結論，在證據薄弱時仍自信地宣稱工作已經有進展。早期測試者回報，Opus 4.8 更可能標示自己對工作的不確定性，也更不容易做出沒有根據的主張。我們的評估也支持這點：Opus 4.8 讓自己寫出的程式碼缺陷未被指出的機率，大約比前代低四倍。

那份連結的 system card 還寫了：

> Claude Opus 4.8 在六個模型的所有 benchmark 上，都有最低的 incorrect-rate，也就是事實幻覺最直接的衡量方式。它達成這點，主要不是因為答對更多問題，而是因為它會在不確定的問題上選擇 abstain。

## 模型特性

和 4.7 相比，改變不算多。

價格和 Opus 4.5 / 4.6 / 4.7 一樣：每百萬 input tokens 5 美元，每百萬 output tokens 25 美元。「Fast mode」則是這個價格的兩倍，這比先前模型大幅降低；4.6 / 4.7 的 fast mode 價格仍是 30 美元 / 150 美元。要注意的是，[fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode) 只開放給參與 research preview 的組織使用，文件寫的是「聯絡你的 account manager 申請存取」。

可靠知識截止日與訓練資料截止日都仍是 2026 年 1 月，和 4.7 一樣。

Context window 仍是 1,000,000 tokens，最大輸出仍是 128,000 tokens。

[What’s new in Claude Opus 4.8](https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-8) 文件裡有一些更有意思的細節。以下幾點特別吸引我注意：

**對話中途的 system messages。** Claude Opus 4.8 允許在 messages array 中、緊接 user turn 之後插入 `role: "system"` 訊息，但必須遵守[放置規則](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages#limitations)。這讓你可以在長時間對話後補上更新後的指令，不必重述完整 system prompt，因此能保留前面回合的 [prompt cache](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) 命中率，降低 agentic loops 的 input 成本。

也可以參考 Anthropic Python SDK 的[這次更新](https://github.com/anthropics/anthropic-sdk-python/commit/2b826760101664ef89db42132932f53ba97c894d#diff-a947c9c02eab58e8ddbe799a11832d533836d242e07c7251997f8543f0981f2f)。能在對話中途調整 system prompt 聽起來非常有威力。我原本擔心這會和我自己的 [LLM library](https://llm.datasette.io/en/stable/python-api.html#system-prompts) 抽象不相容，因為那套 API 預期每段對話只有一個 system prompt；但後來發現，我最近的[重新設計](https://simonwillison.net/2026/Apr/29/llm/) 應該能[很好地處理這件事](https://github.com/simonw/llm-anthropic/issues/73)。

**更低的 prompt cache 最小門檻。** Claude Opus 4.8 可快取 prompt 的最低長度是 1,024 tokens，比 Claude Opus 4.7 更低。

我查了一下，4.7 的最低門檻[是 4,096](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#cache-limitations)。

## 還有一些鵜鶘

這裡有五種 thinking levels 的[鵜鶘騎腳踏車](https://tools.simonwillison.net/markdown-svg-renderer#url=https%3A%2F%2Fgist.github.com%2Fsimonw%2Ffea4f7546626d627862dc241a4e3a86a)：low、medium、high、xhigh 和 max。

這次我是用 [LLM CLI](https://llm.datasette.io/en/stable/usage.html) 跑它們，把 logs 匯出成 Markdown，然後讓 Claude Opus 4.8 [幫我做](https://github.com/simonw/tools/commit/71e4944766b577a327ff048cc63b739ba4cbade9) 一個 HTML 工具，可以把那份 Markdown 裡的 SVG fenced code blocks 直接渲染成頁面上的 SVG。

後來我又用 Codex 裡的 GPT-5.5 xhigh [更新那段程式](https://gist.github.com/simonw/bb5a267f8144dfe4e92e50a014e49e98)，移除所有 XSS 洞。我相信如果我請 Claude 做，它也辦得到，但 GPT-5.5 目前是我在程式碼安全上的安心毯。

Max 那張顯然最好，但它確實用了 25 個 input tokens、17,167 個 output tokens，總成本是 [43 美分](https://www.llm-prices.com/#it=25&ot=17167&ic=5&oc=25&sel=claude-opus-4-5)！

<div class="sep">· · ·</div>

## 真正的產品訊號，是模型開始承認「我不確定」

這篇文章表面上是在記錄 Claude Opus 4.8 的小版本更新，但真正有價值的訊號，是 Anthropic 把「誠實地承認不確定」包成主要能力，而不是只喊 benchmark 又刷新高。

對 agent workflow 來說，這比一般聊天品質更重要。當模型只是陪聊，錯誤最多造成誤解；但當模型開始改 repo、跑工具、讀文件、產生 PR 或分析長任務時，「看起來像完成了」卻沒有指出問題，反而是最危險的失敗模式。Opus 4.8 主打更會標示不確定、較少讓程式碼缺陷無聲通過，等於承認前沿模型競爭已經從單純解題能力，往「可驗證工作流裡的可靠度」移動。

Mid-conversation system messages 也很值得注意。它看起來只是 API 小功能，但對長時間 agent 來說，等於允許系統在任務中途更新權限、約束、環境狀態或策略，而且不必重灌整段 system prompt。這會讓 agent harness 更像一個持續運作的控制系統，而不是一次性 prompt 拼接器。

不過這也帶來新的設計風險。能中途更新 system 訊息，代表控制面更細，也代表開發者更需要明確定義哪些資訊可以改、何時改、誰能改，以及改完後如何留下可審計軌跡。否則成本雖然下降，行為可預測性可能反而變差。

最務實的讀法是：Claude Opus 4.8 不一定是讓人驚呼的模型飛躍，但它把幾個真正影響 agent 工程的細節往前推了一步。對正在建構 coding agents、長任務自動化或多工具工作流的人來說，這種小幅但扎實的改進，可能比一次漂亮但不可控的 benchmark 勝利更有用。
