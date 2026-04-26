---
title: "Stash：替 AI 代理補上持久記憶層"
description: "Stash 用 PostgreSQL + pgvector 建立持久記憶層，讓 AI 代理能跨 session 保留對話、專案、目標與失敗經驗，不必每次都從零開始。"
date: 2026-04-26
author: Mohamed Al-Ashaal
layout: post
permalink: /2026-04-26/stash-persistent-memory-for-ai-agents.html
---

<div class="hero-badge">AI News · 2026-04-26</div>

**原文連結：** [Stash — Persistent Memory for AI Agents](https://alash3al.github.io/stash/?_v01)

## 摘要

- Stash 想解決的是 AI 代理最常見的痛點：每次重開 session 就像失憶，得把同樣的背景再講一遍。
- 它用 PostgreSQL + pgvector 把原始對話整理成 episodes、facts、relationships、patterns，逐步累積成可查詢的知識層。
- namespaces 讓記憶像資料夾一樣分層，能把使用者、專案與 agent 自己的知識分開管理。
- 和 RAG 不同，Stash 不只是檢索文件，而是會從互動中持續學習、合併與修正記憶。
- 它支援 MCP、OpenAI 相容 API、Claude Desktop、Cursor、OpenCode 與本地模型，目標是讓記憶層不綁單一平台。
- 這套系統還內建 goals、failures、hypotheses 與 self-model，試圖讓代理真正「記得自己做過什麼」。

<div class="sep">· · ·</div>

stash.memory

- [什麼是 Stash](#what)
- [命名空間](#namespaces)
- [看看它怎麼運作](#howitworks)
- [和 RAG 的差別](#rag)
- [快速開始](#quickstart)
- [處理管線](#pipeline)
- [MCP](#mcp)
- [後端](#backends)

[→ GitHub](https://github.com/alash3al/stash)

Open Source · MCP Native · PostgreSQL + pgvector

## 你的 AI

有失憶症。

Stash 讓 AI 記住你。每個 session 都記得，永遠記得。再也不用從零開始解釋自己。

28 個

MCP 工具

6 個

管線階段

∞

支援的代理數

聽起來很熟悉嗎？

😫 沒有 Stash

「嘿，我在做一個餐廳 SaaS，你能幫忙嗎？」

「當然！先多告訴我一點你的專案。」

「我們上週不是講過了嗎……我已經解釋過了。」

「抱歉，我看不到之前的對話。」

……又來一次？

🔁 你又浪費了 10 分鐘把同一件事重講一遍。

😌 有 Stash

「嘿，接著上次的專案繼續。」

「歡迎回來！上次我們定好了餐廳 SaaS 的定價模型。你正要處理 onboarding flow，要接著做嗎？」

「對！就是這個。」

「太好了。你之前還提過想避開 Stripe 的複雜度——我有記下來。這裡就是我們上次停下的地方……」

✓ 立刻接上。零重複。完整上下文。

新的 session

❌「你是誰？」

✓ 接續上次進度

你的偏好

❌ 每次都要重講

✓ 已經知道了

過去犯的錯

❌ 會重複犯同樣的錯

✓ 記得哪些方法沒用

長期專案

❌ 目標會掉線

✓ 跨週期追蹤目標

Token 成本

❌ 每個 session 都持續增加

✓ 只回想真正重要的內容

切換模型

❌ 從零開始

✓ 記憶與模型無關

## 什麼是 Stash

## 不只是記憶，而是第二大腦。

Stash 是一層持久化的認知層，夾在 AI 代理和世界之間。它不取代模型，而是讓模型變得連續。episodes 會變成 facts，facts 會組成 patterns，patterns 會累積成智慧。

「你的 AI 是大腦。Stash 是人生經驗。」

你的 agent

Claude、GPT、本地模型，什麼都行

episodes

原始觀察，append-only

facts

由 LLM 彙整出的信念

relationships

實體之間的知識邊

patterns

更高層次的抽象

goals · failures · hypotheses

意圖、學習、以及不確定性

postgres + pgvector

久經考驗的基礎設施

## 命名空間

## 像資料夾一樣整理記憶。

不是所有記憶都一樣。AI 對使用者學到的內容，和對專案學到的內容不同；對自己學到的內容，也不同。namespaces 讓代理能把學到的東西放進乾淨、彼此分離的桶裡，就像電腦裡的資料夾。

每個 namespace 都是一條 path，而且是階層式的。從 `/projects` 讀取時，會自動包含 `/projects/stash`、`/projects/cartona` 這類子路徑。你不用管這件事——代理會自己處理。

📁

寫進一個 namespace，從任意子樹讀取。

例如：

- `/`：全部
- `/users/alice`：Alice 是誰、偏好是什麼
- `/projects`：所有專案
- `/projects/restaurant-saas`：定價、功能、決策
- `/projects/mobile-app`：設計、技術棧、目標
- `/self`：代理自己的知識
- `/self/capabilities`：我擅長什麼
- `/self/limits`：我哪裡做不好
- `/self/preferences`：我怎麼工作最順

🔍

遞迴讀取

從 `/projects` 讀，就能自動拿到下面所有東西。

✏️

精準寫入

每次記憶只寫進一個確切 namespace，不會意外污染其他內容。

🔒

清楚切分

使用者記憶不會混進專案記憶。代理自己的自我知識則留在 `/self`。

## Stash 與 RAG

## RAG 給你的 AI 一個搜尋引擎。Stash 給它一段人生。

大家大概都聽過 RAG（Retrieval Augmented Generation）。它很聰明，但它不是記憶。差別很簡單：

📚 RAG

「一個超快的圖書館員」

你給它一堆文件。提問時，它去搜尋這些文件，再把相關頁面丟給你。就這樣。它不會記得對話，不會學習，也不認識你。每個問題都得從零開始——它只是比較聰明的文件搜尋器。

- 只知道文件裡有什麼
- 無法從對話中學習
- 無法追蹤目標或意圖
- 無法推理因果關係
- 無法長期發現矛盾
- 是無狀態的，不具連續性
- 你必須先把知識寫進去

VS

🧠 Stash

「會成長的心智」

Stash 會從代理經歷的一切裡學習——對話、決策、成功、失敗。它會把原始觀察整理成 facts，把 facts 接成 knowledge graph，偵測矛盾、追蹤目標，並建立一種會隨時間加深的理解。你不用自己寫知識，它會自己整理出來。

- 會自動從每次對話中學習
- 建立知識圖譜
- 跨週期追蹤目標
- 能推理因果
- 發現矛盾時會自我修正
- 是連續的，能精準接續上次狀態
- 會自己生成知識，不只是搬運知識

📚

RAG 比較像……

一個超強實習生，能完美讀懂你給的檔案，但一離開房間就全忘了。

→

🧠

Stash 比較像……

一個從第一天就在場的同事，記得你做過的每個決定，而且每週都更有價值。

可以兩者一起用嗎？可以——RAG 很適合查文件，Stash 則是用來記住經驗。它們解決的是不同問題。只是 Stash 更往前走了很多。

## 為什麼 Stash 不一樣

## 不是只給 AI 一張便條紙，而是給它一個心智。

Claude.ai 有 memory。ChatGPT 有 memory。可它們只服務自己的平台、自己的模型、自己的公司。Stash 則是為所有人、所有地方、永遠存在，而且比它們都更深入。

- 記得你
- 能搭配任何 AI 模型
- 支援本地／私有模型
- 資料由你自己擁有
- 開源
- 背景整理（consolidation）
- 目標與意圖追蹤
- 從失敗中學習
- 因果推理
- 代理自我模型

它給你的 AI：

- 便條紙
- 便條紙
- 心智

## 快速開始

## 三個指令就能跑起來。

不用先搭基礎設施，也不用手動安裝依賴。Docker Compose 會把一切都串好——Postgres、pgvector、Stash，全都準備就緒。

1. clone repo
2. 複製 `.env.example` → `.env`，填入 API key 與模型偏好
3. 執行 `docker compose up` —— 就這樣。Stash 活了。

terminal

```bash
$ git clone https://github.com/alash3al/stash
$ cd stash
$ cp .env.example .env
# 編輯 .env，填入你的 API key、models 與 STASH_VECTOR_DIM
$ docker compose up
```

✓ postgres + pgvector ready

✓ stash migrations applied

✓ mcp server listening

✓ consolidation running in background

⚠️

先在 `.env` 設定 `STASH_VECTOR_DIM`。初始化後就不能改了。

01

📝 Episodes

原始觀察，會即時存下來

02

💡 Facts

由 LLM 彙整出的 episodes 群組

03

🕸️ Relationships

從 facts 抽出的實體關聯

04

🔗 Causal Links

facts 之間的因果關係

05

🌀 Patterns

更高層次的抽象洞察

06

⚖️ Contradictions

自我修正與信心衰減

NEW

07

🎯 Goal Inference

自動把 facts 對齊目前目標，檢查進度並找出矛盾

NEW

08

💥 Failure Patterns

偵測重複犯錯，抽出失敗模式成為新 facts，讓代理不再重蹈覆轍

NEW

09

🔬 Hypothesis Scan

被動檢查新證據，確認或否定尚未解決的假設，不需要人工介入

## MCP 整合

## 兩個指令，任何代理。

Stash 原生支援 MCP。把它放進 Claude Desktop、Cursor，或任何相容 MCP 的代理裡，5 分鐘內就能用。沒有 SDK。沒有 vendor lock-in。你的代理在各處都能記得你。

28 個工具覆蓋完整認知堆疊——從 raw remember / recall，一路到 causal chains、contradiction resolution 與 hypothesis 管理。

Claude Desktop
Cursor
OpenCode
Custom Agents
Local LLMs
Any MCP Client

```bash
$ ./stash mcp execute --with-consolidation
$ ./stash mcp serve --port 8080 --with-consolidation
```

✓ remember · recall · forget · init

✓ goals · failures · hypotheses

✓ consolidate · query_facts · relationships

✓ causal links · contradictions

✓ namespaces · context · self-model

## 代理自我模型

## 你的代理也可以知道自己是誰。

呼叫 `init` 之後，Stash 會建立一個 `/self` namespace 骨架。代理會用自己的記憶層，慢慢建立起對能力、限制與偏好的自我模型。

- `/self/capabilities`：我能做得好的是什麼
  - 代理會記得自己最擅長哪裡，並在規劃時重新利用這些能力。
- `/self/limits`：我哪裡做不好
  - 記錄失敗和已知弱點，避免同樣錯誤再犯。
- `/self/preferences`：我怎麼工作最好
  - 學出來的工作偏好，讓代理不只是記事，也會形成風格。

## 自主循環

## 一個永遠持續學習的代理。

給代理一個 5 分鐘研究循環。它會從過去的記憶中定向、自己挑主題研究、找出新連結、整理學到的內容，最後安靜收尾——準備好下次接續。

把它當成 cron job 跑。每 5 分鐘，代理就更聰明一點。

[→ 看 loop prompt](https://github.com/alash3al/stash)

01 定向

回想上下文、目前目標、開放中的假設，以及過去的失敗

02 研究

自己選一個主題，上網搜尋

03 思考

找出矛盾與缺口

04 發明

產出新東西——一個假設、一個模式，或一個發現

05 整理

跑整理管線，把原始 episodes 合成結構化知識

06 反思 + 休息

寫 session summary，為下一輪建立上下文，然後停止

⚡

Stash 本身跑在 OpenRouter 上。作者把 Stash 本地連到 OpenRouter——一個 API key 就能用數百個模型。

☁️

### 雲端 API

OpenRouter 讓你一次存取數百個模型——GPT、Claude、Gemini、Mistral，全都包在同一個 OpenAI 相容端點後面。把 Stash 指到那裡，就能為 embedding 和 reasoning 選任何模型。

🏠

### 本地模型

如果你在本地跑 Ollama，Stash 也能直接用。Qwen、Llama、Mistral，或任何你拉下來的模型都可以——你的記憶會完全私有、完全離線。

🔧

### 自架

vLLM、LM Studio、llama.cpp server、Together AI、Groq——只要講 OpenAI API 格式，Stash 就能對接。模型供應商可以同時提供 embedding 與 reasoning。

⚠️

在第一次執行前就要設定 `STASH_VECTOR_DIM`，而且之後不能改。pgvector 會在初始化時鎖死 embedding 維度——改了就得整個資料庫重來。預設 embedding 模型是 `openai/text-embedding-3-small`，搭配 `STASH_VECTOR_DIM=1536`。

`.env` — embedding 與 reasoning 用同一個 provider

```bash
STASH_OPENAI_BASE_URL=https://openrouter.ai/api/v1
STASH_OPENAI_API_KEY=sk-or-...
STASH_EMBEDDING_MODEL=openai/text-embedding-3-small
STASH_REASONER_MODEL=anthropic/claude-3-haiku
STASH_VECTOR_DIM=1536
```

```bash
STASH_OPENAI_BASE_URL=http://localhost:11434/v1
STASH_EMBEDDING_MODEL=nomic-embed-text
STASH_REASONER_MODEL=qwen2.5:3b
STASH_VECTOR_DIM=768
```

```bash
STASH_OPENAI_BASE_URL=https://api.groq.com/openai/v1
STASH_EMBEDDING_MODEL=openai/text-embedding-3-small
STASH_REASONER_MODEL=llama-3.1-8b-instant
STASH_VECTOR_DIM=1536
```

## 給你的 AI

一個記憶。

開源。Apache 2.0 授權。以 PostgreSQL 為基礎。相容任何支援 MCP 的代理。

<div class="sep">· · ·</div>

## 延伸評論：AI 代理真正缺的不是模型，是時間連續性

這篇最有價值的地方，不是又一次替「memory」貼新標籤，而是把問題講得很準：AI 代理大多不是不會做事，而是做完就忘。只要記憶還綁在單一產品、單一 session、單一模型裡，所謂的 agent 其實都只是高級的即時回應器。

Stash 走的是另一條路：把對話、失敗、目標和自我認知都變成可累積的資料結構。這種設計如果真的穩，影響會比一個更聰明的模型還大，因為它直接改變代理怎麼「活過去」。

問題也很明顯：記憶做得越深，隱私、污染、遺忘與權限邊界就越重要。真正難的不是把東西存下來，而是知道什麼該記、什麼該忘、誰能讀、何時該修正。