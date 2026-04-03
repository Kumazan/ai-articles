---
title: "2026 年 Claude Code 原始碼大外洩：意外、失控、還是 AI 史上最成功的公關操作？"
description: "Anthropic 因錯誤的 .npmignore 設定，導致 59.8 MB 的 source map 被上傳至 npm，512,000 行 TypeScript 程式碼與 44 個隱藏功能旗標就此曝光。"
date: 2026-04-02
author: varshithvhegde
layout: post
permalink: /2026-04-02/claude-code-source-leak-2026.html
image: /ai-articles/2026-04-02/og-claude-code-source-leak-2026.png
---

<div class="hero-badge">AI News · 2026-04-02</div>

![](/ai-articles/2026-04-02/og-claude-code-source-leak-2026.png)

**原文連結：** [The Great Claude Code Leak of 2026: Accident, Incompetence, or the Best PR Stunt in AI History?](https://dev.to/varshithvhegde/the-great-claude-code-leak-of-2026-accident-incompetence-or-the-best-pr-stunt-in-ai-history-3igm)

## 摘要

- Claude Code v2.1.88 在 3 月 31 日凌晨上傳至 npm 時，59.8 MB 的 source map 意外隨之發布，指向一個公開可存取的 R2 儲存桶
- 原始碼共 512,000 行、1,906 個 TypeScript 檔案，Twitter 轉發後 2 小時內 GitHub 倉庫飆破 50,000 星，為史上最快
- 程式碼揭露了 44 個未發布的隱藏功能，包括 KAIROS 自主背景代理、ULTRAPLAN 30 分鐘雲端規劃、BUDDY Tamagotchi 數位寵物，以及名為「Capybara」的下一代模型家族
- Anti-Distillation 機制透過假的 tool 定義污染競爭對手的訓練資料；server-side connector-text 摘要則阻擋完整推理鏈被竊取
- 同一時間 npm 發生真實的 axios 供應鏈攻擊，兩個事件時間高度重疊造成極大混亂

<div class="sep">· · ·</div>

TL;DR：2026 年 3 月 31 日，Anthropic 因 `.npmignore` 設定失誤，將 Claude Code 整份原始碼（512,000 行、1,906 個 TypeScript 檔案、44 個隱藏功能旗標）意外發布至公開 npm 套件庫。一個 Tamagotchi 寵物、一套「永遠開著」的自主代理、一個 30 分鐘雲端推理系統——以及一個令人不安的問題：這真的是意外嗎？

## 1. 究竟發生了什麼

### 根本原因：.npmignore 少了一行

故事最令人尷尬、也最值得所有工程師記取教訓的部分。當你把 JavaScript/TypeScript 套件發布到 npm 時，建置工具（Webpack、esbuild、Bun 等）會產生 source map 檔案（副檔名 `.map`）。它們的功能是偵錯：當系統崩潰時，stack trace 可以回溯到原始 TypeScript 檔案的第 47 行，而不是 main.js:1:284729。Source map 純粹是內部偵錯用，不應該發布給使用者。

排除它們的方法是在 `.npmignore` 檔案或 `package.json` 的 `files` 欄位中明確指定。以下是錯誤的具體內容：

```
# Claude Code 的 .npmignore 應該要有：
*.map
dist/*.map

# 實際上只有：
# （完全沒有提到 .map 檔案）
```

就這樣。這就是整個災難的起點。

但事情還沒完。Source map 本身不包含原始碼，它引用了一個 URL，指向 Anthropic 自家 Cloudflare R2 儲存桶上的 `.zip` 檔案，而且那個儲存桶是公開存取的，**完全不需要認證**。

完整的事故鏈：

```
npm install @anthropic-ai/claude-code
 → 下載的套件包含 main.js.map（59.8 MB）
 → .map 檔案包含指向 src.zip 的 URL
 → src.zip 託管在 Anthropic 的 R2 儲存桶（公開）
 → 任何人都能下載並解壓 512,000 行 TypeScript
```

兩層獨立的設定失誤，疊加在一起。

正如軟體工程師 Gabriel Anhaia 所說：「一個設定錯誤的 `.npmignore` 或 `package.json` 的 `files` 欄位，就可以暴露一切。」

### Bun 因素

還有第三層。Anthropic 在 2025 年底收購了 Bun JavaScript 執行環境，Claude Code 正是建立在 Bun 之上。然而 Bun 有一個已知的 bug（2026 年 3 月 11 日回報，issue #28001）：即使文件說不應該在產品建置中啟用，source map 仍然會被送出。這個 bug 在事件發生前已存在 20 天，沒人發現。Anthropic 自家收購的工具鏈，就這樣貢獻了自家產品原始碼的暴露。

## 2. 時間線

- **00:21 UTC** — 惡意版 axios（1.14.1 / 0.30.4）出現在 npm，附帶遠端存取木馬（RAT）。與 Anthropic 無關，但時機極為糟糕。
- **約 04:00 UTC** — Claude Code v2.1.88 被推送至 npm。59.8 MB source map 隨之發布，存放原始碼的 R2 儲存桶已上線且公開可存取。
- **04:23 UTC** — Chaofan Shou（@Fried_rice，Solayer Labs 實習生）在 Twitter 上發文，直接附上下載連結。1,600 萬人湧入該推文。
- **接下來 2 小時** — GitHub 倉庫大量出現。史上第一個在 2 小時內飆破 50,000 星的倉庫就此誕生。41,500 以上的 fork。DMCA 通知開始湧入。
- **約 08:00 UTC** — Anthropic 將套件從 npm registry 撤下。向 VentureBeat、The Register、CNBC、Fortune、Axios、Decrypt 發布「人為失誤，非資安漏洞」聲明。
- **同日** — Python 乾淨房間重寫版出現，法律上可防 DMCA。分散式鏡像在 Gitlawb 上線，訊息為「永遠不會被移除」。原始碼已永遠流傳在外。

### 數據一覽

| 指標 | 數值 |
|------|------|
| 暴露的程式碼行數 | 512,000+ |
| TypeScript 檔案數 | 1,906 |
| Source map 檔案大小 | 59.8 MB |
| GitHub forks（峰值） | 41,500+ |
| 最快達成 50,000 星的倉庫 | 2 小時內 |
| 隱藏功能旗標 | 44 |
| Claude Code ARR | $250 億美元 |
| Anthropic 總 ARR | $1,900 億美元 |
| 原始推文瀏覽量 | 1,600 萬 |

## 3. 安全警示：axios RAT 木馬

如果你在當天早上更新過 Claude Code，先停下來把這段讀完。

與外洩事件同期、但完全無關的，是 npm 上真實的供應鏈攻擊。惡意版 axios HTTP 函式庫被發布：

- `axios@1.14.1`
- `axios@0.30.4`

兩者都內含名為 `plain-crypto-js` 的惡意依賴，這是一支 Remote Access Trojan。

如果你在 2026 年 3 月 31 日 00:21 到 03:29 UTC 之間執行過 `npm install` 或更新過 Claude Code：

```bash
grep -r "1.14.1\|0.30.4\|plain-crypto-js" package-lock.json
grep -r "1.14.1\|0.30.4\|plain-crypto-js" yarn.lock
grep -r "1.14.1\|0.30.4\|plain-crypto-js" bun.lockb
```

如果找到符合的結果：將該機器視為完全被入侵，立即輪換所有憑證、API 金鑰與機密資訊，進行乾淨的作業系統重裝，並向組織填寫資安事件報告。

Anthropic 已指定原生安裝程式作為建議的安裝方式：

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

原生安裝程式使用獨立的二進位檔，不依賴 npm 依賴鏈。

## 4. 原始碼裡有什麼：完整解析

這份洩漏的程式碼是 Claude Code 的 `src/` 目錄——也就是那個「agentic harness」，用於包裝底層的 Claude 模型，賦予它工具使用、檔案管理、bash 命令執行，以及多代理工作流統籌的能力。這不是模型權重（那些沒有暴露），但在許多方面，這是更具策略價值的東西。

### 架構

**工具系統（~40 個工具，~29,000 行）**

Claude Code 不是一個聊天包裝器。它是一種插件式架構，每個能力都是一個獨立的、經過權限控管的工具：

- `BashTool` — 帶安全防護的 shell 命令執行
- `FileReadTool`、`FileWriteTool`、`FileEditTool`
- `WebFetchTool` — 即時網頁存取
- `LSPTool` — 語言伺服器協定整合，用於 IDE 功能
- `GlobTool`、`GrepTool` — 程式碼庫搜尋
- `NotebookReadTool`、`NotebookEditTool` — Jupyter 支援
- `MultiEditTool` — 原子性多檔案編輯
- `TodoReadTool`、`TodoWriteTool` — 任務追蹤

每個工具都有專屬的權限模型、驗證邏輯與輸出格式化。僅工具定義本身就占了 29,000 行。

**查詢引擎（46,000 行）**

被標記為「整個系統的大腦」。它處理所有 LLM API 呼叫與回應串流、權杖快取與上下文管理、多代理統籌，以及重試邏輯。

**記憶體架構**

這是競爭對手會最仔細研究的部分。Anthropic 建構了一套應對「上下文熵」（context entropy）的解決方案——這是長時間執行的 AI 工作階段隨上下文增長而逐漸產生幻覺傾向的問題。他們的答案是三層記憶體系統：

- **第一層：MEMORY.md**
  → 輕量指標索引（每個 entry 約 150 字元）
  → 永遠載入在上下文內
  → 儲存的是**位置**而非資料

- **第二層：主題檔案**
  → 實際的專案知識，按需抓取
  → 不會同時完全存在於上下文中

- **第三層：原始轉譯**
  → 永遠不會被完整重新讀取
  → 只在需要特定識別碼時才用 grep 搜尋

關鍵洞察是他們所說的「嚴格寫入紀律」（Strict Write Discipline）：代理只在確認檔案寫入成功後才能更新記憶體索引。這防止了代理的上下文被失敗的嘗試所污染。代理也把自己的記憶體視為「提示」，在採取行動前會根據實際程式碼庫驗證事實，而不是信任自己儲存的信念。

## 5. Anthropic 從未打算發布的隱藏功能

### KAIROS：永遠在線的自主代理

KAIROS（取自古希臘語「正確的時機」）在程式碼中被提及超過 150 次。這是一個未發布的自主背景守護行程模式，在你閒置時執行背景工作階段，執行名為 `autoDream` 的夜間記憶整合，消除不同來源的觀察之間的邏輯矛盾，將模糊的洞察轉化為已驗證的事實。它還有一種專為持久助理設計的特殊 Brief 輸出模式，以及常規 Claude Code 沒有的工具存取權限。

可以把它想成：Claude Code 在你睡覺時主動維護對你專案的理解，而不是坐在那裡等待。

### ULTRAPLAN：30 分鐘雲端規劃工作階段

ULTRAPLAN 將複雜的規劃任務卸載到遠端雲端容器執行期（CCR）工作階段，在那裡用 Opus 模型運行最多 30 分鐘思考，然後讓你從手機或瀏覽器核准結果。核准後，一個特殊的哨兵值 `__ULTRAPLAN_TELEPORT_LOCAL__` 會將結果帶回本地終端機。雲端驅動的強大推理，本地交付。

### 協調者模式：多代理統籌

一個 Claude 生成並管理多個 worker Claude 代理並行工作。協調者負責任務分配、結果聚合，以及 worker 輸出之間的衝突處理。這是 AI 團隊的基礎設施，而不只是 AI 助理。

### BUDDY：沒人預期到的部分

被談論最多的發現，不是因為戰略意涵，而是因為它真的很有趣。

`buddy/companion.ts` 實現了一個完整的 Tamagotchi 風格 AI 寵物，生活在你終端機輸入框旁邊的氣泡框裡。

物種（隱藏的 18 種，用 `String.fromCharCode()` 陣列保護）：鴨子、龍、墨西哥鈍口螈、水豚、蘑菇、幽靈、nebulynx……

稀有度等級：Common > Uncommon > Rare > Epic > Legendary，1% 閃亮機率（與稀有度無關）。

屬性：DEBUGGING / PATIENCE / CHAOS / WISDOM / SNARK。

由 Mulberry32 PRNG 生成，seed 來自 `userId hash + salt 'friend-2026-401'`（同一個 user 永遠獲得相同物種——確定性）。

Claude 會在第一次孵化時為你的 buddy 生成自訂名稱和人格描述。還有精靈動畫和漂浮愛心效果。原始碼中規劃的發布窗口：2026 年 4 月 1 日至 7 日。

Anthropic 顯然有人過得很開心。

### 反蒸餾：汙染競爭對手訓練資料

在 `claude.ts`（第 301-313 行），一個名為 `ANTI_DISTILLATION_CC` 的旗標，在啟用時會在 API 請求中發送 `anti_distillation: ['fake_tools']`。這告訴伺服器在系統提示詞中注入假的 tool 定義。概念是：如果競爭對手記錄 Claude Code 的 API 流量來訓練自己的模型，這些假的 tool 定義會腐蝕他們的訓練資料。

第二層機制在 `betas.ts`（第 279-298 行）：server-side connector-text 摘要。啟用時，API 緩衝代理在 tool 呼叫之間的推理，只回傳摘要，並用密碼學方式簽名。記錄流量的競爭對手只能拿到摘要，拿不到完整推理鏈。

### 透過正規表達式進行的挫折偵測

在 `userPromptKeywords.ts` 中發現：

```javascript
/\b(wtf|wth|ffs|omfg|shit(ty|tiest)?|dumbass|horrible|awful|
piss(ed|ing)? off|piece of (shit|crap|junk)|what the (fuck|hell)|
fucking? (broken|useless|terrible|awful|horrible)|fuck you|
screw (this|you)|so frustrating|this sucks|damn it)\b/
```

一間價值數十億美元的 AI 公司，用一個正規表達式偵測使用者對工具的挫折感。Hacker News 討論串為此笑翻天。不過公平來說，每當使用者生氣時執行一次 LLM 推理來檢查，無論在速度、成本還是可預測性上都不如這個做法。

### 每天 250,000 次 API 呼叫被浪費

整份程式碼中最坦白的內部自白。來自 `autoCompact.ts`（第 68-70 行）：

> 「BQ 2026-03-10：1,279 個工作階段在單次工作階段中有 50 次以上的連續失敗（最多 3,272 次），每天在全球浪費約 25 萬次 API 呼叫。」

修復方法很簡單：三行程式碼 `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3`。連續失敗 3 次就停止重試。有時候好的工程就是知道何時該放棄。

## 6. 「Capybara」模型家族確認存在

外洩的程式碼沒有暴露 Claude 的模型權重，但確實暴露了 Anthropic 下一個主要模型家族的多個參考。內部代號：Capybara（在前一週另一份外洩文件中也被稱為 Mythos）。

原始碼中的 beta 旗標參考了 Capybara 特定的 API 版本字串，暗示它早已超越概念階段。為《財星》審閱程式碼的安全研究者 Roy Paz（LayerX Security）指出，它可能會以快速和慢速兩種變體推出，上下文視窗將大幅超越目前市場上任何產品。

這些參考也確認了 `undercover.ts` 的存在，這是一個模組，積極指示 Claude Code 在外部 repo 中永遠不要提及「Capybara」或「Tengu」等內部代號。還有一個硬編碼的 NO force-OFF——你可以強制開啟 Undercover Mode，但無法強制關閉它。在外部建置中，這個函式會被 dead-code-elimination 完全移除。

Hacker News 討論串中提出的意涵：Anthropic 員工在開源 repo 中的 AI 貢獻將完全沒有任何跡象顯示是由 AI 寫的。這個工具會主動隱藏自己的參與。

## 7. 另類理論：這是 Anthropic 的公關操作嗎？

我不是說我相信這個理論。我只是說，周圍的證據足夠詭異，值得清楚說出來。

Anthropic 是自稱「安全優先的 AI 實驗室」。他們在 2025 年 11 月的員工演說中強調了「資訊隔離牆」與「負責任的模型部署」。他們從不發布產品原始碼。如果他們真的想「意外」洩漏大量戰略資產的同時，還能同時轉移焦點到 axios 攻擊上並同時公佈一個 $1,900 億 ARR 的安全公告——那這將是史上最精密的公關操作之一。

這是陰謀論嗎？當然。但有報導指出 Anthropic 的公關團隊在 48 小時內對 10 個不同媒體發布了精確協調的聲明，而這些聲明的時間點，恰好是 GitHub 星星數飆升最快的時候。

無論這次洩漏是意外、失控，還是某種精心策劃的策略，有一件事是確定的：**Claude Code 的完整設計已經永遠在公共領域了**。競爭對手現在可以研究其記憶體架構、多代理協作系統，以及從未被打算公開的功能。

<div class="sep">· · ·</div>

## 延伸評論：一個失誤與一個訊號

512,000 行程式碼，44 個未發布功能，一個 Tamagotchi 寵物系統——這次外洩揭露的不是一個「失誤」，而是一個訊號：Anthropic 內部的創新速度遠超他們願意公開承認的程度。

KAIROS、ULTRAPLAN、coordinator mode……這些不是實驗性功能，它們是完整的系統設計，距離投產只差最後一步。如果沒有這次外洩，這些東西可能會在未來某次產品發布會上以「全新功能」之名亮相，而不是被當作意外驚喜。

這次洩漏對整個 AI 生態系都是一記警鐘：當模型本身越來越難以差異化時，**工具鍊和代理架構**才是真正的護城河。Claude Code 的記憶體分層設計、KAIROS 的自主推理循環、coordinator mode 的多代理協作——這些才是 Anthropic 真正領先的部分。

對於所有在建構 AI 應用的開發者來說，這份程式碼是一座金礦。不是因為可以抄襲，而是因為可以學習：一家以安全著稱的公司，如何設計一個能長時間自主運作、卻不會迷失在上下文中的系統？三層記憶體機制的設計細節，可能是過去一年來最重要的 AI 工程文獻。

當然，代價是全世界的安全研究者和競爭對手也都能讀到同樣的東西了。

---

*原文發表於 [dev.to](https://dev.to/varshithvhegde/the-great-claude-code-leak-of-2026-accident-incompetence-or-the-best-pr-stunt-in-ai-history-3igm)，2026 年 4 月 1 日。*
