---
title: "OpenAI 推出 ChatGPT Workspace Agents，團隊共享長流程代理正式成形"
description: "OpenAI 推出 Workspace Agents，讓團隊在 ChatGPT 與 Slack 共享可排程、可審批、能串接文件、程式碼與企業工具的長流程代理，朝真正能接手工作流程的團隊型 AI 再往前一步。"
date: 2026-04-24
author: OpenAI
layout: post
permalink: /2026-04-24/workspace-agents-chatgpt.html
image: /2026-04-24/og-workspace-agents-chatgpt.png
---

<div class="hero-badge">AI News · 2026-04-24</div>

![](/ai-articles/2026-04-24/og-workspace-agents-chatgpt.png)

**原文連結：** [Introducing workspace agents in ChatGPT](https://openai.com/index/introducing-workspace-agents-in-chatgpt/)

## 摘要

- OpenAI 推出 workspace agents，讓團隊能建立共享的長流程代理。
- 這些 agent 以 Codex 為核心，可在雲端持續工作，離線時也能繼續跑。
- 團隊可以在 ChatGPT 或 Slack 中共享同一個 agent，並逐步改進它。
- agent 能從文件、程式碼、工具與 memory 蒐集脈絡，並在需要時請求審批。
- OpenAI 提供 finance、sales、marketing 等模板，降低建立門檻。
- 管理員可控制資料來源、工具權限與誰能建立／分享 agent。
- 這篇文章把「聊天式 AI」再往前推成「真正能接手工作流程的 AI」。

<div class="sep">· · ·</div>

今天，OpenAI 推出 ChatGPT 裡的 workspace agents。團隊現在可以建立共享 agent，處理複雜任務與長流程工作，而且整個過程都在組織設定好的權限與控制範圍內運作。

Workspace agents 是 GPTs 的進化版。它們由 Codex 驅動，能接手人們在工作中早就會做的事：準備報告、寫程式、回覆訊息。它們在雲端執行，所以即使人不在線上，也能持續工作。它們也被設計成能在組織內共享，讓團隊可以先打造一次，再在 ChatGPT 或 Slack 裡一起使用，並持續把它調整得更好。

AI 早就幫助人們把個人工作做得更快，但組織裡最重要的流程，往往依賴共享脈絡、交接與跨團隊決策。Workspace agents 就是為這種工作設計的：它們可以從正確的系統收集脈絡，遵循團隊流程，在需要時請求審批，並在各種工具之間把工作往前推。舉例來說，OpenAI 的銷售團隊就用一個 agent，把通話紀錄與帳戶研究整理在一起，篩選新 leads，並直接在業務信箱裡起草後續 email。這讓業務團隊少花時間拼湊資訊，多把時間放在和客戶互動上。

要開始使用，只要在 ChatGPT 側邊欄點選 Agents，描述一個團隊常做的工作流程。ChatGPT 會一步步引導，幫你把它變成一個 agent。Workspace agents 目前在 ChatGPT Business、Enterprise、Edu 和 Teachers 方案中提供研究預覽。

編輯註記：GPTs 會繼續保留，讓團隊在測試 workspace agents 時仍能使用。之後，OpenAI 也會讓 GPTs 更容易轉成 workspace agents。

請開啟聲音，觀看五個今天就能建立的 agent 導覽。

只要描述你想交辦的工作，或直接丟一份檔案進去，ChatGPT 就會幫你把它轉成 agent：定義步驟、連接正確工具、加入 skills，並反覆測試到它表現符合預期。

以下是 OpenAI 團隊已經做出來、而且你的團隊也能做的幾個 agent：

- **Software Reviewer**：審查員工的軟體申請，對照已批准工具與政策，建議下一步，必要時建立 IT ticket。
- **Product Feedback Router**：監看 Slack、客服管道與公開論壇，把回饋整理成優先排序過的 ticket 與每週產品摘要。
- **Weekly Metrics Reporter**：每週五抓資料、產出圖表、撰寫摘要，並把報告分享給團隊。
- **Lead Outreach Agent**：研究 inbound leads，根據資格標準打分，草擬個人化 follow-up email，並更新 CRM。
- **Third-Party Risk Manager**：研究供應商，評估制裁風險、財務健康與聲譽訊號，輸出結構化報告。

你也可以直接用模板快速上手，像是 finance、sales、marketing 等類型。每個模板都內建 skills 與建議工具，可以先快速設定，再從那裡客製化。

Workspace agents 可以從數十種工具蒐集脈絡並執行動作。

Agents 由雲端的 Codex 驅動，因此能使用工作區裡的檔案、程式碼、工具與 memory。它們不只是回一句 prompt 而已：還能寫程式或執行程式、使用連接好的應用程式、記住學到的事，並跨多個步驟持續推進工作。

Workspace agents 甚至可以在你不在的時候繼續跑。你可以設定它們依排程執行，或把它們部署到 Slack，讓它們隨時接住新的需求。舉例來說，OpenAI 的產品團隊做了一個 agent，在 Slack 頻道裡主動回答員工問題。它會給出清楚答案、附上相關文件連結，必要時還能建立 ticket。這讓團隊更快解除卡關，也避免重要後續事項被漏掉。

目前，團隊可以在 ChatGPT 和 Slack 與 agents 互動，之後還會支援更多場景。Agents 會出現在工作本來就發生的對話與流程裡，幫助團隊用更少的協調成本把事情推進。

你可以從 ChatGPT 側邊欄的 Agents 分頁管理分享出去的 workspace agents，也可以探索團隊分享的 agent。

知識常常散落在不同的人與系統之間。Workspace agents 提供了一種把這些知識變成可重複使用工作流程的方法：它遵循正確流程、使用正確工具，並且能在整個組織裡共享。

例如，OpenAI 的會計團隊做了一個 agent，協助處理月結的一些關鍵步驟，從 journal entries、balance sheet reconciliations 到 variance analysis 都能處理。它在幾分鐘內完成工作，產出含有底層輸入與 control totals 的 workpapers 供審查，並遵守內部政策。這個 agent 可以在 ChatGPT 裡提供給團隊成員使用，也可以加到 Slack 頻道裡，讓團隊一邊看輸出、一邊協作。

因為 agents 有 memory，而且可以在對話中被引導與修正，它們會隨著團隊使用而變得更好。時間一長，agent 會成為維持團隊知識最新狀態的實用方式：先建立一次，再靠使用過程持續改進，最後還能分享或複製到新的工作流程。

你可以從編輯器選單查看正在運作的 workspace agents 分析資料。

把工作交給 agent 的同時，控制權仍然在你手上。你可以決定它能使用哪些工具與資料、能執行哪些動作，以及什麼時候必須先審批。像是編輯試算表、寄 email、加入行事曆事件這類敏感步驟，都可以要求 agent 先獲得許可再繼續。

在你分享 agent 之後，分析功能也能讓你看到它的使用狀況，包括執行次數與有多少人正在使用。

Workspace agents 具備企業等級的監控與控制，管理員可以保護敏感資料，同時讓團隊用更安全的方式加快進度。ChatGPT Enterprise 和 Edu 管理員可以控制不同使用者群組能接觸哪些連接工具與動作，也能管理誰可以使用、建立與分享 agents。內建防護還能幫 agent 在遇到誤導性的外部內容時維持在指令範圍內，包括 [prompt injection](https://openai.com/safety/prompt-injections/) 攻擊。

[Compliance API](https://help.openai.com/en/articles/9261474-openai-compliance-platform-for-enterprise-customers) 也讓管理員能看見每個 agent 的設定、更新與執行紀錄，好監控與控管組織內的使用方式。必要時，管理員也可以暫停 agent。

之後，管理員還能在 admin console 裡看到組織內建立的每個 agent，包括使用模式與連接的資料來源。

早期測試者已經看到 workspace agents 帶來更一致的結果，也換來更多時間做更有價值的工作。

> “打造 agent 最難的不是模型，而是整合、memory 和使用者體驗。Workspace agents 把這些工作整合起來，所以我們的其中一位 Sales Consultant 不用工程團隊，也能從頭建立、評估並迭代一個 Sales Opportunity agent。它會研究帳戶、摘要 Gong 通話內容，並把 deal brief 直接貼到團隊 Slack。原本每週要花 5–6 小時的事，現在會在背景自動跑。” — Ankur Bhatt，AI Engineering，Rippling

Workspace agents 目前在 ChatGPT Business、Enterprise、Edu 和 Teachers 方案中提供研究預覽。對 Enterprise 與 Edu 方案來說，管理員可以用 role-based controls 啟用 agents。

Workspace agents 在 2026 年 5 月 6 日前免費，之後會開始採用 credit-based pricing。

OpenAI 接下來還會加入更多功能，幫助團隊用更少人工協調完成更多工作，包括：可自動啟動的 triggers、更好的 dashboard 來理解與改善表現、更多讓 agent 能操作企業工具的方式，以及在 Codex app 中支援 workspace agents。

當知識更容易找到、流程更容易遵循、而且人可以在工作流裡直接得到幫助時，團隊就能把更多時間放在創作、建造與做決策上。Workspace agents 是往這個方向邁出的一步：讓 AI 在人們本來就工作的工具與對話裡一起工作，幫助團隊少一點協調，多一點真正推進事情的時間。

<div class="sep">· · ·</div>

## 延伸評論：這不是更會聊天，而是更像「共享工作單元」

workspace agents 最有意思的地方，不是它又多會答幾句，而是它開始把 AI 從個人助理推成團隊資產。當 agent 可以被分享、排程、審批、記憶，還能活在 Slack 這種日常工作場景裡，AI 才真的像工作流的一部分，而不是一個會回話的側邊欄。

但這也意味著另一個現實：整個價值不在模型，而在整合、權限、審批與維運。這篇其實很誠實地把重點放在「企業級控制」上，因為真正讓 agent 可用的，不是魔法，而是流程不亂、責任能追、資料不外洩。

對正在做自動化的人來說，這篇最值得抄的不是功能清單，而是產品方向：把高頻流程抽成可重複的 agent，先鎖住資料來源與動作邊界，再慢慢擴張。比起追求一個什麼都會的通用助手，這條路更務實，也更接近能上線的東西。