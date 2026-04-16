---
title: "OpenAI 讓 Codex 幾乎能做所有事，從寫 code 到操作桌面都包了"
description: "OpenAI 大幅升級 Codex，讓它能操作電腦、連接 SSH、用瀏覽器做前端迭代，並加入記憶與自動排程，朝全工作流代理前進。"
date: 2026-04-16
author: OpenAI
layout: post
permalink: /2026-04-16/codex-for-almost-everything.html
---

<div class="hero-badge">AI News · 2026-04-16</div>

**原文連結：** [Codex for (almost) everything](https://openai.com/index/codex-for-almost-everything/)

## 摘要

- OpenAI 這次把 Codex 從寫 code 的工具，往能橫跨整個開發流程的工作夥伴推進
- Codex 現在可以操作使用者電腦，透過螢幕、游標與鍵盤直接和桌面互動
- 它也加入更完整的網頁工作能力，包括內建 browser、前端迭代與直接在頁面上留言下指令
- 新版還能生成與迭代圖片，讓產品概念、mockup 和遊戲素材可以在同一個流程裡完成
- OpenAI 一口氣新增 90 個以上 plugins，並把 GitHub review comments、SSH、檔案預覽和 summary pane 整合進 app
- automations 與 memory 讓 Codex 可以跨日續跑、記住偏好，還能主動建議下一步工作

<div class="sep">· · ·</div>

OpenAI 這次釋出的是一個大幅更新版 Codex，目標很清楚，就是讓超過 300 萬每週使用它的開發者，把它用在軟體開發生命週期的更多環節裡，而不只是寫幾段程式碼。

現在的 Codex 可以一邊和使用者同步工作，一邊操作電腦上更多常用工具與 app，還能生成圖片、記住偏好、從過去的操作中學習，並接手那些重複又持續性的工作。Codex app 也補上更深的開發者工作流支援，例如 PR review、同時看多個檔案與 terminal、透過 SSH 連遠端 devbox，以及內建 browser，讓前端設計、app 和遊戲的迭代更快。

有了背景電腦操作之後，Codex 現在可以透過自己的游標看到、點選和輸入，直接使用電腦上的各種 app。多個 agent 也能在同一台 Mac 上平行工作，不會互相干擾使用者正在進行的其他工作。對開發者來說，這對前端修改、app 測試，或是那些沒有 API 的工具特別有用。

Codex 也開始更原生地和網頁協作。App 裡現在有內建 browser，可以直接在頁面上留言，對 agent 下更精準的指令。這對前端與遊戲開發已經很實用，未來 OpenAI 還想把它擴展到能完整操作 browser，不只侷限於 localhost 網頁應用。

Codex 現在也能使用 gpt-image-1.5 生成並反覆調整圖片。把這能力和截圖、程式碼放在同一個工作流裡，對產品概念圖、前端設計、mockup 和遊戲素材都很方便。

OpenAI 同時推出了 90 個以上的新 plugins，把 skills、app integrations 和 MCP servers 串在一起，讓 Codex 能從更多工具蒐集上下文並採取行動。這批新插件裡，開發者可能最常用的包括 Atlassian Rovo、CircleCI、CodeRabbit、GitLab Issues、Microsoft Suite、Neon by Databricks、Remotion、Render 和 Superpowers。

App 本身也新增了回應 GitHub review comments、開多個 terminal tab、透過 SSH 連遠端 devbox 的 alpha 支援，還能在側欄直接開啟檔案，並對 PDF、試算表、簡報和文件提供更完整的預覽。新的 summary pane 則用來追蹤 agent 的計畫、來源與產物。

這些更新加在一起，讓開發者更容易在寫 code、檢查輸出、review 變更、和 agent 協作之間快速切換，整個軟體開發流程也更像是在同一個工作空間裡完成。

OpenAI 也擴大了 automations 的能力，讓既有對話 thread 可以重複利用，保留之前累積的 context。Codex 現在還能替自己排定未來工作，並在之後自動喚醒，持續完成可能跨越數天甚至數週的長期任務。

團隊已經開始拿 automations 來處理各種工作，像是把未完成的 pull request 收尾，或是在 Slack、Gmail、Notion 這類工具之間追蹤快速變動的對話與待辦。

OpenAI 也預覽了 memory 功能，讓 Codex 能記住過去經驗裡有用的上下文，包括個人偏好、修正過的細節，還有原本需要花時間蒐集的資訊。這會讓未來的任務跑得更快，品質也更接近靠大量客製化指令才能達到的水準。

Codex 也會主動提出可繼續進行的工作。它可以根據專案、已連接的 plugins 與 memory，建議一天該從哪裡開始，或是該接回哪個先前的專案。舉例來說，Codex 可以找出 Google Docs 裡需要回覆的留言，從 Slack、Notion 和程式碼庫拉出相關背景，然後整理成一份優先順序清單。

這些更新從今天起會先推給已登入 ChatGPT 的 Codex desktop app 使用者。至於 personalization 功能，像是 context-aware suggestions 與 memory，會再陸續開放給 Enterprise、Edu，以及 EU 和 UK 使用者。computer use 目前先支援 macOS，之後也會擴展到 EU 和 UK。

如果已經在 terminal 或 editor 裡用過 Codex，可以試著把它擴展到更完整的工作流裡。還沒開始用的人，也可以直接下載 app 開始上手。

Codex 上線以來的一年裡，開發者對它的用法已經越來越廣。大家先拿它來寫 code，接著開始用它理解系統、蒐集上下文、review 工作、debug 問題、協調團隊，還有推動更長時間的任務持續前進。

OpenAI 說，他們的使命是確保 AGI 造福全人類。這也包含縮短「人們想得到」和「人們做得出來」之間的落差。這次更新讓 Codex 更接近真正的工具、工作流與決策環節，也還有很多後續值得期待。

<div class="sep">· · ·</div>

## 延伸評論：Codex 正在變成工作平台

這次更新最值得注意的地方，不是單一功能有多炫，而是 OpenAI 明確把 Codex 往「整個工作空間」推。寫 code、看文件、回 review、連遠端機器、碰 browser、做圖片，這些原本分散的動作開始被塞進同一個 agent 介面裡。

真正的差別會出現在長流程任務。當 memory、automations、plugins 和 background computer use 串起來後，agent 不再只是回答問題，而是能持續把工作往前推。這會直接改變開發者日常，也會把競爭焦點從模型能力，拉到執行環境和工作流整合。