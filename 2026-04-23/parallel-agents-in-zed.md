---
title: "Zed 推出 Parallel Agents，讓多個代理在同一視窗並行工作"
description: "Zed 把多個 agent 帶進同一個視窗，透過 Threads Sidebar、可控的資料夾權限與並行執行，讓多代理工作流更容易整理與監看。"
date: 2026-04-23
author: Mikayla Maki, Richard Feldman
layout: post
permalink: /2026-04-23/parallel-agents-in-zed.html
image: /2026-04-23/og-parallel-agents-in-zed.png
---

<div class="hero-badge">AI News · 2026-04-23</div>

![](/ai-articles/2026-04-23/og-parallel-agents-in-zed.png)

**原文連結：** [Introducing Parallel Agents in Zed](https://zed.dev/blog/parallel-agents)

## 摘要

- Zed 讓使用者在同一個視窗裡同時跑多個 agent，並用 Threads Sidebar 管理每條工作線。
- 每個 thread 都能獨立指定可存取的資料夾與 repo，降低多代理同時動手時的混亂。
- 新版預設版面把 Threads、Agent Panel 與 Project Panel 重新安排，讓 agent 工作流更順手。
- Zed 強調 agent 與編輯器要一起用，而不是把 AI 完全交出去。
- 這次更新也是對「agentic engineering」的一次產品化：讓人類保留掌控權，代理負責加速。

<div class="sep">· · ·</div>

Zed 現在讓你在同一個視窗裡調度多個 agent，而且每個 agent 都可以平行運作。這套功能跑在 Zed 著名的 120 fps 流暢體驗上，也能搭配你喜歡的任何 agent，而且整個專案是開源的。新的 Threads Sidebar 會把所有 thread 一次攤開，並依專案分組，讓你可以：

- 依照 thread 自由混搭不同 agent，因為 Zed 允許你選擇要用哪個 agent。
- 跨專案工作，讓一個 agent thread 可以讀寫多個 repo。
- 需要的時候隔離 worktree，並且針對每個 thread 個別決定。

Sidebar 也提供一些常用操作，像是停止 thread、封存 thread，或直接啟動新的 thread。
即使工作流變得更複雜，手上同時跑著好幾個專案、好多個 agents，Sidebar 也能讓畫面維持清楚，方便持續掌握它們的進度。

## 一個新的預設版面

當 Threads Sidebar 逐漸變成主要的專案入口後，Zed 也重新思考哪些面板應該放在哪裡。
現在 Threads 預設停靠在左側，和 Agent Panel 並排；Project Panel 與 Git Panel 則移到右側。

團隊認為這個版面比較適合 agentic work，能把 agent thread 放在最前面，方便人在不同 thread 之間切換。如果你習慣舊版，也可以右鍵底部列的面板圖示來改停靠位置，或直接到 Settings Editor 調整。
舊使用者預設仍可選擇保留原本版面，但團隊也鼓勵先試試新版再決定要不要改回去。

## Agent 和編輯器最好一起用

問十個程式設計師怎麼使用 AI，可能會得到十種答案。
一端是完全「跟著 vibe 走」，另一端是把所有 AI 功能都關掉；Zed 認為，打造高品質軟體的最佳位置，是介於兩者之間：一邊使用 AI，一邊直接接觸程式碼。

Zed 的共同創辦人兼 CEO Nathan Sobo 在 2025 年寫過一句話：
「身為軟體工程師，我們對世界的貢獻，不該用產生了多少行程式碼來衡量，而應該看我們做出了多少可靠、設計良好、容易修改、又讓人喜歡使用的系統。」

那篇文章提出了 *agentic engineering* 這個詞，用來描述「把人類工藝與 AI 工具結合起來，做出更好的軟體」。最近這個詞也越來越常被提起。

Zed 的 Parallel Agents 建立在同樣的原則上。多代理協作不是新概念，但 Zed 相信他們做出了一個很好的使用體驗。團隊花了好幾天把系統塞進數百條 thread，不斷調整細節、修掉邊角、磨順那些多數開發者可能永遠不會注意到的小地方。這過程比想像中更久，也老實說有點折磨人，但最後成果也因此更成熟，讓開發者能在不犧牲手感的前提下，用 agent 做更複雜的事。

## 開始使用

Parallel Agents 已經可以在最新版本的 Zed 裡使用。
你可以下載 Zed，或直接更新到最新版。

可以從左下角的圖示打開 Threads Sidebar，或在 macOS 上用 `option-cmd-j`、在 Linux 和 Windows 上用 `ctrl-option-j`。

希望你會喜歡這種更有控制感的工作方式。

<div class="sep">· · ·</div>

## 延伸評論：多代理真正需要的是秩序，不是更多分身

這篇最有意思的地方，不是「Zed 也支援 agents」而已，而是它把多代理的問題定義成 UI 與控制權的問題。

很多產品只是在功能上多開幾個 agent，但真正會卡住人的，其實是誰能看、誰能改、誰能停。Zed 直接把 thread、repo、worktree 與版面一起設計，等於承認多代理不是單純的模型問題，而是工作流管理問題。

對真的在做 agent 的人來說，這很像一個提醒：如果沒有清楚的隔離與可視化，agent 數量越多，混亂只會更快放大。真正有價值的不是「更多自動化」，而是讓自動化維持可控。