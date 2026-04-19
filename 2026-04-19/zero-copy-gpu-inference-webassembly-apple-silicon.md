---
title: "WebAssembly 與 Apple Silicon GPU 的零拷貝推論"
description: "Agam Brahma 示範如何讓 Wasm 線性記憶體與 Apple Silicon GPU 共享同一份物理記憶體，做到零拷貝推論、可攜式 KV cache 與更低成本的狀態型 AI runtime。"
date: 2026-04-19
author: Agam Brahma
layout: post
permalink: /2026-04-19/zero-copy-gpu-inference-webassembly-apple-silicon.html
image: /2026-04-19/og-zero-copy-gpu-inference-webassembly-apple-silicon.png
---

<div class="hero-badge">AI News · 2026-04-19</div>

![](/ai-articles/2026-04-19/og-zero-copy-gpu-inference-webassembly-apple-silicon.png)

**原文連結：** [Zero-Copy GPU Inference from WebAssembly on Apple Silicon](https://abacusnoir.com/2026/04/18/zero-copy-gpu-inference-from-webassembly-on-apple-silicon/)

## 摘要

- 在 Apple Silicon 上，Wasm 線性記憶體可以直接和 GPU 共用同一份物理記憶體，資料不必再複製一遍
- 作者把關鍵拆成三段：`mmap` 提供頁對齊記憶體、Metal 接手 `bytesNoCopy`、Wasmtime 由 `MemoryCreator` 自帶 allocator
- 實測顯示，零拷貝路徑幾乎沒有額外 RSS 成本，128×128 GEMM 也能正常算出 0 錯誤
- 接上 MLX 之後，Wasm actor 可以驅動 Llama 3.2 1B Instruct，token dispatch 的邊界幾乎不構成瓶頸
- 因為 KV cache 也落在可控記憶體裡，所以能把推論狀態序列化、快速回復，回放比重新 prefill 快 5.45 倍
- 這篇真正重要的不是「更快一點」，而是 stateful AI actor 可能真的能搬家、快照、續跑

<div class="sep">· · ·</div>

tl;dr：在 Apple Silicon 上，WebAssembly 模組的線性記憶體可以直接和 GPU 共用，不需要複製、不需要序列化，也不需要中介緩衝區。Wasm guest 在自己的線性記憶體裡填好矩陣，GPU 讀同一份資料做運算，再把結果寫回去，guest 仍然透過同一個指標看到結果。

通常 Wasm 跟 GPU 之間隔著一層昂貴的序列化邊界。大多數硬體上，把資料從 VM 沙箱送到加速器，代表要先從沙箱複製到主機記憶體，再複製到 GPU 記憶體。兩次複製，兩次延遲，還得處理「隔離 VM」和「硬體加速器」之間不太相容的抽象。

Apple Silicon 改變了這個前提。CPU 和 GPU 共用同一份實體記憶體，沒有 PCIe 那道傳統的 bus。只要能把那個指標一路穿過 Wasm runtime 和 GPU API 的抽象層，不讓任何一層偷偷複製，零拷貝就真的成立。

## 為什麼這件事平常很難

先交代一下背景，給不天天混這條堆疊的人：WebAssembly 提供的是 sandbox。模組拿到的是一個平坦的 byte array，也就是 linear memory，整個宇宙就只到這裡。外面的世界都得透過 host function 來碰。

GPU 也想要平坦的 byte array，但它要的是特定形式的記憶體，必須頁對齊、固定、而且能被 DMA engine 存取。若是在離散 GPU 上，像 NVIDIA 或 AMD，那份記憶體和 CPU 中間隔著 PCIe bus，所以資料流通常是：從 Wasm 的 linear memory 複製到主機記憶體，再複製到 GPU 記憶體。兩次拷貝，兩次成本。

Apple Silicon 改變的是物理層。CPU 和 GPU 共用同一份記憶體，所以 CPU 能讀的位址，GPU 也能直接讀。問題只剩下：能不能一路穿過 runtime 與 API 邊界，避免任何防禦性複製？答案是，可以。

## 三段式鏈路

作者先把這條鏈拆成三個獨立環節，逐一驗證，再把它們組起來。這種做法很重要，因為如果你跳過其中一段，整個 pipeline 壞掉時，根本不知道是哪一個接點漏了。

### 1. `mmap` 提供頁對齊記憶體

在 ARM64 macOS 上，用 `mmap(..., MAP_ANON | MAP_PRIVATE, ...)` 會回傳 16 KB 對齊的位址。這不是巧合，而是 ARM64 的頁大小。對齊很重要，因為 Metal 要求它。

### 2. Metal 接受既有指標，而且不複製

Metal 有 `MTLDevice.makeBuffer(bytesNoCopy:length:...)`，可以把既有指標包成 buffer。作者在 Apple Silicon 上驗證了這條 zero-copy 路徑：`MTLBuffer.contents()` 的指標和原本的 `mmap` 指標相同，沒有藏著另外一份拷貝。

他也量了 RSS，16 MB 區域下，零拷貝路徑只多出 0.03 MB，幾乎就是量測雜訊；相較之下，顯式 copy 路徑會多出 16.78 MB。計算延遲則差不多，因為真正的差異在搬資料，不在算本身。

### 3. Wasmtime 允許你自帶 allocator

Wasmtime 的 `MemoryCreator` 讓你自己控制 linear memory 要怎麼配置。作者不讓 Wasmtime 自己內部呼叫 `mmap`，而是直接提供自己的 `mmap` 區域。接著 `memory.data_ptr()` 拿到的，就是他原本交出去的那個指標。

組起來之後就是：同一塊 `mmap` 記憶體，同時被 Wasmtime 當成 Wasm 的 linear memory，也被 Metal 當成 GPU buffer。Wasm 模組寫資料，GPU 原地計算，結果再原地回來，完全沒有資料搬移。

## 他量到了什麼

他拿 128×128 的矩陣乘法做整條路徑測試。Wasm 模組先填好矩陣 A 和 B，GPU 跑 GEMM shader，最後模組把 C 讀回來。16,384 個元素全都對上，0 錯誤。

| 測試項目 | 零拷貝路徑 | 拷貝路徑 |
| --- | --- | --- |
| 指標一致性 | `mmap == MTLBuffer` | 不同位址 |
| RSS 變化（16 MB 區域） | 0.03 MB | 16.78 MB |
| GEMM 延遲（128×128） | 約 6.75 ms | 約 6.75 ms |
| 正確性（16K 元素） | 0 錯誤 | 0 錯誤 |

延遲差不多不奇怪，因為在 UMA 上，真正的計算成本本來就一樣。差別會在記憶體足跡上冒出來。零拷貝幾乎沒有把資料送上 GPU 的額外開銷；拷貝路徑則會把記憶體用量直接翻倍。

小 tensor 大家可能不痛不癢，但到了 transformer inference 的 KV cache 那種規模，幾百 MB 是常態，能不能少一份拷貝，差別就是一台機器能同時跑四個 actor，還是只能跑兩個。

## 接到 MLX 之後

有了這個 primitive，下一步就是拿去做真正的 inference。作者把這條鏈接到 Apple 的 MLX 框架，讓一個 Wasm actor 驅動 Llama 3.2 1B Instruct。這個模型是 4-bit quantized，大小約 695 MB。整個模型跑在一個全 Rust 的 decoder 上，Wasm 在 host runtime 裡執行，透過 host function 去驅動 Apple Silicon GPU。

他在一台 2021 M1 MacBook Pro 上量到的數字大概是：

| 操作 | 延遲 |
| --- | --- |
| 模型載入（safetensors） | 229 ms（一次性） |
| Prefill（5 tokens） | 106 ms |
| 每 token 生成 | 約 9 ms |
| Wasm 到 GPU 的 host boundary | 幾乎可忽略 |

這裡最值得注意的是 boundary 幾乎不構成瓶頸。很多人看到 sandbox runtime 都會先擔心 dispatch 邊界太貴，但在這台硬體上，真正貴的還是模型運算本身。

## KV cache 可攜性

Transformer 會維護一份 key-value cache，用來累積上下文。一般情況下，這東西是暫時的，程式一死就沒了。

但因為 cache 也在作者可控的 GPU 記憶體裡，他可以把它序列化成 safetensors 格式，再在之後還原。這代表同一台機器、不同機器，甚至理論上不同模型，都可能吃同一份快照。

他量到的結果：

| 操作 | 延遲 | 大小 |
| --- | --- | --- |
| 序列化（24 tokens） | 1.1 ms | 1.58 MB（約 66 KB/token） |
| 從磁碟還原 | 1.4 ms |  |
| 重新 prefill | 67.7 ms |  |

速度提升是 5.45 倍，而且 10/10 個 token 都能保持 bit-identical 的回放一致性。作者也推估，到了 4,096 tokens，還原大約會比重新計算快 100 倍。更重要的是，這個差距會隨上下文變長而擴大，因為還原時間幾乎是常數，而重新 prefill 是線性成長。

## 這到底在做什麼

作者在做的是一個叫 Driftwood 的 runtime，目標是把「有狀態的 Wasm actors」和 GPU inference 綁在一起。零拷貝鏈路只是地基，之後還想加上：

- actor snapshots，也就是把一段對話或任務凍結、搬走、再解凍
- checkpoint portability，讓 inference 狀態能跨機器移動
- multi-model support，讓快照格式盡量不綁死某個模型

這篇文章目前還很早期，但已經把最關鍵的物理問題證明了：Wasm 和 GPU 在 Apple Silicon 上可以共享記憶體，而且沒有明顯額外成本。這不是紙上談兵，是能跑、能量、能存快照的基礎層。

<div class="sep">· · ·</div>

## 延伸評論：真正的價值在「可搬移的狀態」

這篇的重點不只是省掉一個 copy，而是把 AI runtime 從一次性推論，推向可快照、可續跑、可搬遷的狀態機。當 KV cache 和 Wasm 狀態可以被同時保存、回復、甚至移轉，agent 才真的有機會成為長壽命工作單元，而不是每次重開都失憶的聊天室。

如果這條路繼續成熟，下一輪競爭可能不只是在比模型多強，而是在比誰能把「上下文、狀態、算力」封裝成更便宜、更可靠、也更容易移動的基本單位。這會很有意思。