---
title: "Kimi K2.6：開源 coding、長流程 agent 與 swarm 都往前推了一大步"
description: "Kimi K2.6 開源上線，主打長流程 coding、前端設計、agent swarm 與主動式代理，並用多項基準與實戰案例展示它對複雜多步驟工作流的野心。"
date: 2026-04-21
author: Kimi
layout: post
permalink: /2026-04-21/kimi-k26-open-source-coding.html
image: /2026-04-21/og-kimi-k26-open-source-coding.png
---

<div class="hero-badge">AI News · 2026-04-21</div>

![](/ai-articles/2026-04-21/og-kimi-k26-open-source-coding.png)

**原文連結：** [Kimi K2.6 Tech Blog: Advancing Open-Source Coding](https://www.kimi.com/blog/kimi-k2-6)

## 摘要

- Kimi K2.6 以開源方式推出，主打 coding、長流程執行、agent swarm 與主動式代理
- 官方把重點放在「真的能一路做完」的任務，而不是只會短答幾句的模型
- 在長流程 coding 實例裡，K2.6 能連續跑 12 小時、4,000+ 次 tool calls，並把吞吐從約 15 tokens/sec 拉到 193 tokens/sec
- 在另一個 13 小時的 exchange-core 優化案例中，它改動 4,000+ 行程式，做了 1,000+ 次 tool calls，帶來 185% 與 133% 的吞吐提升
- 它也把設計、前端、全端、視覺素材與工具呼叫串成一個工作流，試圖讓 prompt 直接變成可交付的產品
- 這篇真正的訊號是，開源模型競爭已經從「單次能力」轉向「長時間穩定做事的可靠度」

<div class="sep">· · ·</div>

Kimi K2.6 這次不是只丟一個新模型數字，而是直接把「開源 coding 與 agent 工作流」當成主戰場。它可透過 Kimi.com、Kimi App、API 和 Kimi Code 使用，並把重點放在長流程執行、工具呼叫品質，以及多代理協作。

官方想回答的問題很明確, 不是模型會不會寫一小段程式，而是它能不能真的把一個複雜任務一路做完，還能持續維持品質。

## 長流程 coding：真的做完，比單次答對更重要

K2.6 的第一個核心主張，是它在長流程 coding 任務上有明顯進步，而且能跨語言與跨任務泛化，像 Rust、Go、Python、前端、DevOps、效能優化都能碰。

官方舉了一個很硬的例子，它成功在 Mac 上下載並部署 Qwen3.5-0.8B，還用 Zig 去做推論優化。整個過程超過 4,000 次 tool calls、連續跑了 12 個多小時、迭代 14 次，把吞吐從大約 15 tokens/sec 提升到 193 tokens/sec，最後還比 LM Studio 快約 20%。

在 Vercel 的 Next.js benchmark 上，官方也說 K2.6 有超過 50% 的提升。

另一個案例更誇張，K2.6 自動重構了 exchange-core，一個已經跑了 8 年的開源撮合引擎。它在 13 小時內做了 1,000+ 次 tool calls，修改超過 4,000 行程式，還分析 CPU 與 allocation flame graphs，最後把核心 thread topology 從 4ME+2RE 改成 2ME+1RE。結果是中位吞吐提升 185%，從 0.43 拉到 1.24 MT/s，performance throughput 也從 1.23 衝到 2.86 MT/s。

這種案例傳達的訊號很清楚，K2.6 想證明自己不是「會寫 code」，而是「會把 code 做到可交付」。

## Coding 驅動設計：prompt 直接長成介面

K2.6 的第二個重點，是它能把簡單 prompt 直接變成完整前端介面，而且不是只有版面，而是會主動做出有設計感的 hero section、互動元素、甚至 scroll-triggered 動畫。

官方也把 image / video 生成工具一起接進這個流程，讓它不只會產程式碼，還能產出視覺一致的素材，提升首頁與落地頁的整體品質。

更往前一步，它還能延伸到簡單全端流程，從 authentication、使用者互動到 database 操作都能處理，適合交易紀錄、session management 這類輕量全端場景。

換句話說，K2.6 想做的不是單純 code assistant，而是把「設計、前端、後端、素材」串成一條可以直接出成果的鏈。

## Agent Swarms：把任務拆開，同時並行

Kimi 把 agent swarm 當成另一個主軸。它的想法不是只把模型放大，而是把任務拆成多個子任務，交給不同專長的子代理並行處理。

K2.6 的 swarm 版本號稱可以把 broad search、deep research、文件分析、長文寫作、多格式內容生成一起組合起來，最後一次交付文件、網站、簡報或試算表。

官方也把規模拉得更大，說它可以同時協調最多 300 個 sub-agents、4,000 個協作步驟。相較之下，K2.5 只有 100 個 sub-agents、1,500 個步驟。這代表它想解決的不是「一次回答」的問題，而是長鏈式工作流的 latency 和品質。

它甚至能把高品質的 PDF、試算表、簡報和 Word 文件轉成 Skills，保留文件的結構與風格 DNA，讓後續任務可以沿用相同的做事方式。

## 主動式代理：讓 AI 自己盯工作

K2.6 也把自己定位成能持續運作的 proactive agent，特別是像 OpenClaw、Hermes 這種需要跨應用、長時間執行的系統。

官方給了一個很典型的場景，RL infra 團隊用一個 K2.6 agent 自動跑了 5 天，處理監控、incident response 與系統操作，顯示它不是只能陪聊，而是可以在背景裡持續幹活。

這類任務真正重要的是，模型要能維持上下文、拆解多線程任務，還要在出錯時繼續往下修正，而不是只在第一輪看起來很厲害。

## 帶著你自己的代理一起上

K2.6 的最後一層敘事，是 Claw Groups research preview。這裡的核心概念很像「帶著你自己的 agents 一起工作」，而不是把所有東西都塞進單一聊天框。

它支援來自不同裝置、不同模型、不同工具包、不同記憶上下文的 agents，一起在共享空間裡協作。K2.6 充當 coordinator，負責依照技能與工具分派任務，遇到失敗時重分配或重建子任務，直到交付完成。

這其實是在押一個很大的方向，未來不是「人問 AI」，而是「人和多個 AI 一起組隊做事」。

## Benchmark 重點

Kimi 在文末放了一大串 benchmark，重點不是單一分數，而是它想證明自己在 agentic、coding、reasoning、vision 幾個面向都能打。

在 CodeBuddy 的內部評估裡，K2.6 相較 K2.5 的 code generation accuracy 提升 12%，long-context stability 提升 18%，tool invocation success rate 來到 96.60%。

幾個比較醒目的數字：

- Agentic / general：HLE-Full w/ tools 54.0，BrowseComp 83.2，DeepSearchQA 92.5，OSWorld-Verified 73.1
- Coding：Terminal-Bench 2.0 66.7，SWE-Bench Pro 58.6，SWE-Bench Verified 80.2，SWE-Bench Multilingual 76.7
- Reasoning：AIME 2026 96.4，HMMT 2026 92.7，GPQA-Diamond 90.5

整體看起來，它在多項任務上都具備和 GPT-5.4、Claude Opus 4.6、Gemini 3.1 Pro 正面競爭的姿態，尤其是在長流程與工具呼叫相關場景。

### Benchmark 表補充

- General / Agentic：HLE-Full w/ tools 54.0 / 52.1 / 53.0 / 51.4 / 50.2；BrowseComp 83.2 / 82.7 / 83.7 / 85.9 / 74.9；BrowseComp (agent swarm) 86.3 / — / — / — / 78.4
- General / Agentic：DeepSearchQA (f1-score) 92.5 / 78.6 / 91.3 / 81.9 / 89.0；DeepSearchQA (accuracy) 83.0 / 63.7 / 80.6 / 60.2 / 77.1；WideSearch (item-f1) 80.8 / — / — / — / 72.7
- General / Agentic：Toolathlon 50.0 / 54.6 / 47.2 / 48.8 / 27.8；MCPMark 55.9 / 62.5* / 56.7* / 55.9* / 29.5；Claw Eval (pass^3) 62.3 / 60.3 / 70.4 / 57.8 / 52.3；Claw Eval (pass@3) 80.9 / 78.4 / 82.4 / 82.9 / 75.4
- General / Agentic：APEX-Agents 27.9 / 33.3 / 33.0 / 32.0 / 11.5；OSWorld-Verified 73.1 / 75.0 / 72.7 / — / 63.3
- Coding：Terminal-Bench 2.0 (Terminus-2) 66.7 / 65.4* / 65.4 / 68.5 / 50.8；SWE-Bench Pro 58.6 / 57.7 / 53.4 / 54.2 / 50.7；SWE-Bench Multilingual 76.7 / — / 77.8 / 76.9* / 73.0；SWE-Bench Verified 80.2 / — / 80.8 / 80.6 / 76.8
- Coding：K2.6 相較 K2.5 在部分基準與 side-by-side comparisons 上約 +15%
- Coding：SciCode 52.2 / 56.6 / 51.9 / 58.9 / 48.7；OJBench (python) 60.6 / — / 60.3 / 70.7 / 54.7；LiveCodeBench (v6) 89.6 / — / 88.8 / 91.7 / 85.0
- Reasoning & Knowledge：HLE-Full 34.7 / 39.8 / 40.0 / 44.4 / 30.1；AIME 2026 96.4 / 99.2 / 96.7 / 98.3 / 95.8；HMMT 2026 (Feb) 92.7 / 97.7 / 96.2 / 94.7 / 87.1；IMO-AnswerBench 86.0 / 91.4 / 75.3 / 91.0* / 81.8；GPQA-Diamond 90.5 / 92.8 / 91.3 / 94.3 / 87.6
- Vision：MMMU-Pro 79.4 / 81.2 / 73.9 / 83.0* / 78.5；MMMU-Pro w/ python 80.1 / 82.1 / 77.3 / 85.3* / 77.7；CharXiv (RQ) 80.4 / 82.8* / 69.1 / 80.2* / 77.5；CharXiv (RQ) w/ python 86.7 / 90.0* / 84.7 / 89.9* / 78.7；MathVision 87.4 / 92.0* / 71.2* / 89.8* / 84.2；MathVision w/ python 93.2 / 96.1* / 84.6* / 95.7* / 85.0；BabyVision 39.8 / 49.7 / 14.8 / 51.6 / 36.5；BabyVision w/ python 68.5 / 80.2* / 38.4* / 68.3* / 40.5；V* w/ python 96.9 / 98.4* / 86.4* / 96.9* / 86.9

### 評測設定補充

- Kimi K2.6 與 Kimi K2.5 使用 thinking mode，Claude Opus 4.6 使用 max effort，GPT-5.4 使用 xhigh reasoning effort，Gemini 3.1 Pro 使用 high thinking level
- 除非另有說明，Kimi K2.6 實驗都用 temperature = 1.0、top-p = 1.0、context length = 262,144 tokens
- 沒有公開分數的 benchmark 會在相同條件下重跑，並以 * 標示
- HLE 與其他 reasoning 任務的最大生成長度是 98,304 tokens；HLE text-only subset 為 36.4%（without tools）與 55.5%（with tools）
- HLE-Full with tools 的最大生成長度是 262,144 tokens，每一步上限 49,152 tokens
- BrowseComp 使用 discard-all 的 context management；WideSearch 使用 "hide tool result" 的 context management
- Claw Eval 版本是 1.1，max-tokens-per-step = 16384
- APEX-Agents 評估了公開 480 題中的 452 題，排除 Investment Banking Worlds 244 與 246
- Coding 任務的分數平均來自 10 次獨立執行
- Vision benchmark 的 max-tokens = 98,304，avg@3；帶 Python tool 的設定使用 max-tokens-per-step = 65,536、max-steps = 50
- MMMU-Pro 採用官方流程，保留輸入順序並在前面加圖像

## 延伸評論：真正的戰場已經不是「會不會答題」

這篇最值得注意的地方，不是又多了一個開源模型，而是它很明確地把焦點放在「長流程可靠性」上。這是 agent 真正卡住的地方，因為能不能連續做 12 小時，比能不能漂亮回一題更接近真實工作。

另一個值得注意的訊號，是 Kimi 把設計、程式、工具呼叫、代理協作和持續運作全部綁在一起。這表示開源模型的競爭焦點，正在從單點 benchmark 轉成整條工作流的交付能力。

對真的在做 agent 或自動化工作流的人來說，這篇很值得拿來提醒自己：下一個評估標準，可能不只是準不準，而是能不能穩、能不能久、能不能交差。

<div class="sep">· · ·</div>
