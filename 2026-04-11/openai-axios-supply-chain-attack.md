---
title: "OpenAI 遭 Axios 供應鏈攻擊，所幸用戶資料未外洩"
description: "OpenAI 證實其 macOS 簽章流程曾接觸到被污染的 Axios 套件，但目前沒有跡象顯示用戶資料、系統資產或原始碼遭到外洩。"
date: 2026-04-11
author: OpenAI
layout: post
permalink: /2026-04-11/openai-axios-supply-chain-attack.html
image: /2026-04-11/og-openai-axios-supply-chain-attack.png
---

<div class="hero-badge">AI News · 2026-04-11</div>

![](/ai-articles/2026-04-11/og-openai-axios-supply-chain-attack.png)

**原文連結：** [Our response to the Axios developer tool compromise](https://openai.com/index/axios-developer-tool-compromise/)

## 摘要

- OpenAI 發現一項涉及第三方開發工具 Axios 的資安問題，並開始強化 macOS 應用的簽章流程
- 這起事件和更大的供應鏈攻擊有關，惡意版本的 Axios 曾被 GitHub Actions 工作流程下載執行
- OpenAI 表示，目前沒有證據顯示用戶資料、系統資產或軟體本身被竄改
- 受影響的範圍涵蓋 ChatGPT Desktop、Codex、Codex-cli 與 Atlas 相關簽章流程
- 公司也要求 macOS 使用者更新到最新版，舊版將在 5 月 8 日後停止支援
- 這件事提醒所有做 AI 工具的人，真正脆弱的地方常常不是模型，而是周邊供應鏈

<div class="sep">· · ·</div>

OpenAI 表示，它已經發現一項涉及第三方開發工具 Axios 的資安問題，並著手保護用來確認 macOS 應用是否為正版 OpenAI App 的簽章流程。

這家公司表示，目前沒有證據顯示任何用戶資料被存取，也沒有跡象顯示其系統、智慧財產或軟體遭到竄改。根據 OpenAI 的說法，Axios 於 3 月 31 日遭到污染，屬於更大範圍的供應鏈攻擊，而這次攻擊被認為與北韓背景的行動者有關。

OpenAI 說，這次事件觸發了其 GitHub Actions 工作流程去下載並執行惡意版本的 Axios 1.14.1。該流程能接觸到 macOS 應用的簽章與公證素材，包含 ChatGPT Desktop 1.2026.051、Codex App 26.406.40811、Codex CLI 0.119.0 與 Atlas 1.2026.84.2。公司也說，內部分析顯示，工作流程中的簽章憑證很可能沒有被惡意載荷成功外洩。OpenAI 給用戶約 30 天的更新窗口，從 5 月 8 日起，這些較舊的 macOS 桌面版本將不再獲得更新或支援，甚至可能無法正常運作。

## 這類事件的重點，不在 Axios 本身

這篇報導最值得注意的地方，不是某個套件被污染，而是 AI 公司也和一般軟體團隊一樣，會被最老派的供應鏈攻擊打到。當 AI 產品越來越多、簽章流程越多、CI/CD 權限越大，真正該被盯住的反而是依賴版本、工作流程權限、憑證保存方式，以及更新節奏。

換句話說，模型安全很重要，但它不是唯一的戰場。這次根因其實很典型，GitHub Actions 用了浮動 tag，還沒設定新套件的 minimumReleaseAge，最後讓風險從依賴鏈一路滲進簽章流程。對真的在做 agent 和桌面端產品的人來說，這種事件比任何模型 demo 都更像現實世界，因為風險通常不是從前端跳出來，而是從安靜跑在背景裡的依賴鏈鑽進來。
