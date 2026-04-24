---
title: "不同語言模型如何學會相似的數字表徵"
description: "這篇研究發現，不同架構的語言模型都會長出相似的數字週期特徵，但只有部分模型真的學到可線性分離的模數結構，背後還牽涉資料、架構、優化器與 tokenizer 的交互作用。"
date: 2026-04-24
author: "Deqing Fu et al."
layout: post
permalink: /2026-04-24/convergent-evolution-number-representations.html
image: /2026-04-24/og-convergent-evolution-number-representations.png
---

<div class="hero-badge">AI News · 2026-04-24</div>

![](/ai-articles/2026-04-24/og-convergent-evolution-number-representations.png)

**原文連結：** [Convergent Evolution: How Different Language Models Learn Similar Number Representations](https://arxiv.org/abs/2604.20817)

## 摘要

- 這篇研究把數字表徵拆成兩層：頻譜上的週期尖峰，以及能不能把 mod-T 類別線性分開。
- Transformer、Linear RNN、LSTM 和傳統 word embeddings，都會出現 period-2、5、10 的 Fourier 特徵。
- 但有 Fourier 尖峰，不代表真的學到可用的數學結構；幾何可分性才是另一關。
- 資料、架構、optimizer 和 tokenizer 都會影響模型能不能長出這種可分離表徵。
- 模型形成可分離數字特徵有兩條路：語言資料中的共現訊號，或多 token 的加法任務。
- 作者把這種現象稱為 feature learning 的 convergent evolution：不同系統會從不同訊號學出相似特徵。

<div class="sep">· · ·</div>

語言模型在自然語言上訓練時，會學到用週期性特徵來表示數字；最常見的週期，通常落在 **T=2、5、10**。這篇論文進一步把這件事分成兩個層次。

第一層是 **spectral convergence**：不管是 Transformer、Linear RNN、LSTM，還是不同訓練方式下的傳統 word embeddings，很多系統都會在 Fourier domain 裡出現 period-T 的尖峰。第二層是 **geometric convergence**：模型不只要有週期訊號，還要真的把 `n mod T` 的類別做成可線性分類的幾何結構。

作者的結論很直接：**有 Fourier 尖峰，不代表真的懂模數結構**。Fourier domain 的稀疏性是必要條件，但不是充分條件。

實驗上，他們發現資料、架構、optimizer 與 tokenizer 都會影響這件事。當模型從一般語言資料裡吃到互補的共現訊號，像是文字與數字共現、不同數字之間的交互，或是從多 token 的加法題裡學習時，就比較容易長出幾何上可分離的數字表徵；反過來，只有單 token 加法時，結果就沒那麼穩定。

換句話說，這不是單純的「模型有沒有記住數字」，而是模型在不同訓練壓力下，會不會收斂到相似的表示法。

<div class="sep">· · ·</div>

## 真正值得注意的是：相似不等於同一種理解

這篇研究最有價值的地方，在於它把「看起來有結構」和「真的可用的結構」拆開了。對 interpretability、probe、或任何想從 embedding 外觀推斷模型能力的人來說，這是一個很重要的提醒：頻譜漂亮，不代表語義結構就真的成立。

如果要做數字推理、可解釋表徵，或是評估模型是否真的學到模數概念，不能只看一個 Fourier 圖就下結論。更關鍵的是：這些特徵能不能被線性讀出、能不能在不同資料與架構下重現，以及它到底是來自語言共現，還是來自任務壓力。