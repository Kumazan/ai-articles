---
title: "Claude Code 原始碼外洩事件詳解：Anthropic 犯了什麼錯？程式碼裡藏了什麼秘密？"
description: "Anthropic 近期因 npm 包裝錯誤意外外洩了 Claude Code 的完整 TypeScript 原始碼。這篇文章深入剖析了外洩原因、程式碼中揭露的 KAIROS 與 BUDDY 等未發佈功能，以及此事件對 AI 代理安全治理的深遠影響。"
date: 2026-04-02
author: AI Articles Publisher
layout: post
permalink: /2026-04-02/claude-code-source-leak-deep-dive.html
---

<div class="hero-badge">AI News · 2026-04-02</div>

**原文連結：** [https://dev.to/waxell/anthropic-just-leaked-claude-codes-source-heres-what-that-means-for-every-ai-agent-you-run-f7k](https://dev.to/waxell/anthropic-just-leaked-claude-codes-source-heres-what-that-means-for-every-ai-agent-you-run-f7k)

## 摘要

*   **外洩原因**：Anthropic 在發佈 Claude Code v2.1.88 到 npm 時，意外包含了 59.8 MB 的 source map 文件（`cli.js.map`）。
*   **規模巨大**：外洩內容包含約 512,000 行 TypeScript 程式碼，涵蓋 1,900 個文件，揭露了完整的代理架構。
*   **核心組件曝光**：包括工具執行邏輯、多代理協調系統（Coordinator）、以及自我修復記憶架構。
*   **隱藏功能驚現**：程式碼中包含未發佈的 **KAIROS**（24/7 背景代理模式）與 **BUDDY**（終端寵物伴侶系統）。
*   **安全防禦機制**：揭露了 Anthropic 為了對抗「模型蒸餾」（Distillation）而植入的假工具定義（Poisoning）機制。
*   **社群瘋傳**：GitHub 上出現多個鏡像倉庫，其中 clean-room 改寫版本「claw-code」在 24 小時內突破 10 萬星。

<div class="sep">· · ·</div>

在 AI 領域，2026 年 3 月底無疑是 Anthropic 的「黑色一週」。繼 3 月 26 日因 CMS 配置錯誤導致未發佈模型 Claude Mythos 的相關文件外洩後，不到五天，Anthropic 再次發生重大失誤：這一次，是他們引以為傲的終端 AI 程式助手 —— **Claude Code** 的原始碼被完整攤在陽光下。

### 一個 source map 引發的慘案

這次外洩並非駭客入侵，而是一個低級的開發流程錯誤。Anthropic 的工程師在將 `@anthropic-ai/claude-code` 版本 2.1.88 推送到 npm 註冊表時，忘了在 `.npmignore` 中排除 source map 文件。

Source map 是開發者用來調試混淆程式碼的「譯碼本」，它能將壓縮後的 JavaScript 還原回可讀的 TypeScript 原始檔。由於該文件直接指向了 Anthropic 存放原始碼的 Cloudflare R2 存儲桶，全世界的開發者只需下載 npm 套件，就能順藤摸瓜抓下整整 512,000 行的原始程式碼。

### 程式碼裡的寶藏：KAIROS 與 BUDDY

開發者在 dissect 這些程式碼後，發現了許多 Anthropic 尚未正式公佈的驚人功能：

1.  **KAIROS 模式**：這是一個被標記為「主動」（Proactive）的後台進程。它不僅能監控文件變動，還能在電腦閒置時自動啟動「做夢」（Dreaming）模式，進行記憶鞏固與邏輯優化。這意味著未來的 Claude Code 可能不再需要你下令，它會在你睡覺時默默修好 bug。
2.  **BUDDY 伴侶系統**：一個帶有 Tamagotchi 風格的終端寵物。這不僅僅是裝飾，這些寵物（如水豚、貓咪）擁有「調試能力」、「耐性」與「混亂度」等屬性，似乎會影響 AI 的行為風格。
3.  **多代理協作（Coordinator）**：程式碼中揭露了 Claude 如何生成多個「子代理」（Sub-agents）並分配受限的工具集（Restricted Tools），這與目前市場上主流的 Swarm 架構高度吻合。

### 反偵查：與競爭對手的暗戰

外洩程式碼中最令技術圈震驚的，是 Anthropic 對抗競爭對手「偷師」的手段。程式碼中包含一套名為「Anti-distillation」的系統，它會在檢測到疑似爬蟲或蒸餾攻擊時，向 API 請求中注入「偽造的工具定義」。如果競爭對手試圖用 Claude 的輸出來訓練自己的模型，這些「毒藥數據」將會破壞其訓練效果。

### 安全治理的新常態

這次事件讓「AI 代理治理」（Agent Governance）成為熱門話題。當 AI 代理擁有讀寫文件、執行 shell 指令的高權限時，它的「行為邏輯」如果對攻擊者透明，將極大增加被攻擊的風險。

專家指出，未來的防禦不能依賴「程式碼不外洩」（Security through obscurity），而必須建立在基礎設施層級的行為審計（Behavioral Auditing）上。無論攻擊者多麼了解代理的原始碼，只要基礎設施層有限制，危險行為依然能被攔截。

<div class="sep">· · ·</div>

## AI 代理的「透明化」是進步還是災難？

這次外洩事件對開發者社群而言是場盛宴，但對 Anthropic 來說則是沈痛的教訓。

雖然 Anthropic 官方聲稱這只是「人為錯誤」且不涉及客戶數據，但兩次重大的外洩事件反映出這家 frontier lab 在急速擴張中，其發佈工程（Release Engineering）的紀律已經出現鬆動。特別是在這家公司剛宣佈年化營收衝破 250 億美元、準備 IPO 的關鍵時刻，這樣的失誤無疑會影響投資人的信心。

然而，從另一個角度看，這次外洩極大地推動了開源代理的發展。GitHub 上隨即出現的 clean-room 改寫版本，證明了社群對於「不受限制、無遙測、可自定義」的專業級程式助理有著極大渴求。

這也給所有正在建構 AI 應用的團隊敲響了警鐘：**在 AI 時代，你的程式碼遲早會被看光。** 如果你的安全防線是建立在原始碼不被看見的前提上，那它其實根本不存在。未來的應用競爭力將在於動態的「管理」（Management）與「執行上下文」（Context Handling），而非靜態的邏輯程式碼。
