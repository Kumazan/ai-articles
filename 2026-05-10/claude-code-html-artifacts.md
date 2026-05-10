---
title: "Claude Code 的 HTML artifacts：把 AI 回答變成可互動文件"
description: "Simon Willison 重新思考讓 Claude Code 輸出 HTML 而非 Markdown：對 PR review、研究、設計與互動說明來說，瀏覽器原生格式可能比文字牆更能承載理解。"
date: 2026-05-10
author: Simon Willison
image: /2026-05-10/og-claude-code-html-artifacts.png
layout: post
permalink: /2026-05-10/claude-code-html-artifacts.html
---

<div class="hero-badge">Simon Willison · 2026-05-08</div>

![](/ai-articles/2026-05-10/og-claude-code-html-artifacts.png)

**原文連結：** [The Unreasonable Effectiveness of HTML](https://simonwillison.net/2026/May/8/unreasonable-effectiveness-of-html/)

## 摘要

- Simon Willison 介紹 Thariq Shihipar 在 Claude Code 團隊提出的觀點：有些 AI 輸出不該只是 Markdown，而該直接生成 HTML artifact。
- HTML 可以承載 SVG 圖解、互動元件、頁內導覽、顏色標註與 richer layout，特別適合 PR review、研究整理、設計盤點與互動說明。
- Simon 過去長期偏好 Markdown，原因是 GPT-4 時代 8,192 token context 下，Markdown 比 HTML 省 token；但現在模型與使用情境已經改變。
- Thariq 的範例集展示 20 個由 agent 產生的 self-contained HTML files，涵蓋探索規劃、code review、設計、prototype、圖解、簡報、研究、報告與 custom editors。
- Simon 實測讓 GPT-5.5 把 copy.fail 的 obfuscated Python exploit 解釋成互動 HTML 頁面，結果相當可用，但也提醒 prompt 需要更明確聚焦真正要解釋的部分。

<div class="sep">· · ·</div>

Simon Willison 指向了 Claude Code 團隊成員 Thariq Shihipar 的一篇有意思的文章：Thariq 主張，在某些情境下，向 Claude 要求 HTML 輸出會比要求 Markdown 更有效。

這篇文章收集了很多例子，也提供了像這樣的 prompt：

> 幫我 review 這個 PR，請建立一個 HTML artifact 來描述它。我不太熟 streaming / backpressure logic，所以請聚焦那部分。把實際 diff render 出來，加上 inline margin annotations，用顏色標示 findings severity，並加入任何有助於傳達概念的呈現方式。

Simon 說，從 GPT-4 時代開始，他預設多半都會要求 Markdown。原因很實際：當時 8,192 token limit 很珍貴，而 Markdown 相比 HTML 更省 token，這個優勢非常明顯。

但 Thariq 的文章讓他重新思考這件事，尤其是對輸出格式而言。要求 Claude 產生 HTML 解釋時，模型可以放入 SVG diagrams、interactive widgets、in-page navigation，以及各種讓資訊更容易瀏覽的表現方式。

Simon 去年 12 月寫過一篇〈Useful patterns for building HTML tools〉，但那篇主要聚焦在互動工具，例如他放在 tools.simonwillison.net 上的小工具。這一次，他更想開始實驗「針對臨時 prompt 產生 rich HTML explanations」這個方向。

Thariq 也整理了一個範例網站，收集 20 個由 agent 產生的 self-contained HTML files。這些檔案不是把 Markdown 換成更花俏的排版而已，而是把本來會變成文字牆的輸出，改造成可以在瀏覽器裡閱讀、互動、比較與操作的 artifact。

範例被分成幾類：

- Exploration & Planning：當使用者還不確定要什麼時，agent 可以把多個方向並排呈現，讓人直接比較，而不是閱讀三段連續文字後在腦中硬記差異。
- Code Review & Understanding：diffs 和 call graphs 本來就是空間資訊；Markdown 會把它們壓扁。HTML 則能把 change render 成 annotated diff、把 module 畫成 boxes and arrows，或產出 reviewer 真正想看的 PR description。
- Design：design system 本來就以 HTML / CSS 形式存在，因此 tokens 可以變成 color swatches，components 可以變成 contact sheets，artifact 也能直接餵回下一輪 prompt。
- Prototyping：motion 和 interaction 很難只靠文字描述。做一個可丟棄的 HTML page，用真實 easing curve 或 click-through 展示，五秒內就能說明一段 prose 講不清楚的東西。
- Research & Learning：可摺疊段落、tabbed code samples、旁欄 glossary，會讓一篇解釋文和線性文字有完全不同的閱讀感。
- Custom Editing Interfaces：有些需求很難在文字框裡說清楚。可以讓 agent 做一個剛好對應當前任務的小 editor，最後提供 export button，把人在 UI 中操作出的結果轉回可貼給 agent 或可 commit 的內容。

Simon 也立刻做了一個實驗。他拿 copy.fail 這個最近被發現的 Linux security exploit 作例子；該網站包含一段以 obfuscated Python 發布的 proof of concept。

他讓 GPT-5.5 建立一個 HTML explanation，要求模型詳細解釋程式碼、重新格式化、展開困惑之處，並用 HTML、CSS、JavaScript 的能力讓說明更 rich、interactive、clear。

結果產出的 HTML page 還不錯。不過 Simon 也補充，自己應該在 prompt 裡更明確強調「解釋 exploit 本身」，而不是讓模型花太多力氣說明包在外面的 Python harness。

<div class="sep">· · ·</div>

## 延伸評論：AI 輸出的下一個瓶頸是媒介，不只是模型

這篇真正有價值的地方，不是「HTML 比 Markdown 高級」這種表面結論，而是提醒開發者：AI 輸出的格式會限制思考方式。Markdown 很適合可讀、可 diff、可版本控制的文字，但它不一定適合承載空間關係、互動流程、視覺比較或設計系統。

對真的在用 coding agents 的人來說，這是一個很實用的切換點。當任務是寫 memo、整理 checklist、留下可追蹤的 spec，Markdown 仍然合理；但當任務是 review 複雜 diff、理解系統架構、比較多個 UI 方向、或讓人操作後再回饋給 agent，HTML artifact 可能更接近正確工具。重點不是把所有輸出都變漂亮，而是讓輸出本身成為可以探索、驗證與操作的工作介面。

不過這個方向也有代價。HTML 比 Markdown 更耗 token，也比較容易讓人失去直接手改文字的便利；如果 artifact 變成一次性漂亮頁面，卻沒有保留資料結構、可 diff 性或 export path，就可能只是另一種視覺版 slop。比較成熟的做法，應該是把 HTML 當作「閱讀與操作層」，同時讓背後的資料、決策與修改結果仍能回到結構化、可提交、可 review 的形式。
