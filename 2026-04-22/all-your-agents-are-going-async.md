---
title: "所有 AI 代理都在轉向非同步"
description: "Zak Knill 認為，聊天式 LLM 只是起點，真正的下一步是讓 agent 在背景持續工作，並用可持久的 transport 與人協作。"
date: 2026-04-22
author: Zak Knill
layout: post
permalink: /2026-04-22/all-your-agents-are-going-async.html
image: /2026-04-22/og-all-your-agents-are-going-async.png
---

<div class="hero-badge">AI News · 2026-04-22</div>

![](/ai-articles/2026-04-22/og-all-your-agents-are-going-async.png)

**原文連結：** [All your agents are going async](https://zknill.io/posts/all-your-agents-are-going-async/)

## 摘要

- 這篇文章的核心主張很直白，AI 代理正在從「你一句、我一句」的聊天模式，轉向可在背景長時間運作的非同步模式。
- 作者認為，真正的關鍵不只是模型更強，而是 transport 也要跟著升級，不能再只靠 HTTP request-response。
- 文章點名了 OpenClaw、Anthropic Channels、Routines、Remote Control、ChatGPT scheduled tasks、Cursor background agents 等例子。
- 他把問題拆成兩半，durable state 跟 durable transport，前者很多平台已經在做，後者才是更難的地方。
- 對做 agent 系統的人來說，這篇的價值在於它把「聊天產品」和「真正的工作系統」之間的落差講得很清楚。

<div class="sep">· · ·</div>

Agents 以前是你同步對話的東西。現在，它們變成會在背景跑的東西，你一邊工作，它一邊做事。當這件事發生時，底層 transport 就開始失靈。

LLM 剛出來的那段時間，大多數人都是打開聊天視窗，輸入 prompt，然後看模型一個 token 一個 token 地把答案吐回來。ChatGPT、claude.ai、Claude Code，還有幾乎所有 AI SDK 或 AI library 的 demo，都是這種模式。很容易以為，這就是 AI 現在能力的上限。但其實不是。

真正正在發生的事，是所有 agent 都在轉向非同步。Agent 開始有 cron、webhook 支援、WhatsApp 整合、從手機遠端控制、排程任務與 routines。Agent 變成了會在背景持續運作的東西，在你工作時替你做事，然後再非同步回報結果。Agent 也開始接上 Temporal、Vercel WDK、Relay.app 之類的工作流系統。人在終端機或網頁聊天視窗前面盯著它，只是其中一種模式，而且越來越不是最有趣的那一種。真正有意思的是，agent 在沒有人類同步監督時，能做些什麼。

問題在於，聊天機器人主要是建在 HTTP 上的。送出一個 HTTP request，塞進 prompt，然後把 LLM 產生的 token 透過 SSE stream 回傳。但當 agent 是非同步執行時，這套就不行了。沒有一條 HTTP 連線可以讓你把回傳結果一路串回來。

## OpenClaw 的 async 步驟

OpenClaw 先往非同步 agent 邁了一大步，證明 agent 可以住進 WhatsApp 聊天裡。agent 可以跟著人一起移動，也可以在背景處理事情。OpenClaw 證明，使用者不必黏在瀏覽器或終端機前，也能讓 AI 幫忙做事。

Anthropic 對 OpenClaw 模式的直接回應是 Channels，這是 MCP-based 的設計，可以把外部聊天系統的訊息非同步推進 Claude Code session。它們還有 `/loop` 和 `/schedule` 這類 slash command，以及 Routines，都可以把 agent 排進背景執行。Anthropic 另外也做了 Remote Control，讓你可以從手機或另一個瀏覽器接續 Claude Code session。

ChatGPT 也有 scheduled tasks，可以觸發非同步 agent，在需要時反過來找你。Cursor 也有 background agents，讓工作在雲端背景執行。這些功能的共同點，都是把「人坐在終端機或聊天視窗前，一輪一輪互動」這件事解耦。它們讓 agent 互動變成連續、遠端、長時間、非同步。

## transport 不對位

這些新功能有個共同問題：agent 工作的生命週期，和單一 HTTP 連線的生命週期脫鉤了。在 chatbot demo app 裡，agent 只有在 HTTP 連線開著時才會處理事情。LLM 會對一個 HTTP request 做推論，並把 token 透過 SSE stream 回傳。但這無法應付非同步 agent。

舊的 HTTP transport 有四種情境處理得很差：

- **agent 活得比呼叫者久**：例如 routine 從 cron 觸發，或 agent 工作時間很長。五分鐘後結果出來了，但沒人在線上等。結果要丟去哪？現在通常是寫進資料庫，然後你得用某個 session URL 去輪詢，這很煩。
- **agent 想主動推送**：agent 完成一輪夜間 backlog review，手上有三個 PR 要你審。或者 async workflow 走到 human-approval 步驟，需要你先按 yes 才能繼續。這時沒有一條連線可以直接推回你。現在通常只能寄 email，或發 Slack 訊息。
- **呼叫者換了裝置**：你在桌上電腦上啟動任務，午餐時間走開，之後想用手機看進度。Anthropic 的 Remote Control 可以處理一部分，但它靠的是自訂的後端 session storage 和管理。這還不是 HTTP transport 的一等公民能力。
- **同一個 session 有多個人**：五個人一起做同一個任務，agent 也在協作。它需要能把更新推給五個人中的每一個，也要能接收任何一個人的輸入。

很多人覺得 OpenClaw 很酷，原因之一就是它把這些情境一起處理掉了。OpenClaw 把 agent 工作的生命週期，和人類連線的生命週期分開。agent 可以非同步工作，然後用 WhatsApp、iMessage、Telegram、Discord 或其他非同步聊天系統，在完成後把結果推回來。這根本不是 HTTP request-response 做得到的事。

## 大家到底怎麼解？

放眼整個產業，現在有好幾種不同解法。很明顯的一種，就是 OpenClaw 這種模式，把所有互動都放在外部聊天平台上。這個聊天平台也會把 conversation history 提供給 agent，所以 agent 就算重啟，也還是有上下文。不過我不覺得這是最有趣的解法。

更多人其實是把 session state 逐步收進一個集中式、託管式的環境裡。Anthropic 正在用 Routines 和 Remote Control 做這件事。更多 session state、conversation history 和 agent inference 都跑進 Anthropic 自己託管的平台裡。他們不是只當 LLM inference API，而是在整合更多 agent 生命週期和連線狀態。

Cloudflare 也加入了這場戰局，推出建立在 workers 平台上的 Agents 平台。Cloudflare Sessions API 提供了 agent 的 session 與 conversation storage，而且可以透過 HTTP 存取。為了解決非同步通知問題，Cloudflare 也推出了 Email for Agents。

## 這些解法只解了一半

問題其實分成兩半。第一半是 durable state，agent 的狀態放哪裡？它在重啟或處理非同步任務時怎麼讀到那些狀態？它的輸出又存到哪裡？第二半是 durable transport，response 的 bytes 要怎麼在 agent 和人類，或 agent 和其他 agent 之間傳遞？怎麼讓連線撐過斷線、換裝置、fan-out、server-initiated push 等狀況？

Anthropic 和 Cloudflare 的方案，主要都在處理第一半。他們在做 durable state 的儲存與管理。至於 response bytes 怎麼送到人手上，還是得靠 polling，或 HTTP request。Cloudflare 雖然有 websocket 支援，但它沒辦法在斷線後，繼續維持串流中的 LLM response。Anthropic 和 Cloudflare 的思路是，只要把所有需要的資料存好，client 之後總能用 HTTP GET 把資料拿回來。這算是半成功，但還談不上是「可能性之藝術」。

## durable transport，durable state

現在 session 和 transport 全都綁在同一個 HTTP request-response 裡。Cloudflare 和 Anthropic 的託管功能，某種程度上讓 session state 變得更 durable，但它們沒有解掉 transport 問題。

你還是得用 HTTP GET，或 polling，才能知道有沒有新東西發生。回頭看 OpenClaw 的模式，conversation history 在聊天通道裡，agent process 和 LLM provider 又與它分離，這種設計沒辦法直接照搬到 Cloudflare 或 Anthropic 上。那裡沒有一個可供 enterprise 使用的 OpenClaw channels 版本。沒有 durable transport，也沒有 durable state 的完整解法。

如果把問題拉到基礎設施層來看，最值得關注的方向，是把 session 當成核心概念來設計在既有的即時訊息平台上。每次看到大家一次又一次重複踩到同樣的問題，都很讓人沮喪，因為他們一開始就選錯了 transport：HTTP request-response。

對 AI 來說，session 應該是一個人和 agent 都可以隨時連上、隨時斷開的東西。人可以來來去去，session 也應該能撐過 Wi‑Fi 問題，或者人搭進隧道、手機斷線這種狀況，而人和 agent 都不需要為此操心。這就是現代非同步 agentic application 最值得追求的能力。

conversation state 應該透過這個 durable session 來存取，而人和 agent 也應該透過它互相通知。session 應該是建構 async agent 的一等公民 primitive。

因為既有的 realtime messaging platform 已經支援雙向、durable、realtime 的 transport，而且也支援 multi-device 和 multi-user，真正的挑戰就變成把 session state 和 conversation history 接上去，試著一次解掉兩半問題，durable transport 和 durable state。

<div class="sep">· · ·</div>

## 延伸評論：agent 的真正瓶頸，是把工作關係變成 session 關係

這篇最有價值的地方，不是再講一次「agent 很重要」，而是把問題拉回基礎設施層。很多團隊其實已經有不錯的模型、工具調用和工作流編排，卡住的反而是狀態怎麼留、結果怎麼回、誰能接手、斷線後怎麼續跑。

對真的在做 agent 的人來說，這意味著產品設計不能只想「聊天框要不要更順」，而要先決定 session 是不是一等公民。如果 transport 還是靠短命的 request-response，所謂長流程 agent 多半只是把輪詢包得更好看而已。

更現實的一點是，越多人把 agent 送進背景、排程、跨裝置與多人的情境，越會逼出「通知」「接續」「審批」這些老問題。能把這些問題原生處理好的平台，才真的接近 agent 時代的底層。