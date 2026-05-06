---
title: "Gemma 4 的 MTP drafters：把開放模型推論加速到 3 倍"
description: "Google 為 Gemma 4 推出 Multi-Token Prediction drafters，用 speculative decoding 在不犧牲輸出品質下把推論加速到最高 3 倍。"
date: 2026-05-06
author: Olivier Lacombe
layout: post
permalink: /2026-05-06/gemma-4-mtp-drafters.html
---

<div class="hero-badge">Google Blog · 2026-05-05</div>

**原文連結：** [Accelerating Gemma 4: faster inference with multi-token prediction drafters](https://blog.google/innovation-and-ai/technology/developers-tools/multi-token-prediction-gemma-4/)

## 摘要

- Google 為 Gemma 4 family 推出 Multi-Token Prediction（MTP）drafters，主打讓開放模型在本機、行動裝置與雲端部署時更快回應。
- Gemma 4 上線數週內已有超過 6,000 萬次下載，這次更新把焦點從「模型能力」推進到「推論效率」。
- MTP drafters 使用 specialized speculative decoding architecture，最高可帶來 3x speedup，且不犧牲輸出品質或推理邏輯。
- 傳統 LLM inference 常受限於 memory bandwidth；模型每產生一個 token，都得把數十億參數從 VRAM 搬到 compute units，造成延遲與算力閒置。
- MTP 的做法是讓較小的 drafter 先預測多個未來 token，再由較重的 target model 平行驗證，讓一次 forward pass 能接受整段 draft 並額外產生 token。
- Google 表示 26B MoE 在 Apple Silicon 上若 batch size 從 1 提升到 4-8，可在本機達到最高約 2.2x speedup；Nvidia A100 也有類似增益。
- 這批 drafters 採 Apache 2.0 license，已可從 Hugging Face、Kaggle 取得，並支援 transformers、MLX、vLLM、SGLang、Ollama 與 Google AI Edge Gallery。

<div class="sep">· · ·</div>

幾週前，Google 推出 [Gemma 4](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/)，稱它是目前最強的開放模型。上線短短幾週，Gemma 4 已經累積超過 6,000 萬次下載，並把這種「每個參數能提供多少智能」的效率帶到開發者工作站、行動裝置與雲端。

現在，Google 想把效率再往前推一步。

Google 正式釋出 Gemma 4 family 的 Multi-Token Prediction（MTP）drafters。透過 specialized speculative decoding architecture，這些 drafters 能讓推論速度最高提升 3 倍，同時不降低輸出品質或推理邏輯。

## 為什麼需要 speculative decoding？

標準 LLM inference 的技術現實是：它常常被 memory bandwidth 綁住，而不是被純粹算力綁住。

處理器為了生成單一 token，必須花大量時間把數十億參數從 VRAM 搬到 compute units。結果是 compute 沒有被充分利用，延遲卻很高；在 consumer-grade hardware 上，這個問題尤其明顯。

Speculative decoding 的核心，是把 token generation 和 verification 拆開。系統會把較重的 target model，例如 Gemma 4 31B，搭配一個較輕的 drafter，也就是 MTP model。drafter 會利用閒置算力，在 target model 生成一個 token 所需的時間內，先預測出多個未來 token。接著，target model 再平行驗證這些候選 token。

換句話說，慢的大模型仍然保留最後決定權，但不需要每一步都從零開始猜下一個 token。

## MTP 如何運作？

標準大型語言模型是 autoregressive 的：它一次只產生一個 token。這個方法有效，但它會把同樣多的計算資源花在所有續寫上。模型在預測「Actions speak louder than...」後面很可能接「words」時，所花的計算，和處理複雜邏輯題時是一樣的。

MTP 用 speculative decoding 減少這種浪費。這項技術由 Google researchers 在 [Fast Inference from Transformers via Speculative Decoding](https://arxiv.org/abs/2211.17192) 中提出。

如果 target model 同意 drafter 提出的 draft，它就會在一次 forward pass 中接受整段序列，甚至在同一個過程中再額外產生一個 token。也就是說，應用程式可以用原本生成一個 token 的時間，輸出整段被接受的 draft，再加上一個新 token。

## 從邊緣裝置到工作站，都在解鎖更快的 AI

對開發者來說，inference speed 往往是 production deployment 的主要瓶頸。

不論是在做 coding assistants、需要快速多步驟規劃的 autonomous agents，還是完全在裝置端執行的 responsive mobile applications，每一毫秒都很重要。

把 Gemma 4 model 和對應的 drafter 搭配後，開發者可以得到幾個直接效果：

- **更快的回應速度**：大幅降低 near real-time chat、immersive voice applications 與 agentic workflows 的延遲。
- **更強的本機開發體驗**：讓 26B MoE 和 31B Dense models 在 personal computers 與 consumer GPUs 上用更高速度執行，支援更順暢、複雜、離線的 coding 和 agentic workflows。
- **更好的 on-device performance**：讓 E2B 和 E4B edge models 在邊緣裝置上更快產生輸出，進一步節省寶貴的電池電量。
- **零品質損失**：因為最終驗證仍由 primary Gemma 4 model 負責，開發者得到的是同樣的 frontier-class reasoning 與 accuracy，只是交付速度更快。

Google 的示意中，Gemma 4 26B 在 NVIDIA RTX PRO 6000 上搭配 MTP Drafter 後，tokens per second 明顯提升；相同輸出品質下，等待時間接近砍半。

## MTP drafters 的底層最佳化

為了讓這些 MTP drafters 足夠快且準確，Google 在底層做了幾個架構調整。

Draft models 可以無縫使用 target model 的 activations，並共享 target model 的 KV cache。這代表 drafter 不需要浪費時間重新計算大模型已經理解過的 context。

對 E2B 和 E4B 這類 edge models 來說，最後的 logit calculation 會變成重要瓶頸。因此，Google 也在 embedder 裡加入 efficient clustering technique，以進一步加快 generation。

Google 也分析了硬體層面的最佳化。例如，26B mixture-of-experts model 在 Apple Silicon 上、batch size 為 1 時，有它獨特的 routing challenge；但如果同時處理多個 requests，例如 batch sizes 4 到 8，本機端就能解鎖最高約 2.2x speedup。Google 表示，在 Nvidia A100 上提升 batch size 也能看到類似增益。

想看更細的機制，Google 也發布了一份 [technical explainer](https://x.com/googlegemma/status/2051694045869879749)，說明這些 drafters 背後的 visual architecture、KV cache sharing 與 efficient embedders。

## 如何開始使用？

Gemma 4 family 的 MTP drafters 已經推出，並採用和 Gemma 4 相同的 Apache 2.0 open-source license。

開發者可以閱讀 [documentation](https://ai.google.dev/gemma/docs/mtp/overview) 了解如何在 Gemma 4 使用 MTP，也可以從 [Hugging Face](https://huggingface.co/collections/google/gemma-4) 和 [Kaggle](https://www.kaggle.com/models/google/gemma-4) 下載 model weights。

這些 drafters 已可搭配 transformers、[MLX](https://huggingface.co/collections/mlx-community/gemma-4-assistant-mtp)、[vLLM](https://docs.vllm.ai/projects/recipes/en/latest/Google/Gemma4.html)、[SGLang](https://docs.sglang.io/cookbook/autoregressive/Google/Gemma4#speculative-decoding-mtp-server-commands)、[Ollama](https://ollama.com/library/gemma4:31b-coding-mtp-bf16) 使用，也能在 Google AI Edge Gallery 的 [Android](https://play.google.com/store/apps/details?id=com.google.ai.edge.gallery) 與 [iOS](https://apps.apple.com/us/app/google-ai-edge-gallery/id6749645337) 版本直接試用。

<div class="sep">· · ·</div>

## 延伸評論：AI 速度會改變 agent 的產品邊界

這篇看起來是 Gemma 4 的工程更新，但真正重要的是它把「模型可用性」從 benchmark 分數拉回到使用者體感。

對 agent 產品來說，推論速度不是單純的效能指標，而是互動設計的邊界。當模型回應慢，產品通常只能做批次任務、背景分析，或讓使用者等待。當生成速度提升，agent 才更有機會進入即時對話、語音互動、本機 coding、連續工具調用與多步驟規劃。很多看似「模型不夠聰明」的體驗問題，其實也可能是 latency 讓整個 workflow 不可用。

MTP drafters 也提醒開發者一件事：未來開放模型的競爭不只會比模型本身，也會比 serving stack。模型權重、KV cache、batching、speculative decoding、硬體特性、framework integration，這些都會變成實際產品能力的一部分。誰能把同一個模型跑得更快、更便宜、更穩，誰就能把更多任務留在本機或私有環境裡。

不過，速度宣稱也要看上下文。最高 3x speedup 不代表所有 workload 都能直接得到 3 倍效果；batch size、硬體、模型大小、framework support、request pattern 都會影響實際增益。對真的要上 production 的團隊來說，這篇最值得帶走的不是單一數字，而是設計方向：把推論最佳化當成 agent architecture 的一等公民，而不是部署後才處理的 infra 細節。
