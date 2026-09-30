---
title: "OpenAI 指稱 Moonshot 關聯人士發動大規模模型蒸餾行動"
description: "OpenAI 表示已瓦解一場針對受保護推理內容的大規模蒸餾行動，並將核心活動群與 Moonshot AI 關聯人士連結；事件也凸顯模型輸出遭未授權利用的防禦難題。"
date: 2026-10-01
author: Alexis Dufresne
layout: post
permalink: /2026-10-01/openai-moonshot-model-distillation-campaign.html
---

<div class="hero-badge">AI News · 2026-10-01</div>

**原文連結：** [OpenAI Links Moonshot Users to 16,000-Request Distillation Push](https://aiweekly.co/alerts/openai-links-moonshot-users-to-16000-request-distillation-push)（原始報導：[The Next Web](https://thenextweb.com/news/openai-moonshot-distillation-campaign-hidden-reasoning)）

## 摘要

- OpenAI 表示，已瓦解一場試圖擷取其模型受保護推理內容的協同行動，並將其中一個核心活動群連結到與 Moonshot AI 有關的人士。
- 7 月 24、25 日兩天出現 1.6 萬次相關請求，來自超過 4,000 名使用者；進一步調查則發現，相關提示模式涉及超過 15,000 名使用者。
- 操作者把一段對話中的加密推理內容複製到另一段對話，要求模型解密並轉錄；OpenAI 表示，這並未破解加密或存取資料庫、使用者對話。
- OpenAI 將這類作法稱為「對抗式蒸餾」：未經授權地使用另一模型的輸出或推理，來訓練、複製或改良自己的模型。
- 公司已停用相關帳號、加強註冊與基礎設施管控、補強推理內容保護，並與業界及政府分享調查結果。
- OpenAI 強調，關切的是違反服務條款，而非開放模型或正當蒸餾；它也指出，這類風險並非 OpenAI 獨有。

<div class="sep">· · ·</div>

OpenAI 表示，已瓦解一場協同行動，目的是擷取旗下模型的隱藏推理內容；公司將其中一個核心活動群歸因於與 Moonshot AI 有關的人士。Moonshot AI 是 Kimi 的開發商。OpenAI 在週三的部落格文章中公布調查結果。

行動規模不小。相關活動從 7 月 1 日開始，初期數量很少；7 月 24、25 日兩天，請求量暴增至 16,000 次，涉及超過 4,000 名使用者。OpenAI 後續又在超過 15,000 名使用者的群體中，發現相似的提示模式。公司表示，已於 7 月 28 日前全面阻斷這波行動。

手法直接：操作者複製一段對話中的加密推理內容，再要求另一個模型執行個體將其解密並轉錄。OpenAI 表示，加密本身並未遭到破解，也沒有資料庫或儲存的使用者對話被存取。

OpenAI 將這種行為稱為「對抗式蒸餾」：系統性且未經授權地利用一個模型的輸出或推理，協助訓練、複製或改良另一個模型。負責 OpenAI 策略國安政策工作的 Caroline Zier 告訴 Bloomberg：「我們關切的是違反服務條款，而不是開放模型或正當蒸餾。」

公司已停用涉事帳號、收緊註冊驗證、增設隱藏推理內容的防護，並透過 Frontier Model Forum 及政府管道分享調查結果。Anthropic 先前也曾對 Moonshot 提出類似指控。這次揭露是本季一系列中國 AI 相關報導的一部分。

本文原始報導刊於 [The Next Web](https://thenextweb.com/news/openai-moonshot-distillation-campaign-hidden-reasoning)。AIWeekly 刊載的原始標題為：*OpenAI Discloses Moonshot-Linked Users Ran 16,000-Request Campaign to Extract Its Model Reasoning*。

<div class="sep">· · ·</div>

## 蒸餾的界線，取決於方法與授權

蒸餾本身是常見的模型訓練方法；爭點在於輸出如何取得、是否獲得授權，以及被抽取的內容會不會繞過原模型的安全設計。大量呼叫模型不等同於證明企業授意，OpenAI 目前的說法也只把一個核心活動群連結到 Moonshot AI 關聯人士，並未將所有操作者都歸為同一行動者。

對開發者來說，防線不能只靠加密隱藏推理內容。還需要能辨識跨對話重組、異常呼叫模式與帳號網路的控管，同時保留正當評估、研究及模型壓縮的空間。對外揭露時清楚區分已觀察到的行為、技術判斷與歸因信心，也有助於避免把「蒸餾」一概當成不當行為。
