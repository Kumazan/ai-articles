---
title: "OpenAI DevDay 2026 現場紀錄：Dots、GPT-6.1 Sol 與開發者平台新功能"
description: "Simon Willison 從現場記錄 OpenAI DevDay 2026，涵蓋常駐代理 Dots、GPT-6.1 Sol、Codex 雲端、安全工具，以及 ChatGPT 平台與開發者功能的發布和實際展示。"
date: 2026-09-30 04:30:00 +0800
author: Simon Willison
image: /2026-09-30/og-openai-devday-2026-live-blog.png
layout: post
permalink: /2026-09-30/openai-devday-2026-live-blog.html
---

<div class="hero-badge">AI News · 2026-09-30</div>

![](/ai-articles/2026-09-30/og-openai-devday-2026-live-blog.png)

**原文連結：** [OpenAI DevDay 2026 live blog](https://simonwillison.net/2026/Sep/29/openai-devday-2026-live-blog/)

## 摘要

- OpenAI 發表常駐代理 Dots，能連接 ChatGPT、Slack、Teams 等服務，並透過 ChatGPT Space 協作；首波開放給 Pro 與 Enterprise 客戶。
- OpenAI 推出 GPT-6.1 Sol，主打接近 Astra 的智慧、價格約為五分之一；另有最高每秒 300 tokens 的 Ultrafast 版本與 Pro 500 訂閱方案。
- 新增 Decisions API、具備電腦操作能力的 Agents API、Codex Security Cloud，以及 Codex Cloud 等開發者工具。
- ChatGPT 平台擴大開放：支援以 ChatGPT 登入、外掛式應用、可分享的 Sites 與 OpenAI Marketplace。
- 現場展示涵蓋 3D 建模、電腦操作、Codex 開發與 ChatGPT Sites；也出現語音互動失靈、代理回覆延遲等不順利時刻。
- DevDay 分場進一步展示 Sites 的 SQLite 資料庫、排程任務、外掛資料整合、共同編輯，以及 WebMCP。

<div class="sep">· · ·</div>

我今天人在舊金山 Fort Mason 參加 OpenAI DevDay。和去年一樣，我會在主題演講期間即時更新現場紀錄，並補充一些其他觀察。OpenAI 提供了免費入場票，還安排我坐在主題演講的「創作者」區。

**09:27** 我已經進場，主題演講半小時後開始。

今年我用 vibe coding 做了一套比較容易把照片加進即時紀錄的系統。我原本打算用 Codex Cloud 完成——出發去會場的路上，我在手機上動手做了雛形——但遇到一些問題，最後改用 Claude Code 網頁版。

**10:01** Sam Altman 上台，歡迎大家來到 DevDay。他說今天會是「有史以來最棒的 DevDay」。

**10:02** 他先展示大家一直敲碗、而且已經推出的功能。Codex 登上 Linux、Codex 登上手機，都獲得現場掌聲。

**10:03** 今天要推出一項產品，讓人感覺「像是用 AI 工作的全新方式」。我猜可能會是類似 Muse 的個人代理……

**10:03** 它叫做「Dots」。

**10:05** 看起來確實很像 Muse。你可以替它取名，接著它會以一個可愛、像小團子的頭像呈現。（我的 Muse 頭像是一隻鵜鶘。）

**10:06** 示範影片裡有大量語音互動，推測使用的是 GPT-Live，或新一代的相關技術。

**10:07** Dots「由 Astra 驅動」。把這麼昂貴的模型設為預設，成本應該不低！

**10:08** 他們展示了一個相當大膽的使用案例：遷移一套 API。我有點意外他們這麼早就挑了這個需要大量寫程式的範例，大概是因為聽眾主要是開發者。

**10:09** Sam 稱 Astra 是「我們最符合對齊要求的模型」，因此你可以放心讓 Dot 承擔「你覺得自在的責任範圍」。

**10:09** 他說：「你們的團隊也需要一個能和各自 Dots 協作的地方。」於是 OpenAI 推出 ChatGPT Space。

**10:10** 這些 Space 看起來像是共享文件，也許是 Google 文件加上 Artifacts 的模式。Sam 接著介紹 Holly Li。

**10:11** Holly 以打造一款虛構音樂 App 為例，說明操作情境。她的 Dot 叫做「Dottie」，可以存取 ChatGPT、Slack、Teams 等服務。

**10:12** 這個介面真的很像 Meta 的 Muse 代理；目前 Muse 仍高居 iOS App Store 免費榜第一名。

**10:13** 現場開始展示！「Dottie 今天早上動作有點慢。」我們看到它顯示「還在查」，接著尷尬地沉默了一會兒。

**10:14** 現在切換到 ChatGPT Space。裡面有類似 Notion 的斜線指令選單。

**10:16** OpenAI 的員工已經開始直接在 Slack 把工作交給自己的 Dots；這些代理在 OpenAI 的 Slack 裡也有自己的身分。我猜這是 OpenAI 對 Claude Tag 的回應。

**10:17** 「Dottie 可以在我的筆電上使用 Codex，打造這款 App，並在 iPhone Simulator 裡啟動。」

**10:18** ChatGPT Pro 和 Enterprise 客戶今天就能使用 Dots。

**10:19** 他們也正在打造法律、財務等領域的「專家 Dots」，會和企業客戶合作開發，另外也將和 Microsoft 365 合作推出相關功能。

**10:20** 「今天的第二個重點」是平台。Sam 說，他們提供優秀模型、能使用 OpenAI 內部同款工具，以及產品分發管道。

**10:21** 大家一直在問，有沒有更便宜、更快的 GPT-6 Astra。今天 OpenAI 推出 GPT-6.1 Sol。

**10:21** Sam 說它的智慧程度「接近 Astra，價格只有五分之一」。

**10:22** GPT-6.1 Sol 今天就會推出。

**10:22** 今天也推出 Ultrafast：速度快八倍，最高每秒 300 tokens。API、ChatGPT 和 Codex 都能使用，價格則是標準版的六倍。Sam 說：「你知道嗎，這個價錢值得。」

**10:22** Astra 6 的 Ultrafast 今天開放；Sol 6.1 版本則即將推出。

**10:23** 新訂閱方案 Pro 500 也登場：可使用 Ultrafast，使用量是 Plus 的 25 倍。他們今天也重新開放每月 200 美元方案，讓新訂戶可以訂閱。

**10:24** 今天還會預覽全新的 Decisions API，讓模型能在「一秒的零頭」內回應。它讓 Luna 模型從預先定義的一組選項中挑選答案。聽起來像是對 Jev 的回應；Jev 不到兩週前才低調亮相。

**10:25** Sam 開始談「加速研究：OpenAI 內部觀點」。他請 Tejal Patwardhan 上台，分享 OpenAI 如何運用自家模型加速研究。

**10:26** Tejal 談到 Astra 的電腦操作能力。她說：「我們的模型協助最佳化電腦操作所用的 harness。」他們加速了這套 harness，讓延遲降低一半，並已把改良版推出給所有人使用。

**10:27** 她又說：「我們的模型在操作桌面與瀏覽器時，犯錯的機率低得多。」這點「對所有 Dots 都非常重要」。

**10:29** Sam 回到台上，開始談「支援開發者」——讓開發者能使用 OpenAI 自己採用的底層技術。首先是開源 Codex harness。Codex 現在也「全面進入雲端」。兩個小時前我才剛用 Codex Cloud 得到不太好的體驗，希望這次推出的版本能大幅改善。

**10:30** 今天推出「Codex Security Cloud」，包含「Daybreak Blue 存取權」、排程掃描和自動去重；這項服務今天也正式推出。

**10:31** 他們也有新的 Agents API（還是原本的 API 加上新功能？），現在具備電腦操作能力。

**10:31** AWS 合作夥伴的段落讓我有點恍神，不過只持續了幾秒。

**10:32** Sam 很快帶過企業隱私功能。

**10:33** Sam 誇耀他們今天提供的 API「效能最高、可靠性最佳」。感覺是在暗酸 Claude，尤其 Claude 就在今天早上才發生服務中斷。

**10:33** Romain Huet 很有趣地走進會場，螢幕上同步播放著現場攝影機的畫面。

**10:34** 看來他要用 Ultrafast 現場展示 3D 建模。但語音模式不太配合，他只好改用打字。

**10:36** 這場展示不錯。他輸入「把直播畫面放到大螢幕上」之類的指令，過了一會兒，影片就出現在 3D 場館模型的大螢幕上。

**10:38** Romain 用 Ultrafast 現場寫了一個 App，把免費門票隨機送給台下觀眾。

**10:39** 這符合一種慣例：過去幾屆 DevDay，Romain 經常透過有趣的現場互動展示功能。

**10:39** 接著是 Astra 電腦操作示範：Astra 嘗試遊玩一款新遊戲——這款遊戲是用 vibe coding 做出來的。

**10:41** ……然後示範 Codex Remote 為 iPhone Duo 開發 App，Codex 介面裡會顯示 Simulator 的畫面。

**10:42** Romain 接著切換到 Codex Cloud，下達「把整個後端改寫成 Rust」的指令。

**10:43** 最後一個展示使用 Hugging Face 的 Microduck 機器人。

**10:46** Sam 回到台上。他說 ChatGPT 每週有 12 億人使用。「我們以前試過這件事，成果不一」，但現在要再試一次。第一項功能是「使用 ChatGPT 登入」：使用者可以登入你的 App，並直接使用自己已付費購買的 ChatGPT token。我盼這項功能推出已經很多年了！

**10:46** 另外還有外掛擴充功能——可以是「完整的應用程式」，並以原生方式整合進 ChatGPT 和 Codex。

**10:47** 他們展示了一個 Adobe 的 ChatGPT 外掛範例。

**10:48** 你也可以打造 ChatGPT Sites，並指定分享對象。（老實說，我原以為他們早就有這項功能了。）

**10:49** OpenAI Marketplace 今天上線，裡面列出合作夥伴。

**10:49** 最後用一段暖心內容介紹一些基於 OpenAI 平台打造產品的人，還播放了一支影片。

**10:52** 他們送給每位與會者一個這種裝置，還有一個「banked reset」。

**10:53** 他們在會場現場按下按鈕。這次重置影響全世界，而不只是 DevDay 的參加者。

**11:32** 嗯，這令人失望。我從他們的 Dots 公告裡點選「建立你的 Dot」，結果頁面叫我改用桌上型電腦。

**12:47** 我現在在 ChatGPT Sites 的分場。Jon Abrams 最初做出這項工具的原型，是因為他受不了內部工具很難發布。（我以前待過的好幾家公司也有同樣的痛點。）Sites 今年稍早推出，目前已託管 800 萬個網站，OpenAI 有 70% 的員工都在製作自己的 Sites。

**12:47** Katia Gil Guzman 展示一份列出 DevDay 新功能的試算表，並示範如何把它轉成 Site。她問：「可以把這份試算表做成 Launch Radar App，放進一個新資料夾，然後發布成 Site 嗎？」

**12:49** 你也可以叫 Codex 持續監看共用試算表，並隨著新資料加入而更新 Site。

**12:50** Sites 有 SQLite 資料庫！他們今天也推出 Sites 排程任務。

**12:51** Sites 也支援「使用 ChatGPT 登入」，而且預設為私人。

**12:52** 今天推出的 Sites 外掛功能，能讓 Site 顯示透過外掛匯入、針對訪客個人化的資料。我最近注意到 Claude Artifacts 可以存取 MCP，這看起來是類似的功能方向。

**12:53** 他們展示了在分場裡即時做出的 Radar Launch App。

**12:54** 你可以把其他人加為「編輯者」，讓他們也能發布 Site 更新。

**13:01** Katia 開始介紹 WebMCP，以及它比電腦操作有效率多少。

<div class="sep">· · ·</div>

## 從聊天工具走向工作環境

DevDay 的發布清單看起來很長，但主線相當清楚：OpenAI 正把 ChatGPT 從「回答問題的模型介面」擴展成能持續執行工作、連接企業工具，並供開發者延伸的平台。Dots、ChatGPT Space、Codex Cloud、Sites 和外掛不只是各自獨立的功能，而是在補齊代理的執行環境與分發管道。

不過，現場展示也提醒人們，代理「能長時間待命」不代表「可以放心交辦」。Dottie 的延遲、語音模式失靈，以及首次建立 Dot 被要求改用桌機，都指出產品可靠性、互動回饋與可及性仍是體驗的一部分。對開發者和企業而言，評估這類系統時，除了模型能力，也要看它能存取哪些資料、做哪些操作、如何回報進度，以及出錯時能否有效介入。

另一個值得注意的訊號是平台策略：登入、外掛、市集與可分享的 Sites，都是把 ChatGPT 使用者導向第三方應用的方式。這為開發者帶來新的入口，也讓權限、資料隔離與平台依賴變得更重要。真正決定 Dots 能否成為可靠工作方式的，將不只是它能做多少事，而是使用者能否看懂、限制並追蹤它正在做的事。
