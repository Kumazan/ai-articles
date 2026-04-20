---
title: "Prompt injection 證明 AI 模型和人類一樣容易上鉤"
description: "當惡意指令被藏進文件、內容或資料裡，AI 就可能像人一樣照單全收。The Register 用釣魚來比喻 prompt injection，順手把 token 經濟也酸了一輪。"
date: 2026-04-19
author: Rupert Goodwins
layout: post
permalink: /2026-04-19/prompt-injection-ai-models-gullible.html
image: /2026-04-19/og-prompt-injection-ai-models-gullible.png
---

<div class="hero-badge">AI News · 2026-04-19</div>

![](/ai-articles/2026-04-19/og-prompt-injection-ai-models-gullible.png)

**原文連結：** [Prompt injection proves AI models are gullible like humans](https://www.theregister.com/2026/04/19/just_like_phishing_for_gullible/)

## 摘要

- prompt injection 本質上就像釣魚，只是目標從人類換成了 AI
- 把惡意指令藏進文件、附件或資料裡，仍然可能讓機器人把秘密吐出來
- 這種攻擊之所以麻煩，是因為它不是單一漏洞，而是語言模型工作方式的結構性問題
- 作者把 AI 商業模式一路延伸到 token 計價，認為整個產業正在被 quota、訂閱與鎖定效應推著走
- 以 token 為計費單位，對使用者來說像是在為鍵盤敲字付錢，幾乎無法反映真正產出
- 一旦公司把開發流程和 AI 深度綁定，遷移成本就會變得又高又痛

<div class="sep">· · ·</div>

這禮拜又冒出一個新的 prompt injection 攻擊，足以讓那些自以為守得很好的 AI 機器人，只要被用對方式問，就把祕密一股腦倒出來。

仔細想想，人類和 LLM 其實面對的是很像的問題：只要對方話術夠高明，兩者都可能把敏感資訊交出去。針對人類時，我們叫它 phishing；針對機器人時，它幾乎就是 prompt injection。做法也差不多，把惡意指令藏進你要 AI 讀取和分析的文件或檔案裡，AI 卻沒有把它當內容，而是直接執行了。

這類問題有很多好談的地方，尤其是它本質上幾乎是 AI 時代的一種無解難題，像 phishing 一樣。這一集《The Kettle》也有聊到，主持人 Brandon Vigliarolo 這次找來資安編輯 Jessica Lyons 和資深記者 Tom Claburn 一起討論。

你可以在 [這裡](https://theregisterkettle.riverside.com/) 收聽《The Kettle》，也能在 [Spotify](https://open.spotify.com/show/2dlhvWo0GZsNMNKO7PzYrC) 和 [Apple Music](https://podcasts.apple.com/us/podcast/the-register-kettle/id1882523636) 上找到。®

很多人對創意產業的討論，常常是先混進創作者聚在一起的地方偷聽，想聽到什麼大師級洞見、前衛想法、尖端思維。結果通常不是那麼回事。若運氣好，聽到的是八卦；運氣不好，聽到的是旅途抱怨。大多時候，他們其實都在聊錢。

LLM 也一樣，只是大家不直接談錢，而是改談 token。AI coding 新聞幾乎天天都在上演同一種節奏，今天又多了一個「功能被 AI 化」的案例，明天又多了一個訂閱計價上的「修正」，後天又來一次行為變化。這些事都有個共同點，作者把它稱為 TIBS，token incremental burn syndrome，也就是 token 逐步燃燒症候群。也許我們才剛站在 TIBS 的起點，但如果把 AI 拿來當疫情比喻，後面還有得看。

Token 之所以成為 LLM 的計費單位，只是因為它好算而已，雖然這種「好算」本身就很值得懷疑。把 prompt 丟給 LLM，它會先把字詞拆成 lexeme，再轉成 token，丟進那台超大台的「猜下一個字」機器裡。最後輸出 token，再換成你看得到的文字、程式碼，或其他東西。輸入多少 token、輸出多少 token，一算就知道。說得更白一點，差不多就是這樣：

```c
if ((ntokens_left -= (strlen(prompt) + strlen(slop))) <= 0) {
    printf("Cough up, sunshine\n");
}
```

……差不多就是這意思。

建立在這種概念上的整個 AI 商業帝國，簡直就像把程式設計師按按鍵數和輸出字元數計費一樣荒謬。這甚至比用每月程式碼行數來評估工程師還離譜，後者已經蠢到足以讓 Juicero 的投資人看起來像華倫·巴菲特。這種模式完全不管實際完成了什麼工作，也看不出效率損耗是否被獎勵，還很難把付出的價格和真正的生產成本對上。可笑的是，它依然簡單好懂，看起來也像一般的預付型限制次數訂閱。奇怪的是，幾乎沒什麼人真的想改掉它。

除此之外，幾乎也沒有其他有意義的度量方式。你可以在特定 benchmark 裡量 tokens per second，也可以算輸入和輸出 token 的比例，但這又不太說得通。至少在雲端運算這種比較得上號的服務裡，你知道自己買的是多少算力、記憶體、儲存與連線。你還是得小心自動化失控或管理不當，Bill Shock 在 AWS 也一樣會咬人，但至少你還能把結果和成本連起來。LLM 服務就難多了，AI agent 更是如此。

再把這種缺乏價值衡量方式的問題，加上 AI 產業必須拿出驚人投資回報才能兌現承諾的現實，TIBS 的通膨就呼之欲出了。

廠商對把所有東西都做成訂閱制有種近乎上癮的偏好，然後趁機慢慢煮熟使用者，尤其當它還能形成近似壟斷時更是如此。想像一下，一家公司把寫程式的人力削到最低，整個軟體生產鏈又高度依賴某一條 AI 代碼生成鏈，這種鎖定效應會有多強。

遷移是最難開口的一個字。就算有一整電話簿那麼多指標證明該換，也一樣難。你可以算每個 instance 的成本、每 TB 的成本，或是維持商業模式所需的成本，也許還不至於完全錯。但這套邏輯放到 AI-heavy 的 CI/CD 上會怎麼運作，恐怕還是交給別人先想清楚比較好。

## 編輯短評

prompt injection 之所以麻煩，不只是因為它難擋，更因為它太符合 LLM 的操作模型。只要系統還會把外部內容當成可被執行的指令來源，攻擊面就不會因為模型變強而消失。

更大的問題其實在商業模式。當 token 成本、配額、訂閱與鎖定一起綁上去，安全問題就不再只是資安團隊的事，而會直接變成產品、採購和基礎設施的決策壓力。這才是最難拆的那層。
