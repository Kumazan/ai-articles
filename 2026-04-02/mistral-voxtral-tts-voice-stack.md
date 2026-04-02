---
title: "Mistral Voxtral TTS：把語音做成 AI 的完整輸出層"
description: "Mistral 發表 4B 參數的 Voxtral TTS，主打 9 種語言、70 毫秒延遲、3 秒聲音克隆與可上線的企業語音工作流。"
date: 2026-04-02
author: Mistral AI
layout: post
permalink: /2026-04-02/mistral-voxtral-tts-voice-stack.html
---

<div class="hero-badge">AI Audio · 2026-04-02</div>

**原文連結：** [Speaking of Voxtral](https://mistral.ai/news/voxtral-tts)

## 摘要

- Mistral 釋出 Voxtral TTS，這是他們第一個文字轉語音模型，主打多語言、低延遲、可商業部署
- 模型大小只有 4B 參數，架構由 transformer decoder、flow-matching acoustic transformer 與神經音訊 codec 組成
- 支援 9 種語言：英文、法文、德文、西文、荷蘭文、葡萄牙文、義大利文、印地文與阿拉伯文
- 官方宣稱只要約 3 秒參考音訊就能做聲音適配，也能做跨語言聲線遷移
- 在典型輸入條件下，模型延遲約 70 毫秒，適合即時 voice agent 與串流場景
- 人類評測顯示，它在自然度上優於 ElevenLabs Flash v2.5，並與 ElevenLabs v3 接近
- 這篇文章的重點不只是「又一個 TTS」，而是 Mistral 想把語音變成整個 AI 堆疊裡的正式輸出層

<div class="sep">· · ·</div>

*作者：Mistral AI*

今天，我們推出 **Voxtral TTS**，這是我們第一個文字轉語音模型，並且在多語言語音生成上達到最先進的表現。這個模型只有 **4B 參數**，體積輕巧，能讓由 Voxtral 驅動的代理在大規模場景中依然自然、可靠，而且成本可控。

## 重點摘要

- 能以自然、富含情緒的方式生成 9 種主流語言，並支援多種方言
- 具備非常低的 time-to-first-audio 延遲
- 容易適配到新的聲音
- 可直接在 [Mistral Studio](https://console.mistral.ai/build/audio/text-to-speech) 測試
- 具備企業級文字轉語音能力，可支撐關鍵語音代理工作流

自然的語音生成，關鍵不只是「唸出來」，而是要能正確「理解」文字。上下文理解——例如中性、愉快、諷刺等語氣——會決定輸出聽起來是自然，還是像機器念稿。我們的模型同時擅長上下文理解與說話者建模：它不只模仿一個人的聲音，也捕捉那個人真正說話的方式。聲音適配也不侷限於傳統的 read-speech，而是連同說話者的個性一起抓進來，包含自然停頓、節奏、語調與情緒表現。

由於模型體積小、成本低、延遲低，而且很容易客製化，Voxtral TTS 能讓想要掌握自己語音 AI 堆疊的企業，擁有更完整的控制權。

Audio is the new UX. 語音會開啟新的互動方式，讓協作與理解進入只有聲音才有的體驗。現在就可以在 AI Studio 裡使用我們的 Mistral Voices，支援美式、英式與法式口音。

## 聽聽看：你能分辨差異嗎？

我們的團隊說很多語言，也懂不同文化的細節，所以我們打造了一個反映這些特質的模型。語音生成之所以能建立信任，靠的不只是內容正確，還包括自然的節奏、情緒，甚至幽默感。也因為如此，我們在做 voice emulation 時，把「真實感」與「情緒表達」放在核心。

## 最先進的表現

像 word-error-rate 與音質分數這類自動指標，對於多語言 TTS 來說，很難真正衡量語音的自然度。什麼是自然的語音，其實非常細膩，而且高度依賴文化差異與說話習慣。因此，必須由母語者做比較式的人類評測，這才是關鍵。

對 voice agent 而言，延遲與品質永遠在拉扯。人類評測顯示，Voxtral TTS 的自然度優於 ElevenLabs Flash v2.5，同時維持相近的 Time-to-First-Audio（TTFA）。Voxtral 的品質也與 ElevenLabs v3 處於同一水準，並且成功支援 emotion-steering，讓互動更像真人。

我們在 zero-shot 自訂聲線的情境下，做了 Voxtral TTS 與 ElevenLabs v2.5 Flash 的比較式人類評測。針對 9 種支援語言，各自選了兩個在其母語方言中具有辨識度的聲音，3 位標註者針對每一組做並排偏好測試，評估面向包括自然度、口音貼合度，以及與原始參考音訊的聲學相似度。在這個 zero-shot 多語言自訂聲線設定下，Voxtral TTS 明顯拉開了與 v2.5 Flash 的品質差距，顯示它能快速適配到幾乎任何聲音。

## 母語級表現

Voxtral TTS 以大量語音資料訓練，為全球用途而生。它支援 9 種語言，而且表現達到領先水準：英文、法文、德文、西文、荷蘭文、葡萄牙文、義大利文、印地文與阿拉伯文。

這個模型只要約 **3 秒** 的參考音訊，就能適應新的聲音，不只複製聲音本身，也能捕捉細微口音、語調、語氣，甚至像是停頓與口語不流暢等特徵。我們在 API 裡提供了一些預設聲線，但也很容易擴充成企業內部的聲音庫，依照使用情境做客製化：可本地化到不同語言與口音，也能保持中性、或更有情緒；可以更隨意、也可以更正式；可以更自然像在聊天，也可以更機械。

這個模型也展現出 zero-shot 跨語言聲線適配的能力，雖然我們並沒有特別針對這件事訓練。例如，它可以用法語聲音提示與英文文字，生成英文語音；結果聽起來自然，同時保留該聲音提示的法語口音。這使它很適合拿來建構串接式的 speech-to-speech 翻譯系統。

### 串接式 speech-to-speech 翻譯

點擊或連接喇叭到提示區塊，即可啟用串接式 speech-to-text translation。

## 為低延遲串流而生

對 voice agent 來說，延遲至關重要。Voxtral TTS 在典型輸入條件下——10 秒語音樣本與 500 個字元——可達到約 **70 毫秒** 的模型延遲，real-time factor（RTF）約 **9.7x**。模型原生可生成最長兩分鐘音訊，而我們的 API 透過 smart interleaving，可以處理更長的生成需求。

## Voxtral TTS 架構

這個模型是基於 **Ministral 3B** 的 transformer-based、autoregressive、flow-matching 模型，由以下部分構成：

- 3.4B 參數的 transformer decoder backbone
- 390M 參數的 flow-matching acoustic transformer
- 300M 參數的神經音訊 codec（對稱式 encoder-decoder）

模型會接收 5 到 25 秒的 voice prompt 與 9 種支援語言之一的文字提示。對每一個音訊 frame，transformer backbone 先預測 semantic token，再由 flow-matching transformer 經過 16 次 function evaluations（NFEs）產生 acoustic latent。

我們也自研了一套 codec，透過語義 VQ（8192 vocabulary）與聲學 FSQ（36 維、21 個 levels）latent 來 causally 處理音訊，並以 12.5Hz 的 frame rate 產生輸出。

## 為企業語音工作流而建

Voxtral TTS 把 audio intelligence 的最後一塊拼圖補齊，讓企業語音 pipeline 多了一個能通過人類測試的輸出層。它可以和 [Voxtral Transcribe](https://mistral.ai/news/voxtral-transcribe-2) 搭配，形成完整的 speech-to-speech 流程，也能整合進既有的 speech-to-text 與 LLM 堆疊中，並支援跨語言。

### 工作流

#### 客服支援

語音代理可以跨渠道路由與解決問題，並以自然、符合品牌調性的語氣回應。

把 Voxtral TTS 放進既有客服呼叫系統後，就能讓自動語音回覆融入現有工作流程。

## 到 Mistral Studio 試跑

可以直接在 [Mistral Studio playground](https://console.mistral.ai/build/audio/text-to-speech) 裡試 Voxtral TTS。選一個 Mistral voice，或錄下自己的聲音來測試。

## 開始使用 Voxtral TTS

Voxtral TTS 已可透過 API 使用，價格是每 1k 字元 **$0.016**。

現在就可以在 [Mistral Studio](https://console.mistral.ai/build/audio/text-to-speech) 或 [Le Chat](http://chat.mistral.ai/) 試用。

一組含多個參考聲音的模型已在 [Hugging Face](https://huggingface.co/mistralai/Voxtral-4B-TTS-2603) 以 CC BY NC 4.0 授權釋出為 open weights。

也可以閱讀我們的 [文件](https://docs.mistral.ai/capabilities/audio/text_to_speech) 或 [研究論文](https://arxiv.org/abs/2603.25551)。

如果想更深入了解，還可以報名我們即將舉辦的 [webinar](https://learn.mistral.ai/home/events/building-conversation-ai-voxtral)。

## 我們正在招人！

我們正在打造 AI 的語音層。如果這正是你想解的問題，歡迎 [與我們聯絡](https://mistral.ai/careers)。

## 這篇文章真正值得注意的地方

這類產品發佈最容易被解讀成「又一個 TTS 競品」，但真正的信號其實更大：語音正在從 demo 能力，變成 agent 堆疊裡的正式輸出介面。當模型可以做到低延遲、可克隆、可跨語言、可企業部署，語音就不再只是附加功能，而是新的產品入口。

對開發者來說，值得關注的不是單純的參數數字，而是 Mistral 已經把語音、轉寫、推理、部署與企業工作流串成一條線。這意味著未來的競爭點，可能不只是誰的模型更會講話，而是誰能把整個 voice stack 做成真正可控、可擴充、可上線的基礎設施。
