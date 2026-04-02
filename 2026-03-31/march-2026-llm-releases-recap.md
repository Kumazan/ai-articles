---
title: "2026 年 3 月 LLM 版圖回顧：GPT-5.4 並列第一，但真正的故事在別處"
description: "2026 年 3 月九款新模型發布，七款開源，GPT-5.4 與 Gemini 3.1 Pro 並列榜首，MoE 架構主導性更明顯，Mistral Small 4 以 6.5B 活躍參數展現極致效率。"
date: 2026-03-31
author: Dylan Bristot / What LLM
layout: post
permalink: /2026-03-31/march-2026-llm-releases-recap.html
image: /ai-articles/2026-03-31/og-march-2026-llm-releases-recap.png
---

<div class="hero-badge">AI News · 2026-03-31</div>

![](/ai-articles/2026-03-31/og-march-2026-llm-releases-recap.png)

**原文連結：** [https://whatllm.org/blog/llm-releases-march-2026](https://whatllm.org/blog/llm-releases-march-2026)

## 摘要

- GPT-5.4（xhigh）以 Intelligence Index 57.17 與 Gemini 3.1 Pro Preview（57.18）僅差 0.01 點並列第一，但這個消息幾乎沒有引起討論
- 3 月共有 9 款文字模型發布，其中 7 款為開源模型；3 款採用 MoE 架構
- MiniMax-M2.7 與 MiMo-V2-Pro 同日發布，雙雙擠進 45-50 分數區間，性價比極高
- xAI 的 Grok 4.20 Beta 幻觉率僅 22%，創下歷年最低紀錄
- Mistral Small 4 以 119B 總參數、6.5B 活躍參數的 MoE 架構，結合 Apache 2.0 開源許可，成為最具實用價值的開源模型之一
- NVIDIA 在 GTC 2026 宣布 Vera Rubin 平台，訓練成本降低約 10 倍；Anthropic 與美國國防部的對峙成為最大地緣政治變數

<div class="sep">· · ·</div>

## GPT-5.4 並列第一。業界的反應是：沒什麼了不起。

OpenAI 在 3 月 6 日發布 GPT-5.4（xhigh），在 Artificial Analysis 的 Intelligence Index 拿下 57.17 分，與 Gemini 3.1 Pro Preview 的 57.18 分僅差 0.01。OpenAI 從 GPT-5.2 的 51.28 分大幅躍進，正式與 Google 共享龍頭地位。定價每百萬 token 5.63 美元，與 Gemini 的 4.50 美元相比算不上便宜，但品質確實並駕齊驅。

然而這則消息幾乎沒有引發任何討論。「（xhigh）」這個後輟透露了玄機：這是一種推理努力配置（reasoning-effort configuration），而非乾淨的新一代模型。業界的注意力早已轉向 GTC 大会上 NVIDIA 的基礎設施公告、Anthropic 與五角大樓的對峙，以及各種 agentic 工具的密集發布。但數據不會說謊：GPT-5.4 就是並列第一。

## 七款開源模型改變了實質格局

真正改變遊戲規則的是開源陣營。MiniMax-M2.7 於 3 月 18 日發布，指數 49.62 分，每百萬 token 僅 0.53 美元——這是該公司 M2 系列的第三代產品，每一代都在事實準確性上有所提升。MiMo-V2-Pro 同日登場，來自小米，指數 49 分，GDPval-AA agentic 任務評分 1426，專門針對工具呼叫與多步驟工作流程優化。

兩款模型同天出現在 45-50 分區間，對於需要處理真實生產工作負載的開發者而言，這個區間才是主戰場。一個下午，主流選擇就多了兩個。

Grok 4.20 Beta（3 月 12 日）值得特別關注：幻觉率 22%，Artificial Analysis 有記錄以來最低。指令執行 IFBench 分數 82.9%，輸出速度每秒 265 tokens，定價 2/6 美元。對於法律、醫療、金融、合規等「模型胡說八道是災難」的應用場景，這個數字是真正的差異化點。

## MoE 主宰了 3 月

九款新模型中有三款採用 MoE（Mixture-of-Experts）架構，這不算新鮮，MoE 從 2025 年底以來就已是大型開源模型的主流。但 3 月的效率數字特別值得注意：

- **Qwen3.5（大型系列）**：總參數最高 397B，活躍參數僅 3B–10B，活躍比例約 2.5%，開源
- **Nemotron 3 Super**（NVIDIA）：總 120B，活躍 12B，開源
- **Mistral Small 4**：總 119B，活躍 6.5B，活躍比例 5.5%，Apache 2.0

Mistral Small 4 尤其值得細看。119B 總參數，但每次前饋只需啟動 6.5B 參數——這是一個具有大型模型知識容量、但擁有小型模型推論成本的模型。支援圖片與文字輸入，混合推理模式（推理模式下得分 27），Apache 2.0 許可，可自由使用、修改、商用。結合 Mistral 在 GTC 上發布的 Mistral Forge（自訂模型訓練平台），訊息很清楚：Mistral 正在為想要端到端自主 AI 流水線的企業提供完整堆疊。

NVIDIA 的故事也類似：Nemotron 3 Super 總 120B、活躍 12B，指數 36 分。放在 12B 活躍參數的硬體上大多數公司早已擁有，這不是 frontier 等級，但性價比極高。結合 GTC 上發布的 Vera Rubin 平台（約 10 倍訓練成本降低）、Nemotron Coalition（Mistral、Perplexity、Cursor 等），NVIDIA 已不只是晶片公司——它正在建立從模型到硬體的完整管道。

## 邊緣推理已不再是口號

Alibaba 的 Qwen3.5 不是一款模型，是一個產品線。3 月 5 日一次發布八款變體：dense 推理模型 0.8B、2B、4B、9B；MoE 模型 27B、35B（3B 活躍）、122B（10B 活躍）、397B（~10B 活躍）。

小模型才是重點。0.8B 推理模型能跑在手機上，這與 2024 年的雲端優先版本有本質上的不同。4B 變體在單張 GPU 消費級硬體上表現最佳。0.8B–4B 這個範圍的推理模型已經實際可用了——邊緣推理不再是願景，而是已發貨的產品類別。

## 數據告訴你 3 月移動了什麼

**龍頭層（55+）**：多了 1 款。GPT-5.4 加入，與 Gemini 3.1 Pro Preview 並列，但天花板沒有墮升，只是變成了兩個玩家共享。

**強勢層（45–55）**：多了 4 款。MiniMax-M2.7（49.62）、MiMo-V2-Pro（49）、Grok 4.20（48.48）、Qwen3.5 397B（45.05）。這層從稀疏變成擁擠，價格競爭激烈。

**效率層（25–45）**：多了 3 款。Nemotron 3 Super（36）、Gemini 3.1 Flash-Lite（34）、Mistral Small 4（27 推理模式）。

**邊緣與小型**：多了 8 款變體。

整個排行榜在同一个月移動了。

## 實用指引：3 月怎麼選

| 需求 | 推薦 | 理由 |
|------|------|------|
| 最低幻觉率 | Grok 4.20 Beta | 22%，歷年最低。$2/$6 每 M tokens |
| 實惠生產工作負載 | MiniMax-M2.7 | 指數 50，價格激進，開源 |
| 開源 agent/推理 | MiMo-V2-Pro | Agentic Elo 1426，指數 49，可自托管 |
| 高效自托管 | Mistral Small 4 | 6.5B 活躍參數，Apache 2.0，圖文混合推理 |
| 邊緣/設備推理 | Qwen3.5 small（0.8B–4B） | 可跑在手機和消費級 GPU 上 |
| OpenAI 生態，中層 | GPT-5.4（xhigh） | 指數 57.17，與 Gemini 並列第一 |

## 真正的問題已經轉移

57.18 的天花板（2 月以來由 Gemini 3.1 Pro Preview 保持）到 3 月底仍未被突破，但多了 GPT-5.4 來共享。Google、OpenAI、Anthropic 都預計在 2026 年 Q2 推出重大更新，Morgan Stanley 估計 H1 將有約 10 倍的訓練算力上線。當一家實驗室突破 57 分時，其他實驗室會快速回應。

但模型智慧已不再是唯一軸線。Qwen3.5 的 sub-10B 推理和 Mistral Small 4 的 6.5B 活躍參數說明了一件事：local-first AI 是一個品類，不是一種將就。NVIDIA 在 GTC 上的布局說明下一波需求不會只是聊天機器人。而 Anthropic 與五角大樓的對峙提出了對齊問題，這是業界無法忽視的。

「哪個模型最好？」正在讓位給「我們如何在自有硬體上、在不造成電網癱瘓的前提下、以可接受的成本部署這個？」

每月重新評估。排行榜是穩定的。排行榜周圍的一切不是。

<div class="sep">· · ·</div>

## 這份報告對實作者的意義

這篇分析最值得注意的不是任何單一模型的分數，而是整個生態正在集體轉向「可部署性」與「成本效率」——模型能力的競爭已逐漸讓位給基礎設施與商業可行性的競爭。

對大多數在做事的人來說，這個轉變其實是好事。開源陣營在 45-50 分這個「大多數真實生產工作負載」的區間一口氣多了三個有力選項，且全部開源、無供應商鎖定。這代表一個小型團隊現在可以用 MiniMax-M2.7 或 Mistral Small 4 跑起一套完整的 AI 流水線，不需要依賴任何封閉 API。

真正值得觀察的是 Qwen3.5 小型系列——0.8B 能跑在手機上的推理模型是一個質變。它意味著「設備上的 AI 推理」從「未來願景」變成了「今天就可以做到的事」。這會徹底改變需要低延遲、離線運行或資料隱私的應用場景。

至於 GPT-5.4 並列第一卻乏人問津這件事，或許是 AI 產業邁向成熟的訊號：當模型的邊際改進開始遞減，業界的目光自然轉向更有結構價值的問題——誰能把它變成可以用的東西？
