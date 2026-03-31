---
title: "建構 Claude Code 學到的教訓：Prompt Caching 就是一切"
date: 2026-02-19
description: "Anthropic 分享 Claude Code 的 prompt caching 架構心得：前綴匹配、快取命中率監控，以及常見的快取失效陷阱。"
layout: post
permalink: /2026-02-19/lessons-building-claude-code-prompt-caching.html
---

<div class="hero-badge">AI News · 2026-02-19</div>

**原文連結：** [https://x.com/trq212/status/2024574133011673516](https://x.com/trq212/status/2024574133011673516)

## 摘要

- Prompt Caching 是讓長時間 agentic 產品（如 Claude Code）得以在成本與延遲上可行的核心機制。
- 快取基於前綴匹配（prefix match），prompt 結構必須從頭設計：靜態內容在前、動態內容在後。
- 中途修改 system prompt、更換模型、增刪 tools，都會破壞快取，代價可能比維持現狀更昂貴。
- Claude Code 團隊把 cache hit rate 當作服務 uptime 來監控，命中率下降就宣告事故（SEV）。
- Fork 操作（如 compaction 壓縮上下文）需沿用完全相同的前綴，才能繼承快取不額外付費。

<div class="sep">· · ·</div>


工程界常說「快取主宰一切（Cache Rules Everything Around Me）」，這條定律同樣適用於 AI agents。

Claude Code 這類長時間運行的 agentic 產品，正是靠著 prompt caching 才得以可行——它讓我們能重複利用先前請求的計算結果，大幅降低延遲與成本。

**Prompt Caching 怎麼運作？**

Prompt caching 是前綴匹配（prefix match）：API 從請求開頭開始，快取到每個 `cache_control` 斷點為止的所有內容。這意味著 prompt 的擺放順序至關重要——你希望盡量多的請求共用同一個前綴。

最好的做法是**靜態內容在前、動態內容在後**。Claude Code 的 prompt 結構如下：

1. 靜態 system prompt 與 Tools（全域快取）
2. CLAUDE.md（專案內快取）
3. Session context（工作階段內快取）
4. 對話訊息

這樣可以最大化不同 session 間的快取命中。

但這比想像中脆弱！我們曾因以下原因打亂順序而破壞快取：在靜態 system prompt 裡放了精確的時間戳記、非確定性地打亂 tool 定義順序、更新 tool 參數（例如 AgentTool 能呼叫哪些 agent），等等。

---

### 用 messages 傳遞動態更新，而非修改 system prompt

有時 prompt 裡的資訊會過時，例如時間改變了、使用者修改了某個檔案。你可能想直接更新 prompt，但這會導致 cache miss，對使用者來說代價高昂。

請改成在下一輪的 user message 或 tool result 裡附加更新資訊。Claude Code 的做法是在下一則 user message 或 tool result 裡加上 `<system>` 標籤，告知模型最新狀態（例如「現在是星期三」），藉此保全快取。

---

### 不要中途切換模型

Prompt cache 是模型專屬的，這讓 prompt caching 的成本計算相當違反直覺。

如果你已和 Opus 對話了 100k tokens，想問一個看似簡單的問題，臨時切換到 Haiku 反而比讓 Opus 直接回答更貴——因為你需要為 Haiku 重建整個 prompt cache。

如果真的需要換模型，最好的方式是透過 sub-agent：讓 Opus 準備一份「交接訊息」，把任務需求傳給另一個模型。我們在 Claude Code 的 Explore agents（使用 Haiku）就經常這樣做。

---

### 不要中途增刪 tools

在對話途中改變 tool 集合，是破壞 prompt caching 最常見的方式之一。直覺上你可能覺得應該只給模型當下需要的 tools，但因為 tools 是快取前綴的一部分，增加或移除任何一個 tool 都會讓整個對話的快取失效。

**計畫模式（Plan Mode）的設計**

plan mode 是一個圍繞快取限制設計功能的好例子。直覺做法是：當使用者進入 plan mode 時，把 tool 集合替換成只含唯讀工具的版本。但這會破壞快取。

我們的做法是：所有 tools 永遠存在於請求中，並使用 `EnterPlanMode` 和 `ExitPlanMode` 作為工具本身。當使用者切換到 plan mode 時，agent 會收到一則 system message，說明目前處於 plan mode 以及相關指令——探索程式碼庫、不要修改檔案、計畫完成後呼叫 `ExitPlanMode`。Tool 定義始終不變。

額外好處：因為 `EnterPlanMode` 是模型可以自行呼叫的工具，它可以在偵測到困難問題時自主進入 plan mode，無需任何快取破壞。

**Tool Search：延遲載入，而非移除**

同樣的原則也適用於我們的 tool search 功能。Claude Code 可能載入了數十個 MCP tools，把它們全部包含在每次請求中代價高昂；但中途移除會破壞快取。

我們的解法：`defer_loading`。我們不移除 tools，而是發送輕量的 stub——只有 tool 名稱加上 `defer_loading: true`——讓模型可以在需要時透過 `ToolSearch` 工具「發現」它們。完整的 tool schema 只在模型選擇使用時才載入。這樣快取前綴保持穩定：相同的 stubs 永遠以相同順序出現。

---

### 分叉操作（Forking）：Compaction

Compaction 是上下文視窗用盡時的處理方式——我們把對話摘要後，以摘要繼續新的 session。

令人意外的是，compaction 有許多與 prompt caching 相關、違反直覺的邊際情況。

特別是當我們需要把整個對話發給模型來生成摘要時，如果這是一次使用不同 system prompt 且沒有 tools 的獨立 API 呼叫（這是最簡單的實作方式），那麼主對話的快取前綴就完全對不上了——你要為所有那些 input tokens 付全額費用，大幅推高使用者的成本。

**Cache-Safe Forking 解法**

進行 compaction 時，我們使用與父對話完全相同的 system prompt、user context、system context 和 tool 定義。我們在前面加上父對話的訊息，再在最後附上 compaction prompt 作為新的 user message。

從 API 的角度來看，這個請求與父對話的最後一次請求幾乎相同——前綴、tools、歷史記錄都一樣——所以快取前綴可以被重用。唯一的新 tokens 只有 compaction prompt 本身。

不過這也意味著我們需要保留一個「compaction buffer」，確保上下文視窗還有足夠空間容納 compaction 訊息和摘要輸出 tokens。

---

### 總結：五個核心教訓

1. **Prompt caching 是前綴匹配。** 前綴中任何一處改動都會讓後面的一切失效。將整個系統設計圍繞這個限制。把順序搞對，大部分的快取自然就會命中。

2. **用 messages 代替修改 system prompt。** 你可能想藉由編輯 system prompt 來做事，例如進入 plan mode、更新日期等，但把這些插入對話訊息中會更好。

3. **不要在對話中途更換 tools 或模型。** 用 tools 來模擬狀態轉換（如 plan mode），而不是更換 tool 集合。延遲載入 tools，而非移除。

4. **像監控 uptime 一樣監控 cache hit rate。** 我們對快取中斷發出警報，並將其視為事故處理。幾個百分點的 cache miss rate 就能大幅影響成本與延遲。

5. **Fork 操作需要共用父級前綴。** 如果你需要執行旁路計算（compaction、摘要、skill 執行），使用相同的 cache-safe 參數，就能在父級前綴上命中快取。

Claude Code 從第一天起就圍繞著 prompt caching 構建。如果你在打造一個 agent，你也應該這樣做。

<div class="sep">· · ·</div>

## Prompt Caching 不是優化，是 agentic 產品的地基

這篇文章表面上是在教 prompt caching 的技巧，但真正該被記住的訊息只有一個：**在 agentic 產品裡，快取不是效能優化——它是架構約束。**

整個 Claude Code 的 system prompt 結構、工具載入方式、Plan Mode 設計、甚至 compaction 流程，全部都必須繞著「不要打斷前綴」這條規則來安排。這不是「我們可以做更好的快取」的等級，而是「如果你在設計階段沒把快取放在第一優先，後面每一個功能都會變成潛在的 cache-busting 地雷」。

值得特別注意的是 Plan Mode 的設計取捨。直覺做法是切換 tool 集合，讓 agent 在唯讀模式下只看到唯讀工具。但因為 tool 定義是快取前綴的一部分，這個「合理」的設計會直接讓整段快取失效。最終的解法是**永遠帶著所有 tools，用訊息層控制行為**。這是非常典型的「快取限制反過來定義 API 設計」的案例。

同樣的邏輯也出現在 ToolSearch 的 defer_loading 機制。MCP 生態系帶來的 tool 越來越多，全部載入太貴，但中途移除又會破壞快取。折衷方案是送 stub，在需要時才展開完整 schema。這個設計不是多聰明的發明，而是在快取約束下唯一可行的路。

Compaction 的 cache-safe forking 則是最反直覺的部分。壓縮上下文理應是一個獨立的 API 呼叫——摘要一下、開始新 session——但如果你這樣做，就等於重新付全價。所以他們必須把 compaction 請求偽裝成「跟原對話幾乎一模一樣」的結構，只在尾端附上壓縮指令。這種設計既巧妙又脆弱，任何對前綴結構的無意修改都可能讓成本暴增。

對正在打造 agent 產品的團隊來說，這篇文章最實用的提醒不是哪五條教訓，而是一個更根本的觀念翻轉：**不要先設計產品再優化快取，要先理解快取的約束再設計產品。** 在 agentic 產品裡，快取命中率的地位等同服務 uptime——它不是 nice-to-have，而是產品能不能在成本上存活的基本條件。
