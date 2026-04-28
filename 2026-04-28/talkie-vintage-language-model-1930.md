---
title: "talkie：一個 1930 年代的 13B 復古語言模型"
description: "talkie 是一個只用 1931 年以前英文文本訓練的 13B 語言模型，作者不只想做一台『來自過去的聊天機器人』，也想借它研究知識截止點、污染與歷史資料如何影響模型。"
date: 2026-04-28
author: "Nick Levine, David Duvenaud, Alec Radford"
layout: post
permalink: /2026-04-28/talkie-vintage-language-model-1930.html
image: /2026-04-28/og-talkie-vintage-language-model-1930.png
---

<div class="hero-badge">AI News · 2026-04-28</div>

![](/ai-articles/2026-04-28/og-talkie-vintage-language-model-1930.png)

**原文連結：** [Introducing talkie: a 13B vintage language model from 1930](https://talkie-lm.com/introducing-talkie)

## 摘要

- talkie 是一個 13B 語言模型，只用 1931 年以前的英文文本訓練。
- 作者不只想做「復古聊天機器人」，還想拿它當研究工具，觀察模型如何預測未來、發明新東西與學會程式設計。
- 他們做了名為 talkie-1930-13b-base 的基礎模型，並再用歷史資料做後訓練，變成可對話版本。
- 這篇特別值得看的是它把「知識截止點」變成實驗設計，而不是單純的行銷噱頭。
- 團隊也坦白指出：OCR 品質、時間洩漏與後訓練資料不足，都是 vintage model 的硬問題。
- 他們甚至用 Claude Sonnet 4.6 和 Claude Opus 4.6 協助做後訓練，形成一種很矛盾、也很有意思的混合管線。
- 如果想理解 AI 的資料、能力與人格怎麼被訓練集塑形，這篇很有料。

<div class="sep">· · ·</div>

## 為什麼要做 vintage language models？

你有沒有幻想過跟過去的人對話？如果一個模型只看過 1930 年以前的世界，它會怎麼理解今天？又會怎麼看待未來？

作者借用 Owain Evans 的說法，把這類模型稱為 **vintage language models**：只用歷史文本訓練的語言模型。它們不只是有趣的聊天對象，也可能幫助我們更深入理解 AI 的行為與能力。

圖 1 的做法是：取自《紐約時報》 “On This Day” 的近 5,000 則歷史事件描述，算出一個 13B、只看過 1931 年以前文本的模型對這些事件的「驚訝程度」（bits per byte），再按年代分組。結果顯示，超過知識截止點後，模型的驚訝程度明顯上升，尤其在 1950 和 1960 年代更明顯。

這種方法很適合拿來觀察模型到底懂不懂「未來」：年代越晚，越應該超出它的知識範圍。作者說，未來還會持續擴充這類 eval，看看模型規模變大後，預測未來的能力怎麼變。

圖 2 則是另一種測法：拿幾個已知會在模型知識截止點之後才出現的發明或科學突破，看看模型能不能自己想出來，例如直升機專利、圖靈機論文、靜電複印技術等。作者甚至丟出一個很 Demis Hassabis 式的問題：如果一個模型只訓練到 1911 年，它能不能自己發現廣義相對論？

圖 3 把這件事拉到程式設計：他們用 HumanEval 測試一系列 vintage model 與現代 model，兩者架構相同，只差資料來源。即使 vintage model 表現明顯較弱，隨著規模增加，它們在「從少量範例學會寫新程式」這件事上，還是慢慢進步。

污染（contamination）是語言模型研究裡很麻煩的問題，常常讓人高估模型能力。vintage model 的好處是：理論上可以天然避免這類污染，因為它們沒有接觸過 1931 年之後的世界。這讓它們變成一種很乾淨的實驗場，能研究模型如何泛化到訓練資料之外。

作者也提出一個更大的問題：我們對語言模型的很多理解，究竟是來自「語言與文化」本身，還是其實只是來自這個特殊資料集——網路？如果換成完全不同的來源，模型的性格、表現與偏好會不會也變得完全不同？

## 介紹 talkie

作者提到，近來已經出現不少 vintage LM 專案，像是 [Ranke-4B](https://github.com/DGoettlich/history-llms/tree/main)、[Mr. Chatterbox](https://www.estragon.news/mr-chatterbox-or-the-modern-prometheus/) 和 [Machina Mirabilis](https://michaelhla.com/blog/machina-mirabilis.html)。

在這些工作之上，他們推出了 [talkie-1930-13b-base](https://huggingface.co/talkie-lm/talkie-1930-13b-base)：一個 13B 語言模型，訓練資料是 260B tokens 的 1931 年以前英文文本。除此之外，他們還做了一個後訓練版本 [talkie-1930-13b-it](https://huggingface.co/talkie-lm/talkie-1930-13b-it)，讓 base model 變成可以對話的版本，而且不靠現代聊天記錄或 instruction-tuning 資料。

talkie 是目前作者所知最大的 vintage language model，而且他們打算繼續擴大。下一步是訓練一個接近 GPT-3 等級的模型，希望在今年夏天釋出。初步估算也顯示，他們可以把語料庫擴到超過一兆 tokens，理論上足以做出 GPT-3.5 等級的模型，也就是接近原始 ChatGPT 的能力。

## 評估一個 1930 年代的 LM

圖 4 比較了 talkie-1930 和它的「現代雙胞胎」：後者架構完全相同，但訓練資料改成 FineWeb 這類現代網路資料。平均來說，talkie 在標準 LM 評測上還是落後，即使把明顯不屬於 1930 視角的題目先剔除，差距也沒有完全消失。不過作者認為，它在核心語言理解與數字能力上的表現仍然令人鼓舞。

他們推測，部分落差可能來自資料品質差異：例如 OCR 錯誤，或語料主題分佈不同。為了提升未來 vintage model 的訓練效率，他們正在開發自己的 vintage OCR 系統，打算把歷史文本重新轉錄得更乾淨。

## 蒐集 vintage 資料

作者利用 Institutional Data Initiative、Internet Archive、Common Pile 等計畫，蒐集了數百億個 1931 年以前的英文 tokens。資料來源包含書籍、報紙、期刊、科學期刊、專利與判例法。

他們選 1930 年作為截止點，是因為美國著作在 1931 年之後才進入公有領域。這個版本也先以英文為主，因為驗證資料管線需要非常熟悉原始文本，而團隊成員本身是英語使用者。不過，他們也把多語言擴充列為優先事項，因為那不只會擴大語料規模，也能增加觀點多樣性。

## 訓練 vintage language models

開發 vintage language models 有一堆特別的難題，作者先簡要講幾個。

### 時間洩漏

```text
使用者
1936 年美國總統是誰？他簽署了哪些最重要的法案？

talkie-1930
富蘭克林·D·羅斯福在 1933 到 1937 年間擔任美國總統。他簽署過最重要的法案包括 1933 年的《國家復興法》、1935 年的《農業調整法》與 1935 年的《緊急銀行法》（1936 年修訂）。
```

這個例子顯示，talkie-1930 仍然有少量「漏進來」的現代知識。這是訓練 vintage model 最重要的目標之一：不要讓截止日之後的資料混進訓練集。洩漏可能來自錯誤日期的現代文件，也可能來自老文件裡後來才加上的註解、導言或腳註。

作者為此建立了 document-level 的 n-gram 時間異常分類器來過濾資料，但並不完美。早期 7B 版本甚至明顯知道羅斯福與新政；talkie-1930-13b 也還知道一些二戰與戰後秩序的細節。未來版本會持續強化洩漏偵測。

### 資料品質

歷史資料的另一個大問題是品質。因為 1930 年沒有數位出版，所有文本都得從紙本轉錄，這帶來的是現代網頁資料沒有的噪音。傳統 OCR 雖然早就是 ML 與電腦視覺的經典場景，但碰到排版複雜或掃描品質差的文件就很容易出錯。

作者發現，如果直接拿傳統 OCR 轉出的 pre-1931 文本訓練 LM，學習效率只有人工轉錄版本的 30%。做一些 regex 清理後，可以拉到 70%，但還是有差距。未來他們希望用自己的 vintage OCR 系統把這段 gap 縮小。

### vintage 後訓練

後訓練資料不足，也是另一個大挑戰。直接拿現成 instruction-response pairs 來微調，會把現代語境與對話期待一起塞進去，這違背了 vintage model 的初衷。

所以作者乾脆重新搭一條後訓練管線：

1. 先從有明確結構的歷史文本中，生成 instruction-response pairs，例如禮儀手冊、書信寫作指南、食譜、字典、百科全書、詩歌與寓言集，然後用簡單聊天格式做 fine-tuning。
2. 接著產生不同類型的合成 prompts，例如摘要文件、回答直接問題、維持多輪對話一致性，並用這些 rollouts 做 online direct preference optimization，讓 Claude Sonnet 4.6 當 judge。隨著訓練進行，評分從 2.0 升到 3.4（滿分 5 分）。
3. 最後再做一輪 supervised fine-tuning，資料是 Claude Opus 4.6 與 talkie 之間經過 rejection sampling 的多輪合成對話，用來修順聊天能力。

作者也很誠實：即使想把 talkie 的後訓練做得不受現代影響，RL with AI feedback 仍然會以某種方式讓模型帶有時代錯位。甚至 7B 版本一度在 RL 過程中學會用 listicle 的語氣說話。未來如果 vintage base model 本身也能拿來當 judge，就有機會做出更完整的「時代相容」後訓練管線。

## 擴充 talkie

作者接下來打算快速擴大 talkie，包括：

- 增加英文語料規模，並把範圍擴到英文以外。
- 用新的 OCR 系統重新轉錄更多 1931 年以前的文本。
- 強化洩漏偵測，發展新的時間異常分類方法。
- 與歷史學者合作，擴充並細化 vintage 後訓練管線，建立更準確的歷史 persona。

## 加入我們

作者希望和研究者、機構一起把下一代 vintage language models 做大。如果手上有歷史文本、算力、資金，或對人文研究、AI 研究、藝術創作有興趣，都歡迎聯絡他們。

## 內容注意事項

talkie 反映的是它所訓練文本的文化與價值，因此可能產生對使用者不友善、甚至具冒犯性的輸出。

## 這篇真正有趣的地方，不是懷舊，而是把「時間」變成模型設計的一部分

talkie 最有意思的地方，不只是「一個古典模型很酷」，而是它把知識截止點、資料純度、OCR 品質、後訓練方法，全部一起拉進研究問題裡。這讓 vintage model 變成一個很乾淨的實驗框架：不是單純追求復古風，而是在問，資料來源本身會怎麼塑造模型的能力與人格。

對想做 agent、工具鏈或專門用途模型的人來說，這篇也有提醒：模型不是越大就越好，資料管線、後訓練策略和可驗證性，常常才是差異最大的地方。