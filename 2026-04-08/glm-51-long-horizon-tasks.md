---
title: "GLM-5.1：朝向長上下文任務"
description: "GLM-5.1 不只會畫鵜鶘騎車的 SVG，還能看出動畫為何把版面弄壞，並自己修好 HTML/CSS。"
date: 2026-04-08
author: Simon Willison
layout: post
permalink: /2026-04-08/glm-51-long-horizon-tasks.html
image: /2026-04-08/og-glm-51-long-horizon-tasks.png
---

<div class="hero-badge">AI News · 2026-04-08</div>

![](/ai-articles/2026-04-08/og-glm-51-long-horizon-tasks.png)

**原文連結：** [GLM-5.1: Towards Long-Horizon Tasks](https://simonwillison.net/2026/Apr/7/glm-51/)

## 摘要

- Z.ai 的 GLM-5.1 可以透過 OpenRouter 使用，Simon 直接拿它來測經典的「鵜鶘騎腳踏車」題目。
- 第一次輸出不錯，腳踏車和鵜鶘都有，但一加上動畫，鵜鶘就被推到畫面外。
- 追問後，模型指出問題出在 SVG 的 `transform`，CSS 動畫覆蓋了原本的位置設定。
- 它提出的修法，是把定位和動畫拆開，改用內層 group 搭配 `<animateTransform>`。
- 修正後的 HTML 不只把動畫救回來，還讓嘴喙也能輕微擺動。
- 後來連「北維吉尼亞負鼠騎電動滑板車」都能動起來，顯示這類模型已經很會接住帶狀態的生成任務。

<div class="sep">· · ·</div>

Z.ai 的最新模型 GLM-5.1 可以透過 [OpenRouter](https://openrouter.ai/z-ai/glm-5.1) 使用。Simon 乾脆拿它來做經典測試，看看它能不能畫出一隻鵜鶘騎腳踏車：

```bash
llm install llm-openrouter
llm -m openrouter/z-ai/glm-5.1 'Generate an SVG of a pelican on a bicycle'
```

第一次結果其實相當不錯，腳踏車的框架和輪子都對，鵜鶘也在畫面裡。問題出在動畫一加上去，整個構圖就壞了，鵜鶘直接飄到畫面外面。

這時候再追問一句：

```bash
llm -c 'the animation is a bit broken, the pelican ends up positioned off the screen at the top right'
```

GLM-5.1 的回應很有意思。它直接指出，SVG 元素上的 CSS `transform` 動畫，會蓋掉原本用來定位的 SVG `transform` 屬性。換句話說，定位和動畫在搶同一個座標系。

它給的修法也很乾淨，做法是把定位和動畫拆開，讓內層 group 負責動畫，並改用 `<animateTransform>` 來處理旋轉，這樣 SVG 座標系才不會打架。

接著它吐出一份修正版 HTML，整個畫面就正常了。腳踏車開始正確旋轉，鵜鶘穩穩坐在上面，連嘴喙都會微微擺動。最有趣的是它連註解都寫得很像真的在做前端：

```html
<!-- Pouch (lower beak) with wobble -->
```

後來 Bluesky 上有人又提議，把題目換成「North Virginia opossum on an e-scooter」，結果它也照樣交出一個會動的版本。

這篇最精彩的地方，不是它會畫鵜鶘，而是它把「生成、診斷、修正」串成了一條完整工作流。對長上下文任務來說，這比單次輸出漂亮多了。

<div class="sep">· · ·</div>

## 延伸評論：模型開始會修自己的失誤

這種示範很值得注意，因為它不是單純的圖像生成，而是帶著狀態一路把問題收斂到修正完成。真正有價值的點，在於模型能辨認出 bug 出在座標系和動畫層級，而不是只會重新抽一張圖。

對做 agent 或前端工具鏈的人來說，這代表下一步重點可能不只是「生成得多像」，而是「能不能理解哪一層壞了，然後把它修回來」。這種能力一旦穩定下來，會比漂亮的單張輸出更有用。