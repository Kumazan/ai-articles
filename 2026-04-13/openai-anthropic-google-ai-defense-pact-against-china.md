---
title: "OpenAI、Anthropic 與 Google 罕見聯手，對抗 AI 模型複製攻勢"
description: "OpenAI、Anthropic 與 Google 透過 Frontier Model Forum 共享安全情報，試圖阻擋對手以對抗式蒸餾複製模型，也暴露出 API 商業模式的脆弱性。"
date: 2026-04-13
author: Mark
layout: post
permalink: /2026-04-13/openai-anthropic-google-ai-defense-pact-against-china.html
image: /2026-04-13/og-openai-anthropic-google-ai-defense-pact-against-china.png
---

<div class="hero-badge">AI News · 2026-04-13</div>

![](/ai-articles/2026-04-13/og-openai-anthropic-google-ai-defense-pact-against-china.png)

**原文連結：** [OpenAI, Anthropic, Google Form AI Defense Pact Against China](https://www.humai.blog/openai-anthropic-and-google-just-formed-an-ai-defense-pact-the-enemy-isnt-each-other/)

## 摘要

- OpenAI、Anthropic、Google 透過 Frontier Model Forum 開始共享更敏感的安全情報
- 這次合作的直接目標，是阻止 DeepSeek、Moonshot AI、MiniMax 透過對抗式蒸餾複製前沿模型
- Anthropic 表示，已偵測到 1600 萬次 Claude 互動，來自約 24,000 個可疑帳號
- 這類抽取攻擊便宜、有效，而且不需要真正「破解」模型，只要大規模買 API 就能做
- 真正的脆弱點，可能不是模型權重，而是付費 API 本身
- 這場聯盟能爭取時間，但未必能解決前沿 AI 被複製的結構性問題

<div class="sep">· · ·</div>

最後一個月，發生了一件放在 18 個月前幾乎無法想像的事。OpenAI、Anthropic 和 Google，這三家每天都在想辦法搶對方市占的公司，坐下來同意共享最敏感的內部安全資料。目標是 DeepSeek、Moonshot AI 和 MiniMax，這三家中國 AI 實驗室正透過對抗式蒸餾，系統性複製美國前沿模型。

這個合作是透過 Frontier Model Forum 推動的。這個非營利組織是 2023 年由這三家公司和 Microsoft 共同成立，過去大多只是發安全宣示、或在國會面前維持形象。到了 4 月 6 日，情況變了。

觸發點很明確。Anthropic 的安全團隊發現，有超過 1600 萬次 Claude 互動，來自大約 24,000 個詐騙帳號，而且全都指向 DeepSeek、Moonshot AI 和 MiniMax。這些不是隨便打幾個 API 的使用者，而是協同、高頻率的抽取行動，目的是挖出推理鏈、專門知識與行為模式。這正是打造廉價複製版「100 億美元級」模型所需要的資料。

OpenAI 也確認了相同模式。他們在提交文件中指控 DeepSeek 採用「越來越精密的方法」去抽取 GPT 模型能力，稱這是在試圖「免費搭便車，使用 OpenAI 與其他美國前沿實驗室開發出的能力」。Google 雖然沒有公布具體數字，但也毫不遲疑地加入情報共享框架。

三家公司現在正在共用偵測方法，包括標記異常流量模式、辨識重複出現且用來抽取推理鏈的提示序列、抓出透過代理網路轉送的機器人行為，並比對那些看似獨立、其實共用付款方式的帳號是否有同步操作。這不是新聞稿，是威脅情報作戰。

這件事之所以重要，是因為對抗式蒸餾便宜，而且真的有效。你不需要從零訓練模型，只要系統性地對前沿模型發送數百萬個精心設計的提示，收集輸出，再把這些結果拿去微調較小的模型，就能模仿出相近表現。據報導，中國實驗室花了原本訓練成本的一小部分，就拿到原始模型 80% 到 90% 的性能。

<div class="sep">· · ·</div>

## 這場聯盟真正透露的事

說白了，這場合作至少晚了一年。當 OpenAI、Anthropic 和 Google 還在互相提告、寫企業護城河宣言時，DeepSeek 已經在用 24,000 個假帳號對 Claude 下手。這不是單純的資安事件，而是赤裸裸的工業級抽取行動。

更值得警惕的是，這些公司把這種威脅包裝成新型網路攻擊，但真正暴露問題的，是它們把最有價值的智慧財產放在按次計費、而且驗證機制又很薄弱的 API 上。DeepSeek 沒有入侵任何系統，他們只是大規模購買 API 使用權。漏洞從來不只是模型，也包括商業模式。

如果 5,000 萬美元等級的 API 呼叫，就能複製出一個價值 100 億美元的訓練成果，那前沿 AI 的護城河到底還剩什麼？答案可能不是模型權重，而是資料、RLHF，以及能比別人更快迭代的基礎設施。這場聯盟可以爭取時間，但無法真正消除結構性的複製風險。下一個 DeepSeek 可能不會用 24,000 個帳號，而會用 240,000 個、橫跨 50 個供應商，單靠流量分析未必追得上。
