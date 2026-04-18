---
title: "Android CLI 與 skills，搭配新 Gemini 模型，讓 Android 開發更快"
description: "Google 在 Android 上推出 agentic 工作流套件，包含 Android CLI、官方 skills 與 Knowledge Base，目標是讓各種 agent 都能更穩、更快地完成 Android 開發。"
date: 2026-04-17
author: Android Developers Blog
layout: post
permalink: /2026-04-17/android-cli-skills-gemini-models.html
image: /2026-04-17/og-android-cli-skills-gemini-models.png
---

<div class="hero-badge">AI News · 2026-04-17</div>

![](/ai-articles/2026-04-17/og-android-cli-skills-gemini-models.png)

**原文連結：** [Experimental hybrid inference and new Gemini models for Android](https://android-developers.googleblog.com/2026/04/Hybrid-inference-and-new-AI-models-are-coming-to-Android.html)

## 摘要

- Google 針對 Android agentic 開發，推出 Android CLI、官方 skills 與 Android Knowledge Base 三件組
- 內部實驗顯示，Android CLI 可讓專案與環境設定的 token 用量下降 70% 以上，任務完成速度提升 3 倍
- Android CLI 提供 SDK 安裝、專案建立、模擬器管理與部署等核心指令，讓 agent 有一致的操作介面
- 官方 skills 把常見 Android 工作流程標準化，像是 Navigation 3、edge-to-edge、AGP 9、XML-to-Compose 與 R8 分析
- Android Knowledge Base 讓 agent 能即時查到 Android、Firebase、Google Developers 與 Kotlin 的最新規範
- Google 想把 agent 開發的起點放在終端機，但終點仍然回到 Android Studio 的完整工具鏈

<div class="sep">· · ·</div>

作為 Android 開發者，你在 agent、工具和 LLM 上有很多選擇。無論你用的是 Android Studio 裡的 Gemini、Gemini CLI、Antigravity，還是第三方 agent 像 Claude Code 或 Codex，Google 的目標都是讓高品質的 Android 開發可以在各種環境裡發生。

今天，Google 推出一組新的 Android 工具與資源，專門支援 agentic 工作流，也就是 Android CLI、Android skills，以及 Android Knowledge Base。這套工具的目的，是把核心 Android 開發流程的猜測空間降到最低，讓你把工作丟給 Android Studio 以外的 agent 時，它也能更有效率、更準確，還能跟上最新的建議模式與最佳實踐。

不管是剛開始做 Android、已經很熟練，還是在同時管理手機與網頁產品，這些資源都能讓你更容易把開發流程接上 AI 助理。就算一開始是在其他環境中操作，最後也都可以再回到 Android Studio，讓它接手更完整的編輯、除錯、效能分析與視覺化工作。

## 重新介紹 Android CLI

當 agent 要和 Android SDK 與開發環境互動時，最需要的是一個輕量、可程式化的介面。這就是新版 Android CLI 的核心角色。它現在是從終端機進行 Android 開發的主要入口，提供環境設定、專案建立、裝置管理等指令，而且也考慮了更現代的能力與更容易更新的設計。

create 指令可以在幾秒內建立一個 Android app 專案。

在內部實驗中，Android CLI 讓專案與環境設定的 LLM token 用量減少超過 70%，而且任務完成速度比只靠標準工具集時快了 3 倍。

你可以直接使用的重點能力包括：

- **SDK 管理：** 用 `android sdk install` 只下載需要的元件，維持精簡的開發環境。
- **快速建立專案：** `android create` 會用官方樣板建立新專案，從第一行程式碼開始就套用建議的架構與最佳實踐。
- **快速建立與部署裝置：** 用 `android emulator` 建立與管理虛擬裝置，再用 `android run` 部署 app，省掉手動 build 與部署的反覆流程。
- **持續更新：** 用 `android update` 取得最新能力。

Android CLI 可以建立裝置、執行 app，還能讓 agent 更容易理解 UI 流程。

Android CLI 不只支援 agentic 開發，也能用來簡化 CI、維運，以及其他腳本化自動化工作。現在就可以下載並試用 Android CLI。

## 用官方 Android skills 幫 LLM 定錨

傳統文件通常比較偏敘述、概念與高層次說明。這對學習很有幫助，但 LLM 往往需要更精準、可執行的指令，才能在不使用過時模式和函式庫的情況下完成複雜流程。

為了補上這個落差，Google 推出了 Android skills GitHub repository。這些 skills 是模組化、以 markdown 撰寫的 `SKILL.md` 指令集，會針對特定任務提供技術規格，並設計成在 prompt 符合 metadata 時可自動觸發，省掉每次都手動附文件的麻煩。

目前首波 skills 涵蓋 Android 開發者與 LLM 最容易卡住的幾種工作流程，例如：

- Navigation 3 的設定與遷移
- edge-to-edge 的實作
- AGP 9 與 XML-to-Compose 的遷移
- R8 設定分析
- 以及更多項目

如果你用的是 Android CLI，也可以透過 `android skills` 指令瀏覽並設定 agent 工作流。這些 skills 也可以和你自己寫的 skills，或 Android 社群做出的第三方 skills 一起並存。想開始的話，可以到 Android skills 的文件頁面查看。

## 用 Android Knowledge Base 提供最新指引

今天推出的第三個組件是 Android Knowledge Base。它可以透過 `android docs` 指令使用，而且已經能在最新版 Android Studio 中使用。這個專門資料來源讓 agent 能搜尋並抓取最新、最權威的開發者指引，作為回覆與操作時的即時上下文。

Android Knowledge Base 讓 agent 能拿到最新的上下文、指引與最佳實踐。透過這個常更新的知識庫，agent 可以把回覆建立在 Android developer docs、Firebase、Google Developers 與 Kotlin docs 的最新內容上。這代表即使模型的訓練截止點是一年前，也還是能回應今天最新的框架與推薦做法。

## Android Studio：高品質 app 的最終目的地

除了讓 agent 更容易處理專案建立與樣板程式，Google 也把這些新工具設計成能順利導回 Android Studio。也就是說，你可以先在終端機用 agent 快速做出 prototype，再把專案打開到 Android Studio，利用它的視覺化編輯、UI 設計、深度除錯與進階效能分析工具，把 app 打磨到可以正式上線的程度。

這些內建的 agent 讓你更容易把 app 想法延伸到手機、摺疊機、平板、Wear OS、Android Auto 與 Android TV。當 agent 已經拿到完整專案原始碼的上下文，又能操作除錯、分析與模擬工具時，整個開發流程就真的變成一套端到端的 AI 加速工具鏈。

## 立即開始

Android CLI 目前已進入 preview，搭配一系列持續擴充的 Android skills 與知識庫一起提供。若要開始使用，可以前往 Android CLI 的下載頁。

## 延伸評論：AI 代理開始吃基礎建設了

這篇真正重要的地方，不只是多了一個 CLI，而是把 agent 開發 Android 的流程標準化了。當工具、規範與知識庫都被封裝成可觸發的技能，AI 就不再只是「會幫忙寫幾段碼」，而是能接上可重複、可驗證的工程流程。

更關鍵的是，競爭焦點正在從模型本身往下移，變成誰把工具鏈、文件、最佳實踐與執行上下文整合得更完整。對開發者來說，這代表真正值錢的不是單次靈感，而是可被 agent 穩定複用的工作流。
