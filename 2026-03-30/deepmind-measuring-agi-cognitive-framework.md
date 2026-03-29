---
title: "衡量 AGI 進展：Google DeepMind 的認知分類框架"
date: 2026-03-30
author: Google DeepMind
layout: post
permalink: /2026-03-30/deepmind-measuring-agi-cognitive-framework.html
---

<div class="hero-badge">AI News · 2026-03-30</div>

**原文連結：** [Measuring progress toward AGI: A cognitive framework](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/measuring-agi-cognitive-framework/)

## 摘要

- Google DeepMind 發布論文《Measuring Progress Toward AGI: A Cognitive Taxonomy》，以認知科學為基礎建立評估 AGI 進展的正式框架。
- 框架識別出 10 項關鍵認知能力，涵蓋感知、推理、記憶、學習、後設認知、執行功能等，並以三階段協定對比人類表現基準。
- 目前評估缺口最大的五項能力為：學習、後設認知、注意力、執行功能與社會認知。
- 配合論文，DeepMind 與 Kaggle 聯合推出黑客松，邀請社群協助建構評測工具，獎金池高達 $200,000 美元。
- 黑客松投稿截止日期為 2026 年 4 月 16 日，結果將於 6 月 1 日公布。

<div class="sep">· · ·</div>

## 我們距離 AGI 還有多遠？現在有了更精確的量尺

人工通用智慧（AGI）有潛力加速科學發現，幫助人類解決最棘手的問題。但我們究竟離這個里程碑有多近？目前缺乏系統性的實證工具來回答這個問題。

為此，Google DeepMind 在 2026 年 3 月發布了一篇新論文：**《Measuring Progress Toward AGI: A Cognitive Taxonomy》**，以認知科學為基礎，建立了一套評估 AI 系統通用智慧能力的科學框架。

### 解構「通用智慧」

這套框架汲取數十年的心理學、神經科學與認知科學研究，提出了一個**認知分類體系**，識別出 10 項核心認知能力，研究者認為這些能力對於通用智慧至關重要：

1. **感知（Perception）**：從環境中提取與處理感官資訊
2. **生成（Generation）**：產出文字、語音、動作等輸出
3. **注意力（Attention）**：將認知資源集中於關鍵事物
4. **學習（Learning）**：透過經驗與指引習得新知識
5. **記憶（Memory）**：跨時間儲存與檢索資訊
6. **推理（Reasoning）**：透過邏輯推論得出有效結論
7. **後設認知（Metacognition）**：對自身認知過程的認知與監控
8. **執行功能（Executive functions）**：規劃、抑制與認知彈性
9. **問題解決（Problem solving）**：針對特定領域找到有效解法
10. **社會認知（Social cognition）**：處理與詮釋社交資訊並適當回應

### 三階段評估協定

要理解 AI 在各認知能力上的水準，研究者提出了以下三步驟評估流程：

1. 使用涵蓋各項能力的廣泛認知任務組合評測 AI 系統（採留存測試集以防資料汙染）
2. 從具代表性的成人樣本收集相同任務的人類基準表現
3. 將每個 AI 系統的表現，對照人類表現分佈進行標準化比較

### 從理論到實踐：$200,000 黑客松

定義認知能力只是第一步——真正的難題在於如何建立對應的評測工具。DeepMind 與 Kaggle 合作推出黑客松：**「Measuring progress toward AGI: Cognitive abilities」**，邀請全球研究社群針對評估缺口最大的五項能力設計評測方案，分別是：

- **學習**
- **後設認知**
- **注意力**
- **執行功能**
- **社會認知**

參賽者可使用 Kaggle 新推出的 Community Benchmarks 平台，對一系列前沿模型進行測試。

**獎金結構：**
- 五個賽道各取前兩名，每名獲得 $10,000
- 四個最佳整體提交獲得 $25,000 大獎

投稿期間：2026 年 3 月 17 日至 4 月 16 日，結果公布：2026 年 6 月 1 日。

### 為什麼這件事很重要

長期以來，「AGI 已到來」或「AGI 仍是幻想」的論戰缺乏共同的評估語言。DeepMind 這套框架試圖提供一把共同的量尺——不是宣稱現有模型已達到 AGI，而是建立一個可被研究社群驗證、辯論、並迭代改進的評估基礎設施。

這與過去「以單一 benchmark 定高下」的做法有本質差異：它承認通用智慧是多維度的，且不同能力的發展軌跡可能截然不同。

> 投稿連結：[kaggle.com/competitions/kaggle-measuring-agi](http://kaggle.com/competitions/kaggle-measuring-agi)
