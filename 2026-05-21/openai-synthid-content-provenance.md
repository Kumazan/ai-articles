---
title: "OpenAI 採用 Google SynthID：AI 內容溯源進入多層驗證時代"
description: "OpenAI 宣布採用 C2PA、Google SynthID 與公開驗證工具，讓 ChatGPT、Codex/API 生成圖片更容易被平台與使用者辨識來源。"
date: 2026-05-21
author: OpenAI
layout: post
permalink: /2026-05-21/openai-synthid-content-provenance.html
---

<div class="hero-badge">OpenAI · 2026-05-19</div>

**原文連結：** [Advancing content provenance for a safer, more transparent AI ecosystem](https://openai.com/index/advancing-content-provenance/)

## 摘要

- OpenAI 宣布強化內容溯源策略：通過 C2PA conformance、與 Google 合作導入 SynthID 圖片浮水印，並預覽公開驗證工具。
- C2PA 的 Content Credentials 會把媒體來源、建立或編輯方式，以及簽章資訊附在內容上，讓平台與使用者更容易判讀真偽。
- OpenAI 承認 metadata 可能在上傳、下載、改格式、縮放或截圖時遺失，因此加入 SynthID 這類更耐變形的隱形浮水印作為第二層訊號。
- 新驗證工具可檢查圖片是否來自 ChatGPT、OpenAI API 或 Codex，並同時讀取 Content Credentials 與 SynthID 訊號。
- 但 OpenAI 也提醒，沒有偵測到訊號不代表圖片一定不是 AI 生成，因為溯源資料仍可能被移除或破壞。
- 這篇公告的核心訊息是：AI 內容可信度不會靠單一技術解決，而需要開放標準、耐久浮水印與可公開驗證的工具共同運作。

<div class="sep">· · ·</div>

人們每天都在用 OpenAI 的工具創作與編輯圖片、音訊，讓溝通變得更有表現力、更有用，也更容易被不同人使用。當這些工具成為人們建構、想像與分享內容的一部分時，理解並驗證媒體來源就變得重要。知道內容從哪裡來，可以幫助人們更有把握地解讀它。溯源訊號能提供脈絡，說明一段內容來自哪裡、如何被建立或編輯，以及它是否符合自己的宣稱。

OpenAI 今天宣布強化內容溯源做法，採用一套多層、以生態系為核心的線上信任模型。公司正在讓其他工具與平台更容易辨識 OpenAI 的溯源訊號：一方面通過 C2PA conformance，一方面透過與 Google 的合作，把更耐跨平台傳播的 SynthID 浮水印加到圖片中，並且預覽一個可供大眾使用的驗證工具，用來檢查圖片是否來自 OpenAI。

這些更新延續 OpenAI 先前的工作：支持開放標準、讓 OpenAI 生成內容更容易被辨識，並與產業合作，建立更可信的資訊生態系。

## 透過 C2PA conformance 建立信任生態系

OpenAI 自 2024 年起就參與溯源標準的制定與採用。當時公司開始在 DALL·E 3 生成的圖片中加入 Content Credentials，之後也把這套做法延伸到 ImageGen 與 Sora。OpenAI 也加入 Coalition for Content Provenance and Authenticity（C2PA）的 Steering Committee。C2PA 是推動內容溯源開放技術標準的跨產業組織。

C2PA 的技術做法，是使用 metadata 與密碼學簽章，讓一段媒體的相關資訊能安全地跟著內容一起流動。這些資訊可以提供脈絡，協助記者評估來源、平台做內容完整性判斷，也協助一般人理解自己在線上看到的東西。

OpenAI 最近讓自己成為 C2PA Conforming Generator Product。通過 C2PA conformance 後，OpenAI 等於提供平台一種可信方式，去讀取、保留並傳遞附在內容上的溯源資訊。這件事很重要，因為溯源只有在內容離開最初建立平台後仍能存活，才真正有用；conformance 正是讓這件事變得可行的基礎。

## 用 Google SynthID 為圖片建立多層溯源

C2PA metadata 是內容溯源的重要基礎。它讓內容能攜帶來源、建立或編輯方式，以及簽署者等細節。不過，metadata 並不是萬無一失。它可能在上傳、下載、檔案格式轉換、縮放或截圖等過程中被移除、遺失或破壞。

為了讓溯源更有韌性，OpenAI 正採取多層做法，並開始在透過 ChatGPT、Codex 或 OpenAI API 生成的圖片中加入 Google DeepMind 的 SynthID 浮水印。SynthID 會嵌入一層隱形浮水印，用來補強 C2PA 這類以 metadata 為核心的做法。

OpenAI 表示，這不是突然開始的方向。公司過去已經在 Sora 使用可見浮水印，在 Voice Engine 使用音訊浮水印，也持續測試並研究這些方法在實際部署中的準確性與可靠性。

這兩套系統彼此補強。C2PA 能讓內容攜帶詳細脈絡；SynthID 則能在 metadata 沒有保存下來時，保留另一種訊號。浮水印在截圖等轉換過程中可能更耐久，而 metadata 能提供比單純浮水印更多的資訊。兩者合在一起，會比任一單獨方法都更有韌性。

## 偵測與公開驗證工具預覽

可信 metadata 與能抵抗多數修改的浮水印，可以讓溯源訊號更耐久。不過，人們還需要一種方式來偵測這些訊號。OpenAI 現在正預覽一個公開驗證工具，協助人們檢查上傳的圖片是否由 ChatGPT、OpenAI API 或 Codex 生成。這個工具會檢查圖片是否含有溯源訊號，包括 Content Credentials 與 SynthID。

OpenAI 認為，溯源應該更容易被驗證與解讀，而這個工具能讓一般人在回答「這是不是 AI 生成？」這個問題時扮演一部分角色。它整合多種訊號，也延續 OpenAI 在 2024 年圖片偵測分類器初始研究預覽中的經驗。工具能可靠偵測是否存在來自 OpenAI 的 SynthID 浮水印，也能在找到 C2PA metadata 時把相關資訊顯示出來。

不過，沒有任何偵測方法是完美的。因此，當偵測失敗時，OpenAI 會採取保守做法。舉例來說，如果工具沒有偵測到 metadata 或浮水印，它不會直接斷定圖片不是由 OpenAI 工具生成，因為溯源訊號在某些情況下可能已經被移除。

工具剛推出時，僅限支援 OpenAI 生成的內容。未來幾個月，OpenAI 的目標是支持跨產業合作，讓不同平台上的驗證也能成為可能。隨著時間推進，公司也預期支援更多人們可能在線上遇到的內容類型。

## 接下來

沒有任何單一溯源技術能獨自解決問題。OpenAI 認為，強健的做法必須結合共享標準、耐久的浮水印訊號，以及公開驗證工具。透過延續對 Content Credentials 的支持、通過 C2PA conformance、採用 SynthID，並預覽公開驗證工具，OpenAI 希望長期推動一個更能互通的內容溯源生態系。

<div class="sep">· · ·</div>

## 真正的重點不是「偵測 AI」，而是降低來源不透明的成本

這篇公告容易被解讀成「OpenAI 和 Google 聯手幫 AI 圖片加浮水印」，但更大的意義在於：AI 生成內容的可信度問題，正在從單點偵測工具，轉向跨平台的信任基礎建設。

單靠偵測器很脆弱，因為使用者會截圖、壓縮、轉檔、重傳，平台也會在處理流程中移除 metadata。單靠 metadata 也不夠，因為它太容易在傳播途中遺失。OpenAI 這次把 C2PA、SynthID 與公開驗證工具放在一起，等於承認內容可信度需要多層訊號互相補位，而不是期待某個分類器永遠準確。

對開發者與內容平台來說，真正值得注意的是產品介面會怎麼變。未來的內容工具可能不只是輸出圖片或影片，也會輸出可查驗的來源資訊；平台也不只是審核內容，而是要決定如何保存、顯示與傳遞這些溯源訊號。這會讓「內容從哪裡來」變成產品資料模型的一部分，而不是事後才補上的安全功能。

但這套做法仍有明顯限制。首先，它只覆蓋願意參與標準與部署浮水印的供應商；其次，惡意行為者仍可使用沒有溯源訊號的模型或工具；最後，一般使用者也未必會理解「沒有偵測到訊號」和「不是 AI 生成」之間的差異。因此，這不是假訊息問題的終點，而比較像是把內容供應鏈中一部分可驗證資料先標準化。

最務實的判斷是：內容溯源會成為必要但不充分的基礎設施。它不會讓網路自動可信，但能讓平台、媒體、開發者與使用者在需要追查來源時，多一組可互通的證據。
