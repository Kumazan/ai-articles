---
title: "Anthropic 推出 Claude Design，讓 Claude 變成視覺創作工作台"
description: "Anthropic 釋出 Claude Design，讓設計師、產品與行銷團隊用自然對話做原型、投影片與品牌素材，並把成品交回 Claude Code 接手。"
date: 2026-04-17
author: Anthropic
layout: post
permalink: /2026-04-17/claude-design-anthropic-labs.html
image: /2026-04-17/og-claude-design-anthropic-labs.png
---

<div class="hero-badge">AI News · 2026-04-17</div>

![](/ai-articles/2026-04-17/og-claude-design-anthropic-labs.png)

**原文連結：** [Introducing Claude Design by Anthropic Labs](https://www.anthropic.com/news/claude-design-anthropic-labs)

## 摘要

- Anthropic 推出 Claude Design，讓 Claude 從文字助手進一步變成視覺工作協作者
- 這項產品主打設計稿、原型、投影片、一頁式簡報與行銷素材等工作
- Claude 可以讀取程式碼庫與設計檔，幫團隊建立自己的 design system
- 使用者能用 inline comment、直接改字、調整 slider 來逐步修正作品
- 成品可匯出成 PPTX、PDF、Canva、HTML，或直接交給 Claude Code 接手開發
- 對非設計背景的人來說，這把「把想法做成看得見的草稿」門檻再壓低了一階

<div class="sep">· · ·</div>

Anthropic 今天推出 Claude Design，這是 Anthropic Labs 的新產品，讓你能和 Claude 一起做出精緻的視覺作品，例如設計稿、原型、投影片、一頁式簡報等等。

Claude Design 由 Claude Opus 4.7 驅動，目前以 research preview 形式提供給 Claude Pro、Max、Team 和 Enterprise 訂閱者，並會在今天稍晚逐步開放。

就算是有經驗的設計師，也常常得節制探索空間，因為通常沒有時間真的做十幾個方向的原型，所以最後只能選幾個方向試。對創辦人、產品經理、行銷人來說，如果腦中有想法但沒有設計背景，要把想法表達成作品也常常很卡。

Claude Design 的定位，就是一邊給設計師更多發散空間，一邊讓其他人也能更快產出視覺作品。只要描述需求，Claude 就會先做出第一版。接著可以透過對話、行內註解、直接編輯，或是 Claude 生成的自訂滑桿一步步修正，直到符合需求。

如果有權限，Claude 也能自動把團隊的 design system 套進每個專案，讓輸出和公司現有設計風格保持一致。

團隊目前已經拿 Claude Design 來做這些事：

- 擬真原型：設計師可以把靜態 mockup 變成可分享的互動原型，用來收集回饋和做使用者測試，不必先走 code review 或 PR。
- 產品 wireframe 與 mockup：產品經理可以先畫出功能流程，再交給 Claude Code 實作，或分享給設計師繼續調整。
- 設計發想：設計師可以快速產出多種方向，拉大探索範圍。
- 簡報與提案 deck：創辦人與業務可從大綱快速做成完整、符合品牌的一套簡報，然後匯出成 PPTX，或送到 Canva。
- 行銷素材：行銷人員可以做 landing page、社群素材與活動視覺，再找設計師一起收尾。
- Frontier design：任何人都能做出帶有 voice、video、shader、3D 與內建 AI 的 code 驅動 prototype。

## 運作方式

Claude Design 的工作流程很自然。

**品牌先內建。** 在 onboarding 時，Claude 會讀取你的程式碼庫與設計檔，替團隊建立 design system。之後每個專案都會自動沿用你的顏色、字型與元件。這套系統也能持續調整，而且團隊可以維護不只一套。

**從任何地方開始。** 你可以從文字 prompt 起手，上傳圖片與文件（DOCX、PPTX、XLSX），或直接把 Claude 對準你的 codebase。也可以用 web capture 工具直接抓網站元素，讓 prototype 看起來更像真實產品。

**用細粒度控制修正。** 你可以在特定元素上留言、直接修改文字，或用調整旋鈕即時改 spacing、顏色和版面。之後再請 Claude 把變更同步到整份設計。

**協作。** 設計文件支援組織層級分享。你可以保持私有，也可以分享給組織內任何拿到連結的人觀看，或直接給同事編輯權，讓大家一起和 Claude 在群組對話裡改設計。

**匯出到各種地方。** 你可以把設計分享成組織內部 URL、存成資料夾，或匯出成 Canva、PDF、PPTX，甚至獨立的 HTML 檔。

**交給 Claude Code。** 當設計準備要進入實作時，Claude 會把所有內容打包成 handoff bundle，只要一個指令就能交給 Claude Code 接手。

未來幾週，Anthropic 也會讓 Claude Design 更容易串接整合，接上團隊已經在用的更多工具。

> 我們非常享受過去幾年和 Anthropic 的合作，也很重視把複雜的事情變簡單。Canva 的使命一直是讓全世界都能設計，這也代表要把 Canva 帶到點子誕生的地方。我們很期待延伸和 Claude 的合作，讓人們能把 Claude Design 裡的想法和草稿順暢帶進 Canva，在那裡立刻變成可編輯、可協作、可進一步打磨與發佈的設計。

> Brilliant 的複雜互動與動畫，過去在原型階段一直很難處理，但 Claude Design 能把靜態設計轉成互動原型，讓整個流程直接往前跨了一級。我們最複雜的頁面，在其他工具裡常常要 20+ 個 prompt 才能重現，但到了 Claude Design 只要 2 個 prompt。把設計意圖放進 Claude Code 的 handoff，也讓從原型到上線的過程順很多。

> Claude Design 讓我們團隊的原型速度大幅提升，甚至能在對話進行時即時做設計。我們現在常常在大家離開會議室前，就已經從粗略想法做出一個能跑的 prototype，而且輸出還能維持品牌與設計規範。以前要花上一週在 brief、mockup、review 之間來回，現在一場對話就能完成。

## 開始使用

Claude Design 現已提供給 Claude Pro、Max、Team 和 Enterprise 訂閱者。它包含在方案裡，會計入訂閱額度；如果想超出額度，則可以啟用額外用量。

對 Enterprise 組織來說，Claude Design 預設是關閉的，管理員可以在 Organization settings 中啟用。

可直接從 [claude.ai/design](http://claude.ai/redirect/website.v1.c0562954-cffb-427f-a414-7c85fb214d26/design) 開始使用。

## 相關內容

### [Claude Opus 4.7 再看一次](https://www.anthropic.com/news/claude-opus-4-7)
這個最新的 Opus 模型，在 coding、agents、vision 與多步驟任務上都更強，對重要工作也更徹底、更穩定。

### [Anthropic 長期利益信託任命 Vas Narasimhan 加入董事會](https://www.anthropic.com/news/narasimhan-board)

### [Anthropic 與 Google、Broadcom 擴大合作，投入數百億瓦次世代算力](https://www.anthropic.com/news/google-broadcom-partnership-compute)

## 延伸評論：AI 工具開始吃掉設計流程了

Claude Design 的重點不只是「會畫圖」，而是把設計從單點產出變成可迭代、可協作、可移交的流程。這意味著 AI 進入的不是靈感階段而已，而是設計系統、原型、簡報、交接這整條鏈。

更值得注意的是，它直接把 Claude Code 拉進工作流，代表視覺產出和實作不再是兩個孤島。對真的在做產品的人來說，最有價值的可能不是炫技，而是少掉一整輪來回。