---
title: "這家新聞網站的記者其實是 AI 機器人"
description: "AcutusWire 被揭露幾乎全自動產文，連記者「Michael Chen」都疑似是 AI；作者 Tyler Johnston 進一步追出它背後的政治操作與資金網絡。"
date: 2026-04-27
author: Tyler Johnston
layout: post
permalink: /2026-04-27/acutus-ai-reporters-openai-super-pac.html
image: /2026-04-27/og-acutus-ai-reporters-openai-super-pac.png
---

<div class="hero-badge">AI News · 2026-04-27</div>

![](/ai-articles/2026-04-27/og-acutus-ai-reporters-openai-super-pac.png)

**原文連結：** [Tyler Johnston - The reporters at this news site are AI bots. OpenAI’s super PAC appears to be funding it.](https://modelrepublic.substack.com/p/the-reporters-at-this-news-site-are)

## 摘要

- 這篇調查把 AcutusWire 拆開來看：它表面上像新聞網站，實際上卻像一條由 AI 驅動的內容工廠。
- 作者從一封可疑的採訪信開始，發現所謂記者 Michael Chen 幾乎肯定不是人，而是 AI interviewer。
- Acutus 內部的公開程式碼顯示，寫稿、抽引言、文法檢查、編輯審核幾乎全都能自動化。
- 站內 94 篇文章中，69% 被 AI 偵測器判成全自動生成，另有 28% 是部分自動生成。
- 更敏感的是，這套內容與政治顧問、遊說團體、以及 OpenAI 周邊的政治機器似乎有資金與敘事上的連結。
- 文章最後的問題不是「它有沒有用 AI」，而是「誰在用 AI 假裝成新聞」。

<div class="sep">· · ·</div>

上週，Encode 的副總裁兼總法律顧問 Nathan Calvin 收到一封奇怪的信。寄件者自稱是記者 Michael Chen，想就田納西州一項 AI 法案採訪他，媒體是 The Wire by Acutus。

信一看就不太對勁。作者事先把文章標題寫得很滿，提問框架帶著明顯立場，而且只提供書面問答，不接受電話訪談。網路與社群搜尋都找不到任何名叫 Michael Chen、而且與 Acutus 有關的人。寄件地址也很怪，是 generic 的 reporter@acutuswire.com，對一個自稱有許多撰稿人、幾乎天天發文的媒體來說，這並不正常。作者把這封信丟進 Pangram，一個號稱幾乎不會誤判的 AI 內容偵測器，結果顯示：這封信是「完全由 AI 生成」。

也就是說，Michael Chen 幾乎可以確定不是人。更進一步看，Acutus 本身也幾乎不可能有真正的記者。

Acutus 是一家匿名經營的數位新聞站，於 2025 年 12 月 29 日上線。不到四個月，它已經發了 94 篇長篇文章，主題涵蓋 AI 政策、參議院選舉、藥價改革、核能、加密貨幣、特許經營、技能導向聘用等等。網站沒有編輯台、沒有作者簽名、沒有具名主編，也沒有任何說明這個站到底是誰在經營、怎麼出現的。

它自稱提供的是「expert-sourced journalism」與「independent reporting」，About 頁面也把自己描述成一個彙聚各界專家的協作新聞平台。任何人都能填寫 Apply to be a Contributor 表單申請投稿，首頁側欄也會輪播徵稿主題，彷彿真的有一個編輯團隊在主動找人寫稿。

但問題是，這些作者看起來根本不存在，至少不是人類作者。作者把網站上每篇文章都丟進 Pangram 偵測，94 篇裡有 69% 被判定為完全 AI 生成，另外 28% 則是部分 AI 生成，只有 3 篇看起來是人寫的。

更直接的線索來自網站前端程式碼。Acutus 的 React 應用把一套後台編輯介面直接暴露在瀏覽器端。那裡有一個「AI Background Context」欄位，說明是要給 AI 的背景資訊；還有一個「Question Prompts」欄位，用來提供 AI 記者可問的問題。也就是說，這不是單純把稿子丟給模型潤飾，而是從一開始就把整個採訪、寫作流程交給 AI。

那個介面先建立一個 topic，接著按下大大的「Generate Story Draft」就能生成初稿，之後還可以「Regenerate」重來一次。同一套工具還會用 AI 從 research notes 抽引言、跑文法檢查，最後再做多輪 AI 編輯審核，並針對多個標準打分。

Acutus 甚至把所有內容都用 Creative Commons 授權，包裝成一種 wire service。About 頁面寫得很直白：他們的故事會像新聞通訊社一樣，讓其他出版方直接使用。

但網站露出的不只是成品，還有製作過程。`acutuswire.com/api/wire` 這個 API 在瀏覽器裡就能打開，回傳的不只是文章資料庫，還包括每篇內容的內部生成紀錄與 AI 審核結果。裡面有五種審核項目，其中四項會打分數：AP style compliance、quote accuracy、source verification、以及一個直接叫作 acutus 的欄位；另一項則是 fact-checking 狀態。每個審核項目都會列出 AI 找到的問題、建議修正，以及修正完成的時間戳。

時間戳本身就很能說明問題。單篇內容從第一個問題被修到最後一個問題的中位數只要 44 秒，而最後一次修正到正式發佈之間，通常只隔 10 秒。94 篇文章裡，有 42 篇的 AI 最終狀態甚至還是 needs_revision，也就是 AI 自己都覺得還沒準備好上線，但它們還是被發佈了。

某些被標記的問題還保留了 `aiOriginalText` 欄位，等於把模型原本寫了什麼和人工建議怎麼改都一起留下來。這種欄位名稱，只有在原稿本來就是 AI 寫的時候才說得通。

網站還有另一層更耐人尋味的設計：它看起來是朝著 AI 模型本身去設計的。robots.txt 對特定 AI crawler 給了相當寬鬆的權限，還有一個已停用的 `ai-plugin.json`，以及實驗性的 `llms.txt`。那份檔案雖然把網站包裝成「independent journalism」與「grounded in primary research, verified sources, and direct reporting」，但也不小心露餡，寫著「Reporting follows AP Style and a strict zero-hallucination editorial standard.」

如果整條流水線都自動化了，那真實人物的引言是怎麼進來的？作者追下去發現，很多 Acutus 文章裡的 quote 很像是從先前發佈的網頁內容直接抄來，再由 LLM 整理。不是每一則都如此，但至少有一位真正的人被採訪過。哈佛商學院教授 Joseph Fuller 曾在 LinkedIn 上說，他很高興把自己的想法提供給 Acutuswire，還附上了他被引用的文章連結。

Michael Chen 那封信也就更說得通了。Acutus 的前端 code 顯示，這名「記者」其實可能就是 AI interviewer。Bundle 裡有多個欄位直接提到「AI interviewer」和「reporter agent」，展示已上傳訪談的地方還寫著：「No interviews uploaded via the reporter API yet. Interviews submitted by the agent will appear here for review.」

換句話說，Michael Chen 很可能就是那個 AI 代理。當 Acutus 需要一位活人的引言時，它會派出一個 bot 去訪問對方。Fuller，以及任何在這些文章中出現的實名受訪者，談的其實都是一個假裝成人類的軟體。

更糟的是，有些文章看起來還混入了匿名來源，通常是所謂「close to Senate leadership」的共和黨幕僚、策士或顧問。這些匿名引言總是剛好站在作者想支持的那一邊，讓人不得不懷疑：部分資訊可能是直接被餵進 AI 生成器，而不是經過傳統採訪流程。

Acutus 本身又沒有什麼公開能見度。Google 幾乎找不到外部討論，Twitter/X 上也只被少數帳號提及過四次。但其中兩次都和一個人有關：Patrick Hynes，一家共和黨公關公司 Novus Public Affairs 的總裁。他曾轉發 Acutus 關於 Scott Brown 2026 年參議員選戰的文章，還轉推過一篇被反 AI safety 帳號分享的 Acutus 文章。

這裡開始有味道了。Hynes 所在的新罕布夏州，剛好也是 Acutus 特別愛寫的地區之一；網站大量文章都在談新罕布夏、緬因州與東北部政治。Acutus 甚至還替某些 Novus 客戶關心的議題發稿，像是藥品中間商、住房政策、或是特定參選人。舉例來說，作者提到 1 月 24 日、也就是在川普簽署那項全面藥品福利管理改革法案前 10 天，Acutus 跑了一篇攻擊 PBM 的文章；而後文又指出，PhRMA 這個 2025 年花了 3,819 萬美元遊說的產業協會，居然在內部 source log 裡被標成「PhRMA statements」，但公開版文章根本沒引用到任何 PhRMA 人物。

更值得注意的是，Acutus 大約有 15% 的文章在談 AI，而且它們常常與一組反監管科技遊說話術一致：批評 Anthropic、批評藍州管 AI、也批評紅州管 AI，並把近期針對 OpenAI 的暴力事件歸咎於記者與草根組織的言論。這些觀點，和那個規模達 1.25 億美元、由 OpenAI president Greg Brockman 與 OpenAI 投資人 a16z 主要資助的 super PAC，還有 Chris Lehane 周邊團隊推動的說法高度相似。

作者最後拋出的問題很直接：如果這些內容真的是政治機器的一部分，那它就是一個用 AI 包裝的偽新聞站；如果它還同時宣稱自己是獨立報導，那就不只是失真，而是徹底騙局。

這篇文章最刺人的地方，不在於 AI 被拿來寫稿，而在於它揭示了另一種更陰影的用途：AI 不只是用來自動化內容，而是用來自動化立場、包裝權威、並把政治宣傳偽裝成新聞。

<div class="sep">· · ·</div>

## 延伸評論：當新聞外包給模型，信任也一起被外包

這篇最值得警惕的，不只是「有沒有用 AI」，而是「AI 被放進哪一段流程」。如果模型只是幫忙潤稿，風險還在可控範圍；但一旦它開始負責選題、採訪、抽引言、審稿、發佈，新聞就會從記錄事實，滑向自動化立場生產。

更糟的是，當網站還把自己包裝成獨立媒體時，AI 反而成了遮羞布：它讓一整套政治操作看起來像技術創新，而不是訊息操控。真正該問的不是「AI 能不能寫新聞」，而是「誰在用 AI 決定哪些聲音被聽見」。