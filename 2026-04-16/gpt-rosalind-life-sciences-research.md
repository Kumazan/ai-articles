---
title: "GPT-Rosalind：OpenAI 為生命科學研究打造的推理模型"
description: "OpenAI 推出 GPT-Rosalind，主打生物、藥物發現與轉譯醫學，並透過研究預覽、Life Sciences plugin 與嚴格的 trusted access，把模型帶進受管制的科學工作流。"
date: 2026-04-16
author: OpenAI
layout: post
permalink: /2026-04-16/gpt-rosalind-life-sciences-research.html
image: /2026-04-16/og-gpt-rosalind-life-sciences-research.png
---

<div class="hero-badge">AI News · 2026-04-16</div>

![](/ai-articles/2026-04-16/og-gpt-rosalind-life-sciences-research.png)

**原文連結：** [Introducing GPT-Rosalind for life sciences research](https://openai.com/index/introducing-gpt-rosalind/)

## 摘要

- OpenAI 發表 GPT-Rosalind，一個專為生物、藥物發現與轉譯醫學設計的前沿推理模型
- 這個模型鎖定的是科學工作流，不只是回答問題，而是協助文獻整理、假說生成、實驗規劃與資料分析
- GPT-Rosalind 現以 research preview 形式提供給合格客戶，可在 ChatGPT、Codex 與 API 中使用
- OpenAI 也同步推出免費的 Life Sciences research plugin，串起 50 多個科學工具與資料來源
- 官方評測顯示，它在分子、蛋白質、基因、路徑與疾病相關生物學推理上都有領先表現
- 這次發佈同時強調 trusted access、治理與安全控管，顯示 OpenAI 想把 AI 科學工具放進受管制環境

<div class="sep">· · ·</div>

今天，OpenAI 推出 GPT-Rosalind，一個專為生物、藥物發現與轉譯醫學研究打造的前沿推理模型。這個 life sciences 模型系列，重點放在更好的工具使用能力，以及對化學、蛋白質工程與基因體學更深的理解。

在美國，要從目標發現一路走到新藥核准，平均大約要花 10 到 15 年。前期發現階段只要有一點進步，後面整條管線都會跟著受益，像是更好的 target selection、更扎實的生物假說，以及品質更高的實驗設計。生命科學的進展，不只受限於科學本身的難度，也受限於研究流程的複雜度。科學家必須在大量文獻、專門資料庫、實驗數據與不斷演化的假說之間來回切換，才能提出並驗證新想法。這些流程既耗時又碎片化，也很難大規模複製。

OpenAI 相信，先進 AI 系統可以幫研究人員更快走過這些流程，不只是讓既有工作更有效率，也能幫科學家探索更多可能性、找出原本容易漏掉的關聯，並更早收斂到更好的假說。藉由支援證據整合、假說生成、實驗規劃，以及其他多步驟研究任務，這個模型被設計成加速發現流程的工具。長期來看，這類系統有機會幫生命科學機構做出原本不可能完成的突破，而且成功率會高很多。

GPT-Rosalind 現在已經以 research preview 形式，提供給通過資格審查的客戶，可在 ChatGPT、Codex 與 API 中使用。OpenAI 也同步推出一個可免費使用的 Life Sciences research plugin for Codex，幫科學家把模型連到超過 50 種科學工具與資料來源。他們也正和 Amgen、Moderna、Allen Institute、Thermo Fisher Scientific 等客戶合作，把 GPT-Rosalind 用在加速研究與發現的工作流裡。

這個模型以 Rosalind Franklin 命名，致敬她嚴謹的研究如何揭示 DNA 結構，並奠定現代分子生物學的基礎。

<div class="sep">· · ·</div>

GPT-Rosalind 的設計目標，是服務現代科學工作中那些圍繞已發表證據、資料、工具與實驗展開的任務。在 OpenAI 的評測中，它在需要對分子、蛋白質、基因、路徑與疾病相關生物學進行推理的任務上表現最佳，也更能有效使用科學工具與資料庫，完成文獻回顧、序列到功能的解讀、實驗規劃與資料分析等多步驟工作流。

這是 GPT-Rosalind 生命科學模型系列的第一版，OpenAI 接下來還會繼續擴張它在生化推理上的能力，特別是那些長流程、工具密集的科學工作流。OpenAI 的算力基礎設施，讓他們能持續訓練、評測與改進這類領域模型，並用真實科學任務來驗證它們是否真的越來越有用。

從基於證據的 discovery insights，到更高價值的實驗，OpenAI 也希望自己的解決方案能實際改善研究工作流。

他們正在與領先的製藥、生技與研究客戶，以及生命科學技術公司合作，把 GPT-Rosalind 用在推動發現的工作流程中。

OpenAI 針對 GPT-Rosalind 做了一系列評測，涵蓋科學發現與產業研究的核心能力。這些評測衡量的是各個科學子領域的基礎推理能力，包括化學反應機制、蛋白質結構、突變影響、蛋白質互作，以及 DNA 序列的系統發育解讀。它們也測試模型能否支援真實研究工作，例如解讀實驗輸出、辨識專家會在意的模式，以及整合外部資訊來設計後續實驗。最後，這些評測也檢查模型是否能選對並使用正確的 computational tools、資料庫與領域能力來增強推理。

整體來看，這些評測顯示模型已經在整個科學研究流程上取得進展，也展現出更強的能力，足以幫助研究人員處理困難的 discovery tasks。

在公開 benchmark 上，GPT-Rosalind 也交出不錯的成績。在 BixBench 這個以真實 bioinformatics 與資料分析任務設計的 benchmark 上，它拿到了已公開成績中的領先表現。

在 LABBench2 上，這個 benchmark 測的是文獻檢索、資料庫存取、序列操作與 protocol design 等研究任務，GPT-Rosalind 在 11 個子任務裡有 6 個勝過 GPT-5.4。最明顯的進步出現在 CloningQA，這項任務要求端到端設計 DNA 與酵素試劑，用於分子複製實驗流程。

OpenAI 也和 Dyno Therapeutics 合作，用一組未公開、未污染的 RNA sequence-to-function prediction 與 generation 任務來評估模型。比較對象是 AI-bio 領域 57 個人類專家的歷史分數。當把模型直接放進 Codex app 裡做測試時，best-of-ten 的模型提交結果，在 prediction 任務上高於人類專家第 95 百分位，在 sequence generation 任務上也大約落在第 84 百分位。

這些評測提供了一個有意義的訊號，說明它已經開始能支援科學家每天依賴的工作流程，從產生證據、分析複雜資料，到朝著可辯護的生物學結論前進。

科學家現在可以在 GitHub 上使用 OpenAI 新推出的 [Life Sciences research plugin](https://github.com/openai/plugins/tree/main/plugins/life-science-research) for Codex。這個套件收納了許多模組化 skills，涵蓋最常見的研究工作流，讓使用者能跨越人類遺傳學、功能基因組學、蛋白質結構、生物化學、臨床證據與公開研究探索等領域。

這些 skills 像是一層 orchestration layer，幫助使用者更有效地處理寬泛、模糊又多步驟的問題。它們可連到 50 多個公開 multi-omics 資料庫、文獻來源與生物工具，也提供了一個彈性的起點，用於常見且可重複的工作流，例如蛋白質結構查詢、序列搜尋、文獻回顧與公開資料集探索。

符合資格的 Enterprise 使用者可以在研究工作流中搭配 GPT-Rosalind 使用這個 plugin；而所有使用者都能把這個 plugin package 與主線模型一起使用。

OpenAI 表示，他們希望把這些能力提供給最有能力推進人類健康的科學家與研究組織，同時維持強而有力的防護，避免被用於生物濫用。Life Sciences 模型是透過 trusted-access 部署架構推出的，先從美國的合格 Enterprise 客戶開始，並搭配資格審核、存取管理與組織治理等控制措施。與此同時，OpenAI 也更廣泛地提供一組 connectors 與 Life Sciences Research Plugin，讓研究人員能更有效地用主線模型處理生命科學任務。

這個模型的部署也加入了更高規格的 enterprise security controls 與強化的存取管理，讓專業科學用途可以在有治理的研究環境中進行。OpenAI 會從三個核心原則來評估存取：有益用途、強治理與安全監督、以及在受控且企業級安全的環境中使用。實際上，這代表參與機構必須確實在做具有公共利益的合法科學研究；要有適當的治理、法遵與濫用防範措施；而且只能讓核准使用者在安全、受管理的環境裡使用這些工具。機構也必須同意生命科學研究預覽條款並遵守 OpenAI 的使用政策，過程中 OpenAI 也可能要求提供額外資訊，以利 onboarding 或持續參與審查。

符合條件的機構可以透過 [request access](https://openai.com/form/life-sciences-access) 進入資格與安全審查流程。

在研究預覽期間，這個模型的使用不會消耗既有 credits 或 tokens，但仍受濫用防護約束。隨著計畫擴大，OpenAI 會再公布價格與可用性細節。

GPT-Rosalind 的設計，是要幫科學組織在需要技術能力與營運控管並重的環境裡，更快做出更高品質的工作。OpenAI 的專屬 Life Sciences 團隊，以及 McKinsey & Company、Boston Consulting Group（BCG）、Bain & Company 等顧問夥伴，會協助組織找出高影響力的 use case，把模型整合進企業環境，並推動可衡量的成果。如果想了解 OpenAI Life Sciences 能怎麼支援工作，也可以 [contact our Life Sciences team](https://openai.com/contact-sales/)。

這是生命科學模型系列的第一版，OpenAI 將它視為長期投入的起點，目標是打造能加速科學發現的 AI，從人類健康到更廣泛的生物研究都包括在內。接下來他們會持續改善模型的生物推理能力，擴大對工具密集與長流程研究工作流的支援，並和頂尖科學機構合作，評估真實世界的影響。這也包括與像 Los Alamos National Laboratory 這類國家實驗室的持續合作，一起探索 AI 引導的蛋白質與催化劑設計，包含 AI 系統在保留或提升關鍵功能特性的同時，修改生物結構的能力。

長期來看，OpenAI 預期這些系統會成為越來越有能力的研究夥伴，幫助科學家更快從問題走到證據、從證據走到洞見、再從洞見走向新的治療方法。

<div class="sep">· · ·</div>

## 延伸評論：科學工作流正在變成 AI 的新主戰場

這篇發表最重要的訊號，不只是又多了一個專門模型，而是 OpenAI 明確把 AI 的下一個落點，押在研究工作流本身。文獻、資料庫、工具、實驗、治理，這些原本分散又昂貴的環節，現在開始被包進同一個模型與插件層裡。

對生命科學產業來說，真正的價值不會只來自更會聊天的模型，而是能不能縮短從假說到實驗、再到可驗證結論的距離。若這類系統真的能在受管制環境中穩定運作，AI 的競爭焦點就會更明確地從通用對話，轉向高風險、高價值、強工作流整合的專業場景。