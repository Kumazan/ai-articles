---
title: "OpenAI 如何安全部署 Codex：企業 coding agents 的控制面"
description: "OpenAI 分享內部部署 Codex 的安全控制：透過 sandbox、核准政策、網路規則與 agent-native telemetry，讓 coding agents 在企業環境中可審計、可治理地運作。"
date: 2026-05-09
author: OpenAI
image: /2026-05-09/og-running-codex-safely-openai.png
layout: post
permalink: /2026-05-09/running-codex-safely-openai.html
---

<div class="hero-badge">OpenAI · 2026-05-08</div>

![](/ai-articles/2026-05-09/og-running-codex-safely-openai.png)

**原文連結：** [Running Codex safely at OpenAI](https://openai.com/index/running-codex-safely/)

## 摘要

- OpenAI 說明內部如何部署 Codex：核心目標是讓 agent 留在清楚的技術邊界內，低風險動作保持順暢，高風險動作必須明確停下來接受審查。
- Codex 的安全控制由 sandbox 與 approval policy 共同構成，前者限制可寫入路徑、網路存取與受保護區域，後者決定哪些動作需要人工核准。
- OpenAI 使用 Auto-review mode 讓低風險核准請求可由 auto-approval subagent 自動通過，減少日常開發流程被打斷的次數。
- Codex 不具備開放式 outbound access；OpenAI 用 managed network policy 允許預期目的地、阻擋不想讓 Codex 連到的目的地，並要求陌生網域先經核准。
- Codex 的 CLI 與 MCP OAuth 憑證存在安全的 OS keyring 中，登入強制經由 ChatGPT，並綁定 OpenAI 的 ChatGPT enterprise workspace。
- OpenAI 透過 OpenTelemetry 與 Compliance Platform 保留 user prompts、tool approval decisions、tool execution results、MCP server usage、network proxy allow/deny events 等 agent-native logs，供安全稽核與營運調校使用。

<div class="sep">· · ·</div>

隨著 AI 系統變得更有能力，它們也越來越常代表使用者採取行動。Coding agents 可以自主檢視 repositories、執行 commands，並和開發工具互動。這些任務過去都需要人類直接執行。

在 Codex 中，OpenAI 一開始就把這些能力與組織安全部署所需的 controls 一起設計。Security teams 需要能治理 agents 如何運作：它們可以存取什麼、什麼時候需要 human approval、可以和哪些 systems 互動，以及有哪些 telemetry 可以解釋它們的行為。

在 OpenAI 內部部署 Codex 時，目標很清楚：把 agent 留在明確的技術邊界內，讓開發者在低風險動作上能快速前進，並讓較高風險的動作變得明確可見。OpenAI 也保留 agent-native telemetry，以理解並稽核 agent 做了什麼。實務上，這代表受管理的設定、受限制的執行環境、network policies，以及 agent-native logs。

## 控制 Codex 如何運作

OpenAI 部署 Codex 時遵循一個簡單原則：agent 應該在有邊界的環境內保持生產力；低風險的日常動作應該順暢；較高風險的動作則必須停下來接受 review。

Approvals 與 sandboxing 會一起運作。Sandbox 定義技術執行邊界，包括 Codex 可以在哪裡寫入、是否能連到網路，以及哪些 paths 保持受保護。Approval policy 則決定 Codex 何時必須請求核准，例如它需要做 sandbox 外的事情時。使用者可以針對單次動作核准，也可以在該 session 中核准同類型動作。

對 routine approval requests，OpenAI 使用 Auto-review mode。這個功能開啟後，會自動核准某些類型的請求，減少使用者停下來核准 Codex 動作的頻率。Codex 會把計畫中的 action 與近期 context 送給 auto-approval subagent；這個 subagent 可以自動核准低風險動作，而不是打斷使用者。這讓 Codex 能繼續處理日常工作，同時仍會在較高風險或可能產生非預期後果的動作上停下來。

OpenAI 不會讓 Codex 具備開放式 outbound access。OpenAI 的 managed network policy 允許預期目的地，阻擋 OpenAI 不希望 Codex 連到的目的地，並要求 unfamiliar domains 先取得核准。這讓 Codex 可以完成常見且已知安全的 workflows，同時不取得寬鬆的 network access。

OpenAI 也管理 Codex 的 authentication 方式。CLI 與 MCP OAuth credentials 會存放在安全的 OS keyring；登入會強制經由 ChatGPT；存取則固定綁定到 OpenAI 的 ChatGPT enterprise workspace。這讓 Codex 使用情況能連到 workspace-level controls，也讓 Codex activity 出現在 OpenAI enterprise workspace 的 ChatGPT Compliance Logs Platform 中。

OpenAI 使用 rules，避免 Codex 把每個 shell command 都視為同等安全。工程師日常開發會用到的常見 benign commands 可以在 sandbox 外不經核准執行；特定 dangerous commands 則可被封鎖或要求核准。這讓 Codex 能快速完成一般工程任務，同時仍會對 OpenAI 不希望在 sandbox 外執行的 patterns 強制 review 或直接封鎖。

OpenAI 透過 cloud-managed requirements、macOS managed preferences，以及 local requirements files 的組合套用這套 posture。Requirements 是 admin-enforced controls，使用者不能覆寫。macOS managed preferences 與 local requirements files 則讓 OpenAI 可以維持一致 baseline，同時仍能依 team、user group 或 environment 測試不同 configuration。這些設定會套用到 local Codex surfaces，包括 desktop app、CLI 與 IDE extension。

## Agent-native telemetry 與 audit trails

Control 只是工作的一半。Agents 部署後，security teams 還需要 visibility，知道這些 agents 正在做什麼，以及為什麼這麼做。傳統 security logs 在查看 Codex 採取的 actions 時仍然有用，但它們大多只能回答「發生了什麼」：某個 process 啟動、某個 file 被修改、某個 network connection 被嘗試。Defenders 仍得自行推斷 Codex 為什麼這麼做，或使用者原本的 intent 是什麼。

Codex 可以給 security teams 更具 agent-awareness 的 view。Codex 支援針對多種 Codex events 匯出 OpenTelemetry logs，例如 user prompts、tool approval decisions、tool execution results、MCP server usage，以及 network proxy allow or deny events。Enterprise 與 Edu customers 也可以透過 OpenAI Compliance Platform 取得 Codex activity logs。

在 OpenAI 內部，Codex logs 會和 OpenAI 的 AI-powered security triage agent 搭配使用。當 endpoint alert 顯示 Codex 做了不尋常的事，endpoint security tool 會告訴 OpenAI 發生了可疑事件；Codex logs 則協助解釋使用者與 agent 周遭的 intent。AI security triage agent 會使用 Codex logs 檢查原始 request、tool activity、approval decisions、tool results，以及任何 relevant network policy decision 或 block。AI security triage agent 接著會把分析交給 security team review，以區分 expected agent behavior、benign mistakes，以及真正需要 escalation 的 activity。

OpenAI 也把同一份 telemetry 用於 operational purposes。這些 logs 可用來理解內部 adoption 如何變化、哪些 tools 與 MCP servers 正在被使用、network sandbox 多常阻擋或提示，以及 rollout 還需要在哪裡調校。這些 OpenTelemetry logs 可以集中到 SIEM 與 compliance logging systems 中。

## 往前看

隨著 Codex 這類 coding agents 逐漸整合進 development workflows，security teams 需要專門為管理這種轉變而設計的 tools。Codex 提供 control surfaces、configuration management、sandboxing，以及詳細且具 agent-awareness 的 telemetry，讓組織能安全採用 agents。有了這些能力，security teams 就能更有信心地啟用 Codex，在 developer productivity 與 enterprise security 所需的 visibility and control 之間取得平衡。

更多關於設定 Codex 的資訊可參考 [Codex configuration documentation](https://developers.openai.com/codex/config-basic)，Compliance API 的資訊可參考 [OpenAI Compliance Platform for Enterprise and Edu customers](https://help.openai.com/en/articles/9261474-openai-compliance-platform-for-enterprise-and-edu-customers)。

<div class="sep">· · ·</div>

## 延伸評論：企業部署 agent 的關鍵不是更聰明，而是可治理

這篇最值得看的地方，不是 OpenAI 宣稱 Codex 能做多少事，而是它把 coding agent 當成一個需要治理的企業系統來處理。Sandbox、approval policy、network policy、credentials、logs、SIEM、Compliance Platform，這些聽起來不如模型能力發布吸睛，卻是真正決定 agent 能否進入大型組織日常工作流的基礎。

對開發者來說，這也提醒了一件事：agent 安全不是單一「開或關」設定，而是一組分層控制。低風險操作需要低摩擦，否則 agent 失去效率；高風險操作需要清楚停下來，否則它很快會變成不可預期的自動化權限放大器。Auto-review mode 的設計尤其值得注意，因為它承認人工核准本身也會成為瓶頸，所以把「哪些請求可自動通過」也變成可治理的政策問題。

但這篇也留下幾個沒有完全回答的問題。第一，auto-approval subagent 的判斷品質本身如何被評估與防護？第二，當 Codex logs 包含 prompts、tool results 與 approval decisions 時，企業如何在可稽核性與開發者隱私之間取得平衡？第三，managed network policy 與 local requirements files 在大型、異質環境中要如何避免設定漂移？這些問題不會降低文章價值，反而說明下一階段 agent platform 的競爭，會從「誰比較會寫 code」推進到「誰能把 agent 放進真實組織而不失控」。
