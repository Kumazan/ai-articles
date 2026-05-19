---
title: "LLM 過去六個月：coding agents 變好，本地模型超出預期"
description: "Simon Willison 用 PyCon US 2026 五分鐘 lightning talk 回顧近半年 LLM 發展：模型王座快速輪替，但真正轉折是 coding agents 變得可日常使用，本地開源模型也大幅超出預期。"
date: 2026-05-20
author: Simon Willison
layout: post
permalink: /2026-05-20/last-six-months-llms-five-minutes.html
image: /2026-05-20/og-last-six-months-llms-five-minutes.png
---

<div class="hero-badge">Simon Willison · 2026-05-19</div>

![](/ai-articles/2026-05-20/og-last-six-months-llms-five-minutes.png)

**原文連結：** [The last six months in LLMs in five minutes](https://simonwillison.net/2026/May/19/5-minute-llms/)

## 摘要

- Simon Willison 把 PyCon US 2026 的五分鐘 lightning talk 整理成 annotated slides，濃縮回顧過去六個月的 LLM 發展。
- 他認為 2025 年 11 月是關鍵轉折點：最強模型稱號在 Anthropic、OpenAI、Google 之間快速換手，但更重要的是 coding agents 從「常常可用」跨到「大多可用」。
- OpenAI 與 Anthropic 在 2025 年多半都投入 Reinforcement Learning from Verifiable Rewards，搭配 Codex 與 Claude Code 這類 agent harness，讓模型寫程式的品質明顯提升。
- 文章也把 OpenClaw 的爆紅放進這段時間線：一個 2025 年 11 月底才初始 commit 的專案，到 2026 年 2 月已經成為個人 AI assistant 風潮的代表。
- 另一條主線是本地可跑的開源模型大幅超出預期，包括 Gemma 4、GLM-5.1、Qwen3.6-35B-A3B 等模型在插圖與能力展示上的進展。
- Simon 的結論很直白：過去六個月最值得記住的不是單一模型勝出，而是 coding agents 真的變好，以及可在筆電上跑的模型開始遠超原本預期。

<div class="sep">· · ·</div>

我把 PyCon US 2026 五分鐘 lightning talk 的 annotated slides 整理了出來，這次使用的是我的 annotated presentation tool 最新版本。

我在 PyCon US 2026 發表這場 lightning talk，試著用五分鐘總結過去六個月 LLM 的發展。

六個月是很剛好的時間範圍，因為它涵蓋了我一直稱為「2025 年 11 月轉折點」的那段時間。11 月是 LLM 的關鍵月份，尤其是在寫程式這件事上。

其中一件事是，所謂「最強」模型這個頭銜，大致靠感覺判斷，在 Anthropic、OpenAI、Google 這三大供應商之間換手了五次。

和往常一樣，我用「產生一張鵜鶘騎腳踏車的 SVG」這個測試來說明不同模型的差異。

為什麼用這個測試？因為鵜鶘很難畫，腳踏車很難畫，鵜鶘不可能騎腳踏車，而且任何 AI lab 都不太可能為了這麼荒謬的任務特別訓練模型。

11 月初，大家普遍認為「最強」的模型是 9 月 29 日發布的 Claude Sonnet 4.5。它畫出了這隻鵜鶘。

到了 11 月，它先被 GPT-5.1 超過，接著是 Gemini 3，然後是 GPT-5.1 Codex Max，最後 Anthropic 又靠 Claude Opus 4.5 把王座拿了回去。

我認為這批裡面 Gemini 3 畫出的鵜鶘最好，但鵜鶘並不是全部。多數實務工作者應該會同意，Opus 4.5 接下來幾個月都坐穩了王座。

這件事花了一點時間才變得清楚，但 11 月真正的大新聞是：coding agents 變好用了。

OpenAI 和 Anthropic 在 2025 年大多數時間都投入 Reinforcement Learning from Verifiable Rewards，目標是提升模型寫出的程式碼品質，尤其是當模型搭配 Codex 和 Claude Code 這類 agent harness 使用時。

11 月，這些工作的成果開始變得明顯。Coding agents 從「常常可用」變成「大多可用」，跨過了一道品質門檻：你終於可以把它們當成日常工具，用來完成真正的工作，而不是把大部分時間花在修它們那些愚蠢錯誤上。

同樣是在 11 月，另一件事發生了：一個當時還很冷門、名叫「Warelay」的 repo，由一位叫 Pete 的人送出了第一個 commit。

投影片截圖顯示，這個 initial commit 的 hash 是 `f6dd362`，時間是 2025 年 11 月 24 日，內容是一份 MIT license。

到了 12 月到 1 月的假期期間，很多人都趁著休息時間測試這些新模型與 coding agents，看看它們到底能做到什麼。

它們能做到很多事！有些人因此稍微興奮過頭。我自己也短暫經歷了一種 LLM psychosis，開始開出各種野心過大的專案，想看看自己能把它們推到多遠。

其中一個專案，是我用 vibe coding 做出來的 Python 版 JavaScript 實作，算是鬆散移植 MicroQuickJS。我把它叫做 micro-javascript，你可以在瀏覽器裡試用它的 playground。

投影片中的 playground 範例使用 `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`，把它變成 `Doubled: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]`，篩出 `Evens: [2, 4, 6, 8, 10]`，最後得到 `Sum: 55`；畫面也顯示 `Output 27` 與 `Execution time: 8.00ms`。

那個 playground demo 展示的是：JavaScript 程式碼透過我的 micro-javascript library 執行，而這個 library 是用 Python 寫的，跑在 Pyodide 裡；Pyodide 又跑在 WebAssembly 裡；WebAssembly 又跑在 JavaScript 裡；最後整套東西跑在瀏覽器裡。

這很酷！但世界上有人真的需要一個有 bug、很慢、不安全、半成品的 Python 版 JavaScript 實作嗎？

並沒有。我還有不少那段假期做出的專案，後來都已經安靜地退休了。

接著來到 2 月。還記得那個 11 月底才送出第一個 commit 的 Warelay 專案嗎？

12 月到 1 月期間，它經歷了不少改名；到了 2 月，它以最終名稱 OpenClaw 開始席捲世界。

對一個成立不到三個月的專案來說，它獲得的關注量相當驚人。

OpenClaw 是一種「personal AI assistant」，而且我們其實已經有了這類東西的通稱，像 NanoClaw、ZeroClaw 等等，統稱為 Claws。

Mac Minis 開始在矽谷周邊賣到缺貨，因為大家都在買來跑自己的 Claws。

Drew Breunig 跟我開玩笑說，這是因為它們就像新的 digital pets，而 Mac Mini 正好是安置 Claw 的完美水族箱。

我最喜歡用來比喻 Claws 的，是 Alfred Molina 在 2004 年電影《Spider-Man 2》裡飾演的 Doc Ock。他的四隻機械觸手由 AI 驅動，只要 inhibitor chip 沒壞就很安全；一旦壞掉，它們就會變邪惡並接管一切。

2 月還有另一件事：Gemini 3.1 Pro 發布，並且幫我畫出了一張非常好的鵜鶘騎腳踏車圖。你看，牠籃子裡甚至還有一條魚。

然後 Google 的 Jeff Dean 發了一段影片：一隻動畫鵜鶘在騎腳踏車，旁邊還有一隻青蛙騎 penny-farthing、一隻長頸鹿開小車、一隻鴕鳥踩直排輪、一隻烏龜玩 kickflip 滑板，還有一隻臘腸狗開加長禮車。

所以也許 AI labs 真的有在注意這件事。

光是過去一個月就發生了很多事。

Google 發布了 Gemma 4 系列模型，這是我看過美國公司推出的最強 open weight 模型。投影片上示範的是 Gemma 4 26B-A4B（17.99GB）。

同樣是在上個月，中國 AI lab GLM 推出了 GLM-5.1，一個 open weight、1.5TB 的怪物；投影片標示它是 MIT 授權、754B parameters、1.51TB。如果你負擔得起運行它的硬體，這是個非常有效的模型。

GLM-5.1 幫我畫出了這張相當稱職的鵜鶘騎腳踏車圖。

不過當它試著把圖動畫化時，腳踏車彈到上方，整台車也變形了。

Bluesky 上的 Charles 建議我試試「North Virginia Opossum on an E-scooter」。

結果它真的做出來了！我也用其他模型試過這題，但沒有任何一個接近這個效果。「Cruising the commonwealth since dusk」這句標語也很完美，而且它也是動畫。

4 月另一批很有意思的中國 open weight 模型來自 Qwen。Qwen3.6-35B-A3B 在我的筆電上畫出的鵜鶘，比 Claude Opus 4.7 還好。這是一個 20.9GB 的 open weights 模型，可以在我的筆電上跑。

我覺得這主要證明了：鵜鶘騎腳踏車這個 benchmark 已經明確超出它作為有用測試的極限了。

這是 9 月 Claude Sonnet 4.5 畫的鵜鶘，放在這裡作為比較。

所以，這就是過去六個月的兩個主題：coding agents 真的變得很好用；而可在筆電上運行的模型，雖然比前沿模型弱很多，卻已經開始大幅超出大家的預期。

<div class="sep">· · ·</div>

## 真正的轉折不是模型排名，而是能力變成日常基礎設施

這篇文章有趣的地方，是它沒有把過去六個月說成某一家模型公司的勝利。模型排名當然重要，但更值得注意的是能力的「可用性門檻」被跨過了：coding agents 從炫技 demo 變成許多開發者每天可以實際交付工作的工具。

這種轉折通常比單次模型發布更深。當工具從「偶爾驚艷」變成「多數情況下可靠」，使用者的工作方式會跟著改變：任務拆分、驗證方式、專案節奏、甚至個人機器的角色都會重排。OpenClaw 和 Claws 的流行，正是這種變化從模型能力一路擴散到日常工作環境的例子。

另一個值得抓住的訊號，是本地模型不再只是「便宜但明顯較弱」的備案。當 20.9GB 的 Qwen3.6-35B-A3B 能在筆電上跑出令人驚訝的效果，開發者就會開始重新計算哪些工作真的需要前沿模型、哪些工作可以留在本機完成。這會影響成本、隱私、延遲，也會影響 agent 架構的設計方式。

對真的在做 agent workflow 的人來說，這篇的重點不是追逐下一個冠軍模型，而是建立一套能快速吸收新能力的系統：模型可以替換、工具鏈要可驗證、本地與雲端模型要能分工。未來六個月的勝負，很可能不只在模型本身，而在誰能把這些能力穩定地接進日常工作。
