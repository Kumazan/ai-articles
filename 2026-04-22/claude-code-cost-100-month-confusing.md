---
title: "Claude Code 會漲到 100 美元/月嗎？大概不會，但整件事超混亂"
description: "Anthropic 先把 Claude Code 從 Pro 方案拿掉，又火速改口，Simon Willison 整理了這場價格測試、社群反應與品牌信任危機。"
date: 2026-04-22
author: Simon Willison
layout: post
permalink: /2026-04-22/claude-code-cost-100-month-confusing.html
image: /2026-04-22/og-claude-code-cost-100-month-confusing.png
---

<div class="hero-badge">AI News · 2026-04-22</div>

![](/ai-articles/2026-04-22/og-claude-code-cost-100-month-confusing.png)

**原文連結：** [Is Claude Code going to cost $100/month? Probably not—it’s all very confusing](https://simonwillison.net/2026/Apr/22/claude-code-confusion/)

## 摘要

- Anthropic 悄悄改了 Claude 價格頁，讓 Claude Code 看起來只剩 $100/月與 $200/月的 Max 方案可用。
- 這個改動立刻在 Reddit、Hacker News 和 X 上炸開，但官方一開始完全沒有同步公告。
- 之後 Anthropic 的成長主管表示，這只是約 2% 新訂閱者的測試，現有 Pro 與 Max 用戶不受影響。
- Simon 覺得這種做法最大的問題不是調價本身，而是溝通方式太差，直接傷到信任。
- 他也指出，Anthropic 等於把 Copilot / Codex 的市場機會白白送給 OpenAI。
- 幾個小時後價格頁又改回去了，但官方說法依然不夠清楚。

<div class="sep">· · ·</div>

2026 年 4 月 22 日

Anthropic 今天悄悄地，也就是完全沒有公告，更新了 [claude.com/pricing](https://claude.com/pricing) 頁面，但 [Choosing a Claude plan](https://support.claude.com/en/articles/11049762-choosing-a-claude-plan) 那頁卻沒有同步，頁面上多出了一個細小但很關鍵的變動（箭頭是我加的，而且 [已經被撤回](https://simonwillison.net/2026/Apr/22/claude-code-confusion/#they-reversed-it)）：

根據昨天的 [Internet Archive 存檔](https://web.archive.org/web/20260421040656/claude.com/pricing)，那裡原本有一個勾選框。Claude Code 原本是 $20/月 Pro 方案的一部分，但照新價格頁看起來，它現在只屬於 $100/月或 $200/月的 Max 方案。

更新：不要錯過這篇文章後面的 [更新](https://simonwillison.net/2026/Apr/22/claude-code-confusion/#they-reversed-it)，他們在這個變動上線幾個小時後就改回去了。

那到底是怎麼回事？不意外地， [Reddit](https://www.reddit.com/r/ClaudeAI/comments/1srzhd7/psa_claude_pro_no_longer_lists_claude_code_as_an/)、[Hacker News](https://news.ycombinator.com/item?id=47854477) 和 [Twitter](https://twitter.com/i/trending/2046718768634589239) 全都炸鍋了。

我一開始看到截圖時，自己都不太相信。除了那個價格格狀表以外，我找不到 Anthropic 任何公告。後來 Anthropic 的成長主管 Amol Avasare [發了推文](https://twitter.com/TheAmolAvasare/status/2046724659039932830)：

> 為了說明，這是針對約 2% 新的 prosumer 註冊者做的小型測試。既有的 Pro 與 Max 訂閱者不受影響。

這大概是我們目前最接近官方說法的內容。

我不太買單這個「約 2% 新 prosumer 註冊者」的說法，因為我問到的每個人看到的都是新的價格格狀表，而 Internet Archive 也已經 [快照](https://web.archive.org/web/20260422001250/https://claude.com/pricing) 下來了。也許他的意思是，他們只會在一段有限時間內跑這個新版價格頁，而那剛好又可以被說成是 2% 的註冊者？

我也覺得挺好笑的是，Claude Cowork 在 $20/月方案裡仍然可用，因為 Claude Cowork 基本上就是換了個沒那麼嚇人的名字的 Claude Code！

這整件事有好幾個地方都很糟。

如果我們先假設這真的是一場測試，而且測試結果不好、最後他們決定不推，那傷害其實已經很大了：

- 很多人都被嚇到或惹毛了，因為他們依賴的服務看起來像是要被臨時收回。對大多數人來說，$20/月 跟 $100/月 的差距真的很大，尤其是在薪資較低的國家。

- 這種不確定性超糟。由員工發一則推文，絕對不是這種公告的正確做法。我花了下午整整一小時去搞清楚到底發生了什麼。Anthropic 在價格透明度上的信任，對我來說已經被動搖了，而這又是我理解他們產品時非常關鍵的一環。

- 從策略上說，如果我知道他們可能把產品最低價直接拉高 5 倍，那我還要不要押注 Claude Code？

- 更偏個人感受，但我很在意：我投入了 [大量心力](https://simonwillison.net/tags/claude-code/)（到現在已經 105 篇而且還在增加）教大家怎麼用 Claude Code。我不想把這些心力投在一個大多數人根本負擔不起的產品上。

上個月我在 NICAR 資料新聞年會上，做了一場給記者的教學，主題是「Coding agents for data analysis」。我總不可能去教一群人依賴 $100/月 訂閱方案的課程吧！

這件事也讓我覺得 Anthropic 的策略很說不通。Claude Code 定義了 coding agents 這個類別，而且它已經替 Anthropic 帶來了數十億美元的年營收。它口碑非常好，但我不覺得這個口碑強到足以承受，直接把 $20/月 的試用門檻拿掉，讓人一開始就跳到 $100/月。

OpenAI 一直在大力追趕 Claude Code，推出自己的 Codex 產品。Anthropic 則是把行銷機會直接送到對手手上。看看 Codex 工程負責人 [Thibault Sottiaux](https://twitter.com/thsottiaux/status/2046740759056162816) 的這句話：

> 我們不曉得他們那邊到底在做什麼，但 Codex 會繼續在 FREE 和 PLUS（$20）方案中可用。我們有足夠的算力和高效率模型來支撐它。對重要變更，我們會提早與社群溝通。
>
> 透明與信任是我們不會打破的原則，就算這代表短期內少賺一些。提醒一下，你可以用訂閱費去投票，選擇你想活在什麼樣的價值觀裡。

我得補一句，我自己是付 $200/月 的 Claude Max，而且我覺得很值得。我以前曾經透過 Anthropic 拿過免費使用資格，但現在我是在全額付費，而且也付得心甘情願。

但我在意的是這些工具的可近性，尤其是我平常也在教別人怎麼用。如果 Codex 有免費方案，而 Claude Code 從 $100/月 起跳，那我當然應該改用 Codex，因為那樣我就能跟我想教的人用同一套工具。

我猜事情大概是這樣發生的：Anthropic 想優化營收成長，這很合理，而某個人提議把 Claude Code 只留給 Max 以上方案。這點子顯然很糟，但「測試文化」會覺得，任何點子都值得先丟出去試試看，說不定壞點子會有意外結果。

所以他們開始了測試，卻沒把一旦被發現會引發的哀號和咬牙切齒算進去，也沒把這種做法對長期品牌信任造成的傷害算進去。

或者他們其實有算，只是覺得值得冒險。

我不覺得這筆帳划算。他們接下來最好得非常明確地說出像是「我們聽見大家的回饋，並承諾未來會持續讓 Claude Code 留在 $20/月 方案裡」這種話，才有可能把我的信任補回來。

就目前來看，我會覺得 Codex 是更安全的選擇，值得我投入時間去學、去做教材。

#### 更新：他們已經撤回了

我寫這篇文章的同時，Anthropic 看起來已經改回去了， [claude.com/pricing](https://claude.com/pricing) 頁面又把 Pro 欄位中的 Claude Code 勾選框加回來了。不過我還找不到任何官方說明。

看看他們能不能提出一個夠有說服力的解釋或道歉，來抵消今天下午這場信任大火吧！

#### 更新 2：也許還是會影響 2% 的註冊者？

Amol [在 Twitter 上說](https://x.com/TheAmolAvasare/status/2046788872517066971)：

> 這次測試讓登入後的 landing page 和文件被更新，這是個錯誤。
>
> 很多人都在問，如果只有 2% 的新註冊者受影響，為什麼 landing page 和文件還會被更新。
>
> 對於沒被納入實驗的 98% 使用者來說，這確實很令人困惑，所以我們已經撤回 landing page 和文件的變更。

所以，測試還在跑，只是對外看不到了？

Simon Willison

編輯：

Hacker News 討論：<https://news.ycombinator.com/item?id=47854477>

<div class="sep">· · ·</div>

## 延伸評論：真正致命的不是調價，而是把信任拿來做灰度實驗

這篇最刺的地方，不是 Anthropic 想多收錢，而是它把一個會直接影響用戶工作流與預算的決策，包裝成不清不楚的測試，還讓最先看到的人是前台頁面、社群截圖和員工推文。對已經把 Claude Code 納入日常的人來說，這等於在告訴大家，產品規則可以突然變，且你可能要靠網路截圖才知道。

更大的問題是，Claude Code 這種工具的價值，靠的本來就是穩定、可預期、適合累積教學內容。今天如果最低價都可能一夕翻盤，使用者會先想：那我投資的流程、文件、教材、甚至團隊標準，會不會哪天也被連根拔起？這種不確定性，往往比漲價本身更傷。

對真的在做 agent / coding workflow 的人來說，這也是一個很現實的提醒，工具選型不能只看能力，還要看商業策略是不是夠穩。當對手還把免費或低價方案留著，Anthropic 這種試探就等於幫別人送教育市場。