---
title: "別再叫它記憶：每一篇「AI + Obsidian」教學的根本問題"
date: 2026-03-29
author: Jonathan Edwards
layout: post
permalink: /2026-03-29/stop-calling-it-memory-obsidian.html
---

<div class="hero-badge">AI News · 2026-03-29</div>

**原文連結：** [Stop Calling It Memory: The Problem with Every "AI + Obsidian" Tutorial](https://limitededitionjonathan.substack.com/p/stop-calling-it-memory-the-problem)

## 摘要

- 用 Obsidian markdown 資料夾當 AI「記憶系統」是根本性的誤解——markdown 是筆記工具，不是資料庫，無法查詢、無法遍歷關聯、無法擴展
- 作者追溯了這個迷思的形成路徑：Tiago Forte「第二大腦」隱喻 → Anthropic 的 CLAUDE.md → OpenClaw 的 markdown-first 架構 → Obsidian Agent Skills → 內容創作者的病毒式傳播
- 作者展示自己的生產環境：SQLite（832KB / 955 筆結構化記憶）+ Kuzu 圖資料庫（726 節點 / 852 關聯），markdown 僅 636 行用於指令，不儲存任何資料
- 核心論點：「資料庫存放知識，markdown 存放指令。搞混這兩者，就像把便利貼當成基礎設施。」

<div class="sep">· · ·</div>

每週我的動態牆都會冒出另一篇「我用 Obsidian + Claude Code 打造了 AI 第二大腦」的文章。Medium、Substack、YouTube——縮圖上是一顆由發光 markdown 檔案組成的大腦，所有人都在興奮地解釋他們如何把 Claude 塞進 Obsidian vault，實現了「持久記憶」和「Jarvis 等級」的個人助理功能。

我需要談談這件事。因為這是我在 AI 領域看過最清楚的「網紅到 cargo cult 流水線」案例，而如果你正在這些建議的基礎上開發，你是在一個注定會在真正需要時崩塌的地基上施工。

但我會先公平地談。因為 Obsidian 派的人不是全錯，他們只是在最關鍵的事情上搞錯了。

## Obsidian 最強的論點（我是說真正最強的那些）

讓我給 Obsidian 陣營應有的評價，因為這套設定確實有讓人心動的正當理由，忽略這些會顯得思維懶惰。

**你完全擁有自己的資料，而且在本機。** 不依賴雲端、沒有專有格式、沒有供應商鎖定。你的筆記就是硬碟上的純文字檔。如果 Obsidian 明天消失，你的每個檔案都還在。這是真正的優勢。如果你曾被某個 SaaS 工具關站或改 API 坑過，你就懂這為什麼重要。跟 Notion（資料鎖在他們的 API 和格式裡）相比，在資料主權上確實好很多。

**LLM 原生讀取 markdown。** 不需要轉換層。Claude 讀 .md 檔時，吃進去的就是它訓練時用的格式。標題、項目符號、純文字，全部直接相容。不需要 API 呼叫、JSON 解析或中介軟體。你的筆記和模型之間的摩擦基本上是零。

**所有內容人類可讀、可編輯。** 你可以打開 vault 裡的任何檔案，直接看到你的 AI「知道」什麼，用文字編輯器就能修改。這種透明度是資料庫預設做不到的。你不需要特殊工具就能檢視內容。

**Wikilink 系統建立了輕量連結。** Obsidian 的 `[[wikilink]]` 語法提供筆記之間的雙向連結，圖形視圖讓這些連結看得見。這是不碰資料庫就能得到的最接近關聯式資料的東西。

**零設定成本。** Obsidian 免費。你在 vault 資料夾開終端機、打 `claude`，Claude Code 就能存取所有東西。不需要設計 schema、不需要建資料庫、不需要學 SQL。對於分不清資料表和查詢的人，這是最低的入門門檻。

**Git 友善的版本控制。** 你的整個知識庫可以 diff、可以分支、有完整歷史。你能看到什麼改了、什麼時候改的，出問題時可以回滾。

**Steph Ango 的 Obsidian Skills 設計得很好。** Obsidian 的 CEO 在 2026 年 1 月發佈了官方 Agent Skills，教 Claude Code 正確處理 Obsidian 的檔案格式——markdown 語法、Bases 資料庫、JSON Canvas、CLI 指令。這些是正當的、範圍適當的工具，確實做到了它們宣稱的事。

以上就是正方的論點。老實說？作為個人筆記系統、捕捉想法、建立一個你手動瀏覽和維護的知識花園，Obsidian 很棒。我對 Obsidian 作為筆記應用沒有任何意見。

問題從人們把它叫做「記憶」開始。問題從人們把它叫做「資料庫」開始。問題從整個 AI 生產力內容生態系認定一個文字檔資料夾是基礎設施開始。

## 我們是怎麼走到這一步的（一個壞主意的考古學）

這不是意外發生的。從正當的工具設計到集體妄想，有一條清晰的路徑，追溯它很重要，因為它精確地指出思考在哪裡斷裂的。

**第一步：Tiago Forte 讓「第二大腦」成為預設隱喻。**

「Building a Second Brain」方法論（PARA、CODE）從 2017 年左右開始成為一場大型生產力運動。Obsidian 的首頁曾經寫著「A Second Brain. For You. Forever.」這個語言烙進了社群的身份認同。這個概念一直都是關於筆記和知識管理——把你的想法外部化整理，讓真正的大腦可以專注思考。合理的想法。「第二大腦」這個詞是對一套良好組織的歸檔系統的隱喻。

但隱喻會產生後果。當你把筆記叫做「大腦」，人們會開始期待類大腦的能力。而當 AI 進入畫面，「第二大腦」就從隱喻變成了產品宣稱。

**第二步：Anthropic 創建了 CLAUDE.md 和 Skills。**

這裡開始變得技術上有趣，也是混淆真正開始的地方。Anthropic 推出 CLAUDE.md 作為 Claude Code 的專案範圍指令檔。當你在一個目錄裡跑 Claude Code，它會在啟動時自動讀取 CLAUDE.md。它告訴 Claude「這是一個 Python 專案。用 pytest。不要動 CI 設定。」這是一個設定檔，等同於 .bashrc 或 .env。

然後 Anthropic 推出了 Skills——帶有 YAML frontmatter 的 markdown 檔案，作為由斜線指令觸發的 prompt 模板。/checkin 載入一個 241 行的 prompt 來定義行為。markdown 就是 prompt，不是儲存的資料。

這兩者都是指令傳遞機制。它們告訴 Claude 如何行動、去哪裡找東西。它們包含零筆關於你生活的事實、零筆專案細節、零筆聯絡資訊。你可以把它們全部改名為 .txt，什麼都不會變。Claude 不在乎它讀的是 CLAUDE.md 還是 CLAUDE.txt 還是 CLAUDE.csv。它只是在解析文字內容。

但格式是 .md。而且它會自動載入。這個組合創造了一個人們可以看到並且誤解的模式。

**第三步：OpenClaw 犯了關鍵的架構錯誤。**

OpenClaw 是一個自託管的多通道 AI agent 閘道器（WhatsApp、Telegram、Discord、Slack）。作為專案它很有企圖心也很有趣。但它做了一個決定，其漣漪效應可能超出他們的預期：它用 MEMORY.md 作為字面意義的記憶儲存，加上每日 log 檔案存在 `memory/YYYY-MM-DD.md`。

他們的文件明確說「檔案是唯一的真相來源」，而模型只「記得」寫入磁碟的東西。他們將此品牌化為「markdown-first 記憶架構」。

事情是這樣的——即使 OpenClaw 也知道這實際上無法擴展。他們在上面加裝了 SQLite 索引和向量搜尋（BM25 + 語義搜尋加嵌入模型）來讓檢索可用，因為他們發現光讀平面 markdown 檔案行不通。memsearch 這個函式庫就是從 OpenClaw 的程式碼庫中獨立出來的，因為社群需要搜尋能力但不想拖入整個閘道器。2026 年 2 月有一個 GitHub issue 說了每個在此基礎上開發的人都應該注意到的事：「OpenClaw 的記憶是用 markdown 檔案建的。長期來看它無法擴展。」

但內容創作者沒看到底下的 SQLite。他們看到上面的 .md 檔，然後告訴全世界 markdown 是神奇的成分。

**第四步：Obsidian 的 CEO 發佈 Agent Skills（2026 年 1 月）。**

Steph Ango 發佈了 Obsidian 的官方 Agent Skills，教 AI agent 如何正確處理 Obsidian 的專有檔案格式。這些 skills 設計得很好，範圍也恰當。它們教 Claude Code 正確的 wikilink、frontmatter、Bases 資料庫和 JSON Canvas 語法。

但時機就像汽油。那個 repo 衝到了 13,900+ GitHub stars。內容創作者有了他們的鉤子：「Obsidian 的 CEO 剛剛讓 AI 整合成為官方功能了！」Skills 本身並沒有宣稱是記憶系統。它們是格式規範。社群自己把記憶的敘事加了上去。

**第五步：內容創作者的放大迴路（2026 年 2-3 月）。**

然後堤壩潰決了。以下是大約六週內發生的事情的部分清單：

「World of AI」（YouTube 頻道）把 Claude Code + Obsidian 定位為「AI 記憶挑戰的解決方案」。Geeky Gadgets 轉載了。

Chase AI 發佈了一篇指南，把 CLAUDE.md 比作「前額葉皮質」，承諾幾個月內實現「Jarvis 等級」的個人助理能力。

「Learn With Me AI」（截至我寫這篇文章六天前）推出了「停止每次對話都向 Claude 重新解釋自己。我打造了一個永久記憶系統。」作者公開承認自己不是 Obsidian 專家，然後說「它連接到 Claude Code。這就是全部重要的事。」

XDA Developers 刊出一篇稱 CLAUDE.md 為「Claude 的記憶」的文章，並將「Coding with ADHD YouTube 頻道」列為靈感來源。

然後是 GitHub repos。Claudesidian、obsidian-memory-for-ai、claude-note。每一個都在同一個基本想法上搭建越來越精巧的鷹架：markdown 檔案就是記憶。

一整個內容生態系在幾週內具象化，每篇文章引用前一篇作為驗證，沒有人質疑基礎假設。這是一場傳話遊戲，原始訊息（「CLAUDE.md 是一個設定檔」）突變成「markdown 檔案給你的 AI 一個大腦」，而傳遞鏈上沒有人停下來檢查這是否為真。

## 「記憶」真正的意思是什麼（以及這些系統實際在做什麼）

讓我們慢下來，談談這些 Obsidian 設定在宣稱給 Claude「記憶」時，機械上到底在做什麼。

- Claude 把一個 .md 檔讀進它的 context window
- Claude 從那個檔案中讀取資訊
- Claude 把更新的資訊寫回那個檔案

就這樣。整個系統就是這樣。「記憶」就是那些檔案裝得下的文字，以及 Claude 在特定 session 中碰巧載入 context window 的內容。

這行得通。在特定的規模。對非常特定的使用場景。然後就不行了。

以下是我在正方論點章節列出的每個優勢碰到天花板的地方：

**「LLM 原生讀取 markdown」** 是對的，但讀取的機制是把整個檔案傾倒進 context window。那不是查詢，那是暴力法。當你的「記憶」是 50 筆筆記，這沒問題。當它是 500 筆，你每個 session 都在把 token 燒在無關的上下文上。當它是 5,000 筆，你建了一個用得越多就越慢、越貴、越不準確的系統。Context window 不是資料庫。把它當資料庫用，就像試圖把所有食材同時擺在料理台上來經營餐廳廚房。

**「人類可讀」** 在你有 50 筆記錄時很棒。到了 955 筆結構化記錄（這是我實際系統的量），沒有人會讀一個 markdown 檔來找他們需要的東西。你需要查詢。「告訴我所有我在費城一起做過影片專案的人」是一個只需要一條 SQL 語句就能在毫秒內回答的問題。在 markdown 系統中，它需要讀每個檔案、祈禱格式一致，並且祈禱 Claude 抓到每一個相關的提及。

**「Wikilink 建立關聯」** 技術上是對的，但在視覺化之外實際上毫無用處。Obsidian 的圖形視圖展示筆記之間的連結。很漂亮。但你無法查詢它。你不能說「找出所有與使用 Supabase 的專案有關聯的人」然後得到一個遍歷結果。你無法做多跳的關聯查找。你無法問「什麼概念連接了這兩個不相關的專案？」一個互相連結的 markdown 資料夾不是圖資料庫，就像牆上的便利貼網絡不是關聯式 schema 一樣。

**「零設定成本」** 是最讓我受不了的，因為它是最誘人的優勢，也是最危險的陷阱。是的，你可以立即開始。是的，什麼都不用設定。但零設定成本意味著零結構，意味著零能力去查詢、篩選、排序、聚合，或對你的資料做任何事，除了線性地讀它。資料庫要求的「設定成本」不是額外負擔——那是讓系統真正運作的部分。跳過它就像因為灌混凝土太花時間就跳過房子的地基。房子蓋得更快。房子也倒得更快。

## 真正的系統長什麼樣

我一直在 Mac Mini 上建一個個人助理系統，100% 跑在 Anthropic 基礎設施（Claude Code）上，連接 Telegram 做即時互動。它有真正的記憶、真正的上下文管理，而且兩者都處理得很好，因為我用的是真正的解決方案，而不是假裝文字檔是資料庫。

技術堆疊如下：

**SQLite**（claude-memory.db, 832KB）：955 筆結構化記憶，橫跨 22 個分類。67 筆 email 互動。49 筆 session log。一個任務佇列。一個 key-value store。全部有索引，全部可查詢。

**Kuzu Graph DB**（kuzu-graph/, 81MB）：726 個節點（475 人、116 專案、54 概念、43 工具）。852 個關聯，橫跨 12 種類型（KNOWS、WORKS_ON、PROJECT_USES 等等）。

這兩個資料庫每天都在增長。

**Telegram 原生頻道**：即時推送訊息。不需要輪詢。

**4 個自主 agent**（Lex + data-miner + video-producer + content-scout）：每個都有自己的本地 SQLite DB，用於工作日誌、處理狀態、渲染佇列和知識庫。

這個系統裡的 .md 檔？4 個檔案共 636 行。CLAUDE.md（123 行）是啟動指令，一個設定檔。skill.md（241 行）是一個 prompt 模板。Agent 的 CLAUDE.md 檔案是工作描述。它們都不包含一筆關於我的生活或工作的事實。它們告訴 Claude 如何行動、去哪裡找東西。真正的知識存在資料庫裡。

以下是我用 SQLite 能做、但你用 markdown 完全做不到的事：

```sql
-- 「我在費城跟誰合作過影片專案？」
SELECT DISTINCT content FROM memories
WHERE category='client' AND content LIKE '%Philly%';

-- 「我去年對類似工作收多少錢？」
SELECT topic, content FROM memories
WHERE category='business' AND tags LIKE '%pricing%'
ORDER BY created_at DESC;

-- 「告訴我關於這個人我知道的一切」
SELECT * FROM memories WHERE content LIKE '%John Torres%';
SELECT * FROM email_interactions WHERE contact_name LIKE '%John%';
```

以下是用圖資料庫能做、而用檔案完全不可能的事：

```sql
-- 遍歷關聯：「我認識的人裡，誰也在我參與的專案上工作？」（2 跳遍歷）
MATCH (j:Person {name: 'Jonathan Edwards'})-[:KNOWS]->(p:Person)
  -[:WORKS_ON]->(proj:Project)
RETURN p.name, proj.name

-- 「什麼概念連接了這兩個不相關的專案？」
MATCH (p1:Project)-[:PROJECT_EXPLORES]->(c:Concept)
  <-[:PROJECT_EXPLORES]-(p2:Project)
WHERE p1.name <> p2.name
RETURN p1.name, c.name, p2.name
```

試試用一堆 markdown 檔案做這兩件事。你需要讀每個檔案、解析文字、祈禱你在幾個月的記錄中格式保持一致，而且還是做不了關聯遍歷。圖查詢在 726 個節點中在毫秒內找到隱藏的連結。Markdown grep 找到字串匹配就收工了。

以下是真實數據供參考。SQLite 資料庫在 832KB 中存放 955 筆橫跨客戶、專案、個人筆記、創意作品、商業資料和資產的結構化記錄。Kuzu 圖資料庫在 81MB 中存放 726 個節點和 852 個關聯，橫跨 6 種節點類型和 12 種關聯類型。Email 互動（67 個交叉引用的對話串，含聯絡資訊、日期、主旨和副本）存在 SQLite 裡。每個自主 agent 都有自己的本地 SQLite DB（每個約 200KB），用於工作日誌、處理狀態、渲染佇列、知識庫和語音設定檔。整個系統的 .md 指令檔？636 行。

資料庫存放知識。.md 檔存放使用知識的指令。搞混這兩者，就像把檔案櫃跟它上面的標籤搞混。

## 沒有人談的五個問題

每個把 Obsidian 當記憶的系統都會遇到特定的、可預測的故障模式。不是可能會遇到，是一定會遇到。因為這些是用平面檔案做資料儲存的固有問題。

**1. 無法查詢。** 你不能要求「顯示所有標記為 'client' 且重要度 > 7 的聯絡人」。你無法篩選、排序或聚合。唯一能做的操作是「讀檔案然後希望 Claude 找到你需要的」。隨著檔案增長，Claude 遺漏相關資訊的機率也隨之增長。Context window 不是搜尋引擎，它是一個文字緩衝區。

**2. 無法建立關聯。** 你無法遍歷連結。「這個聯絡人認識的人中，誰也在我參與的專案上工作？」需要結構化資料和 join。在圖資料庫中，這是一條查詢。在 markdown 中，這不可能。你可以把筆記互相連結，但你無法以程式化的方式對那些連結的結構提問。

**3. 規模天花板。** 一旦你的「記憶」檔超過幾千行，你每個 session 都在把大量文字傾倒進 context window。這很貴（你在燒可能不相關的 token）。這很慢（更多 input token 意味著更長的處理時間）。而且它排擠了實際工作（context window 是有限的，花在「記憶」上的每個 token 都是無法用於手頭任務的 token）。

**4. 沒有 schema 強制。** 沒有被強制執行的結構。某個 session，Claude 把一個聯絡人格式化為 `## John Torres - Bright Pixel Media`。下一個 session，它寫成 `**John Torres** (Bright Pixel)`。再下一個 session，變成 `John T. - video producer, Philly area`。祝你好運用程式解析那些。祝你好運搜尋 John 的時候找到全部三筆。SQLite 有 schema。每筆記錄遵循相同結構。你可以信賴它。

**5. 無法並行存取。** 兩個 agent 不能安全地同時讀寫同一個 markdown 檔。如果你在跑多個自主 agent（這個領域正在快速往這個方向走），你需要一個能處理並行存取的資料儲存。SQLite 用 WAL 模式原生處理這個問題。Markdown 檔的處理方式是：兩個 process 同時寫入時，默默毀損你的資料。

## 真正可行的替代方案

如果你一直在追隨 Obsidian 當記憶的趨勢，開始感覺到天花板了，以下是可以看看的替代方案。這些都不是理論上的。這些是我每天在生產環境中使用的工具。

**SQLite 做結構化記憶。** SQLite 是一個單檔資料庫，不需要任何伺服器設定。直接在你的機器上跑。Claude Code 可以用簡單的 SQL 查詢讀寫它。你得到 schema、索引、查詢、排序、篩選和並行存取。我的 955 筆記憶系統的整個資料庫是 832KB。一個檔案。不需要伺服器。不需要雲端。仍然本機優先，仍然在你的機器上，仍然是你的。但現在它真的可以查詢了。

**Kuzu（或任何嵌入式圖資料庫）做關聯。** 當你需要理解人、專案、概念和工具之間如何連結，你需要一個圖。不是一個漂亮的互連檔案視覺化，而是一個真正可查詢的圖，你可以跑遍歷、找模式、在數百個節點之間發現連結。Kuzu 在本機跑，嵌入在你的應用程式中，不需要伺服器。

**Open Brain (OB1) 做完整系統。** Nate Jones 的 Open Brain 專案是一個基於 Supabase 的個人知識基礎設施，開箱就給你結構化儲存、向量搜尋和真正的查詢能力。它就是為這個使用場景設計的：給 AI 持久的、結構化的、可查詢的上下文。而且它用的是真正的資料庫，因為這個問題就是需要資料庫。

**Supabase 作為你的個人後端。** 如果你願意多花一點設定功夫，Supabase 給你 PostgreSQL（一個正經的關聯式資料庫）、向量搜尋、即時訂閱和 edge functions。它是開源的、可自託管的，而且就是為「AI 記憶」真正需要的那種結構化資料設計的。

所有這些的共同點：它們是資料庫。它們有 schema。它們處理查詢。它們能擴展。它們強制一致性。它們做到了 markdown 檔案在本質上做不到的事——讓你對你的資料提問，並得到可靠的答案。

## 便利貼類比

以下是我能想到的最簡單的框架來描述發生了什麼事。

想像有人走進一間運作良好的辦公室。他們看到一位高階主管的螢幕上貼著一張便利貼，寫著「打電話給 David 談 Q3 數字」。便利貼是一個提醒、一個小指令、一個指向行動的指標。關於 Q3 的實際資料存在試算表、資料庫、財務系統和 ERP 平台裡。

現在想像一個生產力網紅走進來，看到那張便利貼，然後做了一支 YouTube 影片叫做「這位高階主管用便利貼經營整間公司」。影片爆紅了。幾週內，人們大量採購 Post-it，把整個客戶資料庫、財務記錄、專案時程和員工資訊寫上去。他們把便利貼貼滿牆壁，稱之為「視覺化知識圖譜」。他們用彩色標籤分類，稱之為「結構化資料」。當有人指出這很瘋狂時，他們說「但便利貼是人類可讀的！而且那位主管也在用！而且它們是 local-first 的！」

這就是 CLAUDE.md 和 Obsidian 發生的事。Anthropic 在 Claude 的螢幕上貼了一張便利貼（專案指令），然後整個內容生態系決定便利貼就是基礎設施。那位主管從來沒有把資料存在便利貼上。Anthropic 從來沒有把 .md 檔設計成資料庫。但格式是可見的，而用途被誤解了，現在有數千人在一個從來不是設計來承重的地基上建造他們的 AI 系統。

## Obsidian 真正的用途是什麼（而且這沒問題）

我想說清楚一件事：Obsidian 是一個很好的筆記應用。Steph Ango 的 Agent Skills 設計得很好。在 Obsidian vault 裡用 Claude Code 來整理你的筆記、生成摘要、建立互連文件、管理你的個人知識花園，完全正當。

不正當的是把它叫做記憶。不正當的是把它叫做資料庫。不正當的是在一個文字檔資料夾上建構自主 agent 系統，然後期待它能擴展。

Obsidian 用在它設計的用途上：記錄和整理筆記。資料庫用在它們設計的用途上：儲存、結構化和查詢資料。這個區別並不複雜。筆記本不是檔案櫃。檔案櫃不是資料庫。每個工具都有它的用途，用錯的那個不會讓你顯得聰明——它讓你的系統脆弱。

## 更深層的問題

Obsidian 當記憶的趨勢不只是技術上的錯誤。它是人們對待 AI 工具方式的一個更大問題的症狀：他們優化設定速度而非系統能力。

Markdown 檔案即時載入。資料庫需要 20 分鐘設定。所以人們選擇 markdown 檔案。然後他們花接下來六個月繞過它的限制——加裝搜尋工具、添加向量索引、寫精巧的 prompt 工程來彌補結構的缺乏，最後在意識到它做不到他們需要的事時，整個重建。

20 分鐘的設定本可以省下六個月的變通方案。但內容生態系激勵的是快速 demo 而非持久架構。「我在 10 分鐘內設好了一個 AI 第二大腦」有點擊率。「我花了一個週末設計正確的資料 schema，現在我的系統能擴展用好幾年」沒有。激勵結構獎勵的恰好是錯誤的行為。

而這就是這整件事讓我沮喪的地方。不是因為 markdown 檔案不好。不是因為 Obsidian 不好。而是因為寫這些教學的人正在教別人在沙地上建造，因為比在混凝土上建造更快，而他們要嘛不知道、要嘛不在乎他們建的東西會崩塌。

如果你要建一個有真正記憶的個人 AI 助理，就用真正的基礎設施來建。用資料庫。設計 schema。寫查詢。它需要更長的時間才能開始（讓 AI 幫你搭建起來）。但它會運作。
