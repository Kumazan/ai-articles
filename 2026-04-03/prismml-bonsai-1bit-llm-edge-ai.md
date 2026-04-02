---
title: "PrismML Bonsai：史上第一個商業可用的 1-bit LLM，8B 模型只需 1.15GB"
description: "Caltech 衍生新創 PrismML 推出 1-bit Bonsai 系列 LLM，旗艦 8B 模型僅佔 1.15GB 記憶體，效能匹敵 16-bit 版本，且體積縮小 14 倍、速度提升 8 倍、能耗降低 5 倍，以 Apache 2.0 授權免費開源。"
date: 2026-04-03
author: PrismML
layout: post
permalink: /2026-04-03/prismml-bonsai-1bit-llm-edge-ai.html
---

<div class="hero-badge">AI News · 2026-04-03</div>

**原文連結：** [PrismML Emerges from Stealth with World's First 1-Bit Large Language Models](https://techintelpro.com/news/ai/agentic-ai/prismml-emerges-from-stealth-with-worlds-first-1-bit-large-language-models)

## 摘要

- Caltech 衍生新創 PrismML 正式公開，推出全球首個商業可用的 1-bit 大型語言模型系列 **Bonsai**
- 旗艦 **Bonsai 8B** 模型只需 1.15GB 記憶體，體積比 16-bit 版本縮小 **14 倍**，速度快 **8 倍**，能耗減少 **5 倍**
- 在 IFEval、GSM8K、MMLU-Redux 等標準 Benchmark 上，效能與同參數規模的主流 8B 模型持平
- 全系列（8B / 4B / 1.7B）以 **Apache 2.0** 授權免費開源，可在手機、筆電、嵌入式系統本地執行
- iPhone 17 Pro Max 上，1.7B 模型可達 **130 tokens/s**；M4 Pro 上 4B 模型達 **132 tokens/s**
- 背後由 Khosla Ventures 與 Cerberus Ventures 投資，Google 及 Caltech 提供算力支援

<div class="sep">· · ·</div>

## 重新定義「智慧密度」

AI 模型越做越大、越耗電——這條路走了十年，PrismML 想從根本上改變方向。

2026 年 4 月 1 日，這家從加州理工學院（Caltech）孵化出來的新創公司正式走出隱形模式，發布了全球首個**商業可行的 1-bit 大型語言模型**系列：**Bonsai**。

所謂「1-bit 模型」，意思是網路中每個參數只用三個值（-1、0、+1）來表示，徹底消除了傳統 16-bit 或 32-bit 浮點運算的需求。這不是普通的量化壓縮——而是**從數學架構層面重新設計**的神經網路。PrismML 的 CEO 兼創辦人、Caltech 教授 Babak Hassibi 說：「我們花了數年時間建立數學理論，才能在不損失推理能力的情況下壓縮神經網路。1-bit 不是終點，而是起點。」

### 旗艦模型 Bonsai 8B：數字說話

| 指標 | Bonsai 8B | 傳統 FP16 8B |
|------|-----------|-------------|
| 記憶體佔用 | 1.15 GB | ~16 GB |
| 推理速度 | 8x 更快 | 基準 |
| 能耗 | 5x 更低 | 基準 |
| Benchmark 表現 | 持平 | 基準 |

Bonsai 8B 在 IFEval、GSM8K、MMLU-Redux、HumanEval+、BFCL 等多項主流 Benchmark 上，與 Llama 3 8B 等傳統全精度模型表現相當。

### 三款型號，針對不同裝置場景

- **Bonsai 8B**（1.15 GB）：適合邊緣伺服器、機器人、高端行動裝置
- **Bonsai 4B**（0.57 GB）：針對 M4 Pro 晶片優化，132 tokens/s
- **Bonsai 1.7B**（0.24 GB）：專為 iPhone 17 Pro Max 設計，130 tokens/s

這三款模型今日起可從 Hugging Face 免費下載，採用 **Apache 2.0** 授權，商業用途完全開放。

## 技術細節：真正的端對端 1-bit

與過去的「偽 1-bit」方案不同，Bonsai 系列在**整個網路的每一層**都採用 1-bit 精度——包括 Embeddings、Attention、MLP 以及 LM Head，**沒有任何 higher-precision 的逃逸通道**。這是一個真正從頭到尾的 1-bit 設計。

目前推理需要使用 PrismML 的 llama.cpp fork，官方正與社群合作整合到主線版本。社群已有開發者在 ROCM（AMD RX 9070 XT）上達到約 150 tokens/s，顯示相容性不僅限於 Apple Silicon。

## 對 AI 硬體與資料中心的潛在衝擊

業界對這項發布給予高度評價。Databricks 共同創辦人、UC Berkeley 教授 Ion Stoica 表示：「將模型縮減至 1-bit 表示法，改變了整個優化方程式。它讓一類新型 AI 系統得以同時在邊緣高效運作、並在雲端經濟化地擴展。」

Google Core ML/AI VP Bill Jia 也表示：「當先進模型能在受限裝置上執行，它重塑了從頭到尾的系統設計。模型層面的效率提升，會在整個基礎架構上複利放大。」

曾主導 Google TPU 計劃的 Amir Salek 更指出，這項技術有潛力「從根本上改變 AI 的算力與電力方程式」，並有可能為 1-bit 推理催生全新的硬體架構。

值得留意的是，Forbes 的分析提醒：**效率提升不代表資料中心需求萎縮**。歷史上，每次效率躍進都帶來總計算量的擴張，而非收縮。1-bit LLM 降低了每次推理的成本，但也可能讓過去因成本或硬體限制無法部署的應用大規模爆發，最終反而推升整體算力需求。

## 社群觀察：興奮、懷疑、與獨立驗證

在 r/LocalLLaMA 的討論串中，社群反應兩極：部分開發者對模型輸出品質持保留態度，指出早期測試中出現「重複 token 輸出」的問題；另一方面，有人在 Jetson Orin 上的獨立 Benchmark 顯示，Bonsai 8B 在「每 GiB 準確率」指標上，比多數 Qwen3.5 系列模型更有效率。

方法論上也有疑問：PrismML 對 1-bit 壓縮方法保持「專有 Caltech IP」的保密，外界尚無法重現壓縮流程。獨立的全面 Benchmark 對照尚在進行中，成果仍需時間驗證。

<div class="sep">· · ·</div>

## 邊緣 AI 的新起點，不是終點

1-bit 模型能跑在口袋裡的手機上，聽起來像是科幻電影的情節——現在它是可下載的開源檔案。

對 AI 部署成本長期偏高、對隱私和延遲敏感的應用場景（機器人、穿戴裝置、離線代理），這是一個值得認真關注的架構轉折。但在獨立 Benchmark 驗證完成、壓縮方法公開之前，審慎觀察仍然是合理的立場。

AI 未來的競爭，或許不只是誰能建最大的資料中心——也包括誰能把最多的智慧，塞進最小的空間。
