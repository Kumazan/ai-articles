---
title: "GPT-5.5 提示詞指南"
description: "OpenAI 為 GPT-5.5 公布提示詞建議，強調多步驟任務先用簡短狀態更新安撫使用者，並把既有提示與工具流程當成新模型重新調校。"
date: 2026-04-25
author: Simon Willison
layout: post
permalink: /2026-04-25/gpt-55-prompting-guide.html
image: /2026-04-25/og-gpt-55-prompting-guide.png
---

<div class="hero-badge">AI News · 2026-04-25</div>

![](/ai-articles/2026-04-25/og-gpt-55-prompting-guide.png)

**原文連結：** [GPT-5.5 prompting guide](https://developers.openai.com/api/docs/guides/prompt-guidance?model=gpt-5.5)

## 摘要

- OpenAI 為 GPT-5.5 提供了新的提示詞指南，重點不是「照舊能不能用」，而是如何重新調校。
- 一個實用建議是：多步驟任務在開始工具呼叫前，先對使用者送出一則簡短更新，說明已收到需求與第一步。
- 這種做法能讓長時間思考的 agent 不那麼像當機，也比較能維持互動感。
- OpenAI 也建議用既有技能或工作流做遷移測試，但不要假設舊提示能直接搬到新模型上。
- 對 GPT-5.5 而言，建議從最小可行提示開始，再逐步調整 reasoning、verbosity、工具說明與輸出格式。
- 這篇短文的價值在於，它把模型升級從「換版本」改寫成「重新做基線」的工程問題。
- 對做產品的人來說，真正重要的是：新模型不是舊模型的小改款，而是需要重新驗證的一整個新家族。

<div class="sep">· · ·</div>

[GPT-5.5 提示詞指南](https://developers.openai.com/api/docs/guides/prompt-guidance?model=gpt-5.5)。既然 GPT-5.5 已經可在 API 中使用，OpenAI 也順勢整理出一套實用建議，說明該怎麼把這個新模型用好。

其中一個很值得記住的小技巧，是針對可能要花不少時間思考、再回傳給使用者的應用：

> 在任何多步驟任務的工具呼叫之前，先送出一則簡短、可被使用者看見的更新，說明你已收到請求，並指出第一步。內容保持一到兩句就好。

這招其實已經能在 OpenAI 的 Codex app 裡看到，確實會讓長時間執行的任務少一點「是不是卡死了」的感覺。

OpenAI 也建議用 Codex 跑下面這個指令，並配合他們 openai-docs 技能裡的建議來升級現有程式：

```bash
$openai-docs migrate this project to gpt-5.5
```

而 Codex 會跟著走的升級指南，則是這份文件。裡面甚至還有很輕量的提示，說明該怎麼改寫 prompt，讓它更適合新模型：

[Model string — light prompt rewrite](https://github.com/openai/skills/blob/724cd511c96593f642bddf13187217aa155d2554/skills/.curated/openai-docs/references/upgrade-guide.md#model-string--light-prompt-rewrite)

另一份也很相關的文件是 [Using GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model)。它一開頭就直接提醒：

> 想把 GPT-5.5 用到最好，應該把它當成需要重新調校的新模型家族，而不是 gpt-5.2 或 gpt-5.4 的直接替代品。遷移時應從全新的基線開始，不要把舊 prompt stack 的每一條指令都原封不動帶過來。先用最小的 prompt 保住產品契約，再針對代表性範例去調整 reasoning effort、verbosity、工具說明與輸出格式。

這句話很有意思：OpenAI 其實是在提醒大家，不要相信過去為舊模型最佳化過的 prompt，會自然地在 GPT-5.5 上繼續有效。

<div class="sep">· · ·</div>

## 給做產品的人：先把基線重建好

GPT-5.5 這類更新最容易踩的坑，不是模型不夠強，而是團隊太快把舊工作流原封不動搬上來。只要模型行為、工具呼叫節奏、輸出細節有變，過去那套「看起來合理」的 prompt 很快就會開始漏邊。

這也是為什麼「從最小提示開始」很重要。它迫使團隊先釐清產品契約到底是什麼：哪些行為是核心、哪些只是歷史包袱、哪些其實應該交給工具層處理。

對真的在做 agent 的人來說，這份指南最實用的地方不是那句更新訊息，而是背後的工程觀念：模型升級不是 patch，而是重新驗證整個互動假設。能先把基線重建好，後面的調校才不會像在補洞。