---
title: "模型還不是產品：開源 agent 迴圈透露的軟體工程未來"
description: "從 Hermes、pi 到 OpenCode，這篇拆解 context、memory、skills 與 subagents 如何逐步標準化，也說明真正難的從來不是模型本身，而是周邊架構。"
date: 2026-04-26
author: adlrocha
layout: post
permalink: /2026-04-26/model-still-not-product-agent-loops.html
image: /2026-04-26/og-model-still-not-product-agent-loops.png
---

<div class="hero-badge">AI News · 2026-04-26</div>

![](/ai-articles/2026-04-26/og-model-still-not-product-agent-loops.png)

**原文連結：** [@adlrocha - The Model is still not the Product](https://adlrocha.substack.com/p/adlrocha-the-model-is-still-not-the)

## 摘要

- 這篇文章主張：真正決定 production AI agent 品質的，不是模型本身，而是 context、memory、tools、subagents 這些周邊設計。
- 作者拿 Hermes、pi、OpenCode 等開源專案做對照，觀察大家其實正在收斂到相似的 agent 工程模式。
- Hermes 把 prompt builder、context compressor、memory、skills、delegate 拆成清楚的模組，避免把所有邏輯塞進單一 run loop。
- 它的 self-authoring skills、context compression 與 subagent 隔離，都是為了讓 agent 能長時間工作、又不把自己搞亂。
- pi 則走另一條路：用 30+ typed events 讓外掛攔截生命週期事件，把 policy 放在 hook 層。
- 文章也強調，記憶應該是 declarative facts，不該寫成命令式規則，否則很容易在後續 session 反客為主。
- 結論是：agent engineering 的共享底層正在標準化，未來競爭不只在模型，而在可組合的 primitives。

<div class="sep">· · ·</div>

上週那篇關於 Claude Code 外洩的文章，讓作者一直在想一件事：production AI agent 最有意思的工程，往往不是模型本身，而是模型外圍的一切。長 session 裡的 context 怎麼管理、memory 怎麼結構化，才能在需要時把正確細節帶進來；工具怎麼設計成可組合、而且真的提供有用功能。上週談到的其實就是這件事：要讓模型發揮作用，周邊工程才是重點。

一開始，作者以為這些模式和技巧都藏在 Claude Code 的閉源程式碼裡；但後來他又想起，自己日常使用的其實還有不少開源專案也在做 agent loop。那麼，這些開源版本和 Claude Code 相比，到底差在哪裡？Claude Code 的原始碼讓我們看見 Anthropic 怎麼解這些問題，那 Hermes Agent、pi、OpenCode 又是怎麼處理同樣的問題？

作者的假設是：大家其實都在收斂到相似的解法。這是真的嗎？能不能把某些常見模式提升成「best practices」？為了驗證這個直覺，他花了一週時間翻幾個熱門 agent 專案的原始碼，也挑了自己每天真的在用、對其功能和底層技術有直覺的專案來看。

這次主要聚焦三個專案：Nous Research 的 Hermes（10 萬星、這個月的 #1 trending）、Mario Zechner 的 pi（在作者看來，是他讀過最優雅、最簡單、也最高效率的 harness），以及 Anomaly 的 OpenCode。OpenCode 也看了，但作者覺得沒有什麼特別值得展開。這三者都在處理 agent engineering 的核心問題——context、memory、skills、subagents——而且各自下了不同的賭注。有些賭注，不管你用哪個 framework，都值得借鑑。

這就是他的發現。

## Hermes：架構

作者先用 Hermes 當分析基底，因為它的 core agent loop 比其他幾個更複雜。Hermes 最近在網路上很紅，至少在他常混的圈子裡是這樣，而且它對某些事情的處理方式，確實有點不一樣，也挺漂亮。先理解架構，才看得懂那些具體技術。

這個 codebase 清楚拆成六層：

- `prompt_builder.py` 是無狀態的純函式，負責把 system prompt 拼起來：identity（如果使用者有 `SOUL.md` 就用它）、memory guidance、skills index、context files（`.hermes.md` → `AGENTS.md` → `CLAUDE.md` → `.cursorrules`，先找到的優先）、以及 model-specific steering blocks。
- `run_agent.py` 是主迴圈：呼叫 prompt builder、跑 LLM、分派 tool calls。`context_compressor.py` 則是一個完全獨立的 class，有自己的 LLM client，和主 agent 解耦。壓縮由主迴圈觸發，但實際執行是獨立的。
- `memory_manager.py` 管一個內建 memory provider，外加最多一個外部 plugin；這個上限是故意設的，用來避免 tool schema 膨脹。
- `skill_manager_tool.py` 負責所有 skills 相關工作：建立、編輯、patch、刪除。
- `delegate_tool.py` 負責管理 subagents。
- 最上層還有一個 gateway layer，這是一個獨立 process，負責把 Telegram、Discord、Slack、WhatsApp、Signal 和 email 訊息路由進同一個 agent loop。

當 agent codebase 讓人覺得脆弱時，通常是因為所有東西都糊成一個大 run loop（這種痛大家都懂）。Hermes 把 compression、memory、skills、subagents 拆成獨立模組，介面也清楚。每一塊都能理解、測試、替換，而不必動到其他部分，最後讓模型負責把它們協調起來。

### 自我撰寫的 skills 系統

大家最常談的，是 Hermes 的 self-writing skills。現在這件事已經不是什麼新鮮事了，但它剛出現時，作者覺得這是把 continuous learning 實作進 agent 的聰明方法。這也算是繞過 OpenClaw 為了整合外部系統而得寫下的十萬行級工程。

它在 code 裡實際長這樣。觸發條件只是一條 system prompt 指令。`prompt_builder.py` 裡的原文如下：

> 「完成一個複雜任務（5+ 次 tool calls）、修好一個棘手錯誤，或發現一個非平凡的工作流程後，就把這套做法存成一個 skill，交給 `skill_manage`，下次就能直接重用。」

沒有背景 daemon，沒有 scheduler。門檻就是 5 次 tool calls，而且是否跨過這條線，由模型自己判斷。當它真的跨過去時，`skill_manager_tool.py` 會跑一個謹慎的建立流程：

```text
name validation → frontmatter validation (YAML with name and description required) → size check (max 100,000 chars) → name collision check → directory creation → atomic write (temp file, then os.replace()) → security scan
```

如果任何一步失敗，都會完整 rollback。

skills index 會透過雙層快取注入每一次 system prompt：先是 in-process LRU dict，以 skills directory、toolset、platform 和 disabled list 為 key；再用一份磁碟快照做 cold start，快照會用 mtime/size manifest 驗證。只要有新 skill 被建立，快取就會立刻清空，讓下一次 prompt rebuild 立刻看見它。

載入 skills 時，header 寫著：

> 「寧可多載入一些，也不要少掉關鍵步驟、坑點或既有工作流程。你不需要的 context，總比漏掉重要資訊好。」

而在完成困難任務後，還有一句：

> 「如果你載入的 skill 少了步驟、指令有誤，或漏掉了你發現的坑，在完成前把它補上。」

作者認為，這句才是系統能不能真的工作、能不能擴張的關鍵。agent 不只是建立 skills，還被要求維護它們。`skill_manage` 的 patch action 用的是 fuzzy match engine（和檔案編輯同一套），能處理空白差異、縮排差異、block anchor matching。這表示 agent 可以回頭修補自己三個 session 前寫的 skill，不必仰賴完全相同的字串。這很漂亮，因為它也能處理 tools 演進後帶來的潛在 breaking change。

Hermes 預設帶了幾百個 `SKILL.md`，涵蓋 GitHub PR workflows、Obsidian、Linear、Google Workspace、MLOps、home automation 等等。這是「已經有人搞定了」的長尾。作者第一次安裝時覺得有點肥，但這樣一來，agent 需要用某個功能時，不必從零想起，也不必另外硬塞一段程式去實作那套邏輯，而是可以直接寫自己的 code，並在需要時維護它。

這套設計帶來的學習是：與其為某個任務寫死專用邏輯，不如把 procedural knowledge 編成 first-class、可版本管理、可由 agent 編輯的 artefact。skills 可以被 agent 自己建立、patch、棄用，並依照 runtime 學到的東西調整。這樣的軟體會變得可適應、也更具可塑性。

但它也有明確代價，作者自己做過類似設計，所以很有感：skill explosion。若沒有機制辨識語意相近的 skills，agent 很可能寫出好幾個其實在做同一件事的 skill。要讓這功能大規模運作，就需要某種垃圾回收流程，做 semantic deduplication，並清掉被淘汰的 skills。

有些設計在 token 與 context 使用上也顯得不太省，但作者坦白說還沒時間做完整 benchmark（他是在 local model 上跑 Hermes，所以對 token 成本沒那麼焦慮）。這部分就留給其他做過測試的人補充。

### 壓縮 context，但不要丟掉主線

當對話越來越長，tool outputs、檔案讀取和來回互動會一直堆上來，直到碰到模型的 token limit。這時候 agent 通常不是直接失敗，就是把歷史弄丟；對 local model 來說，這通常特別痛。

`context_compressor.py` 的做法，是把對話中間那段壓縮掉，保留 system prompt 和最近的工作（也就是 head 和 tail），再把中間換成一份結構化摘要，內容包含：目前任務、已做的決策、讀過哪些檔案、卡住什麼、還剩什麼。簡單說，它讓 Hermes 能在長任務裡持續跑，而不會忘記自己做到哪裡，同時讓 active context 保持小而聚焦。

它分成四個階段。

Phase 1 是便宜的 pre-pass，不呼叫 LLM。舊的 tool outputs 會被改成一行摘要，例如：`[terminal] ran npm test → exit 0, 47 lines.` 重複讀取同一個檔案的相同結果會去重。tool arguments 也會被截短，但這個截短是 JSON-aware 的：compressor 先解析參數 JSON，再把長字串值縮到 200 字元，最後重新序列化。更早之前的版本是直接切 raw string，結果把 JSON 切壞，還導致特定 provider 出現 400 error。這版 JSON-aware 的寫法，就是從 production 裡撞到錯誤後修出來的。

Phase 2 是 boundary detection。head（system prompt 加前幾輪對話）和一段 token-budget tail（約佔 context 的 20%，包含最近工作）會被保護。中間其餘部分才是壓縮目標。邊界會對齊，避免切開 tool call/result 配對；一旦被切斷，後續執行就會留下 orphaned IDs，直接壞掉。

Phase 3 是 LLM summarisation，使用的是結構化模板：`Active Task, Goal, Constraints, Completed Actions, Active State, In Progress, Blocked, Key Decisions, Resolved Questions, Pending User Asks, Relevant Files, Remaining Work, Critical Context`。這不是自由發揮式摘要，而是一份結構化的交接文件。

Phase 4 會把摘要重新塞回去，並清理 orphaned pairs。之後再次壓縮時，系統會做迭代更新，直接 patch 既有摘要，而不是從頭重寫。它還有 anti-thrashing 保護：如果最近兩次壓縮各自只省下不到 10% 的 tokens，就會跳過壓縮。

壓縮與整理 context 這件事，本身就是一個值得另開題目的主題；作者說之後還會再寫。暫時先留給 factory.ai 團隊那篇對 compaction 的好整理。

### Subagent 隔離

`delegate_tool.py` 負責把 agents 隔離開來，避免彼此污染。這樣主迴圈就能在背景啟動獨立的 research agents，最後再把結果交回 parent。

每個 child agent 都拿到全新的 conversation，沒有 parent history，有自己的 terminal session，而且 toolset 只會是 parent 已啟用工具與明確要求工具的交集。child 無法取得 parent 沒有的能力。`skip_memory=True`、`skip_context_files=True`，也就是子 agent 一開始是乾淨的。被硬性封鎖的工具包括：`delegate_task`（不再往下遞迴，深度最多 2）、`clarify`（child 不能反問使用者）、`memory`（不能寫共享的 `MEMORY.md`）、`send_message`（不能跨平台產生副作用）、`execute_code`。

遞迴深度硬寫成 `MAX_DEPTH = 2`，就是為了讓執行圖維持可控。

平行 batch mode 用 `ThreadPoolExecutor`，而且有可調上限（預設 3）。這是一套 structured concurrency 架構。interrupt propagation 也寫得很明確：如果 parent 被中斷，executor 會停止等待，只收集已經完成的 children。tool name 的 global 會在 child 建立前先保存，建立後再恢復，避免 parent 的可用工具在 delegation 回來後看起來被改掉。

最意外的是 heartbeat。會有一條 daemon thread 每 30 秒觸碰一次 parent agent 的 last-activity timestamp，避免 gateway 的 inactivity timeout 在 subagent 真正在工作時把 session 殺掉。parent 在 delegation 過程中表面上看起來很閒：沒有訊息、沒有 tool calls；如果沒有 heartbeat，長時間跑的 subagent 真的會被系統誤判成閒置。

很多人現在都已經意識到，平行程式設計裡的技巧，幾乎可以直接搬到平行 agent 架構上來用：structured concurrency、process isolation，都是同一套思路。

### 模型感知的 prompt steering

Hermes 還做了一件作者少見其他地方提到、但其實大家大概也都在做的事：它會根據使用的 model，提供不同的 system prompt instructions。

GPT 和 Codex 模型會拿到一組 XML blocks：`<tool_persistence>`、`<mandatory_tool_use>`、`<act_dont_ask>`、`<prerequisite_checks>`、`<verification>`、`<missing_context>`。這些都是很明確的行為約束，例如「不要靠記憶回答算術，永遠用工具」、「如果問題有明顯預設解讀，就直接動作，不要一直問」。Gemini 和 Gemma 模型則會拿到另一套指引：絕對路徑、import 前先檢查依賴、能平行就平行呼叫工具、CLI 一律用 non-interactive flags。GPT-5 和 Codex 甚至會把 developer role 當成比 system 更高的指令入口，因為較新的 OpenAI 模型對這個 role 的權重更高。

這一段的註解寫著：

> 「靈感來自 OpenAI 的 GPT-5.4 prompting guide 與 OpenClaw PR #38953 的模式。」

這代表框架本身正在公開地向其他 codebase 借鑑，而且還清楚註明來源。這個領域正在公開地收斂到共享解法。

如果真的做過 multi-model agent，就會知道同一條指令不會對所有模型有相同效果。想讓 multi-model agent 表現穩定，steering layer 就得 model-aware。對 Claude 來說顯而易見的事，對 GPT 可能就得寫成明確的 XML constraint。

### 記憶：宣告式，而不是命令式

`prompt_builder.py` 裡有一個小小的設計，卻對 runtime 影響很大：memory guidance。

> 「把記憶寫成宣告式事實，不要寫成對自己的指令。『User prefers concise responses』✓ — 『Always respond concisely』✗。『Project uses pytest with xdist』✓ — 『Run tests with pytest -n 4』✗。命令式措辭在後續 session 會被重新讀成指令，可能造成重複工作，甚至覆蓋使用者當下的要求。流程與工作方法應該放在 skills，不該放在 memory。」

這段的重點是：記憶要寫成宣告式事實，不要寫成對自己的指令。`User prefers concise responses` 是事實；`Always respond concisely` 則像命令。`Project uses pytest with xdist` 是事實；`Run tests with pytest -n 4` 會變成規則。命令式措辭在後續 session 可能被重新讀成指令，導致重複工作，甚至覆蓋使用者當下的要求。procedures 和 workflows 應該放在 skills，不該放在 memory。

這樣的區別可以避免真正的 bug。第一個 session 寫下的命令式記憶（例如「提交前一律先跑測試」），到了第五個 session 重新讀取時，可能就變成活的指令，直接壓過使用者實際要你做的事。宣告式事實不會有這問題，因為它描述的是狀態，不是在下命令。

能學到的是：agent 的 persistent knowledge 應該和 persistent procedures 分開。前者是宣告式，後者是 skills。混在一起，只會讓 agent 的歷史越積越難操控。

## pi：extension event bus

前面提到，作者覺得 pi 是他看過最簡潔、也最優雅的 agent loop 之一。pi 的賭注是：framework 不該把功能硬塞進 core loop，而應該把生命週期事件暴露出來，讓 extension 去攔截。`ExtensionAPI` 提供 30+ 個 typed events。作者坦承，自己有分散式系統背景，而且很愛把 agents 配成個人工作流，這套設計非常對味。也正因如此，pi 在幾週前就成了他的主要 coding agent。

要理解這套東西有多強，只要跟著一個 prompt 走完整條路，看看它會觸發什麼 event、又會帶出哪些 side effects。先看 memory management：當對話太長時，pi 需要壓縮它。但在壓縮前，`session_before_compact` hook 會先觸發。只要幾行 TypeScript，就可以攔截這個事件，讓 framework 在摘要階段暫時換掉昂貴的主模型，改用更便宜、更快的模型。如果失敗，也會優雅回退到預設值。framework 根本不需要內建一個「自訂摘要模型」功能；只要給 hook，就能讓使用者自己定義 policy。

這套哲學也適用在安全與 context 上。AI 在執行任何命令之前，`tool_call` event 會先觸發，把時間暫停，並給你一個可修改的 input。這就是怎麼替 terminal 做出一個 bouncer：如果 AI 想執行像 `rm -rf` 這種危險命令，extension 可以讀取命令、阻止執行，然後跳出確認對話。因為 event 是可變的，前面的 handler 甚至可以先 patch 參數，再交給後面的 handler 看。

除了這些 hooks，pi 也用 skills 擴充能力，且採用開放的 `agentskills.io` 標準。這些 skills 會以 XML 形式放進 system prompt，並透過絕對路徑定位。不過，skills 系統最聰明的地方是治理：強力 skill 通常很吃 context，會拖慢 agent。pi 用一個簡單的 `disable-model-invocation` flag 解決這件事。它會把 skill 完全從 prompt 裡隱藏，讓 AI 保持輕量，直到你手動輸入 `/skill:name` 才召喚那個特定工具。如果你不想自己寫 hook 邏輯，也不想無止盡增加 agent 能力，就可以用自己的 skills。

總體來說，這個專案最優雅的地方，就是用 hook-based extension 取代 baked-in features。核心系統因此可以維持極小、極快，也更容易讀懂；而可客製化的表面積則被完整打開。當然，代價也存在：要駕馭這種力量，得理解內部機制、知道 event loop 會觸發哪些事件，還得自己把它配置到和 OpenCode 或 Hermes 這些 coding agent / harness 差不多的功能層級。

但說真的，這套東西用起來就是順。即使只靠預設值，也已經能得到很好的結果。想一秒愛上這個專案，直接翻一下 `pi-agent-core` 的 README 就懂了。

## 這一切正在往哪裡走

看完這些專案的原始碼後，有幾件事特別明顯。第一，無論路徑怎麼分歧，大家其實都在面對同一類 agents，而不同做法與 trade-off（很多時候還和 use case 有關）最後又會把大家帶回類似解法。

更重要的是，共享底層也在收斂：`SKILL.md` 格式、pi 實作的 `agentskills.io` 開放標準、GPT 的 `<tool_persistence>` XML blocks、以及已經成為事實標準的 OpenAI model API 介面，這些東西正在跨 framework 變成共通語言。為 Hermes 寫的 skill，稍作修改就能轉到 opencode 或 pi。隨著生態成熟，未來不會是單一 framework 全贏，而是能跨框架工作的共享 primitive。agent engineering 的底層積木，正在慢慢標準化。

這也呼應作者最近一直在講的一件事：agent 會讓我們今天熟悉的 code 和 apps 逐漸失去原本的樣子。幾個 markdown 檔案（skills 和 memory files 的形式）、一個 agentic loop、一個把 LLM 當推理機器也就是 processor 的模型，以及一個知識庫（外部 integrations、memory、context 等），就足以做出能依照不同情境與 use case 自我調整的軟體。

有個叫 Matrix OS 的專案，把這條路走到更極端的版本。它的說法是：`LLM is the CPU. The context window is RAM. Files are files.` agent 管理 filesystem、spawn sub-processes，還能在 runtime 寫新的 agent definition files 和 tools，進而長出新能力。它甚至可以修改自己。所有狀態都以檔案形式保存，再透過 git 做 peer-to-peer 同步。作者覺得，這大概就是大家正在收斂的高層架構，也是所謂「新軟體工程」的目標平台。

他會把 Hermes、pi、OpenCode 分到不同類別的 agents（雖然很接近，但他不認為它們在做同一個 use case）。但它們的方向很像，而且都能被改造成很多不同用途。世界正在朝著「fungible software」前進。

那這對軟體工程這個職業代表什麼？這正是作者接下來幾週想回答的問題。重點不是只看 agent 的 builder，而是看那些真正寫軟體的人會怎麼變。作者目前的看法是：軟體工程確實變很多，大家也都感受到了，但短期內工作不會消失。

不過，reskilling 會非常大。能理解這些系統、而且理解到今天談的這個層級的工程師，會累積複利型的槓桿。skill authoring、context governance、subagent isolation、hook-based extension、behavioural prompt engineering，這些都會比任何單一 framework 活得更久。

如果你也在做 agents，而且也在想工程模式怎麼變化，作者很想知道自己漏了什麼。想加入討論的話，可以寄信、留言，或直接聯絡他。

下週見！

<div class="sep">· · ·</div>

## 延伸評論：真正的競爭，不在模型，而在可移植的代理基礎設施

這篇最有價值的地方，不是又一次宣告「模型之外還有很多工程」，而是把這件事具體化成幾個可重用的層：memory、skills、context compression、subagent isolation、prompt steering。這些東西一旦成為共享 primitives，框架之間的差距就會縮小很多。

更值得注意的是，文中幾個設計其實已經在回答同一個問題：怎麼讓 agent 既能長跑，又不失控。宣告式 memory、可回滾的 skill 寫入、可壓縮但不丟主線的 context、以及 model-aware steering，都是在降低「看起來很聰明、實際很難維運」的風險。

對現在真的在做 agent 產品的人來說，這篇的提醒很直接：別把希望全押在更強模型上。先把周邊協調層做穩，才有資格談擴張。