---
title: "Servo crate 0.1.0 上架：可嵌入瀏覽器引擎開始走出實驗室"
description: "Simon Willison 研究 Servo 0.1.0 crate，驗證它能做 headless 截圖，也能把子套件編進 WebAssembly，讓瀏覽器引擎變成可嵌入工具箱。"
date: 2026-04-13
author: Simon Willison
layout: post
permalink: /2026-04-13/servo-crate-exploration.html
image: /2026-04-13/og-servo-crate-exploration.png
---

<div class="hero-badge">AI News · 2026-04-13</div>

![](/ai-articles/2026-04-13/og-servo-crate-exploration.png)

**原文連結：** [Exploring the new `servo` crate](https://github.com/simonw/research/tree/main/servo-crate-exploration#readme)

## 摘要

- Servo 團隊把 `servo 0.1.0` 推上 crates.io，第一次把這個瀏覽器引擎包裝成可嵌入的 Rust 函式庫
- Simon Willison 這份研究報告先確認公開 API 的形狀，再實作一個 headless 截圖 CLI，證明它已經能做實際工作
- `servo-shot` 在 stable Rust 1.94 上可編譯，會拉進約 2000 個依賴，最後產出約 153 MB 的二進位檔
- 整個 Servo crate 目前還不適合直接編進 WebAssembly，但 `html5ever`、`markup5ever_rcdom` 這類子 crate 已經能先拿來做 SPA
- 這份報告最有意思的地方，不是「Servo 能不能跑」，而是它已經能開始被當成工具箱拼裝

<div class="sep">· · ·</div>

## 這份研究在看什麼

2026-04-13，Servo 團隊把 `servo v0.1.0` 發佈到 crates.io，這是它第一次以一般可嵌入函式庫的形式出現。
Simon Willison 這份研究報告，重點不是重講新聞，而是直接驗證三件事：

1. 公開 API 到底長什麼樣
2. 能不能只靠這個 crate 寫出一個把網址或本機 HTML 轉成 PNG 的 CLI
3. 整個 crate 或部分子模組，能不能走進 WebAssembly

## Servo crate 的公開 API

這個 API 的核心流程很清楚：

```text
ServoBuilder → Servo + RenderingContext → WebViewBuilder → WebView
```

`WebViewDelegate` 負責接收載入、繪製、導覽等事件，而 `Servo::spin_event_loop()` 則負責推進整個管線。

| 元件 | 用途 |
| --- | --- |
| `Servo` | 執行中的 Servo 引擎把手 |
| `ServoBuilder` | 透過 `.opts()`、`.preferences()`、`.protocol_registry()` 等方法建立引擎 |
| `WebView` | 一個瀏覽上下文，成本很低，還可 `Clone` |
| `WebViewBuilder` | 建立 webview，設定網址、縮放比例、delegate 等 |
| `SoftwareRenderingContext::new(...)` | 純軟體渲染，適合 headless、CI、沒 GPU 的環境 |
| `RenderingContext` | 處理繪製、顯示、重新整理與讀回影像 |
| `WebViewDelegate` | 接收載入完成、新 frame、動畫與各種 UI 事件 |
| `WebResourceLoad` | 攔截網路請求並提供替代回應 |
| `ProtocolRegistry` | 註冊自訂 URL scheme |

這裡最值得注意的是，`read_to_image()` 已經是第一等公民，代表 Servo 不只是「能渲染」，而是能被拿來做真正的讀回與自動化。

## 用 Servo 做一個 headless 截圖 CLI

Simon 接著做了一個 `servo-shot`，功能很單純：

```bash
servo-shot https://example.com
servo-shot sample.html --out sample.png
servo-shot ./docs/index.html --width 1920 --height 1080 --dpr 2.0
```

它的流程大致是：

```text
ServoBuilder::default().build() → Servo
WebViewBuilder::new(&servo, ctx)
  .url(...)
  .hidpi_scale_factor(...)
  .delegate(...)
  .build() → WebView

等到 LoadStatus::Complete，再多跑幾次 spin_event_loop()
最後用 ctx.read_to_image(...) 讀回 PNG
```

幾個實作細節很實際：

- 用 `SoftwareRenderingContext`，所以不需要 GPU 或 X server
- 用 `Rc` 就夠了，不必上 `Arc`
- `LoadStatus::Complete` 後還要多等幾個 frame，避免圖片或字型還沒穩定
- `dpi::PhysicalSize` 和 `euclid::Size2D` 不是同一個東西，這裡踩過坑
- `surfman::error::Error` 不直接實作 `std::error::Error`，錯誤處理要多轉一層

結果是：這個 CLI 在 stable Rust 1.94 上可編譯，`cargo build --release` 會拉進大約 2000 個依賴，第一次完整編譯約 7 分 49 秒，最後二進位檔約 153 MB。

## 這些坑最值得記

Simon 在報告裡特別列出幾個最容易卡住的點：

- delegate 必須在 `notify_new_frame_ready` 裡呼叫 `webview.paint()`，不然軟體渲染背景不會真的寫入像素
- `present()` 不能先做，因為在 `SoftwareRenderingContext` 下它會把緩衝區清掉
- `LoadStatus::Complete` 之後還要強制多一個 frame，否則某些晚到的繪製不一定會出現
- Linux headless 環境通常還需要 `libegl1` 和可寫的 `$XDG_RUNTIME_DIR`
- `ServoBuilder::default()` 會吃系統 proxy，做本機截圖時要記得清掉

這些都不是炫技問題，而是「真的有人會踩」的工程細節。

## 為什麼整個 Servo 還不能直接進 wasm

Simon 的判斷很直接：**整個 Servo crate 目前不適合直接編進 WebAssembly**。

主要卡點有幾個：

- `mozjs_sys`，也就是 SpiderMonkey
- 大量多執行緒設計
- OpenGL / WebRender / surfman 這條渲染鏈
- 網路層需要改寫到 `fetch()` 或 wasi-sockets
- 字型與檔案系統在 wasm 世界根本不是同一套

簡單說，整個引擎太完整了，不是簡單重編就能搬上網頁。

## 但 Servo 子模組已經能先進 wasm

雖然整個引擎不行，但子 crate 很多其實可以先上：

- `Stylo`
- `html5ever`
- `markup5ever`
- `selectors`
- `cssparser`
- `url`
- `idna`

Simon 甚至做了一個 `html5ever-wasm-demo` SPA，直接把 Servo 的 HTML5 parser 跑在瀏覽器裡。使用者輸入 HTML，左邊看解析樹，右邊看正規化後的 HTML，整包輸出只需要一個 4 KB HTML、8 KB JS glue，外加 454 KB 的 `.wasm`。

## 這代表什麼產品想像

這份研究最有趣的部分，不是「Servo 跑起來了」，而是它開始像一個可拼裝的基礎元件集合。

可行的 SPA 想像包括：

- CSS selector playground
- cascade 解說器
- HTML sanitizer / pretty-printer
- HTML tree diff 視覺化工具
- 用 wasm 做的「lint my page」檢查器
- 把 real CSS cascade 接進 canvas UI 的實驗型前端

如果你真的要把完整 Servo 放到網頁上，現階段比較務實的路線不是直接 wasm 化整個引擎，而是原生跑引擎，再把畫面串流出去。

## 延伸評論

這篇的價值，不在於它證明了「瀏覽器引擎能不能被嵌入」這種老問題，而是它把答案往前推了一小步：**能，而且已經開始實用化了**。

AI 時代很多工具都在往更大的黑盒子走，但 Servo 這條線提醒人一件事，真正耐用的基礎設施，往往是能被拆開、理解、再重新組裝的。這比單純喊模型更強，因為它落在工程上。