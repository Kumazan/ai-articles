---
title: "Claude 訂閱不再含 OpenClaw：Anthropic 開始對第三方 agent 收費"
description: "Anthropic 宣布 Claude Code 訂閱額度不再適用於 OpenClaw 等第三方工具，改走額外用量或 API 計費。這等於把原本被訂閱補貼的 agent 流量，正式拉回單獨計價。"
date: 2026-04-05
author: Anthony Ha (TechCrunch)
layout: post
permalink: /2026-04-05/claude-subscriptions-openclaw-extra-usage.html
image: /2026-04-05/og-claude-subscriptions-openclaw-extra-usage.png
---

<div class="hero-badge">AI News · 2026-04-05</div>

![](/ai-articles/2026-04-05/og-claude-subscriptions-openclaw-extra-usage.png)

**原文連結：** [Anthropic says Claude Code subscribers will need to pay extra for OpenClaw usage](https://techcrunch.com/2026/04/04/anthropic-says-claude-code-subscribers-will-need-to-pay-extra-for-openclaw-support/)

## 摘要

- Anthropic 宣布，Claude Code 訂閱戶若要把 Claude 模型接到 OpenClaw 與其他第三方工具上，之後必須另外付費
- 4 月 4 日中午起，訂閱額度不再能直接套用到第三方 harness；使用者得改走「額外用量」或 API 計費
- Anthropic 表示，這類第三方工具的使用模式本來就不是訂閱方案的設計目標，而且對系統資源壓力更大
- OpenClaw 創辦人 Peter Steinberger 說，他和董事會成員 Dave Morin 曾試著說服 Anthropic，但最後只成功延後一週
- Anthropic 強調自己仍提供完整退款，並稱這次調整是為了把規則講清楚，也讓服務能長期穩定成長

<div class="sep">· · ·</div>

TechCrunch 這篇於 4 月 4 日上午 9:32 PDT 發佈。Anthropic 讓 Claude Code 訂閱戶使用 OpenClaw 和其他第三方工具的成本，馬上變得更高了。

根據 Hacker News 上流出的客戶信，Anthropic 表示從 4 月 4 日中午起，訂閱戶將「不能再把 Claude 訂閱額度用在包含 OpenClaw 在內的第三方 harness」。若要繼續使用，必須改付「獨立於訂閱之外、按用量計費」的額外費用。

公司也說，雖然一開始先從 OpenClaw 開刀，但這項政策「適用於所有第三方 harness，而且很快就會擴大到更多工具」。

Anthropic 的 Claude Code 負責人 Boris Cherny 也在 X 上表示，公司的「訂閱方案本來就不是為這類第三方工具的使用模式設計的」，Anthropic 現在則希望「有意識地管理成長，讓服務能長期穩定地支援客戶」。

這項公告出爐的時間點也很微妙。OpenClaw 創辦人 Peter Steinberger 先前才剛表示自己加入了 Anthropic 的競爭對手 OpenAI，而 OpenClaw 則會持續作為開源專案存在，並獲得 OpenAI 的支援。

Steinberger 隨後貼文說，他和 OpenClaw 董事會成員 Dave Morin 曾經「試著跟 Anthropic 講道理」，但最後只成功把漲價延後一週。

「時機真是巧得可以，先是把一些熱門功能複製到自家封閉 harness，再把開源擋在門外，」Steinberger 說。

Cherny 則回應說，Claude Code 團隊成員其實「非常支持開源」，而他自己也「剛剛為了 OpenClaw 特別送了幾個 pull request，改善 prompt cache 的效率」。

他補充，這次調整「比較像是工程上的限制」；Anthropic 也仍然提供完整退款。「我們知道不是每個人都意識到這不是我們支援的用法，這次是想把事情說清楚、講明白。」

與此同時，OpenAI 最近也關掉了自己的 Sora app 與影片生成模型，據說是為了釋放算力，並配合更廣泛的策略，把重心拉回那些越來越依賴 Claude Code 這類產品的軟體工程師與企業客戶。

<div class="sep">· · ·</div>

## 這不是單純漲價，而是把隱形補貼收回來

這篇新聞表面上看起來像是「Anthropic 開始收費」，但真正的重點其實是：原本被訂閱制度吸收掉的 agent 流量成本，現在被重新拆出來單獨計價了。對 Anthropic 來說，問題不是 OpenClaw 這個名字本身，而是第三方 harness 把長時間、自動化、重上下文的用量，塞進了一個原本為人類互動設計的月費方案裡。

這種做法短期內一定會激怒一批重度使用者，但從商業角度也不難理解。只要模型越好、agent 越能自動跑長流程，flat-rate 訂閱就越容易被高強度用戶吃穿；一旦補貼撐不住，平台最後通常只剩兩條路：要嘛漲價，要嘛把真正昂貴的用量切出去。Anthropic 這次選的是後者。

對開源 agent 生態來說，這代表一個更現實的問題：能不能再把基礎模型當成「便宜又穩定的通用電力」來用，答案正變得越來越不樂觀。未來真正有競爭力的工具，不只要會串模型，還得能處理價格、快取、節流與供應商政策變動。這篇新聞講的其實不是收費公告，而是 agent 經濟學正式進入硬算帳階段。
