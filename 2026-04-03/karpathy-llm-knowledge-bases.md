---
title: "用 LLM 打造個人知識庫：Karpathy 的實戰工作流"
description: "AI 大神 Karpathy 分享如何用 LLM + Obsidian 建立個人知識庫，反駁「小規模不需要 RAG」的直覺，強調 LLM 自己維護結構比預設 fancy tool 更有性價比。"
date: 2026-04-03
author: karpathy
layout: post
permalink: /2026-04-03/karpathy-llm-knowledge-bases.html
image: /ai-articles/2026-04-03/og-karpathy-llm-knowledge-bases.png
---

<div class="hero-badge">AI News · 2026-04-03</div>

![](/ai-articles/2026-04-03/og-karpathy-llm-knowledge-bases.png)

**原文連結：** [LLM Knowledge Bases](https://x.com/karpathy/status/2039805659525644595)

## 摘要

- Karpathy 近來大量 token 流量從「操作程式碼」轉向「操作知識」（以 markdown 和圖片形式儲存）
- 三層架構：**Raw Data** → **LLM 編譯成 Wiki** → **Q&A / Output**，所有產出回流豐富 wiki
- IDE 前端選 **Obsidian**，搭配 Marp（簡報）、matplotlib 圖表等多種視覺化輸出格式
- 小規模知識庫（~100 篇、~40 萬字）不需要 fancy RAG，全文塞進 context window 效果就很好
- LLM 會自動維護 index、文件摘要，並透過「健康檢查」發現不一致與缺失資料
- 最終願景：synthetic data generation + 微調，讓 LLM 直接「掌握」知識而非只靠 context window

<div class="sep">· · ·</div>

最近我發現一個非常實用的做法：用 LLM 來建立各種研究主題的個人知識庫。在這個方式下，我近期的 token 流量有很大一部分不再是操作程式碼，而是操作知識（以 markdown 和圖片的形式儲存）。最新一代的 LLM 在這方面表現得相當出色。

**資料攝入（Data Ingest）**

我會把來源文件（文章、論文、repo、資料集、圖片等）索引進一個 `raw/` 目錄，然後用 LLM 增量地「編譯」成一個 wiki——也就是一個目錄結構中的 `.md` 檔案集合。這個 wiki 包含 `raw/` 中所有資料的摘要、backlinks，然後將資料分類成概念、撰寫文章，並建立所有連結。要把網頁文章轉成 `.md` 檔案，我喜歡用 Obsidian Web Clipper 擴充功能，然後用一個快捷鍵下載所有相關圖片到本地，這樣我的 LLM 就能輕鬆引用它們。

![](/ai-articles/2026-04-03/karpathy-llm-knowledge-bases-illustration.png)

**IDE**

我使用 Obsidian 作為 IDE 的「前端」，可以在當中查看原始資料、編譯後的 wiki，以及衍生出來的可視化。需要特別說明的是，wiki 的所有資料都是由 LLM 撰寫和維護的，我很少直接動手編輯。我試過一些 Obsidian 外掛程式來以其他方式呈現和查看資料（例如用 Marp 製作簡報）。

**問答（Q&A）**

有趣的地方在這裡：一旦你的 wiki 大到某個程度（例如我某個近期研究的 wiki 約有 100 篇文章、40 萬字），你就可以對 LLM agent 提出各種複雜的問題，它會自己去研究答案。我本來以為必須用到 fancy RAG，但 LLM 能自動維護 index 檔案和所有文件的簡短摘要，在這個規模下閱讀所有重要的相關資料已經相當輕鬆。

**輸出（Output）**

我喜歡讓 LLM 幫我 render 出 markdown 檔案，或者簡報（Marp 格式），或者 matplotlib 圖表——這些我都會在 Obsidian 中再次查看。你可以根據查詢內容想像許多其他視覺化輸出格式。通常，最終我會把輸出「歸檔」回 wiki，進一步豐富查詢的基礎。所以我自己的探索和提問都會在知識庫中累積。

**Linting**

我對 wiki 執行過一些 LLM「健康檢查」，例如找出不一致的資料、填補缺失的資料（透過網路搜尋）、發現有趣的新連結作為候選文章等，來逐步清理 wiki 並提升整體資料完整性。LLM 在建議後續問題和值得深入的方向上表現得相當不錯。

**額外工具**

我正在開發更多處理資料的工具。例如，我用 vibe coding 刻了一個簡單但直覺的 wiki 搜尋引擎，我既直接使用它的 web UI，但更常見的情況是透過 CLI 將它交給 LLM，作為大型查詢的工具。

**進一步的探索**

隨著知識庫的增長，自然會想到合成資料生成 + 微調，讓我的 LLM「掌握」資料而不只是依賴 context window。

**TLDR：** 從各個來源收集原始資料，然後由 LLM 編譯成 `.md` wiki，接著透過各種 CLI 讓 LLM 進行問答和增量強化 wiki，所有內容都能在 Obsidian 中查看。你很少親自寫或編輯 wiki，那是 LLM 的領域。我認為這裡有機會做出一個真正不可思議的產品，而不是一堆湊合用的腳本。

<div class="sep">· · ·</div>

## 工程師觀點：為什麼「小規模不需要 RAG」是對的

Karpathy 這篇最核心的 insight，其實不是工具鏈，而是他對 RAG 的反駁。

多數人在遇到知識庫問題時，第一個念頭就是「我需要向量檢索、需要 chunking、需要 embedding」。但 Karpathy 的經驗指出：當你的 wiki 只有 100 篇、40 萬字的規模時，全文直接塞進 LLM 的 context window 效果就已經很好了。背後的原因很直觀——**LLM 的 context attention 機制在處理這麼多文字時，其實比你精心設計的 embedding + similarity search 更靠譜**。你不需要重建索引、不需要處理 chunk boundary 的語意斷裂、不需要維護一個額外的向量資料庫。

他的 LLM 自動維護「index 和簡短摘要」這個設計也很聰明。本質上這是一種 lazy RAG——不是一開始就把所有文件都向量化成 chunk，而是讓 LLM 在閱讀文檔的過程中，自然地提煉出摘要和相關性資訊。隨著查詢累積，這些摘要會越來越精確，但代價只是在 context window 裡多塞幾百字的 index。

這個原則可以推廣：當你的資料量還撐不起一個專門的 vector DB 團隊來維護時，先相信 context window。
