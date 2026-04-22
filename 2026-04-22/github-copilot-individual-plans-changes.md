---
title: "GitHub Copilot 個人方案變更：Agent 時代的價格與限制開始收緊"
description: "GitHub 宣布暫停 Copilot 個人方案新訂閱、收緊用量上限，並調整 Opus 模型可用性。Simon Willison 認為，問題不只是漲價，而是這種不透明的溝通會直接傷到信任。"
date: 2026-04-22
author: Simon Willison
layout: post
permalink: /2026-04-22/github-copilot-individual-plans-changes.html
image: /2026-04-22/og-github-copilot-individual-plans-changes.png
---

<div class="hero-badge">AI News · 2026-04-22</div>

![](/ai-articles/2026-04-22/og-github-copilot-individual-plans-changes.png)

**原文連結：** [Changes to GitHub Copilot Individual plans](https://simonwillison.net/2026/Apr/22/changes-to-github-copilot/)

## 摘要

- GitHub 宣布調整 Copilot 個人方案，包含暫停 Pro、Pro+ 與 Student 的新訂閱，以及收緊使用上限。
- Opus 模型從 Pro 方案移除，只保留在更貴的 Pro+ 裡。
- 官方的理由很直接，agentic workflows 讓長時間、平行化任務吃掉的算力，遠超原本方案設計。
- Copilot 現在改成以 session 與 weekly 兩種 token 上限控管，並把用量顯示在 VS Code 與 Copilot CLI 裡。
- Simon 的重點不是「能不能收更貴」，而是這種先改頁面、再補說法的溝通方式會動搖信任。
- 他也提醒，當 Codex 還留著 FREE 和 PLUS 方案時，Anthropic 這種做法等於把市場教育送給對手。

<div class="sep">· · ·</div>

## 2026 年 4 月 22 日

[Changes to GitHub Copilot Individual plans](https://github.blog/news-insights/company-news/changes-to-github-copilot-individual-plans/)（[via](https://news.ycombinator.com/item?id=47838508)）

就在 Anthropic 今天早上那場 Claude Code「到底會不會變成 100 美元/月」的混亂隔壁，這是 GitHub Copilot 最新的價格調整。

和 Anthropic 不同，GitHub 這次有正式公告，內容包含收緊用量限制、暫停個人方案新訂閱，以及把 Claude Opus 4.7 限縮到更貴的 39 美元/月 Pro+ 方案，前幾代 Opus 也一併移除。

關鍵段落是這句：

> 能動式工作流已經徹底改變了 Copilot 的算力需求。長時間、平行化的 session 現在常常消耗遠超原始方案結構可承受的資源。隨著 Copilot 的 agent 能力快速擴張，agent 做的事情變多了，也有更多用戶撞上原本用來維持服務穩定性的用量上限。

很容易忘記，才六個月前，重度 LLM 用戶消耗的 token 數量還小一個數量級。coding agent 真的很吃算力。

Copilot 在 agent 裡也很特別，至少我認為是這樣，因為它原本是按 request 計價，不是按 token 計價。（更正：Windsurf 也曾用過類似的 credit 制度，而且他們上個月就 [放棄了](https://windsurf.com/blog/windsurf-pricing-plans)。）這代表單次 agentic request 如果燒掉更多 token，就會直接壓縮利潤。最新這套定價改成用 per-session 與 weekly 的 token 上限來處理這件事。

我對這則公告唯一不滿的是，它沒有清楚說明到底哪一個叫作「GitHub Copilot」的產品會受影響。上個月在 [How many products does Microsoft have named 'Copilot'? I mapped every one](https://teybannerman.com/strategy/2026/03/31/how-many-microsoft-copilot-are-there.html) 裡，Tey Bannerman 整理出 75 個共用 Copilot 品牌的產品，其中 15 個標題裡直接寫著「GitHub Copilot」。

從連結的 [GitHub Copilot 方案頁](https://github.com/features/copilot/plans) 看起來，這次變動涵蓋 Copilot CLI、Copilot cloud agent、code review（GitHub.com 上的功能），以及 VS Code、Zed、JetBrains 等 IDE 裡的 Copilot 功能。

<div class="sep">· · ·</div>

## 延伸評論：真正棘手的不是漲價，而是信任成本

這篇最值得注意的，不是 GitHub 想多收錢，而是它在面對 agent 時代的成本壓力時，選擇了先收緊、再解釋的做法。對已經把 Copilot 納入日常流程的開發者來說，這不是單純的方案調整，而是工作流穩定性、模型可用性和預算預期一起被重新定義。

更麻煩的是，Copilot 這種工具的價值本來就建立在「你可以放心把它編進習慣裡」的前提上。當規則變動顯得突然又模糊，團隊就會開始重新評估：要不要繼續押注這個平台？要不要把教學、文件、標準流程都綁得那麼深？這些疑慮通常比價格本身更傷。

對真的在做 coding agents 的人來說，這也是一個很直白的提醒，商業模式不是背景板。當競爭對手還把免費或低價門檻留著，溝通失誤就不只是公關問題，而是會直接把市場教育送到別人手上。
