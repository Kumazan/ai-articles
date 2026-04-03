---
layout: post
title: "Gemma 4：Google 推出「每位元最強」開源模型，主打推理與 Agent 實踐"
date: 2026-04-03
author: Google DeepMind
description: "Google DeepMind 發佈 Gemma 4 系列開源模型，包含 2B 到 31B 四種尺寸。憑藉「每參數最高智慧」的架構優化，Gemma 4 在推理、Agent 工作流及多模態處理上表現卓越，並採 Apache 2.0 開放授權。"
image: /ai-articles/2026-04-03/og-gemma-4-release.png
---

<div class="hero-badge">
  <span>最新發佈</span>
  <span>Gemma 4</span>
  <span>Apache 2.0</span>
</div>

![](/ai-articles/2026-04-03/og-gemma-4-release.png)

**原文連結：** [Gemma 4: Byte for byte, the most capable open models](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/)

## 摘要

・ **四種尺寸滿足不同需求**：推出 Effective 2B (E2B)、Effective 4B (E4B)、26B MoE 以及 31B Dense 四款模型。
・ **參數效率突破**：31B 模型在 Arena AI 排行榜位居開源第三，26B MoE 則排名第六，效能超越 20 倍大的模型。
・ **原生多模態支援**：所有尺寸均支援影片與圖片處理，E2B 與 E4B 額外支援原生音訊輸入，強化語音識別效能。
・ **專為 Agent 設計**：內建對 Function Calling、結構化 JSON 輸出及系統指令的優化支援，旨在打造可靠的自主代理。
・ **商用友善授權**：全系列採用 Apache 2.0 開放授權，開發者可自由部署、微調並保有數位主權。
・ **邊緣運算優化**：E2B 與 E4B 在 Android 與 IoT 設備上具備極低延遲，並能與 Gemini Nano 4 前向相容。
・ **加長上下文窗口**：邊緣模型支援 128K，大模型支援高達 256K 的上下文，可一次處理完整程式庫。

<div class="sep">· · ·</div>

Google DeepMind 今日正式推出 **Gemma 4** 系列，這是目前為止最聰明的開源模型家族。專為進階推理與 Agent 工作流設計，Gemma 4 在「每參數智力」（intelligence-per-parameter）上取得了前所未有的突破。自第一代發佈以來，Gemma 已被下載超過 4 億次，並在社群中產生了超過 10 萬種變體。

### 行業領先的效能與行動優先 AI

Gemma 4 系列包含四個版本：Effective 2B (E2B)、Effective 4B (E4B)、26B 混合專家模型 (MoE) 以及 31B 稠密模型 (Dense)。全系列模型已不僅止於簡單的對話，而是能處理複雜的邏輯與代理任務。

在 Arena AI 文字排行榜上，31B 模型目前排名開源世界第三，26B 模型則排名第六。這意味著開發者可以使用顯著更小的硬體成本，達到過去需要龐大模型才能實現的尖端能力。在邊緣端，E2B 與 E4B 模型重新定義了裝置上的實用性，優先考慮多模態能力、低延遲處理以及無縫的生態系統整合。

### 強大、易取得且開放

為了推動下一代的研究與產品，Gemma 4 的尺寸經過特別設計，可以在各種硬體上高效執行——從全球數十億台 Android 裝置、筆記型電腦 GPU，到開發者工作站。

Gemma 4 的核心優勢包括：
- **進階推理**：在數學與指令遵循基準測試中展現顯著提升，具備多步規劃與深度邏輯能力。
- **Agent 工作流**：原生支援 Function Calling、結構化 JSON 輸出，能可靠地與不同工具及 API 互動。
- **程式碼生成**：提供高品質的離線程式碼輔助，將工作站轉變為本地優先的 AI 開發環境。
- **多模態處理**：支援變動解析度的影片與圖片。E2B 與 E4B 更具備原生音訊輸入功能。
- **更長的上下文**：邊緣模型提供 128K 窗口，大型模型則高達 256K，可輕易處理長篇文章或程式碼庫。
- **全球語言支援**：原生訓練涵蓋超過 140 種語言。

### 適合不同硬體的靈活選擇

- **26B 與 31B 模型**：優化後可在一張 80GB NVIDIA H100 GPU 上運行，量化版本則可在消費級 GPU 上驅動 IDE 與代理工作流。26B MoE 模型僅在推理時激活 38 億參數，提供極快的生成速度。
- **E2B 與 E4B 模型**：針對運算與記憶體效率進行全新設計，可在手機、Raspberry Pi 及 NVIDIA Jetson Orin Nano 等設備上離線運行。

### 開放授權與信任基礎

聽取開發者意見後，Gemma 4 採用 **Apache 2.0 授權**，提供完全的靈活性與數位主權。開發者對數據、基礎設施與模型擁有完全控制權。此外，這些模型經過與 proprietary 模型相同的基礎設施安全協議驗證，確保了可靠性與安全性。

<div class="sep">· · ·</div>

## 延伸評論：當「小」成為新的「強」

Gemma 4 的發佈標誌著 AI 發展從「追求參數規模」轉向「追求參數效率」的轉捩點。對開發者而言，最重要的訊息不在於 31B 模型在排行榜上的名次，而在於這類尺寸的模型現在已經具備了強大的推理與 Function Calling 能力。

過去，建構可靠的 AI Agent 往往需要依賴 API 調用大型雲端模型，這帶來了隱私、成本與延遲的挑戰。Gemma 4 的出現，讓「本地端執行複雜代理」變得切實可行。特別是其對結構化 JSON 與 Function Calling 的原生優化，意味著本地模型不再只是「聊天機器人」，而是能真正嵌入軟體邏輯、驅動外部工具的「運算核心」。

此外，音訊與視訊的原生多模態支援進一步拓寬了邊緣運算的想像空間。當 4B 等級的模型就能在移動裝置上流暢進行語音理解與視覺任務時，AI 的應用將不再侷限於文字視窗，而是深入到更廣泛的真實世界互動場景。這不僅是 Google 的勝利，更是開源社群邁向「高效能本地 AI」的一大步。
