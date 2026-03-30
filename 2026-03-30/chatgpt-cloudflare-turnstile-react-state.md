---
title: "你打字之前，Cloudflare 已讀完你的 React 狀態：我解密了那支程式"
description: "研究者逆向工程 ChatGPT 的 Cloudflare Turnstile 機制，解密 377 支程式後發現：每次輸入前都會蒐集 55 個瀏覽器屬性，包含 GPU、字型、地理位置，甚至 React 應用程式的內部狀態——機器人防護已進化到應用層。"
date: 2026-03-30
author: buchodi
layout: post
permalink: /2026-03-30/chatgpt-cloudflare-turnstile-react-state.html
---

<div class="hero-badge">AI News · 2026-03-30</div>

**原文連結：** [ChatGPT Won't Let You Type Until Cloudflare Reads Your React State. I Decrypted the Program That Does It.](https://www.buchodi.com/chatgpt-wont-let-you-type-until-cloudflare-reads-your-react-state-i-decrypted-the-program-that-does-it/)

## 摘要

- 每則 ChatGPT 訊息送出前，Cloudflare Turnstile 會在瀏覽器中靜默執行一支加密程式，蒐集 55 個屬性
- 蒐集範圍分三層：瀏覽器指紋（GPU、螢幕、字型）、Cloudflare 網路層（城市、IP、地理位置），以及 ChatGPT React 應用程式的內部狀態（`__reactRouterContext`、`loaderData`、`clientBootstrap`）
- 加密方式是 XOR，但 XOR 金鑰就藏在同一個 HTTP 請求裡，作者 377 次解密全部成功
- 機器人偵測已進化到「應用層」：即使爬蟲能偽造瀏覽器指紋，只要沒真正執行 React，就會被識破
- 此外還有「訊號協調器」監測鍵盤節奏、滑鼠速度、捲動行為，以及工作量證明（PoW），構成三層防護

<div class="sep">· · ·</div>

## 前情提要

你知道每次在 ChatGPT 聊天框按下 Enter，你的瀏覽器在傳送訊息之前都在執行一支加密程式嗎？

這支程式的任務是確認你是「人類」——或更準確地說，確認你正在執行一個真實的 ChatGPT React 應用程式。研究者 buchodi 花時間逆向工程了這個機制，解密了 377 支程式，結果令人意外。

---

## 加密本來是要隱藏這件事的

Cloudflare Turnstile 的程式碼以加密形態送達瀏覽器。每次請求，伺服器都會送出一個叫 `turnstile.dx` 的欄位：28,000 個字元的 base64，每次都不同。

外層加密是用 `p` token 做 XOR，而這個 `p` token 就在同一個 HTTP 交換裡，所以解密很直接：

```python
outer = json.loads(bytes(
    base64decode(dx)[i] ^ p_token[i % len(p_token)]
    for i in range(len(base64decode(dx)))
))
# → 89 條 VM 指令
```

89 條 VM 指令裡還藏著一個 19KB 的加密 blob，包含真正的指紋蒐集程式。這個內層 blob 用的是不同的 XOR 金鑰——但這個金鑰就放在指令裡：

```
[41.02, 0.3, 22.58, 12.96, 97.35]
```

最後一個浮點數 `97.35` 就是 XOR 金鑰。跨 50 個請求驗證，每次都行。**金鑰就在 payload 裡。**

---

## 解密後的程式在蒐集什麼

每支程式用自訂 VM（28 個 opcode）蒐集固定的 55 個屬性，分成三層：

### 第一層：瀏覽器指紋

- **WebGL（8 項）：** GPU 廠商、渲染器資訊、canvas 上下文
- **螢幕（8 項）：** 色彩深度、解析度、可用區域
- **硬體（5 項）：** CPU 核心數、記憶體容量、觸控點數量、平台、廠商
- **字型測量（4 項）：** 建立隱藏 div，設定字型，用 `getBoundingClientRect()` 測量實際渲染尺寸，再移除元素
- **DOM 探測（8 項）：** createElement、appendChild 等基本 DOM 操作
- **儲存（5 項）：** 讀寫 `localStorage`，金鑰為 `6f376b6560133c2c`，讓指紋能在頁面載入之間持久化

### 第二層：Cloudflare 網路層

- **邊緣 header（5 項）：** `cfIpCity`、`cfIpLatitude`、`cfIpLongitude`、`cfConnectingIp`、`userRegion`

這些是 Cloudflare 邊緣伺服器在伺服器端注入的。如果機器人直接打到源站、或走非 Cloudflare 代理，這些值就會缺失或不一致。

### 第三層：React 應用程式狀態（這才是重點）

- **`__reactRouterContext`**：React Router v6+ 掛到 DOM 的內部資料結構
- **`loaderData`**：路由 loader 的結果
- **`clientBootstrap`**：ChatGPT 的 SSR 水合（hydration）專用屬性

**這三個屬性只有在 ChatGPT React 應用程式完整渲染並水合後才會存在。** 載入了 HTML 但沒執行 JavaScript bundle 的 headless 瀏覽器不會有這些值；模擬瀏覽器 API 但沒真正跑 React 的機器人框架也不會有。

這是**應用層**的機器人偵測，不是瀏覽器層。

---

## Token 如何生成

蒐集完 55 個屬性後，程式執行 4 條最終指令：

```json
[
    [96.05, 3.99, 3.99],   // JSON.stringify(fingerprint)
    [22.58, 46.15, 57.34], // store
    [33.34, 3.99, 74.43],  // XOR(json, key)
    [1.51, 56.88, 3.99]    // RESOLVE → 成為 token
]
```

指紋被 JSON 序列化、XOR 加密，然後回傳給父層，成為每次對話請求裡的 `OpenAI-Sentinel-Turnstile-Token` header。

---

## Sentinel 還跑了什麼

Turnstile 只是三道防線之一：

**訊號協調器（271 條指令）：** 安裝 `keydown`、`pointermove`、`click`、`scroll`、`paste`、`wheel` 事件監聽，追蹤 36 個 `window.__oai_so_*` 屬性，監測鍵盤節奏、滑鼠速度、捲動模式、閒置時間和貼上事件。這是一套行為生物辨識層，在指紋蒐集之下靜默運作。

**工作量證明（25 欄位指紋 + SHA-256 hashcash）：** 難度均勻隨機（40 萬至 50 萬），72% 在 5ms 內解完。包含 7 個二進位偵測旗標（`ai`、`createPRNG`、`cache`、`solana`、`dump`、`InstallTrigger`、`data`），100 個樣本中全部為零。PoW 增加了計算成本，但不是真正的防線。

---

## 誰能解密 Token

內層程式的 XOR 金鑰是伺服器生成、嵌在 bytecode 裡的浮點數。生成 `turnstile.dx` 的人知道這個金鑰。

使用者與系統之間的隱私邊界，是**政策決定**，不是密碼學保證。

混淆的實際用途有幾個：隱藏指紋清單以防靜態分析、讓每個 token 都是唯一的防止重放攻擊、允許 Cloudflare 在無人察覺的情況下更換蒐集項目。但「加密」方式是 XOR 加上同資料流裡的金鑰——防得了隨便看看，防不了有心分析。

---

## 數據摘要

| 指標 | 數值 |
|------|------|
| 解密程式數 | 377/377（100%） |
| 觀察到的唯一用戶 | 32 |
| 每支程式蒐集屬性數 | 55（所有樣本相同） |
| 每支程式指令數 | 417–580（平均 480） |
| 唯一 XOR 金鑰（50 個樣本） | 41 |
| 訊號協調器行為屬性數 | 36 |
| PoW 指紋欄位數 | 25 |
| PoW 解題時間 | 72% 在 5ms 內 |

---

## 研究方法

研究者未未經授權存取任何系統，未揭露個別用戶資料，所有流量皆來自取得同意的參與者。Sentinel SDK（1,411 行）被美化後手動反混淆，所有解密均在離線環境以 Python 完成。
