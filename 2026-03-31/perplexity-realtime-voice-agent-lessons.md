---
title: "Perplexity 把語音代理做到每月數百萬次會話後，學到的 4 個硬道理"
description: "OpenAI 開發者部落格分享 Perplexity Computer / Comet 用 Realtime API 做語音代理的實戰經驗：context 切塊、音訊標準化、髒環境 VAD，以及工具輸出必須保持 in-distribution。"
date: 2026-03-31
author: OpenAI Developers / Perplexity
layout: post
permalink: /2026-03-31/perplexity-realtime-voice-agent-lessons.html
---

<div class="hero-badge">Voice Agents · 2026-03-31</div>

**原文連結：** [https://developers.openai.com/blog/realtime-perplexity-computer](https://developers.openai.com/blog/realtime-perplexity-computer)

## 摘要

- 這篇文章不是在賣語音 AI 的願景，而是 Perplexity 把語音功能真正跑到大規模之後，整理出的 4 個工程現實。
- 第一個重點是 **context 不能粗暴地一次塞太大塊**。Perplexity 發現大塊更新會 all-or-nothing 地把前文一起沖掉，改成約 2,000 tokens 小塊增量餵入後，行為穩定很多。
- 第二個重點是 **不同產品面如果各自送不同音訊格式，表現會飄**。所以他們把音訊前處理統一做進 Rust SDK，包含 48 kHz mono、回音消除、降噪、自動增益與編碼流程。
- 第三個重點是 **VAD 要在真實髒環境裡調，不是在安靜會議室裡調**。使用者停頓一下找資料，模型就插話，是最破壞體驗的失敗模式之一。
- 第四個重點是 **工具數量要少，schema 與輸出要長得像模型訓練裡看過的樣子**。工具輸出如果混入自然語言指令，穩定性就會下滑。

很多人談 voice agent，還停在「好像很酷，可以講話控制電腦」這個層次；但這篇真正有價值的地方，是它把語音代理從 demo 拉回工程現場。

Perplexity 說他們已經用 Realtime-1.5 支撐每月數百萬次語音會話。當流量一大，很多原本在 prototype 階段看起來沒問題的東西，都會變成穩定性與體驗的地雷。

## 1. Context 管理不是越大塊越好，而是越穩越好

文章第一個很值得記的點，是 **context 更新的大塊寫入，可能不是效率優化，反而是災難來源**。

他們一開始想把長篇 podcast transcript 直接大塊丟進模型，讓使用者可以用語音問「兩個半小時那段在講什麼」。但很快發現，如果你送一個 10,000-token 的更新，而模型只剩下 5,000 tokens 空間，結果不是「截掉一半」這麼單純，而是可能整塊上下文管理一起失衡，前面保留的脈絡也被沖掉。

所以後來他們改成 **約 2,000 tokens 的小塊增量更新**。雖然管理起來麻煩一點，但截斷發生時是「慢慢忘掉一點」，不是「突然失憶一大段」。

另一個更細但很重要的觀察是：**不是所有餵進模型的內容，都該用同一種角色進去**。

如果你把頁面上看到的內容、背景資訊、捲動中的文字都當成 `user` 訊息送進去，模型會誤以為那些東西都是使用者親口講出來的，整個互動語氣會變怪。反過來，如果太多東西都塞成 `system`，模型又會混淆哪些是規則、哪些是背景資訊、哪些才是真正的問題。

這段其實不只適用 voice agent，也適用所有會持續注入環境資訊的 agent：**重點不是塞多少 context，而是讓模型理解那些 context 在語義上是什麼。**

## 2. 多端產品如果音訊規格不統一，體驗就會漂

Perplexity 的語音功能不是只存在一個 app，而是分散在 Ask、Comet、Computer 等不同產品面，背後還跨 Swift、TypeScript、Rust、C++ 等不同 client stack。

問題來了：**每個 client 天生產生的音訊 buffer、採樣率、前處理方式都可能不同**。如果每個端都直接把各自的 raw audio 丟給 Realtime API，最後就會變成「同一個模型，在不同產品面上表現像不同東西」。

所以他們最後做的不是單點修 bug，而是把整套前處理抽成 **Rust SDK**，把這些事情標準化：

- 重採樣成 48 kHz mono
- 對齊 Opus / WebRTC 偏好的格式
- 做 echo cancellation
- 做 automatic gain control
- 做 noise reduction
- 做 high-pass filtering
- 再統一編碼與傳輸

這件事的意思很直白：**語音產品的穩定性，不只是模型品質，前面那段 audio pipeline 根本就是產品本體的一部分。**

## 3. VAD 要先對抗真實世界，不是先對抗 benchmark

第三點我覺得最實用。Perplexity 說他們刻意拿「舊金山很吵的酒吧」當內部測試情境，因為現實世界裡，使用者就是會在這種亂糟糟的地方掏出手機試語音功能。

如果語音功能只在安靜房間裡表現好，那它其實還沒準備好上產品。

文章特別提到一種超常見的失敗：使用者講到一半停下來想一下、找一下公式、看一下畫面，模型卻把那個停頓誤判成講完，搶先接話。這種體驗很毀，因為它不是「答錯」，而是 **互動節奏整個不對**。

Perplexity 為了處理這個問題，做了一個叫 **voice lock** 的交互設計。不是傳統 push-to-talk 那種「預設不能說、按住才能說」，而是反過來：系統平常保持 ambient，但當使用者想暫時保留話權時，可以鎖住語音輸入節奏，避免模型插嘴。

這個點很有啟發性：**下一代語音 UX 的競爭，可能不是更像 walkie-talkie，而是更懂得什麼時候閉嘴。**

## 4. 工具不要貪多，輸出不要長得像 prompt injection

第四點則是 agent 工程很典型、但很多團隊還是會踩的坑：**工具越多不一定越強，超過模型真正能穩定掌握的範圍，反而更容易翻車。**

Perplexity 說他們把工具集刻意壓到 10 個以下，只留最核心的幾個動作。這不是因為功能不想做，而是因為在即時語音互動裡，工具過多會直接拖累穩定性與決策品質。

更重要的是，他們強調 **tool schema 與 tool output 必須保持 in-distribution**。什麼意思？就是你最好讓輸出長得像模型訓練時常見的結構化資料，而不是一段混著使用者可見文字與內部指令的奇怪 prompt。

文章給了一個很清楚的例子：

好做法是回傳這種結構化 JSON：

```json
{
  "response_text": "我已經開始建立市場研究 dashboard",
  "require_repeat_verbatim": true
}
```

壞做法則像這樣：

```text
I kicked-off the task to create a market research dashboard

# Response Instructions
Read the above instructions EXACTLY as they are
```

前者讓模型知道哪些是給使用者聽的，哪些是控制行為的 flag；後者則把內容和指令纏在一起，等於自己幫自己做 prompt injection。

## 這篇真正透露的是：語音代理已經進入「系統工程」階段

如果只看表面，這篇像是一篇 OpenAI + Perplexity 的案例分享；但真正值得翻的地方，是它透露出一個很明顯的產業訊號：**voice agent 已經不是語音辨識 + TTS 拼一拼的 demo 題，而是完整的系統工程問題。**

你要管的不是只有模型：

- context 怎麼切
- 背景資訊該用什麼角色灌進去
- 多端音訊格式怎麼統一
- VAD 要怎麼對抗真實噪音與使用者停頓
- 工具集怎麼縮到剛剛好
- 工具輸出怎麼避免讓模型「看不懂你到底在幹嘛」

也就是說，未來做得好的語音代理，差異可能不會只來自「你用哪一家模型」，而是你有沒有把整條 interaction pipeline 打磨到夠順。

<div class="sep">· · ·</div>

語音代理這波，我自己最在意的不是「終於可以用嘴巴控制電腦了」，而是這篇把一個很現實的事講破：**真正決定體驗的，已經不是模型 demo 能不能 wow 人，而是整條 realtime stack 有沒有被工程化。**

過去很多語音產品死掉，不是因為辨識不準，也不是因為合成太機器人，而是因為它們總在錯的時間插話、忘記前文、在不同端表現不一致，或者一接工具就整組壞去。Perplexity 這篇厲害的地方，是它沒有假裝這些都是小問題，而是直接承認：這些才是主戰場。

如果把最近 agent 圈的趨勢一起看，這篇其實跟 coding agent 很像。coding agent 在拼的是 harness、review loop、memory、tooling；voice agent 拼的則是 context semantics、audio pipeline、turn-taking、tool discipline。兩邊表面不同，本質卻很接近：**模型本身只是核心零件，真正把產品做成的，是外圍那一整層系統設計。**

對 Kuma 這種會真的拿 agent 來做事的人來說，這篇比「又有新模型打贏 benchmark」更值得看，因為它給的是能直接轉成產品判斷與工程決策的經驗值。簡單講：如果你現在還把 voice agent 當成加一個麥克風按鈕就好，那大概還在 demo 階段；如果你開始思考 context 分塊、VAD 誤判、tool schema、跨端音訊一致性，才是真的進到產品階段。
