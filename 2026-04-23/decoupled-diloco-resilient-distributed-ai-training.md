---
title: "Decoupled DiLoCo：一條更能容錯的分散式 AI 訓練新路線"
description: "Google DeepMind 發表 Decoupled DiLoCo，讓大型模型能跨遠端資料中心非同步訓練，在更低頻寬下維持更高容錯與相同的 ML 表現。"
date: 2026-04-23
author: "Arthur Douillard and the DiLoCo team"
layout: post
permalink: /2026-04-23/decoupled-diloco-resilient-distributed-ai-training.html
image: /2026-04-23/og-decoupled-diloco-resilient-distributed-ai-training.png
---

<div class="hero-badge">AI News · 2026-04-23</div>

![](/ai-articles/2026-04-23/og-decoupled-diloco-resilient-distributed-ai-training.png)

**原文連結：** [Decoupled DiLoCo: A new frontier for resilient, distributed AI training](https://deepmind.google/blog/decoupled-diloco/)

## 摘要

- Google DeepMind 提出 Decoupled DiLoCo（Distributed Low-Communication），用來把大型模型訓練拆成多個彼此解耦的 compute islands。
- 這種架構主打更低頻寬、更高韌性，特別適合跨遠端資料中心的大型訓練。
- 當某個 learner unit 發生故障時，其他單元仍可持續學習，訓練不必整體停擺。
- 團隊也測試了混用不同世代硬體，像 TPU v6e 與 TPU v5p，證明可以在同一輪訓練裡協作。
- 在實測中，這套系統能跨美國四個區域訓練 120 億參數模型，而且比傳統同步方法快超過 20 倍。
- 這篇文章把 AI 訓練的下一階段，從單純追求更大算力，推向更在意網路、容錯與全球部署能力。

<div class="sep">· · ·</div>

Google DeepMind 發表了一種新的分散式訓練架構，Decoupled DiLoCo。它的目標很直接：讓大型語言模型可以在分散、遙遠的資料中心之間訓練，同時降低頻寬需求，並提升硬體故障下的韌性。

傳統上，訓練前沿 AI 模型依賴一個高度緊密耦合的系統。成千上萬顆晶片必須幾乎同步運作，這對今天的尖端模型很有效，但當規模繼續擴大時，要維持這種同步變得越來越難。

今天 DeepMind 分享了一篇新論文，提出 Decoupled DiLoCo（Distributed Low-Communication）這個做法。它把大型訓練拆成彼此解耦的「compute islands」，再用非同步資料流在島與島之間傳遞更新。這樣一來，局部故障就會被隔離，不會拖垮整體系統，其他部分仍能持續有效學習。

結果是一種更有韌性、也更彈性的訓練方式，特別適合跨全球資料中心部署。更重要的是，Decoupled DiLoCo 不會受到傳統 Data-Parallel 在全球尺度上那種通訊延遲的拖累。

隨著前沿模型持續朝更大規模與更高複雜度發展，團隊也在探索能跨更多算力、更多地點、更多元硬體的訓練方法。

圖 1：把訓練拆成獨立的 compute islands（learner units），即使硬體故障程度相同，訓練也能因為故障被隔離而維持大部分運作。

## 開發更能容錯的非同步訓練

Decoupled DiLoCo 建立在兩個先前成果之上：Pathways——一種以非同步資料流為基礎的分散式 AI 系統；以及 DiLoCo——大幅降低資料中心之間頻寬需求，讓跨遠端地點訓練大型語言模型變得可行。

Decoupled DiLoCo 把這兩個想法結合起來，讓 AI 模型可以在更大尺度上、更彈性地訓練。它建構在 Pathways 之上，並以 learner units 這些獨立的 compute islands 來進行非同步訓練。這表示某一區的晶片壞掉時，其他區塊不會跟著停下來。

這套基礎設施也具備自我修復能力。在測試中，團隊用一種叫做 chaos engineering 的方法，刻意在訓練過程中引入硬體故障。即使整個 learner unit 掉線，Decoupled DiLoCo 仍能繼續訓練，之後再把它無縫重新接回來。

團隊用 Gemma 4 模型測試 Decoupled DiLoCo，結果顯示：在硬體故障發生時，這個系統能維持比傳統方法更高的訓練叢集可用性，同時最終達到相同的機器學習表現。

圖 2：左圖顯示，Decoupled DiLoCo 需要的頻寬比傳統訓練方式少上好幾個數量級，效率非常高。中圖顯示，在硬體故障逐步增加時，Decoupled DiLoCo 仍能維持很高的 goodput，也就是有效訓練量，而其他方法則快速下滑。前兩張圖來自模擬訓練。右圖則顯示，在真實世界實驗中，用 Decoupled DiLoCo 訓練的 Gemma 4 模型，在 benchmark 上與傳統訓練方法達到相同的 ML 表現。

Decoupled DiLoCo 不只更能抵抗故障，也足以用於生產級、完全分散式的 pre-training。團隊成功在美國四個不同區域訓練一個 120 億參數模型，所需的廣域網路頻寬只有 2–5 Gbps——這個水準在既有資料中心互聯條件下就有機會達成，不必另外建置客製化網路基礎設施。

值得注意的是，這個訓練結果比傳統同步方法快超過 20 倍。原因在於，系統把必要的通訊塞進較長的計算區段裡，避開了某一部分系統必須等待另一部分的「blocking」瓶頸。

## 推動 AI 訓練基礎設施的演進

在 Google，AI 訓練採的是全堆疊策略，從硬體、軟體基礎設施一路到研究都涵蓋在內。越來越多的進展，來自重新思考這些層之間怎麼搭配。

Decoupled DiLoCo 就是其中一個例子。當訓練可以在 internet-scale bandwidth 下進行時，就能把任何閒置算力都納入利用，讓原本閒置的資源變成可用容量。

除了效率與韌性，這種訓練模式也開啟了混用不同世代硬體的可能，例如在同一輪訓練裡同時使用 TPU v6e 與 TPU v5p。這不只延長了既有硬體的壽命，也增加了可用的總算力。在團隊的實驗裡，不同世代、不同速度的晶片依然能達到與單一晶片型號訓練相同的 ML 表現，表示即使是較舊的硬體，也能實際為 AI 訓練出力。

更進一步說，因為新一代硬體不會同時在所有地方到位，能跨世代訓練也能緩解反覆出現的物流與容量瓶頸。

當 AI 基礎設施的前沿持續往前推進時，這類更具韌性的系統設計，正是解鎖下一代 AI 的關鍵。

## 致謝

這項研究由 Google DeepMind 與 Google Research 的多位成員共同完成。

Decoupled DiLoCo 的主導者與核心貢獻者包括 Arthur Douillard、Keith Rush、Yani Donchev、Zachary Charles、Ayush Dubey、Blake Woodworth、Ionel Gog、Josef Dean、Nova Fallen、Zachary Garrett。Nate Keating 與 Jenny Bishop 負責營運支援。

團隊也感謝 Jeff Dean、Marc’Aurelio Ranzato、Raia Hadsell、Arthur Szlam、Edouard Yvinec、Henry Prior、Paul Barham、Michael Isard、Daniel Ramage、Brendan McMahan、Chase Hensel 與 Zoltan Egyed 的額外支援與建議。

<div class="sep">· · ·</div>

## 真正的瓶頸，正在從「算力夠不夠」變成「系統扛不扛得住」

Decoupled DiLoCo 這類方法很像是在提醒整個產業：下一階段的訓練競爭，不只比晶片數量，也比誰能把分散式系統做得更穩、更省帶寬、更容易跨地理位置擴張。當模型越來越大，訓練效率不再只是 FLOPs 的問題，而是網路、容錯與運維一起決定成敗。

另一個更實際的訊號，是它把「老硬體還能不能用」變成正經優勢。若不同世代的晶片能在同一輪訓練裡協作，資料中心就不必等整批升級，整個供應鏈也會更有彈性。對真的在做大規模 AI 基礎設施的人來說，這種架構改變可能比單次 benchmark 漲幾分還更重要。