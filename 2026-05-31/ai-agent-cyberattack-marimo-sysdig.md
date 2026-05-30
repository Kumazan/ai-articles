---
title: "AI 對 AI 資安：LLM Agent 已開始主導入侵鏈"
description: "Tech Times 報導指出，Sysdig 捕捉到第一起由 LLM agent 即時主導的入侵鏈，從 Marimo 漏洞到資料庫外洩不到一小時，迫使防禦思維走向機器速度。"
date: 2026-05-31
author: Adrian Parham, Tech Times
layout: post
permalink: /2026-05-31/ai-agent-cyberattack-marimo-sysdig.html
---

<div class="hero-badge">Tech Times · 2026-05-30</div>

**原文連結：** [AI vs AI Cybersecurity: Sysdig Documents First LLM-Agent Intrusion in the Wild](https://www.techtimes.com/articles/317423/20260530/ai-vs-ai-cybersecurity-sysdig-documents-first-llm-agent-intrusion-wild.htm)

## 摘要

- Sysdig Threat Research Team 在 2026 年 5 月 10 日觀察到一條由 LLM agent 主導的 post-exploitation 入侵鏈，從 Marimo notebook 遭入侵到內部 PostgreSQL 資料庫被匯出，全程不到一小時。
- 攻擊者利用 CVE-2026-39987 取得公開 Marimo notebook 的 shell，接著擷取兩組 cloud credentials，透過 Cloudflare Workers 分散呼叫 AWS API，再拿到 SSH private key。
- 這個 agent 以 8 個平行 SSH session 連上 bastion server，在不到 2 分鐘內列舉 schema 並匯出內部 PostgreSQL database，顯示攻擊流程不再只是固定腳本。
- Sysdig 判斷這是 LLM agent 的四個跡象包括：即時推論未知 schema、規劃註解外洩、命令格式利於機器解析，以及把前一步輸出值帶入下一步。
- 文章指出，資安防禦不能再只依靠 signature 與人類速度；當攻擊鏈由 agent 即時組合，防禦也必須轉向行為偵測、全域 telemetry 與 AI 級自動化回應。

<div class="sep">· · ·</div>

過去二十年，資安團隊主要面對的是「人類攻擊者使用自動化工具放大能力」。這個模型正在過時。現在站在每個連網組織對面的，不只是「人類使用 AI 工具」，而是「AI agent 執行人類意圖」。這個轉變不是理論，而是已經被記錄、被標上時間戳、並公開報導的事件；它迫使 CISO、security engineer 與 software maintainer 重新思考防禦到底代表什麼。

Segura 的 chief security evangelist 與 advisory CISO Joe Carson 今年 4 月在 RSAC Conference 2026 對 Information Security Media Group 表示，資安產業已進入 AI 對 AI 的時代；人類越來越像 orchestrator，而不是 operator。這個 framing 很關鍵：人類負責編排，AI 負責操作。無論攻防兩端，資安團隊都必須面對這個策略轉向；如果沒有轉向，就不是在經營新時代的 security program，而是在用舊式作業方式對抗它本來就無法處理的新型對手。

證據在本週集中出現。5 月 28 日，Security Magazine 刊出對 Sysdig Threat Research Team Director Michael Clark 的訪談，談到他的團隊在 5 月 10 日捕捉到的一起入侵。在這起事件中，一名未知攻擊者讓 large language model agent 直接操作目標基礎設施。它不是 assistant，也不是 co-pilot，而是完整入侵鏈的自主 operator。這個 agent 自己做出每個 post-exploitation 決策、即時調整，從公開的 Python notebook 連續 pivot 四次，到完整匯出內部資料庫，總共不到一小時，過程中沒有人類逐條輸入命令。

同一週，Anthropic 也發布 Project Glasswing 第一個月的量化結果。那是把最強 frontier model 部署到防禦端、對抗同一類威脅的實驗。數字既驚人也令人警醒：防禦者正在建立能以人類團隊無法匹敵的規模與速度找出漏洞的 AI 系統；攻擊者也一樣。這場競賽已經明確展開，而且速度正在加快。

## 5 月 10 日的自主 AI 攻擊鏈

Sysdig 捕捉到的事件始於 CVE-2026-39987。這是 Marimo 的 critical pre-authentication remote code execution 漏洞；Marimo 是 AI researchers 與 data scientists 常用的 open-source Python notebook。這個漏洞不需要複雜 exploit kit：只要對暴露的 endpoint 發出單一 WebSocket request，就能取得互動式 shell。Marimo 維護者已在 0.23.0 版修補，但窗口已經打開。Sysdig 曾記錄到此漏洞在首次公開揭露後 9 小時 41 分鐘內被利用；光是 4 月 11 日到 4 月 14 日，就有來自 10 個國家、11 個 IP 的 662 次 exploit events。

5 月 10 日這起入侵和先前那些掃描、偵察不同。攻擊者透過 Marimo notebook 取得初始 access 後，一個 LLM agent 接手 post-exploitation。它從 environment files 擷取兩組 cloud credentials，接著透過 Cloudflare Workers edge nodes 的分散池重放這些憑證：22 秒內，12 次 AWS API call 分散在 11 個不同 IP 上，讓防禦方難以用單一來源 IP 做關聯偵測。隨後它從 AWS Secrets Manager 取得 SSH private key，開啟 8 個平行 SSH sessions 連到下游 bastion server，並在不到 2 分鐘內 dump 出內部 PostgreSQL database 的完整內容。

整條鏈花了略多於一小時。這個 agent 面對從未見過 schema 的目標，仍然即時組出一個 6 張表的 database dump。它在 live command stream 中留下中文規劃註解，意思是「看還能做什麼」；這比較像 LLM 訓練資料裡滲出的 artifact，而不是國家 attribution 的證據，因為 origin IP 追到的是印尼。每個命令都被格式化成適合機器消費的樣子：使用 delimiter、限制輸出長度、丟棄 stderr。agent 也把自己上一輪輸出餵回下一步，例如從剛讀出的檔案中拿 database password，再把剛列出的 SSH key path 用到下一個命令。

Clark 告訴 Security Magazine，這起攻擊顯示 LLM 正讓 threat actors 能執行越來越複雜的行動，而不只是邊緣上的簡單 opportunistic attacks。過去需要高技能 operator 的複雜入侵工作流，現在能被 AI 加速，甚至由 AI 直接推動，大幅降低進入門檻，也擴大潛在攻擊者池。

換句話說，門檻不再是專業能力，而是 inference budget。傳統 scripted attacker 需要先寫好 playbook，再重複用在新目標上；增加目標的成本是 engineering time。agent operator 則帶著對一類系統的通用先驗，針對眼前目標即時組合攻擊鏈。規模開始受到 compute 限制，而不是技能限制。

## 人類速度的防禦已經不匹配

Sysdig 這起入侵不是孤立事件，而是目前最具體、最有時間戳的例子，證實多家 threat intelligence 組織幾個月來描述的結構性轉變。

CrowdStrike 的 2026 Global Threat Report 顯示，2025 年 AI-enabled adversary operations 年增 89%。平均 attacker breakout time，也就是從 initial access 到 lateral movement 的時間，從前一年的 62 分鐘降到 29 分鐘；最快的已知 breakout 只花 27 秒。82% 的 detections 沒有傳統 malware：攻擊者使用 valid credentials、合法管理工具與商業 remote access utilities，把自己混進正常營運活動中，繞過每一條 signature-based detection rule。

82% malware-free 這個數字，是人類速度與 signature-based security 失效的核心。Signature 偵測的是已知模式；agent 則能在每個目標上組出新的模式。CrowdStrike CTO Elia Zaitsev 在 Anthropic 推出 Project Glasswing 時也說得很直白：從漏洞被發現到被 adversary 利用的窗口已經崩塌，過去可能花幾個月，現在 AI 讓它在幾分鐘內發生。

Cloud Security Alliance 對董事會層級的說法更直接：如果防禦策略沒有以 AI 為核心，就已經落後。過去針對每個問題買一套不同 solution 的時代正在結束。這背後的數學很殘酷：攻擊者不需要每次都贏，防禦者卻必須每次都守住。對沒有用等級相當能力回應的組織來說，AI 已經大幅把勝率推向攻擊方。

## AI 防禦堆疊開始成形

這場 arms race 並不是單方面的。防禦者也在建東西，而且其中一些成果相當驚人。問題是防禦端的 AI 部署仍不均衡、資源不足，而且多數組織仍在追趕先動的威脅。

目前最集中的 defensive AI deployment，是 Anthropic 的 Project Glasswing。它讓約 50 個經審核的 partner organizations 控制使用 Claude Mythos Preview，參與者包括 AWS、Apple、Cisco、Google、JPMorganChase、Microsoft、NVIDIA、CrowdStrike、Cloudflare 與 Palo Alto Networks。Claude Mythos Preview 是 Anthropic 最強 frontier model，因為尚無足夠 safeguard 可防止大規模濫用，所以沒有對一般使用者釋出。

Project Glasswing 第一個月的結果在 5 月 22 日發布，清楚展示 defensive AI 已經走到哪裡。Mythos Preview 在超過 1,000 個 open-source projects 中標出 23,019 個潛在漏洞，其中 6,202 個估計為 high 或 critical severity。獨立資安公司確認 1,726 個為有效 true positives；97 個已被 upstream 修補，88 個 advisories 已發布。Cloudflare 在自己的系統中找到 2,000 個 bugs，其中 400 個為 high 或 critical，而且 false-positive rate 低於傳統人類主導測試。Mozilla 則在 Firefox 150 找到並修補 271 個漏洞，是使用較早 Claude model 時的 10 倍。

其中一個確認案例是 WolfSSL 的 CVE-2026-5194，CVSS 9.1。它可能讓攻擊者 forged TLS certificates，並偽裝成銀行、email 等合法服務，影響估計 50 億台 IoT、automotive 與 industrial control devices。這個漏洞是在攻擊者找到以前先由 AI 發現。另一個 Glasswing partner bank 則用 Mythos 在執行過程中偵測並阻擋一筆 150 萬美元的詐騙 wire transfer。

Autonomous offensive security platform XBOW 也獨立評估 Mythos Preview，認為它在找 vulnerability candidates 上比先前模型大幅進步，也能以 security mindset 分析 source code；XBOW 還表示，依 token-for-token 計算，它達到前所未有的 precision。

OpenAI 方面，在 Sysdig 記錄到攻擊的同一天，OpenAI 推出 Daybreak，結合 GPT-5.5、GPT-5.5-Cyber 與 Codex Security agentic framework，把漏洞發現、patch validation 與 automated remediation 嵌進 developer pipelines。最強的 GPT-5.5-Cyber 僅提供給通過 OpenAI Trusted Access for Cyber identity verification 的防禦者。5 月 27 日，OpenAI 也透過 Government Trusted Access for Cyber initiative，把 program 擴展到 South Korea 與 Japan；這是繼 United States 與 Canada 後第三、第四個取得 access 的國家。

Google 也有 Big Sleep 與 CodeMender。Big Sleep 是 Google DeepMind 與 Project Zero 的合作，在 2025 年中做到此前 defensive system 沒做到的事：它找出 SQLite 的 live zero-day vulnerability（CVE-2025-6965），當時 threat actors 已知該漏洞並準備利用，Big Sleep 在任何攻擊發動前就先標出問題。Google 說這是 AI agent 直接阻止 live zero-day exploit 的首次案例。Google 同時測試 CodeMender，這是一個 experimental agent，使用 Gemini 的 reasoning capabilities 自動修補 critical code vulnerabilities，讓防禦從 discovery 進一步走向 autonomous remediation。

Microsoft 在 RSAC 2026 則把 Security Copilot 擴展成完整 agentic SOC platform。Security Alert Triage Agent 找出 malicious alerts 的速度是單靠 human analysts 的 6.5 倍；Security Analyst Agent 會跨 Defender 與 Sentinel telemetry 做 multi-step investigations。Microsoft 也指出 autonomous AI attacks 在五個面向取得不成比例優勢：patching speed、open-source software exposure、customer source code review、internet-facing attack surface，以及 baseline security hygiene，並針對這些面向打造 agentic tooling。

CrowdStrike 與 IBM 則把 Charlotte AI 與 IBM Autonomous Threat Operations Machine 整合，目標是 machine-speed investigation and containment，讓 endpoint、identity 與 cloud environments 之間能協同 AI response，縮短 29 分鐘 attacker breakout time 與傳統人類團隊需數小時或數天才偵測、圍堵 breach 的落差。

## 對偵測架構的真正含義

Sysdig 事件的操作層意義，不只是「修補 Marimo」。當然，任何還在跑 Marimo 0.20.4 或更早版本的組織都應立刻升級到 0.23.0，並輪換該環境可存取的 credentials、API keys 與 SSH keys。CVE-2026-39987 已列入 CISA Known Exploited Vulnerabilities catalog，聯邦 remediation deadline 也已過。

更深層的含義是：偵測架構必須重建。agent-driven attacks 不會在不同目標上重複相同模式，所以 signature-based detection 會快速退化。沒有固定 User-Agent、沒有固定 command order、沒有相同 probe sequence，也沒有可預測 timing。能在這個轉變中留下來的偵測面，會建立在攻擊者「想達成什麼」上，例如讀取 credentials、列舉 secrets、升級到 bastion、匯出 database，而不是它具體用了哪串命令。

Palo Alto Networks Unit 42 在 2026 年 5 月的 Frontier AI Defense update 中也明確指出，autonomous AI-driven attacks 需要 autonomous AI-driven detection；SOC 必須能在個位數分鐘內完成 mean time to detect and respond，才跟得上。

這場 arms race 也延伸到多數 security teams 還沒完全處理的領域：AI development supply chain 本身。Google Threat Intelligence Group 在 5 月報告中指出，threat actors 越來越常攻擊的不是 frontier models 本身；那些模型直接被 compromise 的難度仍高。更常被打的是模型周邊 orchestration layers：open-source wrapper libraries、API connectors 與 skill configuration files。AI development 創造出的 attack surface，本身也成了 attack vector。

Gartner 對下游風險給出一個數字：到 2028 年，AI-generated code 造成的 software defects 預計增加 2,500%。組織在一年內因熱情擁抱 AI-assisted development，可能創造出相當於過去十年 conventional technical debt 的存量：未審查 code、未 audit dependencies、未驗證 integrations。這些同時會成為 AI attackers 掃描的 surface，也成為 AI defenders 必須搶先找出的 liability。

## Security leaders 現在該改變什麼

轉向 AI vs AI 不是可選項，也不是未來狀態。它已經是每個連網組織的現況。

第一個優先事項是認知層面的：不要再把 human-speed incident response 當成主要框架。幾天內 patch、幾週內調查，已經無法對準能在不到一小時內從 initial access 走到 database exfiltration 的對手。每一條 response SLA 都應對照 29 分鐘 breakout benchmark 重估，而不是沿用 quarterly patch cycle。

第二個優先事項是架構層面的：部署 behavioral detection，找 agent-pattern attack signatures，而不是只看 known-malware signatures。機器格式化的 command streams、來自分散 IP 的 parallel session launches、adaptive schema enumeration，以及把前一步輸出值交給下一步的 self-referential value handoffs，都是 LLM-agent intrusions 的 fingerprint；Sysdig report 已經把它們記得很清楚。

第三個優先事項是縮小 surface：把每個可從 internet 連到的 developer tool、notebook server、research environment 與 AI pipeline component，都當成 production-grade attack surface。Marimo 攻擊不是異常，而是研究環境同時具備網路 access 與 cloud credentials 後的合理後果。任何這樣的環境，只要未 patch、未監控，都可能成為 agent 的一小時 pivot device。

第四個優先事項是 tooling：評估並部署 AI-class defensive tools。Project Glasswing 的早期結果顯示，frontier AI 找漏洞的速率是傳統 human-led methods 的 10 倍。這個落差會雙向發生。具備同等能力的攻擊者會找到你沒 patch 的東西；沒有同等能力的防禦者，patch 速度會比攻擊者慢。這個 gap 已經可量測，而且正在擴大。

2026 年 5 月 10 日的 Marimo 入侵，不只是某個漏洞的警告。它證明資安界過去以理論方式討論的 paradigm shift，已經在真實操作中發生。每個 CISO 與 security team 要問的，不再是 AI-vs-AI cybersecurity 會不會來，而是自己的防禦是否已經為它準備好。

## 常見問題

**什麼是 AI vs AI cybersecurity？為什麼現在重要？**

AI vs AI cybersecurity 指的是攻擊者與防禦者都開始部署 autonomous AI agents，而不是依賴 human operators 執行 scripts 或 tools。它之所以現在重要，是因為 Sysdig 記錄到 2026 年 5 月 10 日的攻擊，公開證明 LLM agent 已能在沒有人類逐步指揮的情況下，操作完整 post-exploitation intrusion chain。再加上 CrowdStrike 2026 report 顯示平均 attacker breakout time 已降到 29 分鐘，AI-enabled adversary operations 年增 89%，人類速度防禦在結構上不再匹配，已不是理論問題。

**AI agents 現在如何被用在 cyberattacks？**

AI agents 正被用作 autonomous post-exploitation operators：它們讀取每個命令的輸出，即時決定下一步，並在遇到未知 schema、缺少檔案或 authentication failure 時調整策略。Sysdig 觀察到的入侵中，LLM agent 擷取 credentials、pivot 到 AWS Secrets Manager、開啟平行 SSH sessions，並在不到一小時內匯出 database，全程沒有人類在 loop 中逐步操作。CrowdStrike 也記錄到 AI-generated malware、AI-accelerated credential dumping 與 AI-scaled insider recruitment operations。

**防禦者正在用哪些 AI tools 對抗 AI-powered attacks？**

主要 defensive AI deployments 包括 Anthropic 的 Claude Mythos Preview 與 Project Glasswing。這套系統限制約 50 個 vetted partners 使用，第一個月就在 1,000 多個 open-source projects 中找到 6,202 個 high 與 critical-severity vulnerabilities。OpenAI 的 Daybreak platform 則為 verified defenders 提供 GPT-5.5-Cyber，用於 vulnerability triage、red-teaming 與 patch validation。Google Big Sleep 已主動阻止 live zero-day exploit，Google 也正在測試 CodeMender 做 autonomous patching。Microsoft Security Copilot 找出 malicious alerts 的速度是 human analysts 的 6.5 倍；CrowdStrike Charlotte AI 與 IBM autonomous SOC platform 則負責 machine-speed detection and containment。

**AI attackers 比人類防禦者快多少？這對組織代表什麼？**

CrowdStrike 2026 Global Threat Report 顯示，eCrime attacker average breakout time 已從前一年的 62 分鐘降到 29 分鐘，最快 breach record 只花 27 秒。Sysdig 記錄到的 AI-agent intrusion 從 initial access 到 database exfiltration 不到一小時。相比之下，IBM 2026 Cost of a Data Breach Report 顯示，平均 incident lifecycle 仍超過 200 天。實務含義是：所有以人類速度調查與 remediation 為基礎的 response SLA，都已不再對準這類 threat。組織必須評估現有 detection and response stack 是否能以 machine speed 運作；如果不能，就要思考哪些 AI-class defensive tooling 能補上落差。

<div class="sep">· · ·</div>

## Agent 安全的核心問題是「誰能下指令」

這篇文章最重要的訊號，不是「AI 會讓資安攻擊變快」這種已經講了很久的抽象說法，而是它把 agent 時代的攻擊模型落到很具體的層次：攻擊鏈不再只是預先寫好的腳本，而是模型在讀取環境輸出後，即時決定下一步要做什麼。

對真的在做 agent 的人來說，這個差異非常大。傳統自動化工具的風險主要來自程式本身怎麼寫；agent harness 的風險則來自「哪些外部文字、log、stdout、file content、API response 會被視為可行動的上下文」。如果 agent 可以把任何觀察到的內容升格成下一步行動依據，那麼資料、提示、錯誤訊息與攻擊面之間的界線會變得非常薄。

文章的另一個盲點是，它把防禦方向幾乎推向「也用 AI 對抗 AI」。這在速度上合理，但不能只靠更強模型來解。真正需要被工程化的是權限邊界、可觀測性、環境隔離、憑證生命週期與 human approval policy。否則防禦端 agent 也可能變成另一個高速、自信、但權限過大的 automation layer。

更務實的結論是：agent 系統要把 stdout、第三方文件、repository content、issue 討論與網頁內容全部視為 untrusted input；真正被授權的目標，必須來自人類或受控 workflow，而不是模型在環境裡讀到的任何字串。這不是單純多加一次 confirmation，而是整個 agent architecture 要能區分 observation、instruction、policy 與 permission。
