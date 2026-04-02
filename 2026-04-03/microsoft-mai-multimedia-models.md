---
layout: post
title: "微軟發佈三款 MAI 多模態模型：看、聽、說一站式解決方案"
description: "微軟推出 MAI-Transcribe-1、MAI-Voice-1、MAI-Image-2 三款模型，主打語音辨識、語音生成與圖像生成，瞄準企業級市場。"
author: "Naomi Moneypenny (Microsoft)"
date: 2026-04-03
image: "/ai-articles/2026-04-03/og-microsoft-mai-multimedia-models.png"
---

<div class="hero-badge">AI News · 2026-04-03</div>

![](/ai-articles/2026-04-03/og-microsoft-mai-multimedia-models.png)

**原文連結：** [Introducing MAI-Transcribe-1, MAI-Voice-1, and MAI-Image-2 in Microsoft Foundry](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/introducing-mai-transcribe-1-mai-voice-1-and-mai-image-2-in-microsoft-foundry/4507787)

## 摘要

- **三位一體佈局**：推出 MAI-Transcribe-1（語音辨識）、MAI-Voice-1（語音生成）與 MAI-Image-2（圖像生成），構成完整的感知與創作能力體系。
- **極致成本效益**：MAI-Transcribe-1 在 FLEURS 基準測試中奪冠，且 GPU 運行成本僅為同類 SOTA 模型的一半。
- **毫秒級反應速度**：MAI-Voice-1 可在不到一秒內生成 60 秒的高保真語音，滿足即時語音智能體（AI Agents）需求。
- **創意工作流升級**：MAI-Image-2 在 Arena.ai 排行榜位列前三，強化了複雜場景、細節構圖與圖中文字的渲染能力。
- **企業級安全保障**：所有模型均經過微軟 AI 紅隊（AIRT）嚴格測試，並在 Microsoft Foundry 平台上提供內建的治理與合規控制。

<div class="sep">· · ·</div>

自成立以來，微軟 Foundry 的目標一直是提供最完整的 AI 與應用智能體工廠；讓開發者能夠存取最新的前沿模型、工具、基礎架構、安全性與可靠性，從而自信地構建與擴展其 AI 解決方案。

今天，微軟朝著這一願景邁出了另一步，宣佈在 Microsoft Foundry 中公開預覽微軟 AI 的三款新模型：

- **MAI-Transcribe-1**：微軟的第一代語音辨識模型，支援 25 種語言，提供企業級精準度，且 GPU 成本比領先的替代方案低約 50%。
- **MAI-Voice-1**：高保真語音生成模型，能夠在單個 GPU 上於不到一秒內產生 60 秒的具表現力音訊。
- **MAI-Image-2**：微軟最強大的文字轉圖像模型，在 Arena.ai 圖像模型家族排行榜上首次亮相即位居第三。

這些模型與目前支援 Copilot、Bing、PowerPoint 和 Azure Speech 的模型相同，現在專供 Foundry 開發者使用。

### 語音與音訊：下一代智能體介面

語音正迅速成為下一代 AI 智能體的主要介面，而構建卓越的語音體驗需要能夠精準聽說的模型。透過 MAI-Voice-1 與 MAI-Transcribe-1，微軟提供了專為開發者打造的完整音訊 AI 堆疊。

MAI-Voice-1 是極速的語音生成模型，這使其成為當今最高效的語音系統之一。在聽覺方面，MAI-Transcribe-1 針對口音、語言與真實世界的音訊環境進行了優化，具備企業級可靠性。與領先的轉錄模型相比，MAI-Transcribe-1 在提供競爭力準確度的同時，GPU 成本幾乎減半，這一優勢直接轉化為企業更可預測且具擴展性的定價。

**應用場景：**
- **對話式 AI 與智能體輔助**：為 IVR 系統、虛擬助手和呼叫中心工作流啟用即時轉錄與語音驅動介面。
- **實時字幕與無障礙功能**：為大型活動與企業會議提供實時字幕，提升數位溝通的包容性。
- **媒體、字幕與存檔**：自動化影片字幕製作與對話索引，支援規模化的內容生產。

### MAI-Image-2：為每位創作者釋放無限創意

圖像位於開發者構建引人入勝的 AI 驅動創意體驗（從行銷工具到內容平台再到多模態智能體）的核心。MAI-Image-2 是微軟對這一需求的回答。

該模型是與攝影師、設計師和視覺敘事者密切合作開發的，在 Arena.ai 排行榜上名列前茅。它提升了在真實創意工作流中最重要的能力：更自然的光影、逼真的圖像生成、更強的圖中文字渲染（適用於資訊圖表與圖表），以及在複雜佈局、細節場景與電影視覺效果上的精確度。

全球最大的行銷與傳播集團之一 WPP 已成為首批大規模應用 MAI-Image-2 的企業合作夥伴，將其用於驅動先前需要大量手動工作的創意生產工作流。

微軟致力於將「以人為本」的 AI（Humanist AI）帶入每個人的口袋，讓每個人都擁有一個真正世界級、對其負責且符合其利益的 AI 助手。

<div class="sep">· · ·</div>

## AI 開發者的多模態新時代

微軟這次發佈的三款模型，標誌著雲端巨頭不再滿足於僅提供第三方模型，而是開始將自家產品（如 Copilot）底層最強大的基礎能力直接開放給開發者。

對於開發者來說，這是一個重大的轉向信號：
1. **成本與性能的再平衡**：50% 的 GPU 成本削減對大規模部署語音服務的企業極具吸引力。
2. **多模態整合的門檻降低**：在同一個 Foundry 平台上完成聽、說、看的所有串接，大幅減少了跨供應商整合的延遲與複雜度。
3. **安全與合規的內置**：微軟強調的紅隊測試與合規克隆機制，反映了企業級應用在 2026 年對 AI 安全性的硬性需求。

這三款模型的推出，將進一步壓縮中小型 AI 模型廠商的生存空間，同時也迫使其他雲端供應商必須提供更高性價比的原生模型來應對。
