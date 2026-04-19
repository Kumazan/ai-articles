---
title: "A2UI v0.9 想把 Generative UI 變成可攜、跨框架的共通語言"
description: "Google 發表 A2UI v0.9，想把 agent 生成 UI 的方式標準化，讓本地或遠端代理都能透過既有元件庫，在 web、mobile 與其他裝置上輸出可攜又一致的介面。"
date: 2026-04-19
author: Google Developers Blog
layout: post
permalink: /2026-04-19/a2ui-v0-9-generative-ui.html
---

<div class="hero-badge">AI News · 2026-04-19</div>

**原文連結：** [A2UI v0.9: The New Standard for Portable, Framework-Agnostic Generative UI](https://developers.googleblog.com/a2ui-v0-9-generative-ui/)

## 摘要

- Google 發表 A2UI v0.9，主打讓 agent 用一套框架無關的標準宣告 UI 意圖，而不是綁死某個前端框架或元件組
- 這版核心方向是把 Generative UI 從 demo 推向 production，強調 concern 分離，讓 agent 負責生成意圖，前端沿用自己原本的 design system 與元件 catalog
- A2UI v0.9 新增 shared web-core、官方 React renderer、Agent SDK、client-defined functions、client-server data sync 與更模組化的 schema
- 傳輸層也變得更彈性，A2UI 可以跑在 MCP、WebSocket、REST、AG-UI、A2A 等通道上，不強迫開發者換整套架構
- Google 同時把 A2UI 生態系往外擴，點名 AG2、A2A 1.0、Vercel json-renderer、Oracle Agent Spec 與 AG-UI 等整合案例
- 這篇真正關心的不是單一 renderer，而是 agent 是否能在不同裝置、不同前端與不同協定之間，穩定地把「要顯示什麼 UI」這件事講清楚

<div class="sep">· · ·</div>

生成式 UI 讓 AI 代理可以即時產生符合當下互動需求的 UI widget，讓介面跟著使用者情境動態變化。但如果想從展示原型走到正式上線，系統裡就需要一個清楚的分工方式。

Google 把 A2UI v0.9 定位成這個問題的答案，也就是一套與框架無關、用來宣告 UI 意圖的標準。它讓本地或遠端代理都能用共同語言和任何 client application 溝通，確保 agent 可以在任何裝置上，透過既有的 component catalog 來生成 UI，而不是逼團隊重做整個前端。

## 代理終於可以直接「說 UI」了，而且不用推翻既有設計系統

A2UI 的設計目標，是同時支援 web、mobile，以及其他任何使用者所在的平台。

## A2UI v0.9 有哪些更新

這次版本更新的重點，是讓建立 agent 與整合現有前端變得比以前更容易。Google 表示，這一版強化了內部抽象層、簡化了 streaming 流程，也改善了整體開發者體驗。

- **從 Standard 改名為 Basic：** 前端開發者通常不想再多接一套新元件。他們本來就有自己的 design system 與慣用元件。代理應該要能動態回應，同時沿用既有前端。因此 Google 把原本那組選用元件從「Standard」改名成「Basic」，更明確傳達這不是要你換掉現有元件，而是作為可選的基礎組件集。
- **共享的 web-core 函式庫：** 在 client 端，A2UI 現在加入共享的 web-core library，大幅簡化瀏覽器端 renderer 的開發。同時官方 React renderer 也正式落地，Flutter、Lit、Angular 與 React 等 A2UI 支援 renderer 都同步升級，社群 renderer 也被獨立整理進生態系頁面。
- **Agent SDK：** 在 agent 端，A2UI Agent SDK 讓整合流程明顯更簡單。Google 也替 generation pipeline 做了新的 caching layer，目標是提供更高效、低延遲的 UI 體驗。
- **新的語言能力：** A2UI 0.9 新增 client-defined functions，特別適合拿來做 validation；同時也加入 client-to-server data syncing，支援和代理一起進行協作式編輯，另外還改善 error handling，並把 schema 做得更簡化、更模組化。
- **更簡化的傳輸層：** Google 重新整理 transport interfaces，讓 agent 與 client 的接線方式更順。A2UI 現在可以跑在 MCP、WebSocket、REST、AG-UI、A2A，或任何你想接的 transport 上。

Google 也特別展示了一個 streaming replay 範例，說明 A2UI 如何把串流 chunk 放慢、重播，並在不同 renderer 之間重現相同場景。

現在，把 A2UI 接進任何 Python agent 已經只是一次 `pip install a2ui-agent-sdk` 或 `uv add` 的距離，Go 與 Kotlin 版本也即將推出。

## 五步把 A2UI 接到既有 agent

Google 提供了一個很直接的 Hello World 流程。

第一步，先定義自己的 catalog，可以使用 Basic，也可以自帶 catalog，並選擇是否提供 examples 幫助 LLM 做 few-shot 學習。

第二步，初始化 Schema Manager，負責管理 A2UI spec 的版本。

第三步，透過 Schema Manager 產生 system prompt，把 A2UI 指令包成 agent 可直接使用的系統指示。

第四步，把這段 system instruction 丟進你原本使用的 LLM agent framework。

第五步，在實際處理使用者請求時，讓 agent 回應、解析輸出、修補與驗證 JSON，最後把可渲染的 parts 串流送回前端。

## 不只 Hello World，A2UI 也在補 production 等級能力

Google 強調，前面的範例只是靜態整合示意，真正的 A2UI Agent SDK 已經是朝 production complexity 設計。它預設支援幾個重要能力：

- **版本協商：** 可以根據 client 能力，動態選出最合適的 A2UI spec 版本
- **動態 catalog：** 可以在執行時切換不同 catalog schema，以配合不同權限條件或裝置限制
- **具韌性的串流：** 系統可以增量解析並修補 LLM 輸出，讓 client 不必等整段 JSON 全部完成，就能一邊生成一邊渲染 UI 元件

Google 也提到，接下來正在開發的方向包括更好的 MCP Apps 整合、A2UI 的 progressive disclosure skills、更高層的人類意圖抽象、PII 支援，以及更多尚未公開的能力。

## Generative UI 的生態系正在快速成形

Google 直接點名幾個正在圍繞 A2UI 擴張的生態節點，強調標準的價值取決於整個 ecosystem，而不是單一規格本身。

- **AG2：** 由 AutoGen 團隊打造，已推出原生整合 A2UI 的 A2UIAgent
- **A2A 1.0：** Agent-to-Agent 協定 1.0 已正式發布，可以作為遠端代理彼此溝通，或代理直接連前端的 transport
- **Vercel json-renderer：** Vercel 最近推出支援 A2UI 的 json-renderer proof of concept，未來可能發展成 Vercel 社群的專用 renderer
- **Oracle Agent Spec：** Oracle 最近宣布 Agent Spec、AG UI 與 A2UI 等支援，Google 將其定位為不同層可替換、但整體體驗仍可維持穩定的組合
- **AG-UI：** 支援把 A2UI、MCP Apps 與 Open Generative UI 等能力接進 agentic web app

## 兩個實際案例

Google 也列出幾個近期的 A2UI 實作案例。

### 個人健康助理

Personal Health Companion 是一個開源 app，目標是解決健康資料被切碎，以及使用者必須在層層選單中來回切換的問題。這個產品用中央 LLM 驅動的 chat 動態生成 UI widget，把關鍵檢驗值、疫苗到期資訊或診所位置，依照當下情境直接浮到前面，而不是要求使用者自己翻資料。

### 個人財務規劃

Life Goal Simulator 則是一個金融服務情境的示範，想說明 Generative UI 如何打破金融產品一體適用的靜態介面。使用者可以選 persona 與目標，像是退休存錢或購買第一間房子，然後交給 Gemini 搭配 Flutter GenUI SDK，在滑桿、長條圖與多選元件的 catalog 中即時組出原生感更強的 UI。

## 已經會說 AG-UI 的 agent，幾乎可以直接接上 A2UI

Google 還特別指出，只要 agent 已經能說 AG-UI，理論上就能在第一天驅動 A2UI v0.9，而不需要客製整合。原因是 AG-UI 的 middleware system 可以插進既有 agent pipeline，幫代理學會 A2UI 的表達方式，接好回應格式與 streaming，然後把 agent 輸出的內容轉成前端可立即渲染的元件，不管是用 A2UI 內建 renderer，或自家 custom component 都可以。

## 立即開始

如果想讓代理真正接管前端，而且仍能沿用團隊現有的元件，Google 建議可以直接從 A2UI Theater 開始，看 replay 範例，或到 A2UI.org 查文件、samples 與開發指南。

<div class="sep">· · ·</div>

## 延伸評論：生成式 UI 的下一戰，不是畫得更漂亮，而是交換格式先統一

這篇最值得注意的地方，是 Google 正在嘗試把 generative UI 從「模型臨場發揮畫幾個元件」拉回工程世界可治理的範圍。A2UI v0.9 的核心訊號，不是又多一個 UI framework，而是 agent 和前端之間終於開始出現比較像樣的協定層。

對開發者來說，這件事很重要，因為真正難的從來不是做出一個 demo widget，而是怎麼讓不同模型、不同 transport、不同客戶端與不同 design system 在 production 裡還能互通。只要這層不穩，所有 generative UI 都會停留在 showcase。A2UI 想解的，就是把「介面意圖」和「介面實作」拆開，讓代理負責前者，產品團隊保有後者。

更大的訊號是，agent 生態現在正在往多協定堆疊前進。上面有 A2A、AG-UI、MCP Apps，下面有各家 renderer、catalog 與 design system。未來真正有優勢的，不一定是單一模型最聰明的團隊，而是誰能把這些層接得最穩，讓 agent 在跨裝置、跨框架、跨品牌介面裡都能持續產出可用 UI。A2UI v0.9 也許還不是終點，但它正在把 generative UI 從靈感展示，往可攜、可治理、可替換的標準化方向推進。