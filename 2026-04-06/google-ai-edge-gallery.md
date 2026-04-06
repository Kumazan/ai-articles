---
title: "Google AI Edge Gallery：把 Gemma 4 裝進 iPhone 的離線實驗室"
description: "Google 的 AI Edge Gallery 讓 iPhone 可離線跑 Gemma 4，還支援圖片問答、音訊轉錄與工具呼叫 demo，展示端側 AI 的實用樣貌。"
date: 2026-04-06
author: Simon Willison
layout: post
permalink: /2026-04-06/google-ai-edge-gallery.html
---

<div class="hero-badge">AI News · 2026-04-06</div>

**原文連結：** [Google AI Edge Gallery](https://simonwillison.net/2026/Apr/6/google-ai-edge-gallery/)

## 摘要

- Google 推出官方 iPhone App：Google AI Edge Gallery，可在裝置本機執行 Gemma 4 模型
- 目前可用 E2B、E4B 與部分 Gemma 3 系列模型，主打離線與低延遲體驗
- E2B 下載檔約 2.54GB，作者實測速度快，而且「真的有用」
- App 內建圖片問答與最長 30 秒的音訊轉錄功能
- 另有一組 skills demo，展示模型對多個 HTML widget 的工具呼叫能力
- 目前仍缺少永久對話紀錄，代表聊天內容是一次性的、會消失的

<div class="sep">· · ·</div>

Google AI Edge Gallery 這個名字不怎麼好聽，但它確實是一款很不錯的 App：這是 Google 官方推出、可在 iPhone 上本機執行 Gemma 4 模型的應用程式，支援 E2B 與 E4B 兩種尺寸，也包含 Gemma 3 系列中的部分模型。

實際使用起來效果相當好。E2B 模型的下載大小約 2.54GB，速度快，而且確實能派上用場。

這個 App 也提供「針對圖片提問」與音訊轉錄功能，音訊長度上限為 30 秒；另外還有一個很有意思的 skills demo，展示模型如何對八個互動式 widget 進行工具呼叫。這些 widget 都是用 HTML 頁面實作的（可惜無法看到原始碼），名稱包括：interactive-map、kitchen-adventure、calculate-hash、text-spinner、mood-tracker、mnemonic-password、query-wikipedia 和 qr-code。

（作者附的截圖顯示，Gemma-4-E2B-it 模型在對話中接到「Show me the Castro Theatre on a map.」之後，呼叫了 `interactive-map/index.html` 這個 JS skill，並在地圖上標出舊金山 Castro Theatre 的位置。）

作者補充說，當他嘗試再輸入後續提示時，這個 demo 會把 App 凍住。

這是他第一次看到本地模型供應商推出官方 App，讓使用者直接在 iPhone 上試用模型。可惜的是，它沒有永久紀錄功能——在這個 App 裡的對話是一次性的，結束後就會消失。

<div class="sep">· · ·</div>

## 端側模型的下一步，不只是「能跑」

這篇貼文最有意思的地方，不是「Google 又做了一個 demo」，而是它把端側模型的價值往前推了一格：不只是在裝置上離線推理，而是把圖片、語音、工具呼叫與互動 widget 放進同一個工作流。

對開發者來說，這種產品的意義在於它把抽象的模型能力變成可操作的體驗：速度夠不夠、下載包有多大、離線場景能不能用、工具呼叫會不會卡住，全部都能直接測出來。這比單純看 benchmark 更接近真實世界。

但它也暴露了端側 AI 目前仍然尷尬的一面：模型能在手機上跑，不代表使用體驗就自然而完整。沒有永久紀錄、互動 demo 會 freeze、權限與資料流也還沒被好好包裝，這些都意味著「本機模型」離真正可依賴的產品層還有一段路。

如果 Google 接下來能把儲存、回顧、權限與沙箱設計補齊，這種 App 就不只是給人看模型效果的展示櫃，而會變成端側 AI 平台的入口。