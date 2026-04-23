---
title: "OpenAI 用 WebSockets 把 Responses API 的 agent 迴圈加速 40%"
description: "OpenAI 透過 WebSockets、連線狀態快取與 previous_response_id，將 Responses API 的 agent 迴圈端到端加速 40%，讓高頻工具呼叫不再被 API 開銷拖慢。"
date: 2026-04-22
author: OpenAI
layout: post
permalink: /2026-04-22/openai-websockets-responses-api-agentic-workflows.html
image: /2026-04-22/og-openai-websockets-responses-api-agentic-workflows.png
---

<div class="hero-badge">AI News · 2026-04-22</div>

![](/ai-articles/2026-04-22/og-openai-websockets-responses-api-agentic-workflows.png)

**原文連結：** [Speeding up agentic workflows with WebSockets in the Responses API](https://openai.com/index/speeding-up-agentic-workflows-with-websockets/)

## 摘要

- OpenAI 把焦點放在 agent 迴圈的延遲：不是單次推理，而是整個工具呼叫往返的總成本。
- 透過 WebSockets 與連線層快取，Responses API 的 agent 工作流端到端加速了 40%。
- 在更快的模型時代，API 本身的額外開銷反而成了新瓶頸。
- 新方案保留熟悉的 `response.create` 介面，改用 `previous_response_id` 續接狀態。
- 這套設計讓安全檢查、tokenization、路由與 billing 都能少做重工。
- Codex、Vercel、Cline、Cursor 的實測結果都顯示明顯加速。

<div class="sep">· · ·</div>

當你讓 Codex 修 bug 時，它會掃描整個程式庫、讀檔建立脈絡、修改程式、再跑測試驗證結果。底層看起來就是一連串來回的 Responses API 請求：判斷模型下一步要做什麼、在本機執行工具、把工具輸出再送回 API，然後重複這個流程。

這些請求累積起來，可能就是使用者等好幾分鐘的原因。從延遲角度看，Codex 的 agent 迴圈主要花在三個階段：API 服務端處理請求、模型推理、以及用戶端執行工具並組裝上下文。推理階段就是模型在 GPU 上產生新 token 的部分。過去推理最慢，所以 API 的額外開銷還不算顯眼；但現在模型越來越快，agent 迴圈裡累積的 API 開銷就變得非常明顯。

這篇文章說明，OpenAI 怎麼把 agent 迴圈做成端到端快了 40%，讓使用者真的感受到推理速度從每秒 65 tokens 提升到接近 1,000 tokens 的差異。做法包含快取、減少不必要的網路跳轉、改良安全系統以便更快標記問題，還有最關鍵的：建立一種能對 Responses API 保持持久連線的方式，而不是每次都走一輪同步請求。

在 Responses API 裡，像 GPT‑5 和 GPT‑5.2 這類前一代旗艦模型大約是每秒 65 tokens。對 GPT‑5.3‑Codex‑Spark 這種更快的 coding 模型，目標是高出一個數量級，超過每秒 1,000 tokens，並靠專門為 LLM 推理優化的 Cerebras 硬體實現。要讓使用者真正感受到這個速度，OpenAI 必須先把 API 開銷壓下來。

大約從 2025 年 11 月開始，團隊啟動了一輪效能衝刺，先在單次請求路徑上做了一堆優化：

- 把已渲染的 token 與模型設定快取在記憶體裡，避免多輪請求時重做昂貴的 tokenization 與網路呼叫
- 減少網路跳轉，移除中介服務的多餘呼叫，直接打到 inference service
- 改良安全系統，讓部分分類器能更快處理、快速標記有問題的對話

這些改進讓 time to first token（TTFT，也就是使用者感受到回應的速度）提升了將近 45%。但對 GPT‑5.3‑Codex‑Spark 來說，這還是不夠快。即使模型本身已經很快，Responses API 的額外成本仍然太高，也就是說，使用者還得先等 API 服務端 CPU 做完事，才能真的用到 GPU 上的模型速度。

更深層的問題其實是架構性的：每一次 Codex 請求都被當成獨立事件處理，對話狀態與其他可重用上下文在每個後續請求裡又被重建一次。就算大部分內容根本沒變，系統還是得為整段歷史重新付出成本。對話越長，重複處理越貴。

於是團隊開始重新思考傳輸層：可不可以保留一條持久連線，把狀態快取起來，而不是每次都透過 HTTP 重新建立連線、再把完整對話歷史送一遍？想法很簡單：只送需要驗證與處理的新資訊，把可重用狀態留在記憶體裡，讓整個連線期間都能重複使用。這樣就能避免重複工作帶來的額外開銷。

團隊評估了幾種做法，包括 WebSockets 和 gRPC 雙向串流，最後選了 WebSockets。原因很務實：它只是個簡單的訊息傳輸協定，開發者不用改 `Responses API` 的 input/output shape，就能接上。它夠 developer-friendly，也跟現有架構相容。

第一版 WebSocket 原型證明這條路可行，而且效果超出預期。工程師把 agent rollout 想成一個長時間運行的 Response。利用 asyncio，Responses API 可以在模型 sample 到工具呼叫後先暫停，送出一個 `response.done` 事件給 client；等 client 執行完工具，再送回 `response.append` 事件，模型就能把工具結果接回上下文，繼續往下 sample。

這個設計的概念類似把本地工具呼叫，抽象成一個 hosted tool call。當模型呼叫 web search 時，推理迴圈會暫停、去查遠端服務，然後把結果放進模型上下文；這裡只是把那個遠端服務換成 client 本機。模型把工具呼叫送回去，client 回傳結果，再繼續推理。這讓 agent rollout 裡重複的 API 工作大幅減少。

但原型也有代價：這種互動方式不夠直覺，API 形狀變得更複雜。OpenAI 想保留開發者熟悉的使用感，不希望大家為了 WebSocket 支援整個重寫整合方式。

所以正式上線時，API 介面又退回熟悉的形式：還是用 `response.create`，但透過 `previous_response_id` 來延續前一次 response 的狀態。

在 WebSocket 連線上，server 會維護一份連線範圍內的 in-memory cache，裡面保存前一個 response 的狀態。當下一次 `response.create` 帶上 `previous_response_id`，系統就直接從快取讀狀態，不必重新從零重建整段對話。

這個快取包含幾個關鍵部分：

- 前一個 response object
- 之前的 input 與 output items
- 工具定義與 namespace
- 可重用的 sampling artifacts，例如先前渲染好的 token

靠著這份狀態重用，OpenAI 得以把幾個重要優化一起做進去：

- 安全分類器與 request validator 只處理新增輸入，而不是每次都掃完整歷史
- 已渲染 token 的記憶體快取可以直接追加，省掉不必要的 tokenization
- 既有的 model resolution / routing 邏輯可以跨請求重用
- 像 billing 這種非阻塞的後處理，可以跟下一次請求重疊執行

目標就是把這套系統做得盡量接近最初的極簡原型，但又維持開發者已經習慣的 API 形式。

經過兩個月的 WebSocket 模式開發，OpenAI 先和幾家 key coding agent 新創一起做 alpha 測試，讓它們整合到自己的基礎設施裡並安全地逐步加量。alpha 使用者回報最高可達 40% 的工作流改善，團隊也因此準備正式推出。

上線後，效果很快就出來了。Codex 很快把大部分 Responses API 流量切到 WebSocket mode；在 GPT‑5.3‑Codex‑Spark 上，OpenAI 達到原本設定的每秒 1,000 tokens 目標，甚至還出現過每秒 4,000 tokens 的尖峰，證明 Responses API 已經能跟上更快的實際生產流量。

開發者社群也很快感受到差異：

- Codex 把大部分流量切到 WebSockets
- Vercel 在 AI SDK 裡整合 WebSocket mode，延遲最高降低 40%
- Cline 的多檔案工作流快了 39%
- Cursor 裡的 OpenAI 模型最多快了 30%

WebSocket mode 是 Responses API 自 2025 年 3 月推出以來，最重要的新能力之一。OpenAI 在短短幾週內，把點子做成正式上線，靠的是 API 團隊與 Codex 團隊的密切合作。它不只大幅改善 agent rollout 的延遲，也提醒大家一件事：當模型推理越來越快，模型周邊的服務與系統也必須一起變快，這些成果才會真的傳到使用者手上。

<div class="sep">· · ·</div>

## 延伸評論：模型變快之後，真正的戰場會轉向「周邊層」

這篇最有意思的地方，是它把焦點從模型本身移到模型周邊的基礎設施。當推理速度被硬體與模型優化拉高後，新的瓶頸往往不是 token 產生，而是狀態重建、網路往返、安全檢查與 billing 這些看起來很不起眼的東西。

這也解釋了為什麼 agent 時代會特別吃架構：模型越能連續工作，周邊系統就越不能每一步都重來一次。`previous_response_id` 這類設計看起來只是小改動，但它其實是在把「對話」重新做成「有狀態的工作流」。

對開發者來說，這篇也很直白地說明了一件事：如果產品賣的是 agent，而不是單次回答，那麼延遲、快取與連線模型就不再是細節，而是核心體驗的一部分。