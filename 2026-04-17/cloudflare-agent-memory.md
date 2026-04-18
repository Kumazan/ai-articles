---
title: "Cloudflare Agent Memory 上線，讓代理學會記住重要的事"
description: "Cloudflare 釋出 Agent Memory 私測版，把對話中的重要資訊抽出、長期保存並在需要時回想，讓長流程代理不再被上下文窗限制。"
date: 2026-04-17
author: "Tyson Trautmann and Rob Sutter"
layout: post
permalink: /2026-04-17/cloudflare-agent-memory.html
image: /2026-04-17/og-cloudflare-agent-memory.png
---

<div class="hero-badge">AI News · 2026-04-17</div>

![](/ai-articles/2026-04-17/og-cloudflare-agent-memory.png)

**原文連結：** [Agents that remember: introducing Agent Memory](https://blog.cloudflare.com/introducing-agent-memory/)

## 摘要

- Cloudflare 推出 Agent Memory 私測版，讓代理把對話中的重要資訊抽出並長期保存
- 核心思路不是把所有內容塞進 context，而是把記憶搬到上下文窗外，再用檢索取回
- Agent Memory 以 profile 為單位，支援 ingest、remember、recall、forget、list 等操作
- 這套設計特別適合長時間運作的 coding agent、背景 agent，以及團隊共享記憶
- Cloudflare 強調資料可匯出，避免把最有價值的工作知識綁死在單一供應商
- 底層流程包含去重、驗證、分類、向量化與多路檢索，目標是讓記憶可用而不是雜亂
- 這篇真正回答的不是「context 要多大」，而是「記憶要怎麼工程化」

<div class="sep">· · ·</div>

隨著開發者在 Cloudflare 上打造越來越複雜的 agent，最麻煩的問題之一一直都是，怎麼在對的時間，把對的資訊放進 context。模型輸出的品質，和它拿到的 context 品質直接相關。可是就算 context window 已經長到一百萬 token 以上，**context rot** 依然還是沒解。

於是就出現兩個都不理想的選項：要嘛把所有東西都留在 context 裡，看著品質慢慢變差；要嘛狠下心刪掉，然後冒著把之後還會需要的資訊一起刪掉的風險。

今天 Cloudflare 宣布 **Agent Memory** 私測版，這是一個 managed service，會把 agent 對話中的資訊抽取出來，放到需要時再取回，卻不會塞爆 context window。

它的目的很簡單，讓 AI agent 真的有持續記憶，知道什麼該記、什麼該忘，然後越用越懂事。這篇文章會說明它怎麼運作，也會說明它能拿來做什麼。

## 代理記憶的現況

代理記憶是 AI 基礎設施裡變動最快的領域之一，新的開源函式庫、託管服務和研究原型幾乎每週都在冒出來。這些方案在儲存什麼、怎麼檢索、適合哪種 agent 上差很多。像 LongMemEval、LoCoMo、BEAM 這類 benchmark 雖然能做比較，但也很容易讓人把系統過度優化到某個測試集上，真正上 production 就失靈。

不同方案的架構也差很多。有些是託管服務，負責在背景做抽取與檢索；有些是自架框架，記憶管線得自己跑。有些提供很受限、很明確的 API，避免 memory 邏輯跑進 agent 主迴圈；有些則把原始資料庫或檔案系統直接交給模型，讓模型自己設計查詢，結果 token 花在儲存與檢索策略上，而不是任務本身。也有人想把一切都硬塞進 context window，不夠就分裂成多個 agent；也有人改走 retrieval，只把最相關的內容取回來。

Agent Memory 採用的是 **managed service + 明確 API + retrieval-based** 的架構。Cloudflare 認為，這才是大多數 production workload 的合理預設。比起讓 agent 直接碰檔案系統，更緊密的 ingestion 與 retrieval 管線在成本、效能與推理品質上都更穩。對 production 需要的複雜推理任務來說，像時間邏輯、取代關係、指令遵循，這種架構也更適合。

Cloudflare 之所以自己做，是因為平台上的實際 workload 讓他們看到，現有方案還不夠。要在真實 codebase 和 production 系統上連跑好幾週、好幾個月的 agent，需要的是會長久保持可用的記憶，不是只在乾淨 benchmark 上漂亮、但換個新 model 可能就完全塞得進 context window 的那種記憶。

它們需要快一點的 ingest。需要不會卡住對話的 retrieval。也需要能在合理 per-query 成本下運作的模型。

## 怎麼用

Agent Memory 會把記憶存進一個以名稱區分的 profile。這個 profile 提供幾個操作：把對話 ingest 進去、直接記住某件事、回想需要的資訊、列出記憶，或把某條記憶忘掉。`ingest` 是批次路徑，通常在 harness 做 context compaction 時呼叫。`remember` 是模型在當下直接存下一條重要資訊。`recall` 則會跑完整的 retrieval pipeline，回傳整理後的答案。

```ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const profile = await env.MEMORY.getProfile("my-project");

    await profile.ingest([
      { role: "user", content: "Set up the project with React and TypeScript." },
      { role: "assistant", content: "Done. Scaffolded a React + TS project targeting Workers." },
      { role: "user", content: "Use pnpm, not npm. And dark mode by default." },
      { role: "assistant", content: "Got it -- pnpm and dark mode as default." },
    ], { sessionId: "session-001" });

    const memory = await profile.remember({
      content: "API rate limit was increased to 10,000 req/s per zone after the April 10 incident.",
      sessionId: "session-001",
    });

    const results = await profile.recall("What package manager does the user prefer?");
    console.log(results.result); // "The user prefers pnpm over npm."

    return Response.json({ ok: true });
  },
};
```

Agent Memory 可以透過任何 Cloudflare Worker 的 binding 使用，也能透過 REST API 被 Worker 外部的 agent 存取，邏輯和 Cloudflare 其他開發平台 API 類似。如果是用 Cloudflare Agents SDK，Agent Memory 也能自然接到 Sessions API 的 memory 部分，成為 compaction、remembering、searching 的參考實作。

## 能拿來做什麼

**個別 agent 的記憶。** 不管是在 human-in-the-loop 的情境下，用 Claude Code 或 OpenCode 這類 coding agent，還是用 OpenClaw、Hermes 這類自架框架替人辦事，或是接上 Anthropic 的 Managed Agents，Agent Memory 都能直接當持久化記憶層，不需要改動 agent 核心迴圈。

**自訂 agent harness 的記憶。** 很多團隊都在自己搭 agent 基礎設施，包含能在背景自主執行、沒有人工即時參與的 agent。像 Ramp Inspect 就是一個公開例子，Stripe 和 Spotify 也描述過類似系統。這類 harness 也能用持久化記憶，讓 agent 的學習不會每次重開就歸零。

**跨 agent、跨人、跨工具的共享記憶。** 一個 memory profile 不一定只屬於單一 agent。整個工程團隊可以共享一組記憶，讓某個人的 coding agent 學到的規範、架構決策、部落知識，也能被其他人使用。code review bot 和 coding agent 也可以共用記憶，讓 review 意見反過來影響之後的 code generation。agent 累積下來的知識，不再只是暫時的，而是團隊資產。

雖然 search 是 memory 的一部分，但 agent search 和 agent memory 解的是不同問題。AI Search 是用來在非結構化或結構化檔案裡找結果；Agent Memory 則是做 context recall。Agent Memory 裡的資料不是檔案，而是從 sessions 萃取出來的。agent 可以兩者都用，而且兩者本來就應該一起工作。

## 記憶歸你

當 agent 變得更強，也更深入嵌入 business process，它累積的記憶就不只是操作狀態，而是實打實的 institutional knowledge。客戶開始擔心，把這種資產綁在單一供應商上到底意味著什麼，這很合理。agent 學得越多，記憶越搬不走，切換成本就越高。

Agent Memory 雖然是 managed service，但資料還是屬於使用者。每條記憶都可以匯出。Cloudflare 希望確保，agent 在 Cloudflare 上累積的知識，如果需求改變，也能一起帶走。他們認為，要建立長期信任，最好的方式就是讓離開變容易，然後持續把產品做得好到讓人不想走。

## 運作方式

要理解上面的 API 背後發生了什麼，先要拆開 agent 如何管理 context。agent 其實有三個部分：

1. 一個 **harness**，負責反覆呼叫 model、處理 tool call、管理狀態。
2. 一個 **model**，接收 context 並產生回應。
3. 一個 **state**，包含目前的 context window，以及 context 之外的資訊，像對話歷史、檔案、資料庫、memory。

agent context lifecycle 裡最關鍵的時刻是 **compaction**。這時 harness 會把 context 壓縮，以免超過模型限制，或避免 context rot。現在大多數 agent 都是在這一步直接丟掉資訊。Agent Memory 的做法，是在 compaction 時保住知識，而不是把它弄丟。

Agent Memory 有兩種接法：

1. **在 compaction 時批次 ingest。** 當 harness 壓縮 context，就把對話送進 Agent Memory 做 ingestion。系統會從訊息歷史抽出 facts、events、instructions、tasks，去重後存成可供未來檢索的記憶。
2. **讓模型直接用工具。** 模型會拿到幾個記憶工具，可以 recall，找出特定資訊；也可以 remember，把重要內容直接存起來；也可以 forget，把已經不重要或不正確的記憶標記掉；還可以 list，查看目前有哪些記憶。這些操作都很輕，不需要模型自己設計查詢，也不需要自己管理儲存。主 agent 不該把 context 花在 storage strategy 上，memory 應該盡量退到背景。

### 資料匯入管線

當一段對話進來要 ingest，會先經過一條多階段管線，把內容抽取、驗證、分類並存檔。

第一步是 deterministic ID 生成。每則訊息都會根據 session ID、角色和內容做 SHA-256 hash，再截成 128 bits。就算同一段對話被 ingest 兩次，每則訊息都會對應到同一個 ID，讓重複 ingest 變成冪等操作。

接著 extractor 會平行跑兩輪。完整輪會把訊息切成每段約 10K 字元，保留兩則訊息的重疊區，最多同時處理四段。每段都會轉成帶有角色標記、相對日期已換成絕對日期、以及來源索引的結構化 transcript。對更長的對話（9 則訊息以上），還會同時跑一個 detail 輪，使用重疊視窗，專門抽 names、prices、version numbers、entity attributes 這類 broad extraction 容易漏掉的具體值。最後把兩組結果合併。

下一步是驗證每條抽出的記憶是否真的被原始 transcript 支持。verifier 會跑八個檢查，涵蓋 entity identity、object identity、location context、temporal accuracy、organizational context、completeness、relational context，以及推論出的事實是否真的有對話依據。每一項最後都會被通過、修正或丟棄。

接著 pipeline 會把驗證過的記憶分成四種型別：

- **Facts**，代表當下是真的、比較穩定的原子知識，例如「這個專案用 GraphQL」或「使用者偏好 dark mode」。
- **Events**，記錄特定時間點發生的事，例如部署或決策。
- **Instructions**，描述要怎麼做，例如流程、runbook、工作方式。
- **Tasks**，追蹤現在正在做的事，這種記憶本來就設計成短命的。

Facts 和 instructions 會有 key。每條都會產生一個 normalized topic key，當新記憶和舊記憶 key 相同時，舊的會被 supersede，而不是直接刪掉。這樣就形成一條版本鏈，舊 memory 會指向新 memory。Tasks 不會進 vector index，讓 index 更乾淨，但仍可透過 full-text search 找到。

最後，所有內容都會用 `INSERT OR IGNORE` 寫入儲存層，重複的內容地址會自動略過。回應 harness 後，background vectorization 會非同步進行。embedding 時會把分類階段產生的 3 到 5 個搜尋 query 前綴到 memory 內容前面，縮短「怎麼寫」和「怎麼搜」之間的落差。被 supersede 的 memories 也會並行刪除舊 vectors、upsert 新 vectors。

### 檢索管線

當 agent 要找某條記憶時，query 會進另一條 retrieval pipeline。Cloudflare 在開發過程中發現，沒有任何單一 retrieval 方法能對所有 query 都最好，所以他們把多種方法平行跑，再把結果融合。

第一階段會同時做 query analysis 和 embedding。query analyzer 會產出排序過的 topic keys、帶同義詞的 full-text search terms，以及一段 HyDE（Hypothetical Document Embedding）——也就是把問題改寫成一個像答案的宣告式句子。這一階段也會直接對原始 query 做 embedding，兩種 embedding 都會往下游送。

第二階段會平行跑五個 retrieval channel。使用 Porter stemming 的 full-text search，適合知道精確術語卻不確定上下文的情況。exact fact-key lookup 會直接回傳能對上 topic key 的結果。raw message search 會直接在儲存的對話訊息上做 full-text search，作為安全網，補抓抽取流程漏掉的字面細節。direct vector search 會找語意最像的 memories。HyDE vector search 則會找「答案長什麼樣」的記憶，特別適合問題和答案用詞差很多的抽象或多跳查詢。

第三階段會用 **Reciprocal Rank Fusion（RRF）** 把五路結果融合。每個結果都會根據在各個 channel 的排名拿到加權分數。fact-key match 權重最高，因為 topic key 精準對上是最強訊號。full-text、HyDE vector 和 direct vector 會依訊號強度分別加權。raw message match 也會保留，但權重較低，當作安全網找出 extraction 可能漏掉的候選。平手時則以新近程度決定排序，較新的結果排前面。

最後，pipeline 會把前幾個候選送進 synthesis model，產生自然語言回答。有些特殊查詢會被特別處理，例如時間計算會直接用 regex 和 arithmetic 算好，不靠 LLM 瞎猜。結果會當成預先計算好的事實塞回 prompt 裡，因為模型在日期計算這種事上本來就不可靠。

## 怎麼做出來的

Agent Memory 的最初原型很輕量，只有基本 extraction pipeline、vector storage 和簡單 retrieval。概念能跑，但還不夠能上線。

所以團隊把它放進 agent-driven loop 裡反覆打磨。流程是這樣：跑 benchmark、找出缺口、提出方案、交給人類挑選那些比較能泛化、不容易過度擬合的策略、讓 agent 動手改、再重複一次。

這樣做很有效，但有一個麻煩。LLM 就算 temperature 設成 zero，輸出還是有隨機性，所以同一組 benchmark 每次跑出來的結果都會有變化。這表示他們得做多次平均，還得搭配趨勢分析，才能看懂到底是哪裡真的進步了。整個過程中也得一直小心，避免把系統調到只會迎合 benchmark，而不是真的讓產品更好。

最後，benchmark 分數確實一路穩定上升，架構也變成更能應付現實世界的版本。團隊刻意拿多個 benchmark 來測，包括 LoCoMo、LongMemEval 和 BEAM，從不同角度把系統推一遍。

## 為什麼是 Cloudflare

Cloudflare 在 Cloudflare 上打造 Cloudflare，Agent Memory 也一樣。現有的基礎原語夠強、也夠容易組合，讓他們能在週末就做出第一版原型，並在不到一個月內做出可用的內部 production 版本。除了開發速度，Cloudflare 的平台也證明了一件事，這些功能不一定要靠很長的整合週期才能推出。

更重要的是，Cloudflare 自己就在處理全球規模的流量與記憶型工作，這讓他們更清楚，agent 的記憶不是可有可無的附加功能，而是會直接影響實際工作品質的底層能力。當 context window 不是唯一答案，記憶就成了真正的基礎設施。

## 結語

這篇文章的核心訊息其實很清楚，agent 的下一個瓶頸，不只是模型更大，而是記憶要怎麼被正確保存、檢索、匯出，還要能被工程化地管理。比起單純追求更長的 context window，Cloudflare 想處理的是更現實的問題：長流程 agent 要怎麼不失憶，還能一直維持可用。

<div class="sep">· · ·</div>

## 延伸評論：把記憶從模型能力，拆成工程能力

Agent Memory 代表一個很實際的轉向，大家不再只問模型「記不記得」，而是開始把記憶當成一層獨立基礎設施來設計。這很重要，因為真正的 production agent 往往不是被推理能力卡住，而是被上下文管理、資料保留、去重與檢索品質卡住。

更關鍵的是，Cloudflare 把記憶做成可匯出的 managed service，等於直接回應了「記憶綁死在單一平台」的顧慮。對團隊型 agent 來說，記憶不是裝飾品，而是會累積價值的資產；如果搬不走，遲早就會變成鎖定供應商的成本。

真正值得注意的，可能不是這個產品本身，而是它暗示的趨勢：未來 agent 的競爭，很可能不只比模型，也會比誰能把 compaction、retrieval、memory governance 做得更像一套可靠系統。
