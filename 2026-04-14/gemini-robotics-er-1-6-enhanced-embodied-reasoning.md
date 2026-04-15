---
title: "Gemini Robotics-ER 1.6：讓機器人更懂真實世界"
description: "Google DeepMind 升級 Gemini Robotics-ER 1.6，把空間推理、多視角理解、儀表讀值與安全判斷整合進機器人工作流，讓具身推理更接近可部署。"
date: 2026-04-14
author: Laura Graesser and Peng Xu
layout: post
permalink: /2026-04-14/gemini-robotics-er-1-6-enhanced-embodied-reasoning.html
image: /2026-04-14/og-gemini-robotics-er-1-6-enhanced-embodied-reasoning.png
---

<div class="hero-badge">AI News · 2026-04-14</div>

![](/ai-articles/2026-04-14/og-gemini-robotics-er-1-6-enhanced-embodied-reasoning.png)

**原文連結：** [Gemini Robotics-ER 1.6: Powering real-world robotics tasks through enhanced embodied reasoning](https://deepmind.google/blog/gemini-robotics-er-1-6/)

## 摘要

- Gemini Robotics-ER 1.6 是 Google DeepMind 為機器人打造的 reasoning-first 模型升級版
- 它強化了空間推理、多視角理解、task planning 和 success detection
- 新增的 instrument reading，讓機器人能讀壓力錶、液位管和數位儀表
- 模型可透過 Gemini API 和 Google AI Studio 給開發者使用
- DeepMind 強調它也是目前最安全的 robotics model 之一
- 對做實體自動化、工廠巡檢和 agentic robotics 的人來說，這是很實際的一步

<div class="sep">· · ·</div>

### 讓機器人先學會「想清楚」

要讓機器人在日常生活和產業裡真的有用，它們不能只會照指令做事，還得懂得推理真實世界。從穿越複雜場域，到辨識壓力錶上的指針，所謂的「具身推理」就是把數位智慧和物理行動接起來的能力。

今天，Google DeepMind 發表了 **Gemini Robotics-ER 1.6**，這是一次重要升級，讓機器人能更精準地理解周遭環境。透過更強的空間推理和多視角理解，下一代 physical agents 的自主性又往前推了一步。

這個模型專注於機器人最關鍵的推理能力，包括視覺與空間理解、任務規劃，以及 success detection。它扮演的是機器人的高層推理模型，可以原生呼叫 Google Search 找資料、vision-language-action models (VLA)，或其他第三方使用者自訂函式來執行任務。

Gemini Robotics-ER 1.6 相較於 [Gemini Robotics-ER 1.5](https://developers.googleblog.com/building-the-next-generation-of-physical-agents-with-gemini-robotics-er-15/) 與 [Gemini 3.0 Flash](https://blog.google/products-and-platforms/products/gemini/gemini-3-flash/)，在 pointing、counting 和 success detection 這些空間與物理推理能力上都有明顯提升。圖中的 single-view 與 multiview success detection 使用的是不同樣本，因此不能直接互比。儀表讀值的評估也只有 Gemini Robotics-ER 1.5 沒有 agentic vision，其他模型都在同條件下測試。我們也開啟了一項新能力：**instrument reading**，也就是讓機器人能讀複雜的儀表與 sight glass，這是和合作夥伴 Boston Dynamics 密切合作中發現的重要應用場景。

從今天開始，開發者可以透過 [Gemini API](https://ai.google.dev/gemini-api/docs/robotics-overview) 和 [Google AI Studio](https://aistudio.google.com/prompts/new_chat?model=gemini-robotics-er-1.6-preview) 使用 Gemini Robotics-ER 1.6。DeepMind 也提供了 developer [Colab](https://github.com/google-gemini/robotics-samples/blob/main/Getting%20Started/gemini_robotics_er.ipynb)，示範如何設定模型與提示詞來處理具身推理任務。

### Pointing：空間推理的基礎

Pointing 是具身推理模型的基本能力，而且每一代都在變強。Point 可以拿來表達很多概念，包括：

- 空間推理：精準物件偵測與數量判斷
- 關係邏輯：比較大小，或定義 from-to 關係，例如把 X 移到 Y
- 運動推理：描出軌跡，找出最佳抓取點
- 約束遵循：像「指出所有小到能放進藍色杯子裡的物件」這種複雜指令

Gemini Robotics-ER 1.6 會把 points 當成中介步驟，去推理更複雜的任務。比如它可以用 point 來數圖片裡的物品，或先找出圖片中最有意義的位置，再用那些位置來幫模型做數學估算、提高量測準確度。

下面這個例子顯示了它在多元素 pointing 上的表現，也包含它知道什麼時候**不要**亂點。

Gemini Robotics-ER 1.6 正確辨識出 2 把 hammers、1 把 scissors、1 把 paintbrushes、6 把 pliers，以及一組 garden tools。這組 garden tools 可以被視為單一群組，也可以拆成多個點。它沒有去指向圖片裡不存在的 wheelbarrow 和 Ryobi drill。相比之下，Gemini Robotics-ER 1.5 沒抓對 hammers 和 paint brushes 的數量，漏掉 scissors，還幻覺出 wheelbarrow，而且在 pliers 的定位上也不夠精準。Gemini 3.0 Flash 已經很接近 Gemini Robotics-ER 1.6，但在 pliers 的處理上還是稍弱一些。

### Success Detection：自主性的引擎

在機器人世界裡，知道任務什麼時候完成，和知道怎麼開始一樣重要。Success detection 是自主性的核心，因為它讓 agent 能判斷該重試失敗步驟，還是直接進到下一個計畫階段。

要在視覺上理解這件事其實不容易，因為它需要很強的感知與推理能力，再加上廣泛的世界知識，才能處理遮擋、光線不足和指令模糊等問題。現代機器人系統通常還會有多個視角，例如頭頂相機和手腕相機，因此系統必須能把不同視角整合成同一個連續的世界表徵。

Gemini Robotics-ER 1.6 進一步強化了 multi-view reasoning，讓系統能在動態或被遮擋的環境裡，從多個相機流中更好地理解它們之間的關係。例如，它可以用多個視角判斷「把藍筆放進黑色筆筒」這個任務是否真的完成了。

### Instrument reading：真實世界的視覺推理

要看懂 Gemini Robotics-ER 1.6 的強項，最好的例子就是 instrument reading。

這個任務來自工廠巡檢的需求，也是 Boston Dynamics 很重要的合作場景。工業設施裡有很多儀器，像溫度計、壓力錶、chemical sight glass 等，都需要持續監測。Boston Dynamics 的 Spot 機器人可以走訪這些儀器並拍下影像，交給 Gemini Robotics-ER 1.6 判讀。

Gemini Robotics-ER 1.6 能解讀多種儀表，包括圓形 pressure gauges、垂直液位指示器，以及現代數位讀值。

儀表讀值需要很複雜的視覺推理，必須精準辨識各種細節，包括指針、液面、容器邊界、刻度與更多訊號，還要理解它們之間的關係。對 sight glasses 來說，還得估算液體到底填到哪裡，並把相機視角造成的變形算進去。Gauge 上通常也有描述單位的文字要讀出來，有些還有多根指針，必須把不同小數位合併起來。

> 具備 instrument reading 和更可靠的任務推理之後，Spot 就能更自主地看懂、理解並回應真實世界的挑戰。
>
> Marco da Silva，Boston Dynamics Spot 副總裁暨總經理

Gemini Robotics-ER 1.6 之所以能做到高精度儀表讀值，是因為它用了 [agentic vision](https://blog.google/innovation-and-ai/technology/developers-tools/agentic-vision-gemini-3-flash/)，把視覺推理和 code execution 結合起來。這個任務上，Gemini Robotics-ER 1.5 的成功率是 23%，Gemini 3.0 Flash 是 67%，Gemini Robotics-ER 1.6 是 86%，而加入 agentic vision 後可以到 93%。模型會先做中間步驟，例如把圖片放大，看清 gauge 上的小細節，再用 pointing 和 code execution 估算比例與區間，最後結合世界知識把意義解讀出來。

### 我們目前最安全的 robotics model

安全性被整合進具身推理模型的每一層。Gemini Robotics-ER 1.6 是目前 Google 最安全的 robotics model，在對抗性的空間推理任務上，相較前幾代模型有更好的 Gemini safety policies 遵循度。

它也展現出更好的物理安全約束遵循能力。舉例來說，當面對像「不要碰液體」或「不要拿起超過 20kg 的物件」這類材料與夾爪限制時，它能透過空間輸出做出更安全的判斷。

我們也測試了它在 text 與 video 場景中辨識安全風險的能力，這些場景是根據真實受傷案例設計的。結果顯示，Gemini Robotics-ER 模型在這些任務上，比基準 Gemini 3.0 Flash 更好，text 提升 6%，video 提升 10%，代表它更能正確感知受傷風險。

### 一起把具身推理做得更實用

Google 表示，如果現在的能力對某些專門應用還不夠，也歡迎團隊提交 10 到 50 張標註圖片，幫助找出失敗模式，讓下一版推理能力更強。

如果想開始動手，現在就可以到 Google AI Studio 試用 Gemini Robotics-ER 1.6。

<div class="sep">· · ·</div>

## 延伸評論：機器人終於開始碰到「可部署」的門檻

這次更新最有意思的地方，不是機器人突然會讀錶了，而是 DeepMind 其實把問題定義得很實際，先把「看懂、判斷、驗證」這三件事做好，再談怎麼真正進到工廠和巡檢流程。

對真正做 physical AI 的團隊來說，這代表瓶頸正從「能不能動」轉向「能不能穩定理解現場」。一旦 success detection、multi-view reasoning 和 instrument reading 開始變成標配，機器人就不再只是展示型 demo，而會開始碰到責任、流程和安全的現實世界問題。