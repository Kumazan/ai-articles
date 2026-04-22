---
title: "ChatGPT Images 2.0：找浣熊測試裡，OpenAI 這次贏了"
description: "Simon Willison 用『找拿火腿電台的浣熊』測試 ChatGPT Images 2.0，對照 gpt-image-1、Nano Banana 2 與 Pro，發現高品質設定下的新模型確實更強，但也再次證明這類題目不該拿來當模型解題器。"
date: 2026-04-21
author: Simon Willison
layout: post
image: /ai-articles/2026-04-21/og-chatgpt-images-2-raccoon-ham-radio.png
permalink: /2026-04-21/chatgpt-images-2-raccoon-ham-radio.html
---

<div class="hero-badge">AI News · 2026-04-21</div>

![](/ai-articles/2026-04-21/og-chatgpt-images-2-raccoon-ham-radio.png)

**原文連結：** [Where’s the raccoon with the ham radio? (ChatGPT Images 2.0)](https://simonwillison.net/2026/Apr/21/gpt-image-2/)

## 摘要

- OpenAI 推出 ChatGPT Images 2.0，Sam Altman 把 gpt-image-1 到 gpt-image-2 的進步，比作從 GPT-3 跨到 GPT-5。
- Simon Willison 用「Where’s Waldo」式的測試，要求模型找出一隻拿著火腿電台的浣熊。
- 先用較舊的 gpt-image-1 當基準，結果他幾乎找不到浣熊。
- 他又拿 Nano Banana 2 和 Nano Banana Pro 來比，前者效果很好，後者反而翻車。
- gpt-image-2 的預設輸出仍然不夠理想，但把品質拉高、尺寸開到 3840×2160 之後，結果明顯改善。
- 這篇最後的結論很直接，新版 ChatGPT 圖像模型目前拿下冠軍，但別期待它真的替你解謎。

<div class="sep">· · ·</div>

2026 年 4 月 21 日

OpenAI [今天推出了 ChatGPT Images 2.0](https://openai.com/index/introducing-chatgpt-images-2-0/)，這是他們最新的圖像生成模型。Sam Altman 在 [直播](https://www.youtube.com/watch?v=sWkGomJ3TLI) 上說，gpt-image-1 升級到 gpt-image-2 的飛躍，大概就像從 GPT-3 跳到 GPT-5 一樣。以下就是我實測的結果。

我的提示詞是：

> 做一張「找威利」風格的圖，不過要找的是拿著火腿電台的浣熊

#### gpt-image-1

先拿舊版 gpt-image-1 當基準，這是我直接在 ChatGPT 裡得到的結果：

![](https://static.simonwillison.net/static/2026/chatgpt-image-1-ham-radio.png)

我沒辦法把浣熊找出來，我很快就發現，拿「找威利」風格的圖來測試圖像生成模型，其實會讓人非常抓狂。

我試著請 [Claude Opus 4.7](https://claude.ai/share/bd6e9b88-29a9-420b-8ac1-3ac5cebac215) 用它更新後的高解析度輸入來解題，但它反而堅持說圖裡一定有一隻浣熊，只是因為左上角那張說明卡片所以很難找：

> 沒錯，圖裡至少有一隻浣熊，但它藏得非常深。仔細掃過幾個放大的區域後，老實說，我沒辦法確定地找出一隻拿著火腿電台的浣熊。［...］

#### Nano Banana 2 和 Pro

接著我試了 Google 的 Nano Banana 2，經由 [Gemini](https://gemini.google.com/share/3775db96c576)：

![](https://static.simonwillison.net/static/2026/nano-banana-2-ham-radio.jpg)

這張就非常明顯了，浣熊就在圖片中央的「Amateur Radio Club」攤位裡！

Claude 說：

> 老實說，這張根本沒有在躲，牠就是攤位上的主角。這位插畫家大概是看上一張太難了，乾脆直接放水。攤位上那個「W6HAM」的呼號雙關也很有趣。

我也在 [AI Studio](https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221sGU5A7mrngkfLfSEU84xaV1DhtOTnS--%22%5D,%22action%22:%22open%22,%22userId%22:%22106366615678321494423%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing) 試了 Nano Banana Pro，結果得到的是這張，到目前為止，這是所有模型裡最糟的一次。我也不確定到底哪裡出了問題。

![](https://static.simonwillison.net/static/2026/nano-banana-pro-ham-radio.jpg)

#### gpt-image-2

基準確立之後，來試試新模型。

我用的是更新版的 [openai_image.py](https://github.com/simonw/tools/blob/main/python/openai_image.py) 腳本。它只是 [OpenAI Python](https://github.com/openai/openai-python) client library 的薄包裝；雖然官方 client library 還沒更新到支援 gpt-image-2，但好消息是它不會驗證 model ID，所以可以直接塞進去用。

我是這樣跑的：

```bash
OPENAI_API_KEY="$(llm keys get openai)" \
 uv run https://tools.simonwillison.net/python/openai_image.py \
 -m gpt-image-2 \
 "Do a where's Waldo style image but it's where is the raccoon holding a ham radio"
```

這是我拿到的結果。我覺得裡面看不到浣熊，我自己找不到，Claude 也找不到。

![](https://static.simonwillison.net/static/2026/gpt-image-2-default.png)

[OpenAI 的 image generation cookbook](https://github.com/openai/openai-cookbook/blob/main/examples/multimodal/image-gen-models-prompting-guide.ipynb) 已經更新，加入 gpt-image-2 的說明，包括 outputQuality 設定和可用尺寸。

我把 outputQuality 設成 high，尺寸拉到 3840x2160，我相信這應該是上限，結果得到這張圖，輸出成了 17MB PNG，我再轉成 5MB 的 WEBP：

```bash
OPENAI_API_KEY="$(llm keys get openai)" \
 uv run 'https://raw.githubusercontent.com/simonw/tools/refs/heads/main/python/openai_image.py' \
 -m gpt-image-2 "Do a where's Waldo style image but it's where is the raccoon holding a ham radio" \
 --quality high --size 3840x2160
```

![](https://static.simonwillison.net/static/2026/image-fc93bd-q100.webp)

這張就相當不錯了！火腿電台浣熊確實在裡面，位置在左下角，而且很容易辨認。

這張圖用了 13,342 個 output tokens，按每百萬 30 美元計價，總成本大約是 [40 美分](https://www.llm-prices.com/#ot=13342&ic=5&cic=1.25&oc=10&sel=gpt-image-2-image)。

#### 結論

我覺得這個新版 ChatGPT 圖像生成模型，至少目前已經把冠軍從 Gemini 手上拿走了。

拿「找威利」風格的圖來測試模型，其實有點惱人，也有點愚蠢，但它確實能很好地展示，這些模型在結合複雜插畫、文字與細節方面，已經進步到什麼程度。

#### 更新：請模型自己解題其實很危險

rizaco [在 Hacker News 上](https://news.ycombinator.com/item?id=47852835#47853561) 要 ChatGPT 在一張他沒找到浣熊的圖片上，把浣熊圈出來。下面這張是他得到的結果，和原圖混合後的動畫：

![](https://static.simonwillison.net/static/2026/ham-radio-cheat.gif)

看起來我們真的不能相信這些模型能可靠地替自己解題！

Simon Willison

編輯：

Hacker News 討論：<https://news.ycombinator.com/item?id=47852835>

<div class="sep">· · ·</div>

## 延伸評論：圖像模型真的強了，但評測方式也更詭異了

這篇最有意思的地方，不只是 gpt-image-2 比前代更會畫，而是它把圖像模型評測的荒謬感一起放大了。找浣熊這種任務看起來像玩笑，卻剛好揭露一件事，模型不只在生成圖，也在重新定義「答對」到底長什麼樣子。

對做產品的人來說，真正值得注意的不是單次 demo 有多漂亮，而是高品質輸出下的穩定性、成本、以及模型是否真的能在複雜視覺線索裡維持一致性。這類能力一旦成熟，會直接影響設計工具、廣告素材、教育內容，還有一堆原本靠人工反覆修圖的工作流。