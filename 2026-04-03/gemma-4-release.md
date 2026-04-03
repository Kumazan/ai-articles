---
title: "Gemma 4：Google 推出「每位元最強」開源模型，主打推理與 Agent 實踐"
date: 2026-04-03
author: "Clement Farabet & Olivier Lacombe (Google DeepMind)"
layout: post
description: "Google DeepMind 發佈 Gemma 4 系列開源模型，包含 2B 到 31B 四種尺寸。憑藉「每參數最高智慧」的架構優化，Gemma 4 在推理、Agent 工作流及多模態處理上表現卓越，並採 Apache 2.0 開放授權。"
image: /ai-articles/2026-04-03/og-gemma-4-release.png
---

<div class="hero-badge">
  <img src="https://img.shields.io/badge/分類-模型發佈-blue" alt="category">
  <img src="https://img.shields.io/badge/來源-Google_DeepMind-orange" alt="source">
</div>

![](/ai-articles/2026-04-03/og-gemma-4-release.png)

**原文連結：** [Gemma 4: Byte for byte, the most capable open models](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/)

## 摘要

- **每位元最強性能**：Gemma 4 被譽為「每位元最精悍」的開源模型，透過架構優化實現極高的智慧密度，31B 版本在 Arena AI 排行榜位居開源第 3。
- **四種靈活尺寸**：推出 Effective 2B (E2B)、Effective 4B (E4B) 邊緣模型，以及 26B MoE（混合專家）與 31B Dense（稠密）模型，覆蓋從手機到工作站的硬體需求。
- **原生 Agent 支援**：針對 Agent 工作流進行深度優化，原生支援函式呼叫（Function Calling）、結構化 JSON 輸出與系統指令，能可靠執行多步驟規劃。
- **多模態與長文本**：所有模型均原生處理影像與影片，E2B/E4B 更支援原生音訊輸入。邊緣模型具備 128K 上下文，大型模型則達 256K。
- **全面開放授權**：採用 Apache 2.0 開放授權，允許開發者自由修改、分發與商業化，強調數位主權與本地端執行的隱私優勢。

<div class="sep">· · ·</div>

Google DeepMind 今日正式推出了 Gemma 4，這是目前為止該系列最強大的開源模型家族。Gemma 4 的核心設計理念是「提升每參數的智慧水準」（Intelligence-per-parameter），旨在讓開發者在有限的硬體資源下，也能獲得接近尖端模型（Frontier Models）的推理與 Agent 協作能力。

### 業界領先的邊緣與裝置端 AI

Gemma 4 家族推出了四種尺寸，精確鎖定不同的應用場景：

- **Effective 2B (E2B) 與 4B (E4B)**：專為行動裝置與物聯網設計，透過「每層嵌入」（Per-Layer Embeddings, PLE）技術最大化計算效率。這兩款模型能完全離線運行於手機、Raspberry Pi 甚至 NVIDIA Jetson，且 E2B/E4B 還具備原生的音訊輸入能力，可用於語音識別與理解。
- **26B MoE (Mixture of Experts)**：專注於低延遲表現。雖然總參數達 26B，但在推論時僅激活 3.8B 參數，能在個人電腦上實現極速的 Token 產出。
- **31B Dense**：追求極致的輸出品質。它是 31B 參數的稠密模型，目前在開源模型排行榜中名列前茅，是進行特定任務微調（Fine-tuning）的最佳基礎。

### 強化推理與 Agent 工作流

與過去僅專注於對話的模型不同，Gemma 4 在設計之初就考慮到了「Agentic」屬性：

- **進階推理**：具備多步驟規劃與深層邏輯處理能力，在數學與複雜指令遵循基準測試中表現優異。
- **工具調用與結構化輸出**：原生支援 Function Calling 與 JSON 格式輸出，讓 AI 能與外部 API、工具無縫對接，並可靠地執行複雜流程。
- **長上下文處理**：邊緣模型支援 128K Context Window，大型版本則支援至 256K，足以處理整個程式碼倉庫或超長文檔。

### 開放與數位主權

延續 Google 對開源社群的承諾，Gemma 4 採用 Apache 2.0 授權。這不僅意味著商業應用的自由，更賦予了開發者對數據與基礎設施的完整控制權。開發者可以選擇在本地端執行，確保隱私與數據不外流。

此外，Gemma 4 在發佈首日即獲得了 Hugging Face、vLLM、Ollama、NVIDIA NIM 及 Google Cloud 等廣泛生態系的支持。無論是 Android 開發者還是企業級架構師，都能立即在其熟悉的工具鏈中使用這款目前「每位元智慧最高」的開源模型。

<div class="sep">· · ·</div>

## 💡 隨筆：模型小型化的「軍備競賽」

Gemma 4 的發佈再次印證了一個趨勢：AI 的競爭焦點正在從「誰的模型最大」轉向「誰的模型最精悍」。

對於大多數開發者和企業來說，部署 70B 或 400B 的模型成本過於沉重，且延遲無法滿足即時互動的需求。Gemma 4 透過架構上的巧思（如 E 系列的 PLE 技術），在 4B 的尺寸內塞進了多模態（含音訊）與 128K 上下文的能力，這對於「離線 Agent」和「裝置端隨身助理」的實現至關重要。

特別值得關注的是 26B MoE 模型。它在推理時僅動用 3.8B 參數，卻展現了遠超其尺寸的智慧水準。這種「快思慢想」式的計算分配，將會是未來本地端 AI Agent 普及的關鍵路徑。當模型不再需要昂貴的 A100/H100 叢集，而是能順暢地跑在筆電甚至手機上時，AI 才真正從雲端走進了日常生活的每一個角落。
