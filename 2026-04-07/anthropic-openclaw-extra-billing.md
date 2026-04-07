---
title: "Anthropic 對 OpenClaw 開始額外收費，Claude 第三方代理進入算帳時代"
description: "Anthropic 開始限制 OpenClaw 等第三方代理框架使用 Claude 的訂閱額度，改為另計用量費，顯示代理工具的商業模式正在快速收緊。"
date: 2026-04-07
author: Will McCurdy
layout: post
permalink: /2026-04-07/anthropic-openclaw-extra-billing.html
image: /2026-04-07/og-anthropic-openclaw-extra-billing.png
---

<div class="hero-badge">AI News · 2026-04-07</div>

![](/ai-articles/2026-04-07/og-anthropic-openclaw-extra-billing.png)

**原文連結：** [Anthropic: You Can't Use OpenClaw With Claude Without Paying Extra](https://www.pcmag.com/news/anthropic-you-cant-use-openclaw-with-claude-without-paying-extra)

## 摘要

- Anthropic 開始對 OpenClaw 這類第三方框架使用 Claude 的訂閱額度收取額外費用
- 官方說法是原本的訂閱方案沒有為這種使用型態設計，容量成本需要另外管理
- 這項變動不只影響 OpenClaw，之後也會逐步擴大到其他第三方工具
- 對開發者來說，這代表「拿訂閱帳號串任意 agent 框架」的空間正在縮小
- 代理工具的成本模型，正在從「能接上就好」轉向「誰付錢、誰承擔容量」的精算模式
- 這件事也反映出 AI 平台和外掛生態之間的權力邊界，開始變得更清楚

<div class="sep">· · ·</div>

Anthropic 已經開始收緊 Claude 的第三方使用方式。根據 PCMag 報導，Claude Pro 和 Max 訂閱用戶現在不能再把自己的額度透過 OpenClaw 這類第三方框架使用，必須另外支付一個新的「額外用量」計費方案。

Anthropic Claude Code 負責人 Boris Cherny 表示，問題核心是成本與容量控制。這類第三方工具的使用模式，並不是原本訂閱方案設計時考慮的情境，因此公司必須更謹慎地管理可用資源。他也強調，Anthropic 依然支持開源，只是這次調整比較像是工程與容量上的限制，而不是理念上的轉向。

PCMag 指出，這項政策目前先影響 OpenClaw，但後續幾週內也會擴大到其他第三方工具。換句話說，這不是單點修補，而是平台策略的重新劃線。

<div class="sep">· · ·</div>

這件事最值得注意的地方，不是「某個工具被禁用」，而是 AI 工具鏈的商業邊界正在被重新定義。過去很多團隊預設，只要模型 API 能用、訂閱權限也能登入，第三方 agent 框架就能自然接上；現在看來，這種假設正在失效。

對真正做 agent 的人來說，這代表兩件事：第一，依賴單一訂閱方案撐起整套工作流的風險變高；第二，平台方會越來越積極把「模型能力」和「使用情境」拆開計價。未來 agent 生態能不能長大，不只看模型好不好用，也看平台願不願意讓工具自由地把模型包裝成工作流。

Anthropic 這次的做法，也在提醒整個產業：當 AI 從聊天產品走向基礎設施，訂閱制就不再只是「付費解鎖」，而是容量、責任與控制權的分配問題。