---
title: "ZAYA1-8B：用不到 10 億活躍參數挑戰前沿推理模型"
description: "Zyphra 發布 ZAYA1-8B，這個在 AMD MI300 stack 上訓練的 MoE 模型，主打高 intelligence density，能用 7.6 億活躍參數在數學、推理與 coding benchmark 上逼近大模型。"
date: 2026-05-08
author: "Robert Washbourne 等 / Zyphra"
image: /2026-05-08/og-zaya1-8b-frontier-intelligence-density.png
layout: post
permalink: /2026-05-08/zaya1-8b-frontier-intelligence-density.html
---

<div class="hero-badge">Zyphra · 2026-05-06</div>

![](/ai-articles/2026-05-08/og-zaya1-8b-frontier-intelligence-density.png)

**原文連結：** [ZAYA1-8B: Frontier intelligence density, trained on AMD](https://www.zyphra.com/post/zaya1-8b)

## 摘要

- Zyphra 發布 ZAYA1-8B，一個總參數 8.4B、每次推論只啟用 760M 參數的 MoE 模型，主打每個活躍參數能產生更高推理密度。
- 這是 Zyphra 宣稱第一個從 pretraining、midtraining 到 supervised fine-tuning 都在 AMD Instinct MI300 stack 上完成的 MoE 模型。
- 在數學、推理與 coding benchmark 上，ZAYA1-8B 可與 Mistral-Small-4-119B、DeepSeek-R1-0528、Gemini-2.5-Pro、Claude 4.5 Sonnet 等大得多的模型競爭。
- Zyphra 同步提出 Markovian RSA test-time compute 方法，透過平行產生 reasoning traces、遞迴聚合與固定長度 chunking，在不讓 context 無限膨脹的情況下延長推理。
- ZAYA1-8B 的重點不只是「小模型變強」，而是模型架構、post-training、RL 與推論 harness 共同設計後，讓 inference cost 與能力之間出現新的折衷點。
- 模型已可在 Zyphra Cloud 以 serverless endpoint 使用，也在 Hugging Face 以 Apache-2.0 license 釋出權重。

<div class="sep">· · ·</div>

## 介紹

今天，Zyphra 發布 ZAYA1-8B。這是第一個在 AMD Instinct MI300 stack 上完成 pretraining、midtraining 與 supervised fine-tuning 的 MoE 模型。ZAYA1-8B 在每個活躍參數上提供前沿級的 intelligence density，並在部分數學與 coding benchmark 上超越大得多的開放權重模型。

ZAYA1-8B 每次推論啟用不到 10 億個參數，卻能在推理、數學與 coding benchmark 上有很強表現。它可匹配或超越 Mistral-Small-4-119B 這類大得多的模型，也能與 DeepSeek-R1-0528、Gemini-2.5-Pro、Claude 4.5 Sonnet 等第一代前沿 reasoning models 保持競爭力。配合 Zyphra 新提出的 Markovian RSA test-time compute 方法後，模型還能取得額外顯著提升；例如在 HMMT'25 上超過 Claude 4.5 Sonnet 與 GPT-5-High，分數為 89.6 對 88.3，並在數學 benchmark 上逼近 DeepSeek-V3.2 等前沿開放權重模型。

ZAYA1-8B 的表現，來自 Zyphra 從模型架構、pretraining、optimization、post-training 到大規模 RL 的全 stack 創新。它也顯示 Zyphra 的 post-training stack 有擴展潛力；接下來 Zyphra 希望在模型規模與應用領域的廣度上繼續推進。

ZAYA1-8B 已可作為 Zyphra Cloud 上的 serverless endpoint 使用。

## 效能表現

ZAYA1-8B 在多種評測上，也能與同重量級的近期 SOTA 開源模型，以及許多大得多的開源模型競爭。這些評測涵蓋數學的 AIME 與 HMMT、coding 的 LiveCodeBench、推理與知識檢索的 GPQA-Diamond，以及 instruction following 的 IFEval 與 IFBench。

這裡的重點不是單一榜單名次，而是 active parameter budget 的差異。ZAYA1-8B 的總參數為 8.4B，但每次 forward pass 只啟用 760M 參數；如果在這個活躍參數規模下仍能接近遠大模型的數學與 coding 表現，推論成本、部署門檻與可用硬體範圍都會跟著改變。

## 架構

ZAYA1-8B 的效率來自獨特架構、pretraining 方法與 reinforcement learning pipeline 的組合。Zyphra 在每個層級都加入新設計，目標很單純：從最後的模型中，盡可能榨出每個參數與每個 FLOP 所能提供的 intelligence。

ZAYA1-8B 有三個關鍵架構變更。第一是 Zyphra 開發的 Compressed Convolutional Attention（CCA），這是一種更有效率、表現也更好的 attention variant。第二是用於 expert selection 的新型 MLP-based router，相較於 linear routers，它能改善 routing stability。第三是 learned residual scaling，以幾乎不增加參數與 FLOP 的方式，控制網路深度增加時 residual norm 的成長。這三者共同構成 ZAYA1-8B intelligence efficiency 的基礎。

## Pretraining

ZAYA1-8B 的一個獨特之處，是它完全在 AMD 硬體與網路上完成 pretraining。Zyphra 使用由 IBM 協助打造的客製訓練叢集，包含 1,024 個 MI300X nodes，以及 AMD Pensando Pollara interconnect。Zyphra 在先前關於 ZAYA1-base 的技術報告中，已更詳細描述 pretraining 與 cluster design。

這點在產業上有額外意義：目前大型模型訓練長期高度依賴 NVIDIA CUDA 生態系。ZAYA1-8B 並不只是模型發布，也是一個 AMD-native training stack 的實證案例，證明至少在這個規模與目標下，非 NVIDIA stack 也能訓練出有競爭力的模型。

## Post-training

Zyphra 的新型大規模 post-training pipeline，也是 ZAYA1-8B 表現的核心。這條 pipeline 包含五個階段，每個階段都針對 ZAYA1-8B 的能力做序列式提升。

第一個 SFT 階段聚焦在基本 chat、instruction following、code、math 與 test-time compute 能力。接著是 reasoning warmup，結合數學任務、邏輯與 puzzle solving，並使用 test-time compute prompts，訓練模型原生地自我聚合候選解。第三階段是大型 RLVE-Gym，透過動態調整 puzzle difficulty，訓練核心 reasoning circuits。第四階段是大規模 math 與 code RL，用於改善模型在這些基礎領域中的知識與推理能力。最後則是相對輕量的 RLHF/RLAIF 階段，重點放在改善模型的 chat capabilities、行為，以及 instruction following 與 writing style 等較難驗證的 rewards。

Zyphra 觀察到，在 RL 階段中，許多能力都有明顯改善；其中數學、instruction following 與 coding 的提升最顯著，但 MMLU、GPQA 等 multiple-choice knowledge retrieval，以及 creative writing 等不可直接驗證任務，也有較小幅度的進步。

## Markovian RSA

與 ZAYA1-8B 一起發表的，還有一種名為 Markovian RSA 的新型 test-time compute scheme，這也是訓練 ZAYA1-8B 時使用的方法。Markovian RSA 結合兩個想法：RSA 的「平行產生多條 traces，再遞迴聚合」；以及 Markovian thinker 的「把推理切成固定長度 chunk，只把上一個 chunk 尾端傳給下一個 chunk」，藉此在推理可能無限延長時，仍讓 context window 維持固定大小。

具體來說，Markovian RSA 會先針對每個 prompt 平行產生多條 traces，再從這些 traces 抽取固定長度的尾段，然後從候選池中抽樣幾個 references，組成新的 aggregation prompts。這些聚合後的 prompts 會成為下一輪平行回應的 seed。

這讓 Markovian RSA 具備有利的推論特性：rollout generation 可以平行執行，利用 batching；而 Markovian chunking strategy 則確保不管模型為了中間 chain-of-thoughts 推理多久，context length 都能保持 bounded。

ZAYA1-8B 從 SFT 階段開始，就被訓練去理解並回應 Markovian RSA 的 aggregation prompts 與 chunking 方法。Zyphra 透過合成方式建構能反映目標行為的 prompts，並在 RL 中用一部分 prompts 訓練 Markovian RSA self-aggregation behavior。Zyphra 發現，對 ZAYA1-8B 而言，Markovian RSA 能大幅提升表現，尤其是在困難的數學推理任務上。

在主要結果中，Zyphra 展示了 ZAYA1-8B 使用 Markovian RSA 時的表現：中間 chain-of-thoughts 使用 40K-token budget，且每次只把最後 4K tokens 傳給下一輪。在這種設定下，ZAYA1-8B 可接近 DeepSeek-V3.2 與 Qwen3-A22B 等前沿開放權重模型的水準，距離 GPT-5-High 也只剩幾分差距。進一步使用 extra-high test-time compute 設定時，也就是每題 5.5M tokens，ZAYA1-8B 在 APEX-shortlist 這個困難數學 benchmark 上，超過 DeepSeek-V3.2 與 GPT OSS 120B (high)。

Zyphra 也發現，要讓這種方法有效，模型必須被訓練成能理解 Markovian RSA harness。當 Zyphra 把同樣方法套到 Qwen3-4B-Thinking-2507 時，效能提升明顯小得多。這突顯出最終模型 harness 與 post-training 方法共同設計的重要性。

## 結論

ZAYA1-8B 的表現遠超它的重量級。Zyphra 也期待使用者實際嘗試這個模型；目前可以透過 Zyphra Cloud 測試，也可以從 Hugging Face 取得模型權重。

ZAYA1-8B 以 Apache-2.0 license 釋出。

如果想了解更多，Zyphra 在技術報告中提供了大量關於架構、pretraining，尤其是 post-training 與 RL 方法的細節。

<div class="sep">· · ·</div>

## 延伸評論：小模型真正有趣的不是小，而是 harness 與訓練開始合體

ZAYA1-8B 這篇最值得注意的地方，不只是「760M active parameters 可以打到多高分」，而是它把模型與推論方式綁在一起設計。Markovian RSA 不是單純在推論時多丟幾次 sampling，再用投票選答案；Zyphra 從 SFT 與 RL 階段就讓模型學會配合這套聚合與 chunking harness。這代表未來的模型能力不一定只藏在 weights 裡，也可能藏在「模型如何被訓練去使用某種推論工作流」裡。

這對開發者很關鍵。很多 agent 與 coding workflow 目前還是把任意模型塞進固定 harness，再期待模型自己適應工具呼叫、長 context、規劃與修正。ZAYA1-8B 指向另一個方向：如果 harness 會是產品體驗的一部分，訓練與 post-training 就應該直接對準那個 harness，而不是把它當成部署後才加上的外掛。

但也要小心不要把這篇讀成「小模型要取代所有前沿模型」。ZAYA1-8B 的強項集中在數學、推理與 coding benchmark；原文沒有證明它已能處理完整 agent workflow、模糊產品需求、長期記憶或高風險決策。比較務實的判斷是：當任務可被 benchmark、可平行探索、可用明確規則聚合候選解時，能力密度高的小模型會越來越有經濟價值；但在需要深度情境理解、可靠工具鏈與長程工作記憶的場景，前沿模型與更成熟的 harness 仍會是主力。
