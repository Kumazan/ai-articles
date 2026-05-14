---
title: "前沿 AI 正在改寫資安攻防：Palo Alto 的防禦者指南更新"
description: "Palo Alto Networks 分享前沿模型掃描 130 多項產品後的資安衝擊：AI 已能大量發現漏洞，防禦者需要加速修補、降低暴露面並讓 SOC 進入即時化。"
date: 2026-05-14
author: Lee Klarich
layout: post
permalink: /2026-05-14/frontier-ai-cybersecurity-defender-guide.html
---

<div class="hero-badge">Lee Klarich · 2026-05-13</div>

**原文連結：** [Defender's Guide to the Frontier AI Impact on Cybersecurity: May 2026 Update](https://www.paloaltonetworks.com/blog/2026/05/defenders-guide-frontier-ai-impact-cybersecurity-may-2026-update/)

## 摘要

- Palo Alto Networks 說，最新前沿 AI 模型已經非常擅長在程式碼中找漏洞，甚至能把漏洞轉成接近即時的攻擊路徑。
- 他們自 2026 年 4 月 7 日起作為 Project Glasswing launch partner 測試 Anthropic Claude Mythos，後續也測試 Claude Opus 4.7 與 OpenAI GPT-5.5-Cyber。
- 在 5 月 Patch Wednesday 中，Palo Alto 首次出現多數修補項目都來自前沿 AI 模型掃描程式碼；初次完整掃描涵蓋 130 多項產品、三個平台。
- 這次公告包含 26 個 CVE、代表 75 個問題，遠高於平常每月不到 5 個 CVE 的量；Palo Alto 表示重要漏洞已修補，且沒有發現被野外利用。
- 文章給企業四個立即行動方向：找出並修補漏洞、降低可被攻擊面、補強攻擊防護、部署即時化資安營運。
- 作者估計，組織只有約 3-5 個月的窄窗口能在 AI-driven exploits 成為新常態前搶先補強。

<div class="sep">· · ·</div>

你現在大概已經聽過：最新的前沿 AI 模型非常擅長在程式碼中找漏洞，並產生可能的 exploit。它們強到一定程度，以至於這些模型被大幅限制一般使用，希望能先給防禦者時間，在攻擊者找到並利用漏洞前把問題修掉。

背景是這樣：2026 年 4 月 7 日，Palo Alto Networks 作為 [Project Glasswing](https://www.anthropic.com/glasswing) 的 launch partner，開始測試 Anthropic 的 Claude Mythos 模型。結論很清楚：最新模型非常擅長找出漏洞，並把它們在近乎即時的速度下轉成關鍵 exploit path。作者先前在 [Defender's Guide to the Frontier AI Impact on Cybersecurity](https://www.paloaltonetworks.com/blog/2026/04/defenders-guide-frontier-ai-impact-cybersecurity/) 中分享過早期發現與建議。

自那之後，他們持續測試最新前沿 AI 模型，包括 Anthropic 的 Mythos、Claude Opus 4.7，以及透過 Trusted Access for Cyber program 取得的 OpenAI GPT-5.5-Cyber。幾週前最大的問題是：「我們是不是高估了這些模型的能力？」更多測試後，作者認為答案是否定的。事實上，這些模型找漏洞的能力可能比他們一開始理解的還要強。這篇文章是他們對持續研究、測試過程學到的事，以及保護客戶做法的更新。

## 在攻擊者找到並利用前，先找出並修補

Palo Alto Networks 發布了 5 月的「Patch Wednesday」安全公告，這是他們每月透明揭露與修補漏洞的固定節奏。這是第一次，多數發現都來自前沿 AI 模型掃描他們的程式碼。

- 這是一次完整初始掃描的結果，涵蓋三個平台上的 130 多項產品。
- 截至公告當天，Palo Alto 已修補所有 SaaS 交付產品中的重要漏洞，所有由客戶自行營運的產品也都已提供 patch。
- 這次公告涵蓋 26 個 CVE，代表 75 個問題；相較之下，Palo Alto 平常一個月通常不到 5 個 CVE。這裡不包含 CyberArk 漏洞，因為 CyberArk 會依照自己的正常流程揭露。Palo Alto 表示，這些問題沒有在野外被利用。

重要的是，不要把這件事理解成一次性任務。Palo Alto 正在重新掃描，並把他們對如何提供正確 context 與 threat intelligence 的學習套回模型。他們的目標是在先進 AI 能力更廣泛流向攻擊者前，修掉所有找到的漏洞。

AI 模型雖然非常強，但並不是魔法。要得到高 fidelity 的結果，仍然需要建立 AI scanning harnesses，並搭配 context、guardrails 與 threat intelligence。Palo Alto 也發現，不同模型因訓練差異而有變異，因此需要 multimodel approach 才能找出更完整的漏洞集合。短期最急迫的任務，是找出並修補組織現在已有的漏洞；長期來看，更大的轉變是把這些模型直接納入 software development lifecycle。這條路的終點，是未來軟體可以從設計階段就更安全。

## 每個組織現在就該做的四件事

不論目前這些模型能力是否仍受限制，Palo Alto 相信它們會更廣泛流向其他模型。他們現在估計，組織只有大約 3-5 個月的窄窗口，可以在 AI-driven exploits 成為新常態前跑在攻擊者前面。這波即將到來的漏洞洪流要求企業立刻行動。沒有建立適當防護的組織，會面對一種全新的風險類型。

### 找出並修補應用程式、產品與程式碼中的漏洞

核心原則是：在攻擊者找到並利用前，先找出並修掉。

- 使用 AI 模型辨識整個 codebase 裡的漏洞。
- 對 open-source supply chain 套用同樣的 AI 掃描，並修補或緩解發現的問題。
- 讓 product 與 development teams 緊密協調，加速 patching。

### 評估、降低並修補暴露面

企業需要降低攻擊者可觸及的範圍，並保護必須對外開放的資產，例如 customer-facing applications。

- Attack surface management products，例如 [Cortex Xpanse](http://paloaltonetworks.com/cortex/cortex-xpanse)，在找出並降低暴露面時變得前所未有重要。
- 最新前沿 AI 模型若搭配正確的 AI scanning harness，非常擅長評估暴露面、理解 security misconfigurations，並依照 attack-path reachability 排序優先順序。
- 稽核 supply chain，包括 AI infrastructure、runtime environments 與 model dependencies。

### 確保攻擊防護到位

漏洞 exploit 通常只是多階段攻擊生命週期中的一步。要避免 breach，更需要建立同級最佳的防護。

- 盤點目前 sensor coverage，找出 detection、prevention 與 telemetry 的關鍵盲點。
- 在所有 on-premises 與 cloud hosts 部署高品質 XDR，重點放在即時 ML-based detection 與 prevention。
- 部署 Agentic Endpoint Security，以保護企業大規模採用 vibe coding 與 AI security 的 agentic endpoint，例如 Prisma AIRS 與 Palo Alto 近期收購的 Koi。
- 用具備 AI-based security 的 enterprise browser 保護使用者實際工作的地方。
- Zero trust 與 Identity Security 是保護每個使用者與連線的基礎，也要延伸到內部分段與 outbound application connections。

### 部署即時化資安營運

Autonomous AI-driven attacks 會把攻擊生命週期壓縮到分鐘等級，迫使每個 SOC 達到個位數的 mean time to detect (MTTD) 與 mean time to respond (MTTR)。

- Attack detections 必須由 AI/ML 驅動，才能在頻繁變動與新型攻擊出現時仍可大規模偵測。
- 這些 AI detections 必須能處理廣泛的 first-party 與 third-party data sources。一個高品質 AI SOC 必須能作用於所有相關資料來源。
- 自動化必須原生整合並貫穿 SOC lifecycle，才能達到個位數 MTTR；這種自動化也會越來越 agentic。
- 平台化交付很重要，否則 point solutions 之間會產生斷點與落差。
- 盡快完成評估並採取行動。

## 用 AI 對抗 AI：前沿 AI 資安創新即將到來

到目前為止，前沿 AI 模型主要是找出新的攻擊，而不是發明全新的攻擊技術。這代表，只要有正確創新，防禦者也能擴大 AI 的使用，解決組織正在面對的資安挑戰，並提供客戶需要的能力，讓防禦方能跟上持續演化的 threat landscape。

Palo Alto 提到幾個方向：

- 重新想像 virtual patching：透過橫跨 network、endpoint 與 cloud security 的 proactive、高 fidelity content updates，因應 open source 與 technology suppliers 可能出現的 patch 洪流。Virtual patching 可以提供緩解層，為團隊爭取更新時間。Palo Alto 預期很快推出第一階段能力。
- 強化攻擊防護：包含 cyber-LLM trained ML、small language models (SML) 與 behavior protections。Palo Alto 表示，Cortex XDR 與 WildFire malware prevention 等 network security services 的早期測試，對這類由新前沿 AI 模型創造的攻擊有高防護覆蓋率。
- 使用這些模型掃描自己的 code、applications，甚至 security configurations。Palo Alto 的目標是把這些能力產品化並納入平台。

## Unit 42 如何協助

Palo Alto 承認，不是每個組織都有足夠能力或專業，可以在 AI 創新要求的短時間內落實所有建議，來對抗 frontier AI-driven risks。他們的 [Unit 42 Frontier AI Defense](https://www.paloaltonetworks.com/blog/2026/04/introducing-unit-42-frontier-ai-defense/) service，旨在幫助客戶在攻擊者之前發現並修補目前暴露面、強化能降低暴露與限制影響的 controls，並現代化 security operations，讓團隊能用機器速度偵測與回應。

作者認為，這是資安產業的關鍵時刻。雖然挑戰規模真實存在，但他對解決問題的能力有信心。Palo Alto 表示，會協助客戶走過這個轉變，並確保在 landscape 持續演進時，優勢仍留在防禦者手上。

## 前瞻性聲明

這篇文章包含 forward-looking statements，涉及風險、不確定性與假設，包括但不限於 Palo Alto Networks 產品與技術，或未來產品與技術的效益、影響、表現或潛在效益、影響與表現。這些 forward-looking statements 並不是對未來表現的保證；有許多因素可能使實際結果與文章中的說法產生重大差異。相關重要風險與不確定性，可參考 Palo Alto Networks 最新 Annual Report on Form 10-K、最新 Quarterly Report on Form 10-Q，以及不定期提交給 SEC 的其他文件。所有 forward-looking statements 都是基於截至文章日期可取得的資訊，Palo Alto Networks 不承擔更新這些聲明的義務。

<div class="sep">· · ·</div>

## 延伸評論：資安團隊真正缺的不是更多警報，而是更快的閉環

這篇文章值得看，不只是因為「AI 會找漏洞」這件事聽起來很驚人，而是它把問題推到更務實的位置：如果攻擊者能用 AI 擴大 vulnerability discovery，防禦者也必須把 discovery、triage、patching、virtual patching、detection 與 response 串成更快的閉環。單純多掃出漏洞沒有意義；掃出來之後，能不能快速判斷優先順序、修補、部署、驗證，才是差距。

不過這篇也帶有供應商文章常見的張力：它一方面提出真實風險，另一方面自然導向 Palo Alto 自家的平台與服務。讀者應該把它當成一份強烈訊號，而不是照單全收的採購建議。真正可驗證的重點，是組織是否能量化自己的暴露面、修補速度、sensor coverage、MTTD、MTTR，以及 AI 進入攻防流程後這些指標是否真的改善。

對正在導入 agent 與 AI coding workflow 的團隊來說，這篇還有另一層提醒：AI 不只是提高開發效率，也會讓依賴、connector、skill、runtime、browser、endpoint 全部變成新的攻擊面。下一階段的工程成熟度，不只是「讓 agent 更會做事」，而是讓 agent 的權限、輸入、輸出、記憶、工具與網路行為都能被觀測、限制與回收。
