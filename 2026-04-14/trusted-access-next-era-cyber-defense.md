---
title: "OpenAI 把資安防禦做成分級通行證，GPT-5.4-Cyber 上場"
description: "OpenAI 擴大 Trusted Access for Cyber，讓驗證過的防禦者可使用 GPT-5.4-Cyber，並以分級授權、KYC 與更少拒答邊界把資安能力推向實戰。"
date: 2026-04-14
author: OpenAI
layout: post
permalink: /2026-04-14/trusted-access-next-era-cyber-defense.html
image: /2026-04-14/og-trusted-access-next-era-cyber-defense.png
---

<div class="hero-badge">AI News · 2026-04-14</div>

![](/ai-articles/2026-04-14/og-trusted-access-next-era-cyber-defense.png)

**原文連結：** [Trusted access for the next era of cyber defense](https://openai.com/index/scaling-trusted-access-for-cyber-defense/)

## 摘要

- OpenAI 把 Trusted Access for Cyber 擴大到數千名驗證過的個人防禦者、以及數百個團隊
- 新的 GPT-5.4-Cyber 是一個更偏向資安防禦、拒答邊界更低的 GPT-5.4 變體
- 核心策略有三個，分別是普及可近性、漸進式部署、以及投資整個資安生態系的韌性
- OpenAI 明說，資安風險早就存在，而且會隨著模型能力提升而一起加速
- 取得更高階權限的方式，會更依賴 KYC、身分驗證與可觀察的信任訊號
- 這篇文章其實在宣告一件事，未來的 AI 資安能力會被更細緻地分層發放

<div class="sep">· · ·</div>

OpenAI 這次是在擴大 Trusted Access for Cyber（TAC）計畫，目標對象是數千名經過驗證的個人防禦者，以及數百個負責保護關鍵軟體的團隊。它想做的，不只是把工具放出去，而是把資安能力做成一套可控、可驗證、可分級的存取系統。

官方也直接點名，接下來幾個月模型會變得更強，所以從今天開始，OpenAI 會針對防禦性資安用途，持續微調模型。第一個登場的是 GPT-5.4-Cyber，這是一個 GPT-5.4 的變體，專門為資安工作調整，拒答邊界更低，讓合法防禦工作更容易做。

OpenAI 把自己的做法整理成三個原則。

- **Democratized access**：盡量讓更多合法防禦者都能用到工具，但同時要防止濫用。OpenAI 認為，不該靠主觀判斷決定誰能用，而是要靠明確、客觀的標準，像是強化版 KYC 與身分驗證。
- **Iterative deployment**：先小心丟到世界裡，再一邊觀察、一邊修正。它們想持續理解不同模型的能力差異、風險差異、對 jailbreak 與對抗式攻擊的韌性，然後同步調整防護。
- **Investing in ecosystem resilience**：不只自己做模型，也要支持整個防禦社群，包含 trusted access、資助計畫、開源資安倡議，以及像 Codex Security 這類幫忙大規模找洞、補洞的工具。

OpenAI 也把時間線交代得很清楚。從 2023 年開始，它們就透過 Cybersecurity Grant Program 支援防禦者，並在同年開始評估模型的資安能力。到了 2025 年，它們把資安專用的安全機制納入模型部署；早些時候又推出了 Codex Security，讓它能在程式碼庫中主動找出漏洞並提出修補建議。

這次文章特別強調幾個觀點。

第一，資安風險不是未來才會出現，而是早就存在，現在只是被模型能力放大。第二，風險不只看模型本身，也看使用者、信任訊號、和給了多少權限。第三，OpenAI 認為，不能等到某個「未來門檻」才開始管制，因為攻防競賽已經在跑了。

它們也很直白地說，想要讓高階防禦能力真正落地，就需要更自動化、更客觀的驗證方式。換句話說，未來不太可能是「誰想用就直接開」，而是要看你是誰、你要拿來做什麼、你能不能被驗證成可信的防禦者。

在產品層面，OpenAI 這次也把門檻講得很清楚。

- 個人使用者可以到 `chatgpt.com/cyber` 驗證身分
- 企業可以透過 OpenAI 業務窗口申請 trusted access
- 通過最高層級審核的客戶，可以拿到 GPT-5.4-Cyber
- 這個版本會降低合法資安工作上的拒答邊界，並支援更進階的防禦流程，包含 binary reverse engineering
- 對於像 ZDR（Zero-Data Retention）這種看不到使用內容的場景，OpenAI 也明講會更保守

最後，這篇文章其實是在替未來幾代模型鋪路。OpenAI 認為，現在這套防護已經足夠支撐更廣泛的部署，但面對更強的新模型，還是要有更完整的防禦框架。資安能力會繼續提升，防護也必須跟著一起升級。

<div class="sep">· · ·</div>

## 延伸評論：資安正在被金融化、分級化

這篇最有意思的地方，不是又一個「我們很重視安全」聲明，而是它把資安能力正式產品化成分級服務。能不能用、能用到哪一層、誰能拿到更少限制的版本，開始變成像雲端額度一樣可管理的東西。

這會讓防禦者更有效率，也會讓門檻更清楚，但同時代表資安能力會更集中在少數平台手上。對真的在做防禦的人來說，這很實用；對整個生態系來說，這也意味著新的依賴關係正在形成。
