---
title: "Google 發布 Gemma 4 開放模型：從樹莓派到工作站，每參數智慧再創新高"
description: "Google DeepMind 推出 Gemma 4 四款開放模型，基於 Gemini 3，支援多模態輸入與 256K 上下文，Apache 2.0 授權，覆蓋邊緣到伺服器全場景。"
date: 2026-04-03
author: Google DeepMind
layout: post
permalink: /2026-04-03/google-gemma-4-open-models.html
image: /2026-04-03/og-google-gemma-4-open-models.png
---

<div class="hero-badge">AI News · 2026-04-03</div>

![](/ai-articles/2026-04-03/og-google-gemma-4-open-models.png)

**原文連結：** [Gemma 4 — Google DeepMind](https://deepmind.google/models/gemma/gemma-4/)

## 摘要

- Google DeepMind 發布 Gemma 4，共四款尺寸：E2B、E4B（邊緣裝置）、26B MoE、31B Dense（工作站/伺服器）
- 31B 模型在 Arena AI 開放模型排行榜位居第三，26B MoE 排名第六，宣稱效能超越體積大 20 倍的競品
- 全系列原生支援多模態：所有型號處理圖像與影片，小型 E2B/E4B 額外支援音訊輸入；支援 140 種語言
- 首次改採 Apache 2.0 授權，大幅降低企業商業部署門檻，Hugging Face 共同創辦人稱此為「重大里程碑」
- 邊緣模型效能較前代提升最多 4 倍、耗電量降低 60%；E2B/E4B 將成為 Android 版 Gemini Nano 4 的基礎

<div class="sep">· · ·</div>

Google DeepMind 於 2026 年 4 月 2 日正式發布 Gemma 4——這是 Gemma 開放模型系列的最新一代，共四款尺寸，設計涵蓋從智慧型手機到高效能工作站的全部署場景。這批模型建立在驅動 Gemini 3 的同一研究成果之上，同時首次改採 Apache 2.0 授權。

**四款尺寸，各有所長**

Gemma 4 的陣容由輕到重分為四個層級：

- **E2B（有效 2B 參數）**：針對手機、樹莓派及 Jetson Orin Nano 最佳化，強調極致效率與近零延遲，比 E4B 快三倍
- **E4B（有效 4B 參數）**：同樣鎖定邊緣裝置，在效率與推理能力之間取得更好的平衡
- **26B MoE（混合專家架構）**：推理時僅啟動 3.8B 參數，在 Arena AI 開放模型排行榜位居第六，以高速 token 生成見長
- **31B Dense（稠密架構）**：全力衝刺品質，在 Arena AI 排行榜名列第三，非量化版本可在單張 80GB NVIDIA H100 上運行；量化後亦可跑在消費級 GPU

Google 指出，兩款大型模型的效能超越體積大 20 倍的競品，而邊緣模型則較上一代快最多 4 倍、耗電降低 60%。

**多模態原生支援，語境視窗大幅提升**

所有四款模型皆原生支援圖像與影片輸入，適用於 OCR、圖表理解及視覺推理等場景。E2B 與 E4B 更額外整合音訊輸入，可直接處理語音辨識任務。訓練資料橫跨超過 140 種語言，不僅止於翻譯，而是深入理解文化語境。

在上下文視窗方面，邊緣型號提供 128K tokens，26B 與 31B 大型模型則達到 256K tokens，可在單次提示中處理完整的長文件或程式碼儲存庫。

**代理工作流程原生支援**

Gemma 4 全系列原生整合函式呼叫（function calling）與結構化 JSON 輸出，並首度支援 `system` role 提示，讓開發者能打造更可控、更可靠的自主代理。數學推理、多步驟規劃及程式碼生成均有顯著進步。

根據第三方機構 Artificial Analysis 的獨立測試，Gemma 4 31B 在 GPQA Diamond 科學推理基準上得分 85.7%，在 400 億參數以下的開放模型中排名第二，僅次於 Qwen3.5 27B（85.8%）。

**授權大轉向：Apache 2.0**

這是 Gemma 系列首次採用 Apache 2.0 授權，允許任何用途的使用、修改與商業部署，無需支付授權費。此前的 Gemma 版本使用自訂授權，對部分企業與商業場景存在限制。Hugging Face 共同創辦人 Clément Delangue 公開表示，此次授權轉換是「一個重大里程碑」。

**立即可用**

Gemma 4 現已在 Hugging Face、Kaggle 及 Ollama 上線，31B 與 26B 模型可在 Google AI Studio 試用，E4B 與 E2B 則可透過 AI Edge Gallery 存取。值得一提的是，E2B/E4B 同時也是下一代 Android 版 Gemini Nano 4 的基礎，預計今年稍晚正式推出。

自 2024 年 2 月首代 Gemma 問世以來，這個系列已累積超過 4 億次下載，並衍生出逾 10 萬個社群微調版本。Gemma 4 在此基礎上持續推進，重點轉向本地部署與多模態代理應用場景。

<div class="sep">· · ·</div>

## 開放模型的新座標

Gemma 4 的發布標誌著開放 AI 格局的一次明確轉移。Apache 2.0 授權移除了企業採用的法律顧慮，讓各規模的組織都能在自有基礎設施上部署前沿等級的模型，無需仰賴雲端 API 也無需擔心授權風險。

更值得關注的是效率論點：26B MoE 在推理時僅啟動 3.8B 參數，卻能在 Arena AI 達到第六名；31B Dense 在單張 H100 上跑完整精度，這讓「本地部署前沿模型」從理論變成了工程實踐。

對於正在構建 AI 應用的開發者而言，Gemma 4 提供了一個難得的組合：效能夠強、授權夠自由、硬體門檻夠低。邊緣模型的突破更將把高品質多模態推理帶入過去只屬於雲端的場景——這對隱私敏感型應用、離線部署及物聯網使用案例而言，是實質性的進展。
