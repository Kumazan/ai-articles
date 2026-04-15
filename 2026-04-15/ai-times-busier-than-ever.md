---
title: "AI 時代，大家反而更忙了"
description: "Latent Space 這期從 Turkey problem、SWE-Bench 飽和、GDPval、Chrome Skills、Gemini Robotics、GPT-5.4-Cyber 到 Hermes Agent，整理出一個反直覺結論：AI 越強，知識工作者似乎越忙。"
date: 2026-04-15
author: swyx (Shawn)
layout: post
permalink: /2026-04-15/ai-times-busier-than-ever.html
image: /2026-04-15/og-ai-times-busier-than-ever.png
---

<div class="hero-badge">AI News · 2026-04-15</div>

![](/ai-articles/2026-04-15/og-ai-times-busier-than-ever.png)

**原文連結：** [Humanity's Last Gasp](https://www.latent.space/p/ainews-humanitys-last-gasp)

## 摘要

- 這期最反直覺的訊號是，AI 讓代理人做更多事，但人類並沒有因此輕鬆下來
- Aaron Levie、Tyler Cowen、Simon Last 都指向同一件事，現在是「工作更多、焦慮也更多」的時代
- SWE-Bench 飽和、GDPval 與 ARC-AGI-3 讓評測焦點開始往下一層移動
- Google、OpenAI、Cursor、Hermes、LangChain 都在把 AI 從 demo 推向可部署的工作流
- 世界模型、機器人與 3D 生成也在往「可編輯、可執行」的方向前進
- 這期的核心不是某個單一模型，而是 AI 基礎設施正在重寫工作的節奏

<div class="sep">· · ·</div>

### 真的愈來愈忙了嗎？

Latent Space 和 AI Engineer 最近反覆出現一個主題，大家看起來都比以前更拼了。

- （節目朋友）Aaron Levie 說過，**「AI 目前沒有讓任何人少工作，矽谷的人反而覺得自己的團隊忙到前所未有。」**
- Tyler Cowen 從經濟學角度主張，不管你認為 AI 會降低你的價值，還是提高你的價值，**現在都應該更用力工作。**
- Notion 的 Simon Last 在今天的節目裡說，他是自從放棄機器學習模型訓練以來，第一次又回到**失眠和 24/7 工作**的狀態，但這次不是因為訓練，而是因為 **agent 層的 token 焦慮**。

所以問題就變成了，為什麼會同時成立：**代理人做得更多，但每個人也都更忙？**

怎麼會一邊說 Claude Mythos 已經在內部用了 2 個月，一邊又看到 Claude 三不五時當掉？怎麼會一邊說模型與 agent 實驗室生產力爆表，一邊又看到 acquihiring 和收購案越來越多？

這裡就回到一個很老的比喻，**Turkey problem**。火雞根據眼前看到的歷史資料，只能得出一個結論，世界越來越美好，因為人類一直餵牠吃得很好；直到感恩節那天，真相才突然現形。看著這波 AI 浪潮，工程師和其他知識工作者，會不會也像火雞一樣？在某個時間點之前，工作彈性和工作價值是不是還會一路上升，直到跨過某個臨界點，才變成真正的「馬」？

現在 SWE-Bench 已經接近飽和，SWE-Bench Pro 很快也要上場，Mythos 在裡面已經到 78%；GDPval 甚至把 GPT-5.4 評成在多數經濟領域裡，83% 的時間都優於或等於人類專家。那接下來還剩下什麼？

Notion 在做 Notion’s Last Exam，Greg 和 Francois 已經推出 ARC-AGI-3，而這邊也在想下一個 coding eval 的前沿。但這一切似乎都很空泛，如果硬體就是命運，而 AGI 只是遲早要靠 20GW 超級叢集才能堆出來的東西……

……或者，還有更有價值的問題等著被解決？

AI News for 4/3/2026-4/4/2026。我們檢查了 12 個 subreddit、544 個 Twitter 帳號，沒有再看其他 Discord。AINews 的網站可以搜尋所有歷史期數。順帶一提，AINews 現在已經是 Latent Space 的一個分支，你也可以自己設定要不要收到這些郵件頻率。

### 熱門推文（依互動量）

- **Google 的 Chrome「Skills」把提示詞變成可重用的瀏覽器工作流程**：Google 推出 Chrome Skills，讓使用者把 Gemini 提示存成一鍵動作，直接在目前頁面與選取的分頁上執行。Google 也同步提供一組預設 Skills，這不只是提示詞紀錄，而是瀏覽器裡的輕量級 agent 化。
- **Tencent 的 HYWorld 2.0 把世界模型往可編輯 3D 場景推進**：在正式發布前，@DylanTFWang 先曝光了 HYWorld 2.0，這是一個開源、可直接接進引擎的 3D world model，能從單張圖片生成可編輯的 3D 場景。
- **Google DeepMind 推出 Gemini Robotics-ER 1.6**：這個新模型強化了視覺與空間推理、增加了更安全的物理推理能力，並可在 Gemini API / AI Studio 使用。後續貼文提到，它在儀表讀值上的成功率可達 93%，也更能處理液體、重物這類物理限制。
- **OpenAI 擴大 Trusted Access for Cyber，並推出 GPT-5.4-Cyber**：OpenAI 表示，GPT-5.4-Cyber 是針對防禦型資安工作流微調的 GPT-5.4 變體，只開放給更高層級、完成身份驗證的防禦者，透過 Trusted Access 計畫使用。
- **Hugging Face 在 Hub 上推出 Kernels**：@ClementDelangue 宣布新增一種 repo 類型，專門放 GPU kernels，預編譯產物會對應到特定 GPU / PyTorch / OS 組合，官方宣稱可比 PyTorch 基線快 1.7x 到 2.5x。
- **Cursor 和 NVIDIA 做了一個多 agent CUDA 最佳化系統**：@cursor_ai 說，他們的多 agent 軟體工程系統在 3 週內，對 235 個 CUDA 問題拿到 38% 的幾何平均加速，這是 agent 被拿去做系統最佳化，而不只是 app scaffolding 的很實際例子。

### Agent 基礎設施：Hermes、Deep Agents 與生產級 harness

- **Hermes Agent 正在變成一個認真的本地 agent 堆疊**：很多人都在往 Hermes Agent 移動，原因不是模型 IQ 特別高，而是它在長時間任務上更穩、更容易延續。這次它發了 v0.9.0，大幅更新 web UI、模型切換、iMessage / WeChat 整合、備份還原，以及透過 tmux 在 Android 上跑的支援；Tencent 也補了一個一鍵 Lighthouse 部署，方便長駐雲端與訊息整合。記憶管理這塊，hermes-lcm v0.2.0 加入了無損 context 管理、持久訊息儲存、DAG 摘要，以及展開被壓縮 context 的工具。社群回饋很一致，Hermes 的優勢不是「最聰明」，而是**穩定、可擴充、可部署**。
- **LangChain 正把 deep agents 推向可部署的多租戶 async 系統**：deepagents 0.5 增加了 async subagents、多模態檔案支援，以及 prompt caching 改善。相關貼文也在強調，deepagents deploy 是 managed agent hosting 的開源替代方案，接下來還會做 user / agent / org 範圍的記憶切分，以及自訂 auth / per-user thread isolation。這個趨勢很明顯，AI agent 不再只是 demo，而是開始碰 tenancy、isolation、long-lived task、Salesforce 整合、Agent Protocol server 這些平台問題。
- **Harness design 已經變成一個正式工程題目**：好幾篇貼文都在說，agent 表現不只看模型，也看 scaffold。@Vtrivedy10 把「thin vs thick」這種意識形態之爭講得最清楚，主張要用任務專用的開放 harness；@kmeanskaran 則強調流程設計、記憶切換、工具輸出控制，比追 frontier model 更重要。這也呼應 @ClementDelangue 想要一份模型到最佳 coding / agent harness 的對照表，因為開源權重模型越來越多，這種 mapping 只會越來越必要。

### 機器人、世界模型與 3D 生成

- **Gemini Robotics-ER 1.6 是 embodied reasoning 的重要產品化一步**：@GoogleDeepMind 這次強調的是更好的視覺 / 空間理解、工具使用，以及物理限制推理。後續補充提到，這個模型對人類受傷風險的判斷提升了 10%，也能讀更複雜的類比儀表；而且現在可以透過 API 使用。這比較不像是一般研究論文掉落，而更像一個真正面向開發者的 embodied-reasoning API。
- **世界模型正在從電影感 demo 走向可編輯的空間資產**：Tencent 的 HYWorld 2.0 teaser 明確把自己和影片生成系統區分開來，主打的是一個真正的 3D 場景，可編輯、可直接丟進引擎。網頁端這邊，Spark 2.0 也釋出了可串流的 LoD 系統，目標是把 1 億個以上的 splat 世界帶到 WebGL2，涵蓋手機、網頁與 VR。這些跡象都在說，**AI 生成 3D** 正從內容生成，走向互動式渲染與下游可用資產。
- **開源 3D 生成正在往拓樸、UV、rigging 與可動畫化前進**：@DeemosTech 介紹了 SATO，一個用來生成 topology 和 UV 的 autoregressive 模型；@yanpei_cao 則發布 AniGen，可以從單張圖生成 3D shape、skeleton 和 skinning weights。這很重要，因為真正常見的生產瓶頸從來不是「能不能生出 mesh」，而是這個資產能不能被動畫、貼圖和編輯。

### 模型、基準與專用系統

這一期的後半還在持續整理模型、基準和專用系統的變化，但主訊號已經很清楚了，競爭焦點正在從「誰的模型最強」轉向「誰能把模型接到真實工作流裡」。

<div class="sep">· · ·</div>

## 延伸評論：真正被重寫的是工作節奏

這篇最耐人尋味的地方，不是單一模型又刷了幾個 benchmark，而是它把一個更大的變化講得很清楚，AI 並沒有讓工作消失，反而把工作切成更多層，從開發、review、hardening 到 deployment，每一層都需要新的流程、預算和協作方式。

所以「大家更忙了」不一定只是錯覺。當模型真的開始做更多事，瓶頸就會往上移，變成 harness、tenancy、記憶、評測、資安與 token 管理。對真的在做 agent 的團隊來說，接下來最值錢的，可能不是再多一個 demo，而是能不能把這些看起來瑣碎、卻決定成敗的基礎設施做穩。
