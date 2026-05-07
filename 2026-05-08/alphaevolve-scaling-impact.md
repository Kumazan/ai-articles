---
title: "AlphaEvolve 的下一步：讓 Gemini coding agent 走進科學、電網與晶片設計"
description: "DeepMind 展示 AlphaEvolve 一年來如何從演算法探索工具走向實際部署，改善基因定序、電網最佳化、量子電路、TPU 設計與企業工作負載。"
date: 2026-05-08
author: AlphaEvolve team
layout: post
permalink: /2026-05-08/alphaevolve-scaling-impact.html
---

<div class="hero-badge">Google DeepMind · 2026-05-07</div>

**原文連結：** [AlphaEvolve: How our Gemini-powered coding agent is scaling impact across fields](https://deepmind.google/blog/alphaevolve-impact/)

## 摘要

- Google DeepMind 回顧 AlphaEvolve 一年來的進展，強調這個 Gemini-powered coding agent 已從演算法探索工具，走向科學、基礎設施與企業應用。
- 在基因體學中，AlphaEvolve 協助改進 DeepConsensus，使 variant detection errors 降低 30%，讓 PacBio 等團隊能更準確、低成本地分析基因資料。
- 在電網最佳化中，它把 Graph Neural Network 找到可行 AC Optimal Power Flow 解的比例從 14% 提升到超過 88%。
- 在量子物理與數學研究中，AlphaEvolve 產生比傳統最佳化基準低 10 倍錯誤的量子電路，也協助 Terence Tao 等數學家探索 Erdős problems。
- 在 Google 內部，它已成為基礎設施最佳化工具，用於下一代 TPU 設計、cache replacement policies、Spanner compaction heuristics 與 compiler optimizations。
- Google Cloud 正把 AlphaEvolve 推向企業，案例涵蓋 Klarna 訓練加速、Substrate 半導體模擬、FM Logistic 路線最佳化、WPP 行銷模型與 Schrödinger 分子模擬。

<div class="sep">· · ·</div>

一年前，Google DeepMind 介紹了 AlphaEvolve：一個由 Gemini 驅動、用來設計進階演算法的 coding agent。當時，DeepMind 展示 AlphaEvolve 能協助在數學與電腦科學的開放問題上產生新發現，也能最佳化後來已部署到 Google 關鍵基礎設施中的演算法。

今天，由於演算法幾乎存在於生活的每一個面向，AlphaEvolve 可發揮作用的範圍變得更廣。從協助解釋自然世界的物理，到支撐電網與運算基礎設施，AlphaEvolve 有許多機會能加速科學家與企業在不同領域中的進展。

這篇文章整理了 AlphaEvolve 至今最重要的一批實際影響。

## 推動社會影響與永續

AlphaEvolve 已經協助在健康與永續研究中找出重要連結。

在基因體學中，AlphaEvolve 被用來改善 DeepConsensus。DeepConsensus 是 Google Research 開發、用於修正 DNA sequencing errors 的模型；經過 AlphaEvolve 最佳化後，variant detection errors 降低了 30%。這些改進正在幫助 PacBio 的科學家以更高準確度、更低成本分析基因資料。

PacBio 資深總監 Aaron Wenger 表示，Google 團隊透過 AlphaEvolve 找到的解法，讓他們的定序儀器達到明顯更高的準確率；對研究人員來說，更高品質的資料可能讓過去被隱藏的致病突變浮現出來。

在電網最佳化方面，AlphaEvolve 被應用到 AC Optimal Power Flow problem。它讓訓練出的 Graph Neural Network（GNN）模型找到可行解的能力，從 14% 提高到超過 88%，大幅降低電網還需要額外昂貴 post-processing steps 的需求。

在地球科學中，AlphaEvolve 把複雜的 geospatial data 轉成更可靠、可行動的洞察。透過協助自動最佳化 Earth AI models，它讓自然災害風險預測的整體準確度提高 5%；這項評估彙整了野火、洪水、龍捲風等 20 個類別。

## 推進研究前沿

AlphaEvolve 正在成為強大的研究夥伴，加速各種科學發現。

在量子物理中，AlphaEvolve 的最佳化讓研究人員能在 Google 的 Willow quantum processor 上執行複雜分子模擬。它提出的 quantum circuits，錯誤率比先前傳統最佳化基準低 10 倍。這已經對第一批量子運算實驗展示帶來直接貢獻，也指向一個未來：AlphaEvolve 可能協助找出超越 classical computers 能力的演算法。

AlphaEvolve 也和 Terence Tao 等世界級數學家合作，協助解決 Erdős problems。Tao 認為，AlphaEvolve 這類工具正在給數學家非常有用的新能力；尤其對 optimization problems 而言，研究者現在可以很快測試潛在不等式是否存在反例，或確認哪些情況可能是 extremizers。這能大幅改善研究者對問題的直覺，也讓嚴謹證明更容易被找到。

AlphaEvolve 還打破了一些經典數學挑戰的紀錄，包括改善 Traveling Salesman Problem 與 Ramsey Numbers 的 lower bounds。

此外，這種自主發現能力也正在推動其他領域的平行創新，例如發現可解釋的神經科學模型、證明 microeconomics 的新市場極限、快速改進 neural network building blocks、強化使用者隱私的 cryptography、synthetic data generation，以及 frontier AI models 的關鍵 safety mitigations。

DeepMind 也提供了 AlphaEvolve 最佳化 Tammes problem 實例的公開展示。讀者可以在 public Gallery 探索 AlphaEvolve 針對更多問題產生的潛在解法。

## 改善 AI 基礎設施

AlphaEvolve 已經從 pilot testing 畢業，成為 Google 基礎設施中的核心元件。它已被常態用來最佳化下一代 TPU 的設計，也協助發現更有效率的 cache replacement policies；這項工作在兩天內完成了過去需要數月、仰賴大量人力投入的努力。

Google DeepMind 與 Google Research 首席科學家 Jeff Dean 表示，AlphaEvolve 一開始就在最佳化支撐 AI stack 的最底層硬體。它提出了一個反直覺但高效率的電路設計，並被直接整合進下一代 TPU 的 silicon。這是 TPU 大腦協助設計下一代 TPU 身體的最新例子。

AlphaEvolve 也透過改進 Log-Structured Merge-tree compaction heuristics，提高了 Google Spanner 的效率。這項最佳化把 write amplification，也就是寫入儲存的資料量相對於原始請求的比例，降低了 20%。它也為新的 compiler optimization strategies 提供洞察，讓軟體的 storage footprint 減少將近 9%。

## 擴展商業應用

DeepMind 現在也和 Google Cloud 一起，把 AlphaEvolve 的能力帶到不同行業的商業企業中。

在金融服務領域，Klarna 使用 AlphaEvolve 最佳化它最大型的 transformer models 之一，使訓練速度翻倍，同時改善模型品質。

在半導體製造領域，Substrate 將 AlphaEvolve 應用於 computational lithography framework，讓 runtime speed 提升數倍，使他們能執行規模大得多的 advanced semiconductor simulations。

在物流領域，FM Logistic 使用這項技術最佳化 Traveling Salesman Problem 這類複雜路線挑戰，在原本已高度最佳化的解法之上，又找到 10.4% 的 routing efficiency 改善，每年可省下超過 15,000 公里的行駛距離。

在廣告與行銷領域，WPP 使用 AlphaEvolve 改進 AI model components，在複雜、高維度的 campaign data 中搜尋更好的方案，讓準確度相較於人工最佳化的競爭基準提升 10%。

在 computational materials 與 life sciences 中，Schrödinger 應用 AlphaEvolve，讓 Machine Learned Force Fields（MLFF）的訓練與推論都大約加速 4 倍。

Schrödinger 機器學習技術負責人 Gabriel Marques 表示，AlphaEvolve 讓他們能以前所未有的速度與效率探索更大的 chemical spaces。更快的 MLFF inference 會帶來真實商業影響：縮短 drug discovery、catalyst design 與 materials development 的 R&D cycles，讓企業能在幾天內篩選分子候選，而不是等上好幾個月。

## AlphaEvolve 的未來

過去一年顯示，AlphaEvolve 正快速變成一套多用途、通用型系統。它展示了下一波突破可能來自能自行學習、演化與最佳化的演算法。往後，DeepMind 計畫擴展這些能力，並把這項技術帶到更廣泛的外部挑戰中。

## 致謝

AlphaEvolve 最初由 Matej Balog、Alexander Novikov、Ngân Vũ、Marvin Eisenberger、Emilien Dupont、Po-Sen Huang、Adam Zsolt Wagner、Sergey Shirobokov、Borislav Kozlovskii、Francisco J. R. Ruiz、Abbas Mehrabian、M. Pawan Kumar、Abigail See、Swarat Chaudhuri、George Holland、Alex Davies、Sebastian Nowozin 與 Pushmeet Kohli 開發。這項研究屬於一個更廣泛的計畫，目標是用 AI 推進演算法發現。初始開發之後，Alexey Cherepanov、Anindya Basu、Becky Evangelakos、Jamie Smith 與 Mario Pinto 加入團隊，協助擴大 AlphaEvolve 的影響。

Adam Connors、Alex Bäuerle、Anna Trostanetski、Fernanda Viegas、Gabi Cardoso、Jonathan Caton、Lucas Dixon、Mariana Felix、Martin Wattenberg、Matin Akhlaghinia、Richard Green、Yosuke Ushigome 與 Yunhan Xu 和團隊合作開發 AlphaEvolve UI，並得到許多其他人的支援。

Anant Nawalgaria、Diego Ballesteros、Gemma Jennings、Jakob Oesinghaus、Kartik Sanu、Laurynas Tamulevičius、Nicolas Stroppa、Nishta Dhawan、Oliver Hilsenbeck、Reah Miyara、Skander Hannachi、Tom Beyer 與 Vishal Agarwal 和團隊合作開發 AlphaEvolve API，並協助接觸 Google Cloud 客戶，同樣得到許多其他人的支援。

DeepMind 也感謝在關鍵問題上主導 AlphaEvolve 應用並為這份報告做出貢獻的合作者：Aaron Wenger、Abhradeep Guha Thakurta、Akanksha Jain、Alex Vitvitskyi、Amir Yazdan Bakhsh、Andrew Carroll、Aranyak Mehta、Arthur Conmy、Ansh Nagda、Davide Paglieri、Eric Perim Martins、Hassler Thurston、Hongzheng Chen、Jack Mason、János Kramár、Jeremy Ratcliff、Jessica Sapick、Johannes Bausch、Jonathan Katz、Kevin Miller、Kim Stachenfeld、Mark Kurzeja、Mircea Trofin、Myriam Khan、Nero Geng、Pablo Samuel Castro、Petar Veličković、Pi-Chuan Chang、Prabhakar Raghavan、Raghav Gupta、Rohin Shah、Sasha Vezhnevets、Sébastien Lahaie、Sergio Guadarrama、Shravya Shetty、Shruthi Gorantala、Terence Tao、Todd Lipcon、Tom O'Brien、Vinod Nair、Ziyue Wang、Zun Li，以及許多 AlphaEvolve 使用者。

最後，DeepMind 感謝 Amin Vahdat、Ankur Jain、Demis Hassabis、Jeff Dean、Parthasarathy Ranganathan、Pushmeet Kohli、Saurabh Tiwary 與 Sundar Pichai 等領導者提供指導與支援，也感謝 Google DeepMind、Google Cloud、Google Labs、Google Research 與其他產品領域的合作團隊，協助實現由 AlphaEvolve 驅動的應用與產品。

<div class="sep">· · ·</div>

## 延伸評論：真正值得看的不是「AI 會寫 code」，而是「AI 能否驗證改進」

這篇文章的關鍵，不是再一次證明 coding agent 能寫出程式，而是展示一種更可落地的 agent 範式：讓模型在可量測、可驗證、有明確 objective function 的空間中搜尋改進。AlphaEvolve 的力量不只來自 Gemini 會提出候選方案，而是每個候選方案都能被演化流程、benchmark、模擬或 production metrics 篩選。

這也是它和一般 vibe coding 最大的差別。多數 coding assistant 的失敗點在於「看起來像對」不等於真的有用；AlphaEvolve 則把問題限制在能自動評分的領域，讓模型的創意有機會被嚴格篩掉。對企業來說，這比單純讓 agent 接管一段模糊流程安全得多，也更容易產生可量化 ROI。

但這篇也有明顯侷限。AlphaEvolve 擅長的是能被形式化、可反覆測試、評分訊號清楚的問題；它不等於所有知識工作都能用同一套方式自動化。真正值得帶走的不是「把所有事交給 agent」，而是先問：哪些工作可以定義出可靠 evaluator？哪些改進能被數字、測試、模擬或審計軌跡驗證？能回答這兩個問題的場景，才是 agent 最可能先穩定產生價值的地方。
