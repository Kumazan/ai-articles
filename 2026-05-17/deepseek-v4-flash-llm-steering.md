---
title: "DeepSeek-V4-Flash 讓 LLM steering 又值得關注了"
description: "Sean Goedecke 認為，DeepSeek-V4-Flash 這類夠強的本地開源模型，可能讓直接操控模型 activation 的 steering 技術重新變得值得實驗。"
date: 2026-05-17
author: Sean Goedecke
layout: post
permalink: /2026-05-17/deepseek-v4-flash-llm-steering.html
---

<div class="hero-badge">AI News · 2026-05-17</div>

**原文連結：** [DeepSeek-V4-Flash means LLM steering is interesting again](https://www.seangoedecke.com/steering-vectors/)

## 摘要

- LLM steering 指的是在推論過程中直接調整模型 activation，用「steering vector」影響輸出，而不是只靠 prompt 或重新訓練。
- DeepSeek-V4-Flash 搭配 antirez 的 DwarfStar 4，讓夠強的本地模型首次變成許多工程師可實際嘗試 steering 的對象。
- 作者認為 steering 的吸引力在於它像模型內部控制面板：理論上可以調整簡潔度、謹慎度、拒答傾向等行為。
- 但多數簡單用途仍可能被 prompt 打敗；真正困難的目標，例如「提升智慧」或「壓縮整個 codebase 知識」，很可能接近 fine-tuning 或重新訓練問題。
- HN 討論補充指出，steering 已可用於降低或動態移除模型拒答，且 runtime steering 比直接修改模型權重更細緻、可逆。
- 作者的結論是：不必過度樂觀，但開源社群若能在未來半年找出實用 steering 特徵庫，這條路線就值得重新評估。

<div class="sep">· · ·</div>

自從 [Golden Gate Claude](https://www.anthropic.com/news/golden-gate-claude) 之後，作者就一直對「steering」很著迷：也就是在模型推論進行到一半時，直接操控模型的 activation，藉此引導 LLM 輸出。

### DeepSeek V4 Flash

這篇文章的靈感來自 antirez 最近的專案 [DwarfStar 4](https://github.com/antirez/ds4/tree/main)。它是一個被精簡到只跑 DeepSeek-V4-Flash 的 [llama.cpp](https://github.com/ggml-org/llama.cpp) 版本。這個模型特別在哪裡？它可能正是許多工程師等待已久的東西：一個足夠好的本地模型，至少能和低階前沿模型的 agentic coding 能力競爭。

因為 steering 需要本地模型，現在許多工程師才第一次真正有機會嘗試它。antirez 也確實把 [steering](https://github.com/antirez/ds4/tree/main/dir-steering) 做成 DwarfStar 4 的一等功能。現在它還很初階，基本上只是可以用 prompt 複製的玩具級「verbosity」範例；但最初版本也才在 [8 天前](https://github.com/antirez/ds4/commit/d997b56c151184bcff469dd8302ed97f23481024)發布。作者打算密切追蹤這個專案。

### Steering 的運作方式

steering 的基本想法，是從模型內部狀態抽出某個概念，例如「回答簡短」，接著在推論期間伸手進去，增強構成該概念的數值 activation。

一種做法是把同一組 100 個 prompt 餵給模型兩次：一次使用正常 prompt，一次在 prompt 後面加上「回答簡短」。接著針對每一組 prompt pair 測量模型 activation 的差異，做法是把其中一個 activation matrix 減掉另一個。這就是你的「steering vector」。理論上，你可以把這個 vector 加到任何 prompt 的同一個 activation layer，得到相同效果，也就是讓模型回答得更簡短。

另一種更精緻的方式，是訓練第二個模型，從主模型的 activation 中抽取「features」：也就是看起來會一起出現的行為模式。接著你可以嘗試把這些 feature 對回個別概念，再用相同方式增強它們。Anthropic 用 [sparse autoencoders](https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html) 做的，大致就是這件事。它和天真的做法原理相同，但能捕捉更深層的模式，代價是需要更多時間、算力與專業能力。

### 為什麼 steering 有趣

steering 聽起來像作弊碼。與其費心組一份訓練資料集，試著把模型往訓練資料分布中「聰明」的那一端推，為什麼不直接找出模型腦中的「聰明」旋鈕，然後一路轉到底？

它看起來也像是一種更優雅的模型語氣調整方式。與其反覆微調 prompt，例如加入或移除「你必須」這類限定詞，難道不能直接做一個控制面板，放上「簡潔 / 詳盡」或「謹慎 / 速度」之類的滑桿，然後直接調整模型內部狀態嗎？

最後，它就是很酷。看著 Golden Gate Claude 不情願地把每一句話都拖回金門大橋，既迷人又令人不安，像 Oliver Sacks 的神經學軼事一樣。若自己的心智也被以類似方式微調，那還會是同一個自己嗎？

### 為什麼 steering 一直沒有被大量使用

既然如此，為什麼大家沒有更常使用 steering？為什麼 ChatGPT 和 Claude Code 還沒有一個可以即時調整模型大腦的 steering 面板？其中一個原因是，steering 在 AI 研究裡有點尷尬地屬於「中產階級」想法。

它低於大型 AI lab 的需求層級。這些 lab 可以直接操控自己的模型，不需要在推論途中做笨拙的腦部手術。Anthropic 確實在做這類工作，但據作者所知，主要是從 interpretability 和安全角度出發。當他們希望模型以某種方式行動時，不會繞去做 steering，而是直接訓練模型。

steering 對一般 AI 使用者也遙不可及，因為大家多半透過 API 使用 LLM，拿不到 steering 所需的模型權重或 activation。舉例來說，只有 OpenAI 能替 GPT-5.5 辨識或暴露 steering vector。開源權重模型理論上可以這樣做，但直到很近以前，還沒有足夠強、值得這樣折騰的開源模型。

除此之外，大多數基本 steering 應用都會輸給 prompt。能直接操控模型大腦聽起來很厲害，但你知道還有什麼也能直接操控模型大腦嗎？prompt token。你可以用 steering 對 activation 做相當細緻的控制，但只要調整 prompt 語言，也已經能做到極細緻的控制。換句話說，如果只是要讓模型更囉嗦，特地 steering 沒有太大意義，直接要求它就好。

### Steering 那些 prompt 不動的東西

steering 可能真正有用的一種情境，是找到某種無法用 prompt 要求的概念。例如「智慧」呢？以前可以用 prompt 要求智慧，這就是為什麼 GPT-4o 時代的 prompt 常以「你是專家」開頭；但當代模型已經把這點內建進人格裡，所以再 prompt 也沒用。也許 steering 仍然有效？

這終究是實證問題，但作者懷疑我們能否找到一個「智慧」steering vector。換句話說，構成「智慧」這麼困難概念的 steering vector，可能幾乎等同於模型整組權重，因此辨識它最後會退化成「訓練一個聰明模型」的問題。

一個足夠精緻的 steering 方法，到最後會變成取代實際模型。如果拿 GPT-2，並且在每一層都把 activation 換成某個架構相同但更強模型的 activation，那結果當然會好很多。但到那個時候，你不是讓 GPT-2 變得更聰明，而是在和那個更強的模型對話。智慧存在於 steering 裡，而不是原本模型裡。作者在另一篇文章 [AI interpretability has the same problems as philosophy of mind](https://www.seangoedecke.com/philosophy-and-ai-interpretability/) 中談過更多這個問題。

### 把 steering 當成資料壓縮

steering 另一種可能有用的方式，是替需要大量 token 才能表達的概念做 steering。這樣 steering 就能替我們省下一大塊 context window。直覺上，可以把它想成把某個概念從模型的工作記憶移到隱性記憶。

例如，假設我們能辨識出「知道我這個特定 codebase」的概念呢？當 GPT-5.5 快速讀過作者的 codebase 時，它獲得的一部分知識必然埋在 activation 裡，對吧？也許可以把這些知識拉出來，形成一個很大的 steering vector。

作者會很意外如果這真的能行。他認為這會碰到和抽取「智慧」時相同的問題：「知道我的 codebase」這個概念可能太複雜，需要完整 fine-tune 模型才夠。不過，至少它看起來有可能。

### 結論

作者對 steering 很著迷，但沒有特別樂觀。他認為大多數收益都可以更有效率地用 prompt 重現，而那些真正野心大的 steering 目標，也可以更有效率地用訓練或 fine-tuning 重現。

然而，開源社群還沒有對 steering 做很多工作，而這件事現在可能才剛要開始改變。如果作者錯了，而 steering 確實有實用應用，接下來 6 個月應該就會看出來。

值得觀察的是，像 DwarfStar 4 這種為特定模型打造的工具，最後是否會內建一套可 boost feature 的「函式庫」。每當一個熱門開源權重模型發布時，社群總會立刻釋出一整套 wrapper 和 quantized 版本。我們是否也會看到大家搶著從模型裡抽出可增強 feature？

編按：這篇文章在 [Hacker News](https://news.ycombinator.com/item?id=48160807) 引發一些討論。幾位留言者，包括 antirez 本人，[指出](https://news.ycombinator.com/item?id=48161688) steering 可以用 prompt 做不到的方式改變某些「訓練進去」的行為，最明顯的是移除模型拒答。另一位留言者[提到](https://news.ycombinator.com/item?id=48161488)，開源模型的 uncensoring / abliteration 其實已經用這種方式在做。作者原本不知道這點，以為 uncensored models 通常是 LoRA fine-tune。對此，antirez [補充](https://news.ycombinator.com/item?id=48161688)說，修改權重可能比更輕量的 runtime steering 更傷模型能力；runtime steering 可以只在需要時套用。這點很合理。

註 1：模型有很多不同 activation 可以測量，例如 attention 之後、每一層之間等等。基本上可以選任何一個，也可以試多個看看哪個有效。

註 2：作者最近讀了一篇很好的 [deep dive](https://huggingface.co/spaces/dlouapre/eiffel-tower-llama)，介紹如何用開源 LLaMA 模型做這件事；他幾個月前也[自己試過](https://github.com/sgoedecke/skills/blob/main/skills/extract-features-clamp-inference/SKILL.md)，結果好壞參半。

註 3：向大型 AI lab 的讀者致歉。如果你在內部試過 steering 來提升能力，而且沒有成功，請寄信給作者。他保證不會告訴任何人。

註 4：而即使如此，業界「用你的 codebase fine-tune 一個模型」的成果大多也不成功。

<div class="sep">· · ·</div>

## 這篇真正值得看的地方

這篇文章的價值不在於宣稱 steering 一定會成為下一個大技術，而是把它放回一個更務實的位置：當本地開源模型終於夠強，過去只存在於 interpretability 實驗室裡的「直接調模型內部狀態」才開始變成一般工程師可碰的工具。

但這裡也有一個必要的冷水：如果 steering 只是讓模型更短、更長、更少拒答，它可能只是 prompt engineering 或模型設定的替代品；真正有價值的問題，是它能不能做到 prompt 做不到、fine-tuning 又太重的中間層控制。對做 agent、coding tool、資安工具的人來說，最值得盯的不是「智慧滑桿」，而是像拒答控制、工具使用時機、風險偏好、上下文壓縮這類具體且可測的 feature。這些地方若能被 runtime steering 穩定控制，才會從有趣玩具變成工程介面。
