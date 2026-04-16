---
title: "Darkbloom：在 Apple Silicon 上做私有 AI 推論"
description: "Darkbloom 把閒置的 Apple Silicon Mac 串成去中心化推論網路，主打端到端加密、硬體驗證與更低成本的 OpenAI 相容 API。"
date: 2026-04-16
author: Eigen Labs
layout: post
permalink: /2026-04-16/darkbloom-private-ai-inference-on-apple-silicon.html
image: /2026-04-16/og-darkbloom-private-ai-inference-on-apple-silicon.png
---

<div class="hero-badge">AI News · 2026-04-16</div>

![](/ai-articles/2026-04-16/og-darkbloom-private-ai-inference-on-apple-silicon.png)

**原文連結：** [Darkbloom — Private AI Inference on Apple Silicon](https://darkbloom.dev)

## 摘要

- Darkbloom 想把閒置的 Apple Silicon Mac 串成一個去中心化推論網路
- 目標是讓 AI 推論更便宜，而且不需要把資料交給中心化雲端
- 它主打 OpenAI 相容 API，聊天、圖片生成、語音轉文字都可用
- 系統設計強調端到端加密、硬體驗證、受保護的執行環境與可追溯簽章
- 官方宣稱成本最高可比中心化替代方案低 70%
- 硬體擁有者可以吃下 95% 的收入，利用閒置設備賺取美元

<div class="sep">· · ·</div>

## 閒置 Mac 上的私有推論

我們提出 Darkbloom，一個去中心化推論網路。今天的 AI 算力經過三層加價，從 GPU 製造商到雲端超大規模業者，再到 API 供應商，最後才到使用者。與此同時，超過 1 億台 Apple Silicon 裝置每天大多數時間都在閒置。我們把這些機器直接接到需求端。營運者看不到推論資料。API 則相容 OpenAI。根據我們的測量，成本最多可比中心化替代方案低 70%。營運者保留 95% 的收入。

## 這能帶來什麼

### 對使用者來說

#### 推論成本減半

閒置硬體幾乎沒有邊際成本，因此節省會直接反映到價格上。這是一個相容 OpenAI 的 API，可用於聊天、圖片生成與語音轉文字。每個請求都會端到端加密。

[開啟控制台 ↗](https://console.darkbloom.dev)

### 對硬體擁有者來說

#### 用閒置 Apple Silicon 賺美元

你的 Mac 本來就有硬體。營運者拿走 100% 的推論收入。Apple Silicon 的電力成本依工作負載不同，大約是每小時 0.01 到 0.03 美元。剩下的就是利潤。

[開始賺錢 ↗](https://console.darkbloom.dev/earn)

## 為什麼這件事值得做

AI 算力市場現在有三層利潤：NVIDIA 把 GPU 賣給雲端大廠，AWS、Google、Azure 與 CoreWeave 再把容量加價租給 AI 公司，AI 公司最後再把服務加價賣給終端使用者。每一層都抽成，最後使用者付出的價格遠高於晶片的實際運行成本。

這會把財富與可用性一起集中到少數公司手上。大家都是在租，不是擁有。

但 Apple 近年已出貨超過 1 億台具備 ML 硬體的機器。統一記憶體架構、273 到 819 GB/s 的記憶體頻寬、Neural Engine，甚至足以跑 2350 億參數模型的機器都存在。大多數設備每天閒置 18 小時以上，卻沒有替擁有者帶來任何收益。

這不是技術問題，而是市場問題。

這個模式很像 Airbnb 把閒置房間接給旅客，Uber 把閒置汽車接給乘客，屋頂太陽能把閒置屋頂變成能源資產。在每一個案例裡，分散式閒置容量都能用接近零的邊際成本打穿中心化老大哥。

Darkbloom 也是同一個邏輯。閒置 Mac 來跑推論，使用者因為中間少了雲端大廠而付更少，硬體擁有者則從自己原本就有的設備賺錢。不同於那些網路，營運者看不到使用者的資料。

### 100M+
自 2020 年以來出貨的 Apple Silicon 裝置

### 3x+
從晶片到終端 API 價格的加價倍數

### 18hrs
每台機器平均每日閒置時間

### 100%
收入都歸硬體擁有者

## 挑戰在哪裡

其他去中心化算力網路，重點是把買家和賣家連起來。那是簡單的部分。

真正困難的是信任。你把提示詞送到一台不屬於你的機器上，由一個你從沒見過的人在操作。那裡面可能是公司的內部資料、使用者對話、競爭優勢，全都跑在別人家裡的硬體上。

如果沒有可驗證的隱私，去中心化推論根本走不通。

## 我們的方法

### 移除所有可被觀察的路徑

我們移除了營運者可能看到推論資料的每一條軟體路徑。這裡有四層彼此獨立、也能獨立驗證的保護。

### 加密

#### 端到端加密

請求會先在使用者裝置上加密，再送出去。協調器只會轉送密文。只有目標節點上、綁定硬體的金鑰才能解密。

### 硬體

#### 硬體驗證

每個節點都持有一把在 Apple 防篡改安全硬體內產生的金鑰。驗證鏈可以一路追溯到 Apple 的根憑證機構。

### 執行環境

#### 強化過的 runtime

推論程序在作業系統層級被鎖定。禁止 debugger 附著，也禁止記憶體檢視。營運者無法從執行中的程序把資料抓出來。

### 輸出

#### 可追溯到硬體

每個回應都會由產生它的那台特定機器簽章。完整的驗證鏈會公開，任何人都能自行檢查。

### 營運者跑你的推論，但看不到你的資料

提示詞在離開你的機器之前就先加密。協調器只能路由自己看不懂的密文。提供者在一個協調器無法檢視的強化程序內解密。整條驗證鏈都是公開的。

[閱讀論文 ↗](#paper)

## 實作

### OpenAI 相容 API

只要換掉 base URL，其他都能照常運作。串流、函式呼叫，全部沿用既有 SDK。

```python
from openai import OpenAI

client = OpenAI(
 base_url="https://api.darkbloom.dev/v1",
 api_key="your-api-key"
)

response = client.chat.completions.create(
 model="mlx-community/gemma-4-26b-a4b-it-8bit",
 messages=[{"role": "user", "content": "Hello!"}],
 stream=True
)

for chunk in response:
 print(chunk.choices[0].delta.content, end="")
```

- Streaming, SSE, OpenAI 格式
- 圖片生成，FLUX.2 on Metal
- 語音轉文字，Cohere Transcribe
- 大型 MoE，最高 239B 參數

## 結果

### 成本比較

閒置硬體幾乎沒有邊際成本，所以省下來的部分會直接反映在價格上。沒有訂閱費，也沒有最低消費。以下是每百萬 token 價格的比較：

- Gemma 4 26B, 4B active、快速的多模態 MoE, 輸入 $0.03, 輸出 $0.20, OpenRouter $0.40, 省 50%
- Qwen3.5 27B, Dense、前沿級推理, 輸入 $0.10, 輸出 $0.78, OpenRouter $1.56, 省 50%
- Qwen3.5 122B MoE, 10B active、最佳品質, 輸入 $0.13, 輸出 $1.04, OpenRouter $2.08, 省 50%
- MiniMax M2.5 239B, 11B active、SOTA coding, 輸入 $0.06, 輸出 $0.50, OpenRouter $1.00, 省 50%

#### 圖片生成
$0.0015 / 張
Together.ai：$0.003

#### 語音轉文字
$0.001 / 音訊分鐘
AssemblyAI：$0.002

#### 平台費
0%
營運者保留 100%
透明

## 營運經濟

營運者提供閒置的 Apple Silicon，換取美元。100% 的推論收入都歸營運者。唯一的變動成本是電費。

### 100%
收入都屬於你

### ~90%
利潤率

#### 透過 Terminal 安裝

下載 provider binary 並設定 launchd 服務。

```terminal
$ curl -fsSL https://api.darkbloom.dev/install.sh | bash
```

- 無需相依套件
- 自動更新
- 以 launchd 服務執行

### 收益預估

選擇硬體後，就可以估算預期營收。頁面會根據機器、晶片、記憶體，以及每天 18 小時的閒置假設，分別估算文字與圖片工作負載的收入、年收入、電費與淨利；目前畫面上的初始值都還是 0。

這些都只是估算。實際結果取決於網路需求與模型受歡迎程度。前提是，你真的擁有那台 Mac。

### 讀研究論文

架構規格、威脅模型、安全性分析，以及分散式 Apple Silicon 上硬體驗證私有推論的經濟模型。

[下載 PDF ↗](https://github.com/Layr-Labs/d-inference/blob/master/papers/dginf-private-inference.pdf)

## 模型目錄

### 可用模型

經過精選，只有值得付費的模型。

- Gemma 4 26B, Google 最新模型，快速的多模態 MoE，4B active params, 文字
- Qwen3.5 27B, Dense、前沿級推理（Claude Opus 蒸餾版）, 文字
- Qwen3.5 122B MoE ⓘ, 10B active, 每 token 最佳品質, 文字
- MiniMax M2.5 239B ⓘ, SOTA coding，11B active，Mac Studio 上 100 tok/s, 文字
- Cohere Transcribe, 2B conformer，語音轉文字的最佳選擇, 音訊
## 你可以怎麼看這件事

Darkbloom 的方向很清楚，就是把一直被雲端平台壟斷的推論層往外拆，改用分散式閒置硬體來承接。這種想法有吸引力，也有現實阻力。吸引力在於它把成本結構直接打到最薄，阻力則在於信任、驗證、網路品質與模型供給，任何一項沒做好都會立刻回頭傷到使用者體驗。

如果它真的能把「看不到資料」和「OpenAI 相容」同時成立，這會不是又一個本地 AI 小工具，而是對雲端推論定價的一次直接挑戰。
