---
title: "Anthropic 把 Claude agents 帶進金融工作流"
description: "Anthropic 推出 10 個金融服務 agent 模板，整合 Claude Cowork、Claude Code、Managed Agents、Microsoft 365 add-ins 與金融資料 connectors，目標是把金融業導入 AI agents 的週期從數月縮到數天。"
date: 2026-05-06
author: Anthropic
layout: post
permalink: /2026-05-06/anthropic-financial-services-agents.html
image: /2026-05-06/og-anthropic-financial-services-agents.png
---

<div class="hero-badge">Anthropic · 2026-05-05</div>

![](/ai-articles/2026-05-06/og-anthropic-financial-services-agents.png)

**原文連結：** [Anthropic - Agents for financial services](https://www.anthropic.com/news/finance-agents)

## 摘要

- Anthropic 發布 10 個可直接使用的金融服務 agent 模板，涵蓋 pitchbook、KYC、月結、估值審查、財報與市場研究等高工時流程。
- 這些模板可在 Claude Cowork 或 Claude Code 中以 plugin 形式使用，也可用 Claude Managed Agents cookbook 在 Claude Platform 上部署成長時間執行的自主流程。
- Claude 現在也能透過 Microsoft 365 add-ins 橫跨 Excel、PowerPoint、Word，Outlook 則即將支援，讓模型、試算表、簡報與文件共享工作脈絡。
- 每個 agent 模板都把 skills、connectors 與 subagents 打包成 reference architecture，企業可依自己的建模慣例、風控政策與審批流程調整。
- Anthropic 同時擴大金融資料生態系，新增 Dun & Bradstreet、Fiscal AI、Financial Modeling Prep、Guidepoint、IBISWorld、SS&C IntraLinks、Third Bridge、Verisk connectors，以及 Moody's MCP app。
- Anthropic 表示 Claude Opus 4.7 在 Vals AI 的 Finance Agent benchmark 達到 64.37%，是這次金融 agents 最搭配的模型。
- 這篇真正值得注意的地方，不只是「AI 會做金融分析」，而是 Anthropic 正把 regulated enterprise agent stack 做成可購買、可稽核、可落地的產品包。

<div class="sep">· · ·</div>

Anthropic 正式推出一組面向金融服務與保險業的 Claude agents。這次發布的重點是 10 個 ready-to-run agent templates，針對金融業最耗時間的工作設計，包括製作 pitchbooks、審查 KYC 文件，以及月底關帳。

每個模板都能以 plugin 形式在 Claude Cowork 與 Claude Code 中使用，也提供 Claude Managed Agents 的 cookbook。Anthropic 想解決的問題很直接：讓金融團隊不用花幾個月從零建 agent，而是能在幾天內把 Claude 放進真實金融工作流。

Claude 也開始更深地進入 Microsoft 365。透過 Claude add-ins，它現在可以跨 Excel、PowerPoint、Word 工作，Outlook 支援則即將推出。安裝 add-ins 之後，脈絡可以在不同應用之間延續：在模型裡開始的工作，可以接到試算表、簡報或文件裡，不需要每換一個工具就重新解釋一次。

同時，Anthropic 也擴大金融服務 partner ecosystem。新的 connectors 與 MCP app 讓 Claude 能接上金融專業人士原本就在用的資料與工具。Connectors 讓 Claude 在 governed access controls 下取得即時資料；MCP apps 則更進一步，把資料供應商自己的互動工具嵌進 Claude 裡。

Anthropic 表示，這些更新最適合搭配 Claude Opus 4.7 使用。該模型在金融任務上是 state-of-the-art，並在 Vals AI 的 Finance Agent benchmark 以 64.37% 成績領先。

## 金融工作的 10 個 agent 模板

Anthropic 把每個 agent template 定義成一套 reference architecture，裡面包含三個主要部分：skills、connectors 與 subagents。

Skills 負責放任務指令與領域知識，connectors 負責讓 agent 在受治理的前提下存取任務所需資料，subagents 則由主 agent 在特定子任務中呼叫，例如選擇可比公司、檢查方法論，或做另一層驗證。

金融機構可以依照自己的建模慣例、風險政策與 approval flows 調整這些模板。Anthropic 把它們放在 financial services marketplace，可作為 Claude Cowork / Claude Code plugins 使用，也可作為 Claude Managed Agents cookbooks 部署。

這 10 個新 agent 分成兩大類。

**Research and client coverage：**

- **Pitch builder**：建立 target lists、跑 comparables，並為客戶會議草擬 pitchbooks。
- **Meeting preparer**：在電話或會議前整理客戶與交易對手 briefing。
- **Earnings reviewer**：閱讀 transcripts 與 filings，更新模型，並標記與投資 thesis 相關的變化。
- **Model builder**：根據 filings、data feeds 與 analyst inputs 建立並維護 financial models。
- **Market researcher**：追蹤產業與 issuer developments，綜合新聞、filings 與 broker research，並標記需要 credit / risk review 的資訊。

**Finance and operations：**

- **Valuation reviewer**：依 comparables、methodology 與公司審查標準檢查估值。
- **General ledger reconciler**：對帳 general ledger accounts，並根據 books of record 執行 net asset value calculations。
- **Month-end closer**：執行 close checklist、準備 journal entries，並產出 close reports。
- **Statement auditor**：檢查 financial statements 的一致性、完整性與 audit-readiness。
- **KYC screener**：組裝 entity files、審閱 source documents，並為 compliance escalation 整理資料包。

這些模板有兩種使用方式。

第一種是在 Claude Cowork 或 Claude Code 中作為 plugin，和分析師一起在桌面軟體旁工作。舉例來說，把 target list 交給 Pitch agent 後，它可以產出 Excel comps model、PowerPoint pitchbook draft，以及準備好放進 Outlook 的 cover note。

第二種是用 Claude Managed Agent，讓同一套模板在 Claude Platform 上自主執行，適合跨整本交易 book 或 nightly schedule 的工作。Cookbooks 會把企業原本得自己工程化的 building blocks 包好：可持續多小時 deal close 的 long-running sessions、per-tool permissions、managed credential vaults，以及 Claude Console 中可讓 compliance 與 engineering teams 檢查每次 tool call 和 decision 的完整 audit log。

不論是哪一種模式，Anthropic 強調人仍在 loop 裡。使用者需要 review、iterate、approve Claude 的工作，才會送給客戶、正式 filed，或被拿來行動。

## Claude 進入 Excel、PowerPoint、Word 與 Outlook

Claude 現在可以透過 add-ins 直接在 Microsoft Excel、PowerPoint、Word 工作，Outlook 也即將加入。

在 Outlook 裡，Claude 可以像 chief of staff 一樣整理 inbox、安排會議，並用使用者的語氣草擬回覆。在 Excel 裡，它可以根據 filings 與 data feeds 建立 financial models、稽核 linked workbooks 之間的 formulas，並執行 sensitivity analyses。在 PowerPoint 裡，它能草擬會隨底層數字更新的簡報。在 Word 裡，它能依照公司的 templates 編修 credit memos。

這裡的關鍵不是單一 add-in，而是 Claude 能在四個工具之間帶著知識與脈絡移動。分析師如果先在 Excel 建模，後續要把工作轉成 PowerPoint 時，不必從頭說明模型假設。

在 Claude Cowork 裡，使用者也能透過 Dispatch 從任何地方用文字或語音指派任務。Claude 可以在分析師離開座位時繼續處理本機檔案，等使用者回來再交付可審閱的成果。

## 更大的金融資料生態系

Anthropic 的判斷很清楚：AI agents 的品質取決於它們能接到多少可靠資料與上下文。Claude 已經能連接多種 market data、research platforms 與金融公司內部系統，包括 S&P Capital IQ、MSCI、PitchBook、Morningstar、Chronograph、LSEG、Daloopa，以及企業自己的 data warehouses、research repositories 與 CRMs。

這次新增的 connectors 包含：

- **Dun & Bradstreet**：提供 verified business identity 的全球標準，協助企業串接 systems of record 並擴展 AI-enabled workflows。
- **Fiscal AI**：擴展 public equities 的 real-time fundamentals coverage，用於更深入研究與 benchmarking。
- **Financial Modeling Prep**：提供 equities、ETFs、crypto、forex、commodities 的 real-time quotes、fundamentals、statements、filings 與 transcripts。
- **Guidepoint**：搜尋 100,000+ 份 compliance-reviewed expert interview transcripts，並提供可連回來源的 verbatim excerpts。
- **IBISWorld**：追蹤數千個產業的 revenue、financial ratios、risk scores、cost structures 與 forecasts。
- **SS&C IntraLinks**：讓 Claude 存取 DealCentre data rooms，用於文件搜尋、diligence Q&A 與 deal-activity tracking。
- **Third Bridge**：讓 Claude 使用 company、sector 與 value chain 的 primary-source expert interviews。
- **Verisk**：提供 property、casualty 與 specialty insurance data，用於 underwriting、claims 與 risk analysis。

此外，Moody's 推出 MCP app，把 proprietary credit ratings，以及超過 600 million 家 public and private companies 的資料帶進 Claude，用於 compliance、credit analysis 與 business development。

## Anthropic 想吃下 regulated enterprise agents

Anthropic 說，許多大型銀行、資產管理公司與保險公司已經選擇 Claude。Claude 被用在 front office 的 research 與 client experience、middle office 的 underwriting、risk、compliance，以及 back office 的 code modernization 與 operations。

這次發布的產品線，等於把這些用例包成更明確的上線路徑：agent templates、Office add-ins、financial connectors、MCP app、Managed Agents、credential vaults、audit logs。對金融業來說，這些東西比「模型很聰明」更重要，因為 regulated workflows 真正卡住的往往是資料、權限、審批、稽核與責任歸屬。

這些 Claude agents 已經在 financial services marketplace 上架。它們可在所有付費方案的 Claude Cowork 或 Claude Code 中以 plugin 使用，也可以用仍處於 public beta 的 Managed Agents 在 Claude Platform 上 programmatically 執行。新的 connectors 與 Moody's MCP app 則提供給 joint customers 的 paid plans 使用。

Claude for Excel、PowerPoint 與 Word add-ins 已經 generally available，Claude for Outlook 則即將推出。

<div class="sep">· · ·</div>

## 延伸評論：金融 agents 的重點不是自動化，而是可治理的自動化

這篇表面上是在宣布金融服務 agents，但真正的訊號是：Anthropic 正在把 agent 從「會做事的聊天機器人」推向「可被企業採購、治理、稽核的工作流產品」。

金融業是很好的測試場，因為它同時有高價值工作、高重複流程、高資料密度，也有極高的監管與責任要求。若 agent 只能產生一段看似合理的分析，它在金融場景裡價值有限；但若它能存取正確資料、用公司模板工作、留下 audit log、遵守權限邊界，並在關鍵節點要求人類批准，那才有機會進入核心流程。

這也說明 enterprise AI 的競爭正在從模型本身移到「最後一哩工作流」。模型能力仍然重要，但客戶真正買單的會是整套封裝：模板、connectors、permissions、credential management、UI integration、human approval、compliance evidence。誰能把這些拼成可以直接落地的產品，誰就更接近企業預算。

不過，Anthropic 的敘事也有一個需要保留的問題：金融工作流被 agent 化之後，人的角色很容易從「做分析」變成「審查一堆 AI 產物」。這能不能真的降低工作量，取決於 agent 輸出的可靠度、可追溯性，以及 review UI 是否足夠好。否則，企業只是把執行成本換成審查成本，把手動工作換成治理負債。
