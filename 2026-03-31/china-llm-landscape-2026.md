---
title: "中國 LLM 版圖 2026：模型、產品與生態系統正在重新排序"
description: "中國 AI 戰場不再只是單一排行榜之爭。用戶入口、開源模型、商業化、AI 代理工作流與算力監管等多條軸線正在同時重構這張地圖。ByteDance 靠分發稱霸消費者層，Qwen 與 DeepSeek 在開源圈引領風潮，而真正的下一個戰場是：誰能成為 Claude Code 的預設模型後端？"
date: 2026-03-31
author: Merchmind AI / Reddit r/LocalLLaMA
layout: post
permalink: /2026-03-31/china-llm-landscape-2026.html
image: /ai-articles/2026-03-31/og-china-llm-landscape-2026.png
---

<div class="hero-badge">AI News · 2026-03-31</div>

![](/ai-articles/2026-03-31/og-china-llm-landscape-2026.png)

**原文連結：** [https://merchmindai.net/blog/en/post/china-llm-landscape-2026](https://merchmindai.net/blog/en/post/china-llm-landscape-2026)

## 摘要

- 中國 LLM 市場不是單一排行榜，而是多層地圖：消費者入口層、開源開發者層、與商業產品層各有不同贏家。
- ByteDance 的 Doubao 在用戶量上領先（2.27 億活躍用戶），但 DeepSeek 在開發者群體中以 1250.7% 年增率急起直追。
- Qwen 與 DeepSeek 仍是開源影響力最大的兩個品牌，但 MiniMax、GLM-5、Kimi K2.5、Xiaomi MiMo 等第二梯隊正快速追趕，絲毫沒有掉隊。
- 真正的下一個戰場不是模型Benchmark分數，而是：誰能成為 Claude Code、Cline、MCP、終端代理與企業助理的預設模型後端。
- 中國大廠（騰訊、阿里、百度）正透過商業 API、企業整合、Agent 工具鏈與雲端平臺綁定快速推進，與論壇焦點的路線截然不同。

這篇文章的起點是 Reddit r/LocalLLaMA 上的一篇討論文，但原PO的框架只說對了一半。如果只跟著論壇風向走，很容易以為「DeepSeek 與 Qwen 幾乎定義了一切」。但如果只看中國內地的應用安裝量，你又會以為「Doubao 是壓倒性的贏家」。這兩種觀察都不算錯，但它們描述的是市場的不同層次。

中國 LLM 版圖現在看起來不像一條單一排名，而更像一張被高速重繪的多層地圖。

## 消費者入口層：ByteDance 的分發優勢

截至 2025 年 6 月為止，全中國已有 **5.15 億**生成式 AI 用戶，滲透率達 36.5%。這代表 LLM 競爭已不再是科技圈內的小眾話題，而是進入大眾市場階段。

QuestMobile 2026 年 3 月 3 日發布的 AI 應用層報告顯示：截至 2025 年 12 月中國有 **7.22 億** AI App 月活用戶，**5.59 億**使用手機廠商 AI 助理，**2.05 億** PC AI 用戶。其中 Doubao（位元組跳動旗下）自 2025 年 8 月超越 DeepSeek 後持續蟬聯第一。

截至 2026 年 2 月 4 日，Doubao 在 AIGC 原生應用類別已達到 **2.27 億**用戶，領先 DeepSeek 近一億。但值得注意的是：DeepSeek 的網頁端同比增長 **1250.7%**，說明其在開發者與高頻生產力用戶群體中的滲透率遠高於對手。

這組數據說明一個重要事實：**用戶入口層的贏家，與開源社群層的贏家並非同一批人。**

Doubao 的優勢不只來自模型本身，而在於它背後有抖音、剪映（CapCut）、火山引擎與更廣大的分發網絡。DeepSeek 的實力則更體現在技術品牌認知、開發者話語權，以及圍繞網頁與 API 使用形成的習慣。兩者並不在同一層次直接競爭。

## 開源與開發者生態：Qwen 仍是穩固的開放基礎

當 2025 年 4 月阿里巴巴發布 Qwen3 時，一口氣推出兩個 MoE 系列與六個 dense 模型，明確以 Apache 2.0 許可證開源。Qwen3-235B-A22B 擁有 2350 億總參數、220 億活躍參數；Qwen3-30B-A3B 則持續推進小而高效的路線。

同年 7 月，Qwen3-Coder-480B-A35B-Instruct 發布，原生支援 25.6 萬上下文、可擴展至 100 萬，並直接圍繞 Claude Code、Cline 與 OpenAI 兼容介面設計。

但時間走到 2026 年 3 月，只用 Qwen3 來描述阿里已經不夠了。阿里雲的公開文檔顯示：

- **Qwen3.5 系列**已成為視覺理解與混合推理的最新主線。qwen3.5-plus 與 qwen3.5-flash 預設啟用推理能力，開放側則列出 qwen3.5-397b-a17b、qwen3.5-122b-a10b、qwen3.5-27b、qwen3.5-35b-a3b 等型號。
- Qwen3.5 也是原生多模態線。阿里雲視覺文檔明確將 Qwen3.5 描述為「最新一代視覺理解模型」，qwen3.5-plus 定為最高性能與推薦預設選項。
- 商業旗艦端，qwen3-max-2026-01-23 與 qwen3.5-plus 並列於最新版支援矩陣中。

更準確地說，2026 年 3 月阿里的產品矩陣是三層堆疊：**「Qwen3 為開源基礎，Qwen3.5 為原生多模態線，qwen3-max 為商業旗艦」**。

## DeepSeek：仍是技術影響力最大的品牌

2025 年 1 月 20 日 DeepSeek-R1 發布時，公司明確表示模型與程式碼均以 MIT 許可證開源，API 輸出可用於微調蒸餾。

這次發布的意義不只是「又一個強大模型問世」，而是 DeepSeek 將低成本推論、開放蒸餾與強化學習敘事推到了產業討論的中心。

無論一家公司是否真的部署 DeepSeek，整個市場都開始更認真地看待一個問題：**「開放推理模型能否成為商業預設？」**

## 新創公司沒有掉隊，模型線持續推進

如果只跟著論壇關注度走，很容易錯誤解讀為「Qwen 與 DeepSeek 之外的廠商都在跟風」。但官方發布節奏並不支持這個結論。

- **Moonshot / Kimi K2.5**：已取代更早的 K2。官方描述為開源、原生多模態 Agentic 模型，在 K2-Base 基礎上使用約 15 兆混合視覺文字 token 訓練，總參數 1 兆、活躍參數 320 億，上下文支援 25.6 萬。
- **Z.ai / GLM-5**：旗艦已從 GLM-4.5 升至 GLM-5。定位為 Agentic Engineering 旗艦基座模型，上下文 20 萬、最大輸出 12.8 萬，總參數 7440 億，活耀參數 400 億。
- **MiniMax-M2.7**：截至 2026 年 3 月 18 日，MiniMax 最新文字旗艦已推進至 M2.7。官方描述為「首款深度參與自身進化的模型」，強調複雜 Agent Harness、Agent Teams、動態工具搜索、軟體工程與專業辦公室工作。公告報告 SWE-Pro 56.22%、VIBE-Pro 55.6%、Terminal Bench 2 57.0%。
- **StepFun / Step-3.5-Flash**：總參數 1960 億、活躍參數 110 億，上下文 25.6 萬，已在模型卡上明確文件化 Claude Code、Codex 與更廣泛 Agent 平臺整合。
- **小米 / MiMo-V2-Pro 與 MiMo-V2-Omni**：MiMo-V2-Pro 為真實 Agent 工作負載的旗艦基座模型，總參數逾 1 兆、活躍參數 420 億，上下文 100 萬，並明確從編碼推向更廣義的 Agent。MiMo-V2-Omni 則是統一的多模態 Agent 基座，涵蓋圖像、影片、音訊、文字，具備原生結構化工具調用、函數執行與 UI Grounding。

這組數據支撐一個更實際的結論：**中國開源 LLM 生態不是「Qwen 與 DeepSeek 壟斷，其餘都在陪跑」，而是有兩個頂層領導者加上一批快速移動的追趕者，而且這些追趕者的迭代速度一點也沒有減緩。** 小米的 MiMo 就足以說明不應該把「中國 LLM」簡化為常見的新創名單。

## 大廠走的是另一套劇本

對 ByteDance 的定位需要特別澄清：它不該被歸類為「新創」。更準確地說，ByteDance、騰訊、百度與阿里都在透過不同策略快速推進：在商業前線快速迭代，輔以選擇性的部分開源。

- **ByteDance / Seed 2.0 與 Seed-OSS**：截至 2026 年 2 月 14 日，位元組最新通用模型線已推進至 Seed 2.0，提供 Pro、Lite 與 Mini 三種規格，為大規模部署、多模態理解、長程任務與經濟價值高的工作負載構建。但截至 2026 年 3 月 24 日，公開材料中尚未見 Seed 2.0 有配套開源權重庫。位元組目前明確開源的主線仍是 Seed-OSS 與 Seed1.5-VL。
- **騰訊與百度**呈現類似模式：在商業 API、企業整合、Agent 工具鏈與雲端平臺綁定上快速前進，儘管論壇話語權不如 Qwen 或 DeepSeek 等開源明星集中。

## 真正的戰場已從聊天品質轉向 Agent 與工作流

2024 年，多數討論還圍繞聊天體驗與 Benchmark 分數。到 2025、2026 年，重心已明顯轉移。

幾乎每一個新模型發布現在都強調同一串術語：agentic coding、tool use、OpenAI-compatible API、Anthropic-compatible API、long context 與 multimodal reasoning。

例如 Qwen3-Coder 從設計時就支援 Claude Code 與 Cline。騰訊混元在 2026 年 1 月同時發布了 OpenAI-compatible API 與 Anthropic-compatible API 文件。

**更具體地說，兩條軌跡正在會聚：**

第一條是 **Claude Code 風格的編碼 Agent 工作流**。第二條是更廣義的 **Agent 評估與框架生態**，以 OpenClaw、ClawEval 與 PinchBench 為代表。

換句話說，供應商之間的競爭不再只是「誰能寫程式碼」，而是「誰能從頭到尾擁有一個可執行的工作流」。

## 誰能成為 Claude Code 的預設後端？

這是理解中國 LLM 廠商最近動作的關鍵視角：

- **阿里雲 Model Studio** 現在提供直連 Claude Code 的整合文件，範例中明確將 `ANTHROPIC_BASE_URL` 與 `ANTHROPIC_MODEL` 指向 `qwen3.5-plus`。
- **智譜 GLM** 不只支援 Claude Code。其官方 FAQ 明確文件化了 GLM Coding Plan 與 Claude Code 的模型對應，Max 與 Pro 方案已支援 GLM-5。
- **Kimi** 雖然不把「Claude Code 兼容性」當作最响亮的標語，但其公開帖子持續環繞 Agentic Coding、工具使用、MCP 伺服器與 Kimi Playground。
- **StepFun** 直接在模型卡上為 Claude Code 與 Codex 設立獨立區塊。這說明 Agent 兼容性不是被當作附屬功能，而是核心賣點。
- **百度**走的是更偏基礎設施的路線。百度 Qianfan 現在提供 Claude Code 等工具的 Coding Plan，百度雲文件也持續推動將 OpenClaw 快速部署到企業微信、QQ、釘釘等場景。
- **小米 MiMo-V2-Pro / Omni** 看起來是直接從模型基座層押注編碼、Agent 與多模態 Agent 工作流。MiMo-V2-Pro 頁面明確寫道「從編碼泛化至 Agent」，並聲稱在 PinchBench 排名第 3、ClawEval 排名第 3。

這一切的幕後趨勢是：**中國 LLM 供應商真正在爭奪的，不只是模型排行榜上的位置，而是開發者入口層的所有權。**

誰能第一個進入 IDE、Agent 框架、企業工作流、辦公協作套件與雲端平臺，誰就有更好的機會將模型能力轉化為可持續營收。一個「回答得還不錯的聊天機器人」已經遠遠不夠了。

## 中國 LLM 市場的真正壁壘

在中國市場，真正的壁壘越來越不再是「誰能訓練一個模型」，而是：

**「誰能把模型變成真正的產品、合規上線、並吸收長期的推論與算力成本。」**

這個結構性觀察，比任何一個模型分數都更能解釋為什麼某些品牌在用戶端稱霸、某些在開發者端領先、某些在大廠生態系中默默滲透。

理解這張多層地圖，比盯著任何單一排行榜要有用得多。

<div class="sep">· · ·</div>

## 評論：分層思考，才能看懂中國 AI 版圖

這篇文章最有價值的地方，不是它列出了哪些模型或哪家公司的分數，而是它強迫讀者放棄「哪個最強」這種單一維度的思考框架。

中國 LLM 市場的真正結構，是**多條軸線同時在跑，而且每條軸線上的贏家都不一樣。** Doubao 在用戶量上碾壓，但 DeepSeek 在開發者心佔率上以不可思議的速度追趕。Qwen 與 DeepSeek 在開源圈呼風喚雨，但騰訊、阿里、百度正在企業端悶聲發大財。這種「不同層次不同贏家」的局面，其實比「誰又贏了 SOTA」要真實得多。

對關注全球 AI 發展的人來說，這篇最值得記住的一個訊號是：**下一個階段的競爭，將不再是模型本身的競賽，而是「誰能成為工具鏈默認後端」的競賽。** 當各家模型能力差距逐漸縮小（至少在實務應用場景裡），誰能綁定 Claude Code、Cline、MCP、IDE 與企業工作流，誰就能在商業層面建立真正難以撼動的護城河。

這一點對 OpenClaw 生態中的玩家也很重要。因為無論哪家模型成為主流，承載這些模型的框架與工具鏈本身，才是最終價值的沉積點。

中國市場的快速迭代與激烈競爭，正在為全球提供一個搶先看的實驗室：當模型不再是稀缺資源，當 Agent 工作流成為新的價值載體，整個生態的結構會怎麼重寫？答案可能會在中國率先揭曉。
