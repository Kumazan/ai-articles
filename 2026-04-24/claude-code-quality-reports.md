---
title: "Claude Code 品質回報異常的最新說明"
description: "Anthropic 釐清近月 Claude Code 品質下降的三個原因，說明問題其實出在產品層與提示層，而不是模型本身，並公布修正與後續改進措施。"
date: 2026-04-24
author: Anthropic
image: /2026-04-24/og-claude-code-quality-reports.png
layout: post
permalink: /2026-04-24/claude-code-quality-reports.html
---

<div class="hero-badge">AI News · 2026-04-24</div>

![](/ai-articles/2026-04-24/og-claude-code-quality-reports.png)

**原文連結：** [An update on recent Claude Code quality reports](https://www.anthropic.com/engineering/april-23-postmortem)

## 摘要

- Anthropic 針對近月 Claude 變差的回報做了完整回溯，結論是問題出在 Claude Code、Agent SDK 與 Claude Cowork 的三個獨立變更。
- API 與推論層沒有受影響，真正出問題的是產品設定、快取優化與系統提示詞。
- 第一個問題是 Claude Code 預設 reasoning effort 從 high 改成 medium，雖然降了延遲，卻也讓部分使用者感到模型變笨。
- 第二個問題是快取修正邏輯出錯，讓 session 一旦閒置超過一小時後，後續每一輪都持續丟失舊的 thinking。
- 第三個問題是系統提示詞加了壓縮篇幅的限制，意外拉低 coding 品質，最後被回滾。
- Anthropic 也承諾接下來會加強內部 dogfooding、prompt 變更審查、soak period 與更廣的 eval。

<div class="sep">· · ·</div>

過去一個月，Anthropic 一直在查 Claude 部分使用者回報的品質下降問題。最後的結論很明確：這不是模型本身刻意降級，也不是 API 或推論層出事，而是三個彼此獨立的變更，分別影響了 Claude Code、Claude Agent SDK 與 Claude Cowork。這三個問題都已在 4 月 20 日隨 v2.1.116 修正。

這篇文章把調查結果、修復方式，以及接下來會怎麼避免重演，完整攤開來說。

### 一次看見三個不同問題

Anthropic 找到的三個問題如下：

- 3 月 4 日，Claude Code 預設 reasoning effort 從 high 調成 medium，原本是想降低某些情況下過長的延遲；但這個取捨不對，後來在 4 月 7 日回滾。
- 3 月 26 日，系統為了縮短閒置 session 恢復時的延遲，加入清掉舊 thinking 的快取優化；但程式有 bug，導致它不是只清一次，而是在之後每一輪都持續清，讓 Claude 變得像是失憶又重複。這個問題在 4 月 10 日修掉。
- 4 月 16 日，為了減少冗長回應，在 system prompt 加了一條限制字數的指令；它和其他 prompt 改動疊在一起，讓 coding 品質明顯變差，於 4 月 20 日被回滾。

因為這三個變更影響的流量切片不同、時間點也不同，所以整體看起來像是零散但持續的退化。Anthropic 其實從 3 月初就開始調查，但一開始很難和正常波動區分，內部使用情況和 eval 也沒有立刻重現。

### Claude Code 預設 effort 的取捨出錯了

當 Opus 4.6 在 Claude Code 中推出時，預設 reasoning effort 設成 high。之後收到不少回饋：high mode 有時會想太久，讓 UI 看起來像卡住，延遲與 token 消耗也太高。

一般來說，模型想得越久，輸出通常越好；effort 等級就是在「更會想」和「更低延遲、較少額度消耗」之間做取捨。Anthropic 當時根據內部 eval，認為 medium 在大多數任務上只略降智能，卻能大幅降低延遲，所以把預設改成 medium。

但推出後，使用者開始回報 Claude Code 變笨了。團隊雖然加了很多 UX 提示，像是啟動時通知、inline effort selector、把 ultrathink 加回來，但多數人還是停在 medium 預設。後來在更多回饋進來後，Anthropic 於 4 月 7 日把預設改回去。現在 Opus 4.7 預設是 xhigh，其他模型則是 high。

### 一個快取優化，把前一步思考弄丟了

Claude 在推理時，通常會把 thinking 留在對話紀錄裡，這樣下一輪就能看到自己前面怎麼想、做過哪些 tool call。

3 月 26 日，Anthropic 原本想做一個效能優化：如果 session 閒置超過一小時，就把舊的 thinking 清掉，減少恢復 session 時送出的 token 數。做法是搭配 `clear_thinking_20251015` API header 和 `keep:1`，先把不必要的訊息裁掉，之後再恢復完整的 reasoning history。

問題出在實作：它不是只在第一次閒置後清一次，而是在那個 session 後面的每一輪都持續清。只要 session 一旦跨過閒置門檻，後續所有 request 都會只保留最近一段 reasoning，前面的上下文全被丟掉。若使用者在 Claude 還在 tool use 中時又送出訊息，還會在新的 turn 裡繼續套用這個錯誤旗標，連當輪的推理也一起消失。結果就是大家看到的健忘、重複、工具選擇怪異。

因為每次都在丟 thinking block，這些 request 也會變成 cache miss。Anthropic 認為，這正是有些人回報 usage limit 異常快速耗盡的原因之一。

這個 bug 卡在 Claude Code 的 context management、Anthropic API 與 extended thinking 交界處，而且改動還通過了多輪人工作業、單元測試、端對端測試、自動驗證與 dogfooding。再加上只會在 stale sessions 這種邊角情況發生，所以整整過了一週才查出根因。Anthropic 也提到，他們已經開始把更多必要的 repository 納入 code review 的上下文，讓內部 back-test 更完整。

這個問題在 4 月 10 日於 v2.1.101 修正。

### 壓縮 system prompt，卻壓到智能

Claude Opus 4.7 相較前代有個明顯特性：它更囉唆。這讓它在難題上更聰明，但也會吐出更多 tokens。

在 4.7 釋出前幾週，Anthropic 先替 Claude Code 做了不少調整。每個模型行為都不太一樣，所以產品與 harness 會先針對新模型做優化。

團隊用過不少方法來壓縮冗長度：模型訓練、prompt、以及改善產品裡的 thinking UX。最後他們全都用了，但 system prompt 裡多加的一句話，對 Claude Code 的智能影響遠大於預期：

> 「Length limits: keep text between tool calls to ≤25 words. Keep final responses to ≤100 words unless the task requires more detail.」

內部測試和評估跑了幾週都沒看到回歸，所以團隊有信心把它和 Opus 4.7 一起在 4 月 16 日上線。後來在更廣的評估和 ablation 裡，Anthropic 才發現某些組合會讓 Opus 4.6 與 4.7 的表現都下降約 3%。於是他們在 4 月 20 日立刻回滾這條 prompt。

### 接下來會怎麼做

Anthropic 說，之後會做幾件事來避免類似問題：

- 讓更多內部員工直接使用和外部相同的 public build，而不是測試版。
- 強化內部 Code Review 工具，並把改良版一起交付給客戶。
- 對所有 system prompt 變更加上更嚴格的控管與審查。
- 為每次 prompt 變更跑更廣泛的 per-model eval，並持續做 ablation，理解每一行的影響。
- 對所有可能影響智能的改動，加入 soak period、廣泛 eval 與漸進式 rollout。

他們也新開了 @ClaudeDevs 這個 X 帳號，用來更完整說明產品決策，GitHub 上也會同步集中整理。

最後，Anthropic 感謝那些主動用 /feedback、或在線上提供可重現範例的使用者。正是這些回饋讓團隊能找到並修正問題。今天也同步替所有訂閱者重置了 usage limits。

<div class="sep">· · ·</div>

## 這篇 postmortem 真正該讓人警覺的地方

這篇文章最值得記住的，不是「模型變差了」，而是大型 agentic 產品的失誤，常常出在模型外圍：預設值、快取策略、system prompt、回滾節奏，任何一個小改動都可能把使用體驗整段拉歪。對真的在做 agent 的人來說，harness 和產品層的穩定性，往往比單次 benchmark 更關鍵。