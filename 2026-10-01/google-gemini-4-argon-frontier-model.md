---
title: "Google 推出 Gemini 4 Argon，基準測試領先但暫未全面開放"
description: "Google 發布 Gemini 4 Argon，稱其在 18 項基準中有 13 項領先或並列第一，涵蓋程式開發、知識工作與資安；模型先向可信任防禦者分階段開放，API 價格與全面部署時程仍待觀察。"
date: 2026-10-01
author: Carl Franzen
layout: post
permalink: /2026-10-01/google-gemini-4-argon-frontier-model.html
image: /2026-10-01/og-gemini-4-argon-frontier-model.png
---

<div class="hero-badge">AI News · 2026-10-01</div>

![](/ai-articles/2026-10-01/og-gemini-4-argon-frontier-model.png)

**原文連結：** [Google 推出 Gemini 4 Argon，基準測試領先 OpenAI 與 Anthropic，但目前僅限受控發布](https://venturebeat.com/technology/google-unveils-gemini-4-argon-retaking-benchmark-lead-over-openai-and-anthropic-but-in-limited-release)

## 摘要

- Google 發布 Gemini 4 Argon，主打長程軟體工程、企業知識工作與防禦型資安；目前先透過 Fairwind 計畫提供給可信任的資安防禦者，尚未全面開放。
- 在 Google 公布的 18 項基準中，Argon 有 12 項獨自領先、1 項並列第一；GPT-6 Astra 獨自領先 3 項，Claude Opus 5.5 領先 2 項，但各模型仍各有所長。
- Google 宣稱 Argon 支援最高 100 萬個輸出 token，並已協助內部團隊最佳化資料中心記憶體、把 C/C++ 程式碼移植至 Rust，以及進行漏洞偵測與修補。
- Argon 初期 API 定價為每百萬輸入 token 2 美元、輸出 token 10 美元，之後預計調整為 4 美元與 20 美元；但一般開發者何時能實際使用仍未確定。
- 這次發布讓 Google 重新提出前沿模型競爭的主張；真正關鍵仍是基準表現能否轉化為可取得、可整合且能在真實工作負載穩定運作的產品。

<div class="sep">· · ·</div>

Google 今天宣布 Gemini 4 Argon，這款新前沿模型據稱在多項企業相關基準測試中領先同業，涵蓋長程軟體工程、資安漏洞修補、商業流程自動化，以及能帶來經濟效益的知識工作。

這款模型目前尚未廣泛開放。Google 表示，Argon 正透過本月稍早推出的 [Fairwind 計畫](https://blog.google/innovation-and-ai/technology/safety-security/fairwind-program/)，開始提供給一批可信任的資安防禦者使用；在進一步擴大發布前，公司也正參與美國政府的自願性預先模型存取流程。VentureBeat 根據看過的 Google 解禁前部落格文章報導，Google 計畫「盡快」向開發者、企業與一般消費者開放，首波對象將是付費 API 客戶與 Google AI Ultra 訂閱者。

對企業買家而言，這不只是一次聊天機器人發布，更代表 Google 試圖在數月來受到 OpenAI 與 Anthropic 壓力後，重新站回前沿 AI 競賽。Google 將 Argon 定位在企業目前已經投入預算的三個領域：軟體開發、專業知識工作與資安營運。

## 基準測試：Argon 領先或並列的項目最多，但並非全面勝出

Google 並未宣稱 Gemini 4 Argon 在每一項測試都獲勝。不過，根據公司解禁資料中公布的比較表，Argon 獨自取得最高分或並列最高分的項目，比 GPT-6 Astra 與 Claude Opus 5.5 都多。

在 Google 公布的 18 項基準中，Argon 有 12 項獨自領先、1 項並列第一；GPT-6 Astra 有 3 項獨自領先，另有 1 項與 Argon 並列；Claude Opus 5.5 則有 2 項獨自領先。以 Google 這組比較項目來看，Argon 是領先項目數最多的前沿模型，但整體競賽仍然接近，OpenAI 與 Anthropic 在數個重要技術類別仍保有優勢。

以下列出報導中的代表性成績。模型欄位順序固定為 Gemini 4 Argon、GPT-6 Astra、Claude Opus 5.5；不同基準測試衡量的任務各異，分數不可直接跨測試比較。

| 基準測試 | Gemini 4 Argon | GPT-6 Astra | Claude Opus 5.5 |
| --- | ---: | ---: | ---: |
| Google 公布的領先項目數（18 項中） | 12 項領先、1 項並列 | 3 項領先、1 項並列 | 2 項領先 |
| Harvey 法律代理基準 | 19.6% | 5.4% | 3.8% |
| AutomationBench 商務執行 | 51.3% | 41.4% | 42.5% |
| GraphWalks 長脈絡圖遍歷 | 84.2% | 71.8% | 66.8% |
| Vals Finance Agent v2 | 65.4% | 53.5% | 58.6% |
| DeepSWE v1.1 長程軟體工程 | 77.9% | 74.1% | 74.2% |
| LVBench 長影片理解 | 91.7% | 87.5% | 83.7% |
| CWE-bench v1 漏洞修補 | 68% | 68% | 67% |

Argon 在企業與長脈絡工作流程的領先幅度最明顯。在 Harvey 法律代理基準中，Argon 得分 19.6%，遠高於 GPT-6 Astra 的 5.4% 和 Claude Opus 5.5 的 3.8%。Zapier 用來評估端到端商務執行的 AutomationBench，Argon 得分 51.3%，Claude Opus 5.5 為 42.5%，GPT-6 Astra 為 41.4%。在測試較長脈絡中圖形遍歷能力的 GraphWalks 評估中，Argon 得分 84.2%，GPT-6 Astra 為 71.8%，Claude Opus 5.5 為 66.8%。

Argon 在金融、程式開發與多模態理解也取得具體領先。在 Vals Finance Agent v2 中，Argon 得分 65.4%，高於 Claude Opus 5.5 的 58.6% 和 GPT-6 Astra 的 53.5%。衡量真實世界長程軟體工程工作的 DeepSWE v1.1 中，Argon 得分 77.9%，Claude Opus 5.5 為 74.2%，GPT-6 Astra 為 74.1%。在長影片理解基準 LVBench 上，Argon 得分 91.7%，GPT-6 Astra 為 87.5%，Claude Opus 5.5 為 83.7%。

這些成績支撐 Google 的主張：Argon 對企業最可能優先評估的工作流程特別有力，包括法律與金融分析、程式開發、商務自動化、長脈絡推理、多模態理解與防禦型資安。在評估漏洞修補能力的 CWE-bench v1 上，Argon 與 GPT-6 Astra 同以 68% 並列第一，Claude Opus 5.5 則為 67%。

不過，基準表也顯示競賽遠未定局。Argon 與 GPT-6 Astra 的最大差距，出現在 FrontierSWE v2 與 Terminal-Bench Science 0.1；兩項測試 Astra 都領先 10.5 個百分點，分別以 65.5% 對 55.0%、68.1% 對 57.6% 勝出。Claude Opus 5.5 對 Argon 最大的領先幅度則在 Terminal-bench 4.0：Opus 得分 66.4%，Argon 為 57.4%，差距 9 個百分點。Opus 在 PostTrainBench 也以 49.3% 領先 Argon 的 45.3%。

因此，更準確的說法不是「各項任務全面最佳」。在 Google 公布的比較集合中，Argon 的高分分布似乎最廣，但 GPT-6 Astra 在數個軟體工程、科學終端操作與電腦操作任務中仍居前，Claude Opus 5.5 則在終端代理與後訓練流程上領先。對企業買家來說，模型選擇仍取決於實際工作負載；即使 Argon 讓 Google 首度能以領先基準數量主張前沿模型的整體優勢，這點也沒有改變。

對開發者與資訊長而言，Argon 不需要全面勝出，就足以改變競爭格局。它在公布的 18 個類別中有 13 項領先或並列，讓 Google 得以主張自己擁有最多項目的最高分。不過，FrontierSWE v2、Terminal-Bench Science 0.1 與 Terminal-bench 4.0 等落後項目，也顯示 OpenAI 與 Anthropic 仍有明確的技術強項。前沿競賽依舊激烈，Google 現在能主張的是廣度領先。

Argon 也擴大了 Google 的輸出上限。Google 表示，模型最高可輸出 100 萬個 token，遠高於先前 Gemini 模型的 6.4 萬個。對代理式軟體工程、稽核、程式移植與法律審閱而言，模型能在交還控制權前持續完成多長的工作鏈，是一項重要差異。

## Google 已在內部大量使用 Argon

Google 表示，數千名員工已用 Argon 執行專門的程式任務、深入研究與寫作。

Google 提出數個內部案例：Argon 協助量子運算研究人員最佳化受限子程序所需的時空資源，據稱只花幾分鐘便比已發表的基準方法好 40%；Argon 代理分析全公司資料中心的設備遙測資料，找出記憶體最佳化方式，全面部署後預計可釋出超過 300 TiB 記憶體，總節省量估計可達 500 TiB 至 1 PiB；此外，Argon 代理也正協助把 Google 的 C/C++ 程式碼庫移植至 Rust，範圍從 re2、libgav1 等核心函式庫的數萬行程式碼，到 Fuchsia 作業系統 Zircon 核心的 80 多萬行程式碼。

最具體的工程案例是 Google 開源影片解碼器 libgav1。根據 Google 部落格文章，Argon 代理以既有的 Rust 移植版本為基礎，透過多輪效能導向實驗、研究編譯器輸出，並產生可由編譯器自動向量化的安全 Rust 程式碼，取代 32,000 行 SIMD 程式碼。Google 表示，新版本的記憶體安全解碼器在保持影片輸出完全相同的情況下，速度比原本的 Rust 移植版快 2.7 倍。

另一項主要方向是資安。Google 表示，Argon 能自主找出、驗證並修補重大軟體漏洞；為了讓可信任的防禦者與 Google 內部團隊發揮完整防禦能力，這些使用者將能使用未套用網路攻擊防護限制的 Argon。

Google 表示，Wiz 已透過 Scan for Good 計畫使用 Argon。這項計畫致力於免費保護關鍵公共基礎設施；初期演示中，Argon 在全球醫院使用的醫療軟體中，找到一項可能外洩敏感個人資訊的重大漏洞。

Google 將資安防禦發布與安全訊息並行。在全面開放前，公司表示正強化對網路攻擊與化學、生物、放射性、核武（CBRN）濫用、間接提示注入、模型失準與不安全代理環境的防護。

在 Google 部落格列出的 Gray Swan 間接提示注入基準中，Gemini 4 Argon 的攻擊成功率為 0.7%，Claude Opus 5.5 與 Claude Fable 5.1 各為 1.0%，GPT-6 Astra 為 8.5%，GPT-6 Sol 為 27.0%，GLM 5.3 為 31.5%，Grok 4.8 則為 51.8%。此測試的數值越低越好。

## 定價與供應：初期價格積極，但使用權限有限

Google 以積極的 API 初期價格搭配 Argon 的基準測試主張，但尚未說明「初期」優惠會持續多久。過去 Google 有些初期定價最後也成為長期正式價格。

Argon 初期價格為每百萬輸入 token 2 美元、每百萬輸出 token 10 美元；快取輸入 token 則比輸入定價便宜 95%，也就是初期每百萬個快取輸入 token 為 0.10 美元。初期價格結束後，Google 表示 Argon 將調整為每百萬輸入 token 4 美元、輸出 token 20 美元。假設屆時快取折扣仍維持 95%，快取輸入將漲至每百萬個 0.20 美元。

這種定價讓 Google 能提出兩種競爭論述。初期期間，Argon 價格是 GPT-6 Astra API 定價的五分之一；OpenAI 的 API 價格為每百萬輸入 token 10 美元、輸出 token 50 美元。Argon 初期也只有 Claude Opus 5.5 的一半價格；Anthropic 對 Opus 5.5 的定價為輸入 4 美元、輸出 20 美元。

下表依原文整理不同模型的每百萬 token 價格；欄位順序為輸入、輸出、兩者相加的總額，金額皆為美元。原文中的參考來源連結保留於最後一欄。

| 模型 | 輸入／輸出 | 合計 | 來源 |
| --- | ---: | ---: | --- |
| Muse Spark 1.2／1.3 Contributor | $0.10／$0.20 | $0.30 | [Meta](https://dev.meta.ai/docs/pricing-rate-limits) |
| MiMo-V2.6-Flash | $0.14／$0.28 | $0.42 | [Xiaomi](https://mimo.mi.com/models/en-US/mimo-v2.6-flash) |
| GPT-6 Luna | $0.10／$0.50 | $0.60 | [OpenAI](https://openai.com/api/) |
| DeepSeek-V4.1-Flash（離峰） | $0.15／$0.60 | $0.75 | [DeepSeek](https://api-docs.deepseek.com/quick_start/pricing/) |
| MiMo-V2.6-Pro | $0.435／$0.87 | $1.305 | [Xiaomi](https://mimo.mi.com/models/en-US/mimo-v2.6-pro) |
| MiniMax-M3 | $0.30／$1.20 | $1.50 | [MiniMax](https://platform.minimax.io/subscribe/token-plan?tab=api-enterprise) |
| LongCat-2.0（限時優惠） | $0.30／$1.20 | $1.50 | [LongCat](https://longcat.chat/platform/docs/APIPayAsYouGo.html) |
| DeepSeek-V4.1-Flash（尖峰） | $0.30／$1.20 | $1.50 | [DeepSeek](https://api-docs.deepseek.com/quick_start/pricing/) |

| 模型 | 輸入／輸出 | 合計 | 來源 |
| --- | ---: | ---: | --- |
| DeepSeek-V4-Pro（離峰） | $0.66／$1.98 | $2.64 | [DeepSeek](https://api-docs.deepseek.com/quick_start/pricing/) |
| LongCat-2.0（一般價格） | $0.75／$2.95 | $3.70 | [LongCat](https://longcat.chat/platform/docs/APIPayAsYouGo.html) |
| Gemini 3.8 Flash（至 2026-12-31） | $0.75／$3.75 | $4.50 | [Google](https://ai.google.dev/gemini-api/docs/pricing) |
| DeepSeek-V4-Pro（尖峰） | $1.32／$3.96 | $5.28 | [DeepSeek](https://api-docs.deepseek.com/quick_start/pricing/) |
| Muse Spark 1.1／1.2／1.3 | $1.25／$4.25 | $5.50 | [Meta](https://dev.meta.ai/docs/pricing-rate-limits) |
| GLM-5.3 | $1.40／$4.40 | $5.80 | [Z.AI](https://docs.z.ai/guides/overview/pricing) |
| Grok 4.7（提示不超過 20 萬 token） | $2.00／$6.00 | $8.00 | [xAI](https://docs.x.ai/developers/models/grok-4.7) |
| Qwen3.8-Max | $2.00／$6.00 | $8.00 | [QwenCloud](https://www.qwencloud.com/models/qwen3.8-max) |
| Gemini 3.8 Flash（自 2027-01-01 起） | $1.50／$7.50 | $9.00 | [Google](https://ai.google.dev/gemini-api/docs/pricing) |
| GPT-6 Sol | $2.00／$10.00 | $12.00 | [OpenAI](https://openai.com/api/) |
| Claude Sonnet 5.5 | $2.00／$10.00 | $12.00 | [Anthropic](https://platform.claude.com/docs/en/about-claude/pricing) |
| Gemini 4 Argon（初期價格） | $2.00／$10.00 | $12.00 | [Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/) |

| 模型 | 輸入／輸出 | 合計 | 來源 |
| --- | ---: | ---: | --- |
| Grok 4.7（提示超過 20 萬 token） | $4.00／$12.00 | $16.00 | [xAI](https://docs.x.ai/developers/models/grok-4.7) |
| Grok 4.7 Fast（Cursor，輸入不超過 25.6 萬 token） | $4.00／$12.00 | $16.00 | [Cursor](https://cursor.com/docs/models/grok-4-7) |
| GPT-5.4 | $2.50／$15.00 | $17.50 | [OpenAI](https://openai.com/api/pricing/) |
| Kimi K3 | $3.00／$15.00 | $18.00 | [Moonshot AI](https://platform.kimi.ai/docs/pricing/chat-k3) |
| Claude Opus 5.5 | $4.00／$20.00 | $24.00 | [Anthropic](https://platform.claude.com/docs/en/about-claude/pricing) |
| Grok 4.7 Fast（Cursor，輸入超過 25.6 萬、最高 50 萬 token） | $6.00／$18.00 | $24.00 | [Cursor](https://cursor.com/docs/models/grok-4-7) |
| Gemini 4 Argon（初期優惠結束後） | $4.00／$20.00 | $24.00 | [Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/) |
| Sakana Fugu Ultra（不超過 27.2 萬 token） | $5.00／$30.00 | $35.00 | [Sakana AI](https://console.sakana.ai/pricing#subscription-plan) |
| Claude Opus 5.5（Fast 模式） | $8.00／$40.00 | $48.00 | [Anthropic](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Fable 5／Claude Mythos 5 | $10.00／$50.00 | $60.00 | [Anthropic](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Fable 5.1／Claude Mythos 5.1 | $10.00／$50.00 | $60.00 | [Anthropic](https://platform.claude.com/docs/en/about-claude/pricing) |
| GPT-6 Astra（標準模式） | $10.00／$50.00 | $60.00 | [OpenAI](https://openai.com/api/) |
| GPT-6 Astra（快速模式） | $20.00／$100.00 | $120.00 | [OpenAI](https://developers.openai.com/api/docs/models/gpt-6-astra) |

優惠期結束後，Argon 的一般價格與 Claude Opus 5.5 基本 API 價格相同，都是每百萬輸入 token 4 美元、輸出 token 20 美元，但仍低於 GPT-6 Astra 的輸入 10 美元、輸出 50 美元。Anthropic 將 Claude Opus 5.5 的快取讀取價格列為每百萬 token 0.20 美元、快取寫入為 5 美元；若依 Google 宣布的 95% 快取輸入折扣計算，Argon 初期快取輸入較便宜，優惠期後則相近。

限制在於使用權限。Argon 並非一開始就全面提供給開發者；Google 表示，現階段會透過 Fairwind 計畫先開放給可信任的資安防禦者，同時參與美國政府的自願性模型預先存取流程。未來預計向開發者、企業與消費者開放，首波涵蓋付費 API 客戶與 Google AI Ultra 訂閱者。

Google 將 Argon 定位成基準測試領先項目廣、且至少在初期價格低於 OpenAI GPT-6 Astra 與 Anthropic Claude Opus 5.5 的前沿模型。實際限制是，多數客戶仍須等待 API 擴大開放，才能驗證 Argon 的基準優勢是否能在真實程式開發、法律、金融與資安工作負載中轉化為較低的生產成本。

## Google 是否成功追回落後數月的差距？

這次發布的時機相當重要。Google 一直承受壓力，必須證明自己能在模型能力前沿與其他公司競爭，而不只是在產品通路、基礎設施與較便宜的 Flash 模型上占優勢。上週，《The Verge》[報導](https://www.theverge.com/tech/999802/google-deepmind-gemini-4-timeline-koray-kavukcuoglu)，Google DeepMind 新任主管 Koray Kavukcuoglu 表示 Gemini 4 正在最後調整，可能遠早於年底推出。報導指出，Google 自 2025 年 11 月 Gemini 3 系列以來，尚未發布新的旗艦模型；同一期間 OpenAI 與 Anthropic 已推出 GPT-6 與新一代 Claude 模型。

這段落差之前，Google 已承受數月的公開檢視。《路透社》[7 月報導](https://www.reuters.com/business/alphabets-gemini-delay-spending-worries-loom-over-earnings-2026-07-21/)，Alphabet 投資人擔憂 Gemini 3.5 Pro 延後、AI 基礎設施支出增加，以及 AI 團隊人才流失。《Axios》[8 月報導](https://www.axios.com/2026/08/06/googles-ai-leadership-shuffle)指出，Google 進行了重大 AI 領導層調整：Demis Hassabis 辭去 Google DeepMind 執行長，改任 Alphabet 董事長兼首席科學家；Jeff Dean 離開首席科學家職位，與其他 AI 研究人員創業；Koray Kavukcuoglu 則接掌 DeepMind，向 Sundar Pichai 匯報。Axios 將這次變動形容為 Google 自 2023 年 OpenAI 動盪以來最大規模的 AI 領導層重整，同時指出 Google 並未將這些異動歸因於模型延宕。

外部報導也指出更深層的緊張。《MarketWatch》[報導](https://www.marketwatch.com/story/a-decade-of-internal-ai-battles-is-finally-catching-up-to-google-7b3358a1)，Google 的 AI 組織受到人才流失、模型發布延遲，以及研究、前沿能力與商業產品優先順序之間理念分歧的影響。因此，Argon 發布不只是新模型亮相，也是對外界觀感的回應：Google 的 AI 人才底子雖深，前沿產品的推出節奏卻已落後。

至少從公開資料來看，Argon 讓 Google 更有力地回應這些批評。它在數個與企業部署密切相關的測試中領先或並列，包括衡量長程程式開發的 DeepSWE、漏洞修補的 CWE-bench、知識工作經濟效益的 Vals Index、商務執行的 AutomationBench，以及提示注入抵抗能力的 Gray Swan IPI。Google 也採用差異化發布策略，先提供給資安防禦者，同時持續進行安全工作與政府預先存取程序。

## 企業採用仍待驗證

接下來要看的是商業化。企業會想知道 Argon 的實際定價、速率限制、資料治理條款、部署介面，以及它與 Gemini API、Vertex AI、Google Cloud、Workspace 和開發者工具的整合方式。Google 擁有強大的產品通路優勢，但只有在 Argon 的基準表現能轉化成穩定的實際工作成果時，這些優勢才有意義。

目前 Gemini 4 Argon 是 Google 數月來最明確的一次前沿模型回歸：焦點不在消費者聊天機器人的個性，而在 AI 代理能否安全地改寫程式碼、稽核系統、分析受監管的知識工作，並在攻擊者利用軟體弱點之前保護系統。

<div class="sep">· · ·</div>

## 觀察：基準領先不等於已經追上

這次發布最有訊號的部分，不只是某些分數高出多少，而是 Google 選擇把 Argon 的賣點放在企業工作、資安防禦與長程代理任務，並用有限發布來框住高風險能力。對真正要導入的團隊而言，這同時是機會和限制：數據看起來有競爭力，但現在還無法讓大多數客戶自行測試。

18 項測試中領先或並列 13 項，是重要訊號，不是獨立驗證。這些比較來自 Google 揭露的基準集合，且大部分案例與可取得性、速率限制、可靠度、資料治理及整合成本仍未公開。等 API 擴大開放後，最值得追的不是榜單上的總勝場，而是特定工作流程的任務成功率、失敗代價、每次完成任務成本，以及模型能否在長時間代理工作中維持可控。
