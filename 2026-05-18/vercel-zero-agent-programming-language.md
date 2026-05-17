---
title: "Vercel Zero：為 AI agent 設計的程式語言，讓 compiler 直接說 JSON"
description: "Vercel Labs 推出實驗性系統語言 Zero，把 compiler 診斷、修復計畫、能力式 I/O 與 agent skill 都設計成 agent 可直接讀懂的結構化介面。"
date: 2026-05-18
author: Michal Sutter
layout: post
permalink: /2026-05-18/vercel-zero-agent-programming-language.html
---

<div class="hero-badge">Michal Sutter · 2026-05-17</div>

**原文連結：** [Vercel Labs Introduces Zero, a Systems Programming Language Designed So AI Agents Can Read, Repair, and Ship Native Programs](https://www.marktechpost.com/2026/05/17/vercel-labs-introduces-zero-a-systems-programming-language-designed-so-ai-agents-can-read-repair-and-ship-native-programs/)

## 摘要

- Vercel Labs 推出實驗性系統語言 Zero，目標不是取代 Rust 或 Zig，而是探索「給 AI agent 使用的程式語言與 toolchain」應該長什麼樣子。
- Zero 的核心想法是讓 compiler 直接輸出 agent 可解析的結構化資訊，例如穩定錯誤碼、JSON diagnostics、typed repair metadata，以及可機器讀取的修復計畫。
- 文章指出，現在多數 coding agent 的脆弱點在於要解析給人類看的 compiler 錯誤訊息；訊息格式一變，agent 的修復迴圈就容易失準。
- Zero 也把副作用寫進 function signature：I/O、檔案系統、網路存取都要透過 capability object 宣告，讓人類與 agent 都能快速看出程式能碰哪些外部資源。
- 目前 Zero 是 v0.1.1、Apache-2.0、仍屬早期實驗，compiler、standard library 與 spec 都未穩定，還不適合當 production dependency。
- 真正值得關注的不是 Zero 本身會不會變成主流程式語言，而是「agent-native toolchain」可能成為下一代開發工具的設計基準。

<div class="sep">· · ·</div>

大多數程式語言一開始都是為人類設計的：人類閱讀錯誤訊息、解讀 warning、手動追 stack output，再判斷該怎麼修 bug。AI agent 並不擅長這些事。它們更適合處理結構化資料：可預測的 token、穩定的錯誤碼，以及機器可以直接解析的修復提示。

Vercel Labs 發布的 Zero，想補上的正是這個缺口。Zero 是一種實驗性系統語言，設計目標是更快、更小，也更容易被 agent 使用與修復。

## Zero 是什麼？

Zero 是一種系統程式語言，位在 C 或 Rust 類似的設計空間。它可以編譯成 native executable，提供明確的記憶體控制，也瞄準較低階的執行環境。

Zero 和既有系統語言最大的差異，在於它的 compiler output 與 toolchain 從第一天開始就不是只給人類工程師讀，而是同時給 AI agent 消費。

## Agent-first toolchain

Zero 要處理的核心問題，是 agent 如何理解 compiler feedback。

典型 coding agent 的迴圈大致是：agent 寫 code、compiler 產生錯誤、agent 讀錯誤訊息、agent 判斷哪裡壞掉並嘗試修復。這個迴圈很脆弱，因為錯誤訊息格式會隨 compiler 版本改變，而且那些訊息本來就是寫給人類看的。更麻煩的是，傳統 compiler output 通常沒有內建「repair action」這種概念。

Zero 的 CLI 預設可以輸出 structured JSON diagnostics。執行 `zero check --json` 時，輸出會像這樣：

```json
{
  "ok": false,
  "diagnostics": [
    {
      "code": "NAM003",
      "message": "unknown identifier",
      "line": 3,
      "repair": {
        "id": "declare-missing-symbol"
      }
    }
  ]
}
```

每個 diagnostic 都包含穩定錯誤碼，例如 `NAM003`、給人類看的 message、行號，以及帶有 typed repair ID 的 repair object。人類可以讀 message，agent 則可以讀 code 和 repair object。同一個 CLI command 同時服務兩種讀者，不需要另外跑第二套工具。

Zero 的 toolchain 也整合成單一 binary：`zero check`、`zero run`、`zero build`、`zero graph`、`zero size`、`zero routes`、`zero skills`、`zero explain`、`zero fix`、`zero doctor` 都是同一個 CLI 的 subcommand。對 agentic workflow 來說，這很重要，因為 agent 不需要額外判斷「這個任務該呼叫哪個工具」。

其中兩個 subcommand 特別針對 repair loop 設計。`zero explain <diagnostic-code>` 會回傳特定 diagnostic code 的詳細說明，因此 agent 遇到 `NAM003` 時，可以直接查它的意思，不必去爬可能過期的文件。

`zero fix --plan --json <file-or-package>` 則更進一步：它會輸出機器可讀的 fix plan，也就是一份結構化描述，說明要改哪些地方才能解決 diagnostic。換句話說，agent 不必只靠錯誤文字自行推論修法，compiler 可以直接告訴它修復方向。

`zero skills` 的用途不同。它會透過 CLI 直接提供與目前 compiler 版本相符的 agent guidance。執行 `zero skills get zero --full` 會得到針對 Zero syntax、diagnostics、builds、packages、standard library、testing、agent edit loops 等主題的 focused workflows。這代表使用 Zero 的 agent 不需要去 scrape 外部文件，也比較不會讀到和本機 compiler 版本不一致的資料。

## 明確副作用與 capability-based I/O

Zero 的另一個核心設計，是把副作用明確寫進 function signature。如果一個 function 會寫 stdout、碰檔案系統或發網路請求，它必須透過 capability object 宣告。

Zero 的標準 entry point 看起來像這樣：

```zero
pub fun main(world: World) -> Void raises {
  check world.out.write("hello from zero\n")
}
```

`world: World` 是授權程式碰外部世界的 capability object。沒有拿到 `World` 或從 `World` 派生出的 capability，function 就不能做 I/O，compiler 會在 compile time 擋下來，而不是等到 runtime 才出事。這也代表 Zero 沒有隱藏的 global process object。

`check` keyword 用來處理可能失敗的操作。如果 `world.out.write(...)` 可能失敗，呼叫端就必須用 `check` 把錯誤往上攤開。`main` 後面的 `raises` annotation 則明確標示這個 function 可能 propagate error，讓錯誤路徑出現在 signature 裡，而不是藏在 exception 或隱式 runtime 行為裡。

## 入門方式

安裝 Zero 只需要一個 command：

```bash
curl -fsSL https://zerolang.ai/install.sh | bash
export PATH="$HOME/.zero/bin:$PATH"
zero --version
```

installer 會從 GitHub release 下載最新版 binary，放到 `$HOME/.zero/bin/zero`。Zero package 使用 `zero.json` manifest，source file 放在 `src/` 底下，可以用 `zero new cli <name>` 初始化。repo 裡也附了一個 `.0` 檔案的 VS Code syntax highlighting extension，位置在 `extensions/vscode/`。

## MarkTechPost 的 visual explainer 重點

MarkTechPost 把 Zero 的定位整理成九個畫面。重點可以濃縮成幾件事。

第一，Zero 是「The Programming Language for Agents」。它是一種實驗性系統語言，目標是讓 AI agent 能讀、修、檢查、發佈小型 native program，同時產生小於 `10 KiB` 的 native binary。

第二，Zero 直接針對 agent repair loop 的痛點設計。傳統語言把 compiler error 當成給人類看的文字，agent 必須解析那段文字來判斷發生什麼事；Zero 則讓 compiler output 包含 stable code、line number、typed repair ID 和 machine-readable metadata。

第三，`zero explain` 和 `zero fix --plan --json` 把「理解錯誤」與「提出修法」也變成結構化介面。agent 可以查 diagnostic code，也可以拿到明確的 fix plan，不必從 prose documentation 或自由文字錯誤訊息裡猜答案。

第四，`zero skills` 把 version-matched agent guidance 放進 toolchain。這些 guidance 涵蓋 Zero syntax、diagnostics、builds、packages、testing、agent edit loop 等 workflow，並且和目前安裝的 compiler version 對齊。

第五，Zero 的 capability-based I/O 讓副作用外顯。`world: World` 授權 I/O、filesystem、network 等外部能力；`check` 表示 fallible operation；`raises` 表示 function 可能 propagate error。這些都出現在 signature 裡，而不是散落在 implementation 裡。

第六，Zero 強調 predictable memory 和 tiny binary。它沒有 mandatory GC、沒有 mandatory event loop，也不希望有 hidden runtime tax；`zero size --json` 可以在可行時於 code generation 前回報 artifact size。

第七，Zero 目前仍是早期狀態：版本是 `v0.1.1`，compiler、standard library 與語言規格都還不穩定；沒有 package registry；cross-compilation 只支援文件列出的 target subset；VS Code extension 目前主要提供 `.0` syntax highlighting。

## Key takeaways

Zero 是 Vercel Labs 的實驗性系統語言，能編譯出 sub-`10 KiB` native binary，並且把設計焦點放在 AI agent workflow 上。

它的 compiler 會輸出 JSON diagnostics，包含穩定錯誤碼與 typed repair metadata，讓 agent 不需要解析給人類看的錯誤文字。

`zero explain` 與 `zero fix --plan --json` 讓 agent 能以結構化方式理解錯誤與取得修復計畫，不必靠 prose parsing。

透過 capability-based I/O，Zero 把副作用寫進 function signature，function 必須宣告自己能碰哪些外部資源，compiler 也會在 compile time 強制執行這件事。

Zero 沒有 mandatory GC、hidden allocator、implicit async 或 magic globals，因此 memory 與 control flow 更可預測。

Zero 目前是 `v0.1.1`、Apache-2.0 授權，而且仍屬實驗階段。

<div class="sep">· · ·</div>

## 真正的重點是 toolchain 開始為 agent 重設介面

Zero 現在還太早期，不該被解讀成「下一個 Rust」或「agent 時代的主流程式語言」。比較合理的看法是：它把 coding agent 真的會卡住的地方具體化了。

過去大家常把問題推給模型：agent 修不好，是因為模型不夠聰明。但 Zero 提出的反問是，既然 agent 已經是 toolchain 的使用者，那 compiler、CLI、docs、diagnostics 是否也應該提供 machine-readable 的操作面？這個問題比 Zero 本身更重要。

對開發者來說，最值得帶走的不是立刻學 `.0` 語法，而是重新檢查自己工具鏈的 agent ergonomics：錯誤訊息有沒有 stable code？CLI output 能不能用 JSON？修復建議能不能被程式消費？文件能不能跟版本一起發佈？副作用與權限能不能在 signature 或 manifest 這種外顯介面上看出來？

如果 coding agent 會成為日常開發的一部分，下一代好工具不只要「人類好用」，還要「agent 好讀、好查、好修、好驗證」。Zero 的價值就在於它把這件事講得很直白：agent-native 不是把 AI 接到舊工具上而已，而是讓工具本身開始承認 agent 也是一等使用者。
