---
title: "DeepMind 推出 SynthID Bio，為 AI 設計蛋白質加上生物浮水印"
description: "DeepMind 推出 SynthID Bio，將難以察覺的標記嵌入 AI 設計蛋白質與預測結構；實驗顯示標記後仍保有生物功能，可望協助生物安全篩檢與資料來源追蹤。"
date: 2026-10-01
author: "Pushmeet Kohli, David Stutz, Ali Cowen-Rivers, Jeremy Ratcliff"
layout: post
permalink: /2026-10-01/synthid-bio-ai-protein-watermark.html
---

<div class="hero-badge">AI News · 2026-10-01</div>

**原文連結：** [Introducing SynthID Bio](https://deepmind.google/blog/introducing-synthid-bio/)

## 摘要

- Google DeepMind 推出 SynthID Bio，嘗試在 AI 設計的蛋白質序列與預測結構中嵌入難以察覺、可供驗證的標記。
- 研究團隊在 VEGF-A、SARS-CoV-2 刺突蛋白受體結合區及 PD-L1 三種目標上進行濕實驗；帶標記的蛋白質結合體，其命中率、結合能力與序列多樣性與未標記版本相當。
- 蛋白質結構的浮水印則透過微調 AlphaFold 3 的部分擴散網路加入模型權重，讓預測座標保有可偵測訊號，同時維持預測準確度。
- 這項技術可望補強 DNA 合成篩檢與生物資料庫的來源驗證，協助識別 AI 生成的生物設計並減少錯誤標示。
- DeepMind 表示浮水印並非單一解方，仍須提升抵抗刻意竄改的能力，並與中繼資料、集中式資料庫及其他生物安全措施搭配。
- 團隊公開方法論、程式碼與體外實驗資料，並向研究社群釋出模型權重，盼促進後續驗證與合作。

<div class="sep">· · ·</div>

Google DeepMind 今日推出 SynthID Bio，將浮水印技術帶進合成生物學。SynthID Bio 會把難以察覺的簽章嵌入生物序列，使浮水印不只可在數位模型中驗證，也能在實際合成出的蛋白質上驗證；實驗室測試同時顯示，標記不會破壞蛋白質的生物功能。

生成式 AI 正協助科學家應對重要的生物學問題，例如預測蛋白質結構（AlphaFold）、設計全新蛋白質（AlphaProteo 與 ProteinMPNN），近來也開始用於開發新的噬菌體——也就是會感染細菌的病毒。然而，這些工具也帶來新挑戰：全新的 AI 設計可能繞過傳統 DNA 合成篩檢；合成蛋白質的三維結構若被錯誤標示，也可能污染公開資料庫，誤導後續研究。

## SynthID Bio 的運作方式

SynthID Bio 是一組專為合成生物學開發的浮水印方法，目的是強化生物安全與科學資料完整性。

這套方法會依資料類型調整做法：對蛋白質序列，會微妙地引導胺基酸的選擇；對預測出的三維結構，則調整原子座標，藉此形成可靠的偵測訊號。實驗結果顯示，這些調整沒有損害蛋白質的生物功能；而功能完整正是促進疾病治療與科學研究不可或缺的條件。

*VEGF-A 帶標記蛋白質結合體的預測結構；各胺基酸上的顏色代表浮水印訊號。*

研究團隊以 AlphaProteo 蛋白質結合體設計方法，搭配整合 SynthID Bio 的 ProteinMPNN 版本，驗證蛋白質結合體——也就是能選擇性附著於其他蛋白質的分子——能否加上浮水印。針對三種目標蛋白質進行濕實驗測試：VEGF-A、SARS-CoV-2 刺突蛋白受體結合區，以及 PD-L1。帶標記設計的命中率、結合親和力與天然序列多樣性，都與未標記版本相當，成功打造出首批具有生物功能且帶有浮水印的蛋白質結合體。

*以 KD 值衡量三種目標蛋白質的未標記與帶標記設計之結合親和力；數值越低代表結合力越強。*

至於蛋白質摺疊，SynthID Bio 會微調 AlphaFold 3 擴散網路的一小部分，讓模型權重本身具備加入浮水印的能力。如此一來，不論由誰執行模型，預測出的三維座標都會自然帶有可偵測訊號。SynthID Bio 在維持 AlphaFold 3 預測準確度的同時，達到近乎完美的偵測率，保留關鍵結構特徵的分布，也能抵抗數位雜訊或輕微的座標變動。

*以 7PPA 為例，依序展示 AlphaFold 3 預測結構、真實結構，以及帶有浮水印的結構。*

## 強化生物安全與資訊完整性

生物安全仰賴多層防禦——可以把它想成「瑞士起司」防禦模型：多種彼此獨立的安全措施共同運作，互相補上各自的盲點。模型層級的緩解措施與客戶審查等防護都很重要，但每一層都可能存在缺口。SynthID Bio 的浮水印將可驗證訊號直接嵌入生物設計本身，為 DeepMind 更廣泛的生物韌性願景增加一層具體防線。

曾審閱這項研究的生物安全政策專家、Science Policy Consulting 顧問 Sarah Carter 表示：「SynthID Bio 是追蹤生物設計來源的重要拼圖。透過將設計與模型開發者連結，這些浮水印能讓開發者主動承擔安全責任，也能協助合成服務商簡化對使用相關模型客戶的篩檢。」

這一層防護對 DNA 合成篩檢尤其重要，因為合成篩檢位於生物安全的第一線。要把數位蛋白質設計轉成實體分子，必須向 DNA 合成業者下單；業者會利用已知威脅資料庫篩查訂單。過去遇到陌生序列時，或許還能安全地推測它是尚未發現的天然生物。但 AI 能創造與已知危害幾乎毫無相似之處的全新序列，因此篩檢者已不能再如此假設。若要確認陌生訂單並非經過設計的威脅，就必須進行耗時的人工詳查，可能拖慢重要研究。SynthID Bio 可在此提供自動化驗證訊號，證明訂單來自內建安全防護的可信模型。

曾為論文提供早期意見的 Twist Bioscience 政策與生物安全副總裁 James Diggans 表示：「AI 正拓展科學家的設計能力，而 DNA 合成公司在協助這些創新負責任地擴大規模方面扮演重要角色。浮水印是生物安全工具箱中很有潛力的新選項，可望強化篩檢、將資源集中在需要進一步檢查的序列上，並讓生物安全工作更有效率，跟上 AI 設計生物技術的發展。」

SynthID Bio 也有助維護 Protein Data Bank、UniProt 與 GenBank 等資料庫的完整性。這些資料庫有許多接受公開投稿，對科學進展至關重要；但若資料項目遭錯誤標示，可能對生物安全決策造成遠大於其本身的負面影響。隨著 AI 生成生物資料增加，這個問題可能更加嚴重。SynthID Bio 可在投稿流程中協助確認合成資料是否正確標示，或將其標記出來以供進一步審查。

## 展望未來

沒有任何單一生物安全措施能解決所有問題，但 SynthID Bio 將 DeepMind 已開發並經過驗證的 SynthID 浮水印技術延伸至合成生物學，是可靠識別與追蹤 AI 生成生物序列及結構的重要第一步。

接下來仍有關鍵挑戰，包括提升浮水印抵抗刻意竄改的能力。SynthID Bio 也能搭配生物設計來源的中繼資料方案——類似數位媒體的 C2PA——或 AI 生成生物資料的中央資料庫，更有效地識別與追蹤 AI 設計蛋白質。

為因應前沿 AI 技術日益增強的能力，研究團隊也在探索如何將浮水印應用於更複雜的生物物件。目前，團隊正與史丹佛大學及 Arc Institute 的 Hie 實驗室合作，將 SynthID Bio 整合至先進基因體模型 Evo 2，為 Evo 2 設計的噬菌體基因組加上浮水印。初步細菌培養實驗已確認這些帶標記噬菌體仍具功能。團隊認為，這項工作有望處理基因組設計帶來的部分生物安全風險，並表示稍後會公布技術論文的更多細節。

要充分發揮這項工作的生物安全效益，需要社群共同合作並持續研究。作為負責任創新承諾的一部分，團隊將公開方法論論文、開源程式碼與體外實驗資料，也會向研究社群釋出模型權重，讓更多人能在此基礎上推進研究。透過與生物安全、基因合成及政策領域夥伴開放合作，AI 驅動的科學探索才能與安全責任同步前進。

如欲洽談此領域的合作，請寄信至 synthidbio@google.com，並附上高階合作構想；請勿寄送任何機密或專有資訊。

## 致謝

本計畫由 Pushmeet Kohli 發起。研究與技術開發由 Alexander I. Cowen-Rivers 和 David Stutz 主導，並由 Pushmeet Kohli 提供指導。以下人員對工程與研究有重要貢獻：Guillermo Ortiz-Jimenez、Jeremy Ratcliff、Vinicius Zambaldi、Lindsay Willmore、Josh Abramson、Harshnira Patani、Christina Kouridi、Florian Stimberg、Mel Vecerik、Alex Chu、Sukhdeep Singh、Sumanth Dathathri、Eliseo Papa、Valentin De Bortoli、Arnaud Doucet、Jue Wang 與 Sven Gowal。感謝 Adaptyv Bio 協助體外驗證。

將這項技術延伸至噬菌體 DNA 浮水印的工作，是 Google DeepMind 與史丹佛大學及 Arc Institute 的 Hie 實驗室合作成果。Google DeepMind 的主要貢獻者包括 Jeremy Ratcliff、Aleks Petrov、Alexander I. Cowen-Rivers、David Stutz、Elisa L. H. Wong、Victor Martin Palacios、Francesca Pietra、Alfred Piccioni、Tristan Oliver Kwan、Tor Lattimore、Sumanth Dathathri 與 Pushmeet Kohli；Arc Institute 與史丹佛大學的主要貢獻者則包括 Brian Hie、Samuel King 與 Aditi Merchant。

研究團隊也感謝 Rudy Bunel、Anna Cupani、Rob Fergus、Thomas Frerix、Sahra Ghalebikesabi、John Jumper、Jacob Kelly、David La、Victor Martin、Sebastian Nowozin、Stig Petersen、Aleks Petrov、Uchechi Okereke、Sylvestre-Alvise Rebuffi、Rosalia Schneider、Armin Senoner、Richard Shuai、Ashok Thillaisundaram、Elisa L. H. Wong、Zachary Wu 與 Augustin Žídek 對研究論文的貢獻，並感謝 Julien Bergeron 協助製作三維渲染圖。最後，感謝 Demis Hassabis 對本計畫的鼓勵與支持。

<div class="sep">· · ·</div>

## 浮水印能證明什麼，又不能證明什麼？

把可偵測訊號放進 AI 設計的生物資料，是值得關注的安全方向：它補上單靠序列相似度比對可能漏掉新型設計的缺口，也有機會在資料進入合成流程或公開資料庫時留下來源線索。不過，浮水印最多能協助判斷設計是否出自特定模型，並不等同於安全背書；來源可信，也不代表該序列就沒有風險。

實驗室證明標記後仍保有功能，是重要的概念驗證，但「不影響功能」與「無法被移除或仿造」是兩個不同問題。DeepMind 也承認，抵抗刻意竄改仍是後續挑戰。實際部署時，浮水印必須與 DNA 合成篩檢、客戶審查、可稽核的來源中繼資料及事故應變機制共同運作；若把單一訊號當成安全通行證，反而可能製造新的盲點。
