---
title: "Mr. Chatterbox：用維多利亞時代文本訓練的 340M 模型，能在你的電腦上跑了"
description: "Trip Venturella 用英國圖書館 28,000 本維多利亞時代書籍、29.3 億 tokens 從頭訓練了一個 3.4 億參數的小模型，完全不含現代資料。Simon Willison 實際跑過，結論是「很弱，但很有趣」。"
date: 2026-03-30
author: Simon Willison
layout: post
permalink: /2026-03-30/mr-chatterbox-victorian-era-llm.html
image: /2026-03-30/og-mr-chatterbox-victorian-era-llm.png
---

<div class="hero-badge">AI News · 2026-03-30</div>

![](/2026-03-30/og-mr-chatterbox-victorian-era-llm.png)

**原文連結：** [https://simonwillison.net/2026/Mar/30/mr-chatterbox/](https://simonwillison.net/2026/Mar/30/mr-chatterbox/)

## 摘要

- Mr. Chatterbox 是從頭訓練的語言模型，僅用維多利亞時代版權過期文本，29.3 億 tokens、3.4 億參數（約 GPT-2-Medium 大小）
- 完全不含任何 1899 年之後的訓練資料，連詞彙與概念都僅限十九世紀文學
- 模型磁碟大小僅 2.05GB，可在一般 CPU 上執行
- Simon Willison 用 Claude Code 幫他寫了 LLM 外掛，直接在終端機就能對話：`llm chat -m mrchatterbox`
- 缺點很明顯：回答像馬可夫鏈而非真正的 LLM，問答功能很弱
- 訓練資料量遠低於 Chinchilla 論文建議（340M 模型理論需 ~70 億 tokens），作者預估要 4 倍以上才會開始實用
- 微調階段使用了 GPT-4o-mini 生成的合成對話資料，某種程度上破了「不含現代資料」的承諾

<div class="sep">· · ·</div>

Trip Venturella 發布了 [Mr. Chatterbox](https://www.estragon.news/mr-chatterbox-or-the-modern-prometheus/)，一個完全從頭訓練的語言模型，訓練語料是英國圖書館超過 28,000 本維多利亞時代書籍。以下是模型卡（model card）的描述方式：

> Mr. Chatterbox 是一個語言模型，完全從零開始訓練，語料是 1837 至 1899 年間出版的 28,000 多本英國圖書，來自英國圖書館提供的資料集。這個模型**絕對不含任何 1899 年之後的訓練輸入**——詞彙與概念完全形成於十九世紀文學。

Mr. Chatterbox 的訓練語料共 28,035 本書，過濾後約 29.3 億輸入 tokens，模型約 3.4 億參數，跟 GPT-2-Medium 大小相當。當然不同的是，GPT-2 是從大量現代資料訓練的。

一直以來有個想法困擾著我：要訓練一個有用的 LLM，勢必要靠大量未授權的抓取資料，那有沒有可能完全用公版領域資料訓練出一個可用的模型？Mr. Chatterbox 讓我們終於能親自驗證這個問題的答案。

老實說，這個模型**很弱**。跟它聊天感覺更像在跟馬可夫鏈對話——回覆可能帶有可愛的維多利亞風格，但很難得到真正實用的回答。

[2022 年的 Chinchilla 論文](https://arxiv.org/abs/2203.15556)建議訓練 tokens 應該是參數量的 20 倍。以 340M 參數的模型來說，這代表需要約 70 億 tokens，是這次使用的 29.3 億 tokens 的兩倍多。最小的 Qwen 3.5 模型是 600M 參數，而那個模型族要到 2B 以上才開始有趣——所以作者的直覺是，要得到真正可用的對話夥伴，可能需要四倍以上的訓練資料。

但光是這個概念本身就足夠有趣了！

## 用 LLM 指令碼在本地執行

Simon 決定用自己寫的 [LLM](https://llm.datasette.io/) 框架在本地執行這個模型。

整個過程大部分由 Claude Code 完成——[這是 transcript](https://gisthost.github.io/?7d0f00e152dd80d617b5e501e4ff025b/index.html)。

Trip 是用 Andrej Karpathy 的 [nanochat](https://github.com/karpathy/nanochat) 訓練模型的，所以 Simon 先 clone 了那个專案、拉下模型權重，然後叫 Claude 寫了個 Python 腳本來執行模型。過程中需要從 [Space 展示網站的原始碼](https://huggingface.co/spaces/tventurella/mr_chatterbox/tree/main) 取得一些細節，才能正確跑起來。接著再叫 Claude [閱讀 LLM 外掛教學](https://llm.datasette.io/en/stable/plugins/tutorial-model-plugin.html)，把剩下的外掛功能建完。

[llm-mrchatterbox](https://github.com/simonw/llm-mrchatterbox) 就是成品。安裝方式：

```bash
llm install llm-mrchatterbox
```

第一次執行時，會自動從 Hugging Face 下載 2.05GB 的模型權重。試試看：

```bash
llm -m mrchatterbox "Good day, sir"
```

或開啟持續對話：

```bash
llm chat -m mrchatterbox
```

如果沒有安裝 LLM 也可以直接用 `uvx` 開啟對話：

```bash
uvx --with llm-mrchatterbox llm chat -m mrchatterbox
```

用完之後，可以用以下指令刪除快取模型：

```bash
llm mrchatterbox delete-model
```

這是 Simon 第一次用 Claude Code 從頭建立一個完整的 LLM 模型外掛，效果非常好。他預期之後還會用同樣的方法繼續做這類實驗。

Simon 仍然希望有一天能看到從完全公版資料訓練出實用模型的例子。Trip 能用 nanochat 和 29.3 億 tokens 走到這一步，已經是個好的開始。

## 關於微調資料的補充

2026 年 3 月 31 日更新：Simon 最初發布本文時忽略了這點，但 Trip 有一份[更詳細的專案記錄](https://www.estragon.news/mr-chatterbox-or-the-modern-prometheus/)，裡面有更完整的訓練過程說明。關於書籍的預訓練過濾方式一開始是這樣做的：

> 首先下載了英國圖書館所有十九世紀書籍的資料集，然後過濾到維多利亞女王在位期間的書籍（遺憾地排除了珍·奧斯汀的小說），再以光學字元識別（OCR）信賴度 0.65 以上的書籍，最後留下 28,035 本，約 29.3 億 tokens 的預訓練資料。

讓模型表現得像對話模型反而更難。Trip 一開始試過用王爾德和蕭伯納的劇本，但發現對話配對數量不夠。接著試著從書籍本身抽取對話，但效果很差。最後成功的做法是叫 Claude Haiku 和 GPT-4o-mini 生成合成對話配對來做監督式微調（SFT）。這解決了問題，但某種程度上稀釋了原本模型卡所聲稱的「不含任何 1899 年之後的訓練資料」的宣稱。

<div class="sep">· · ·</div>

## 模型很弱，但它回答了一個比結果更重要的問題

Mr. Chatterbox 作為一個可用的 AI 助理，坦白說毫無實用價值。跟它聊天更像在和一個有維多利亞口音的 auto-complete 對話，而不是在和一個能理解問題的 model 互動。Simon Willison 自己也用「很弱」來形容它。

但這個專案的價值完全不在它的實用性上。

**它是目前最乾淨的一次「公版資料能不能訓練出可用 LLM」的實驗。** 長期以來，AI 產業有一個很方便但很少被正面挑戰的敘事：要訓練有用的模型，你就是需要大量未授權抓取的資料。Mr. Chatterbox 用 28,000 本版權已過期的維多利亞時代書籍，從頭訓練了一個 340M 參數的模型。結果不好——但它讓這個問題從「理論上可不可能」變成了「需要多少資料才夠」，並且給出了一個具體的下界。

Chinchilla 論文建議 340M 模型需要約 70 億 tokens，Trip 只用了 29.3 億。以此推算，如果能把公版語料擴大到 4 倍以上——涵蓋更多語言、更多時代的公版文本——結果可能會有質的不同。這不是幻想：Project Gutenberg、HathiTrust、Internet Archive 的公版藏書量遠超 28,000 本，問題只是 OCR 品質和語料清洗的工程量。

**微調資料的妥協也很有教育意義。** Trip 最終用了 GPT-4o-mini 生成的合成對話來做 SFT，這在某種程度上破了「不含現代資料」的承諾。但這個妥協恰好揭示了一個真實的技術瓶頸：預訓練和微調需要的資料性質完全不同。公版書籍提供的是語言能力和世界知識，但把模型變成能夠問答的對話模型，需要的是大量格式化的指令-回應配對——而這種格式的公版資料幾乎不存在。未來如果要走這條路，合成資料的合法性和品質，會是一個繞不開的問題。

對所有在關注 AI 訓練資料合法性爭議的人來說，Mr. Chatterbox 最大的價值是：它把「能不能只用公版資料」從立場之爭，推進到了可量化的工程問題。答案目前是「還不夠」，但距離「夠」的那條線，可能比很多人想像的更近。
