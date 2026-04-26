---
title: "SWE-bench Verified 為何已不再能衡量前沿 coding 能力"
description: "OpenAI 指出，SWE-bench Verified 受錯誤測試與訓練污染雙重影響，已不再適合作為前沿模型自治軟體工程能力的主要指標，建議改報 SWE-bench Pro。"
date: 2026-04-26
author: OpenAI
layout: post
permalink: /2026-04-26/why-swe-bench-verified-no-longer-measures-frontier-coding-capabilities.html
image: /2026-04-26/og-why-swe-bench-verified-no-longer-measures-frontier-coding-capabilities.png
---

<div class="hero-badge">AI News · 2026-04-26</div>

![](/ai-articles/2026-04-26/og-why-swe-bench-verified-no-longer-measures-frontier-coding-capabilities.png)

**原文連結：** [Why SWE-bench Verified no longer measures frontier coding capabilities](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)

## 摘要

- OpenAI 認為，SWE-bench Verified 已經不再適合拿來衡量前沿模型的自治軟體工程能力。
- 這個判斷來自兩個問題：測試本身會誤殺正確解法，以及模型可能在訓練時已看過題目與金標答案。
- OpenAI 抽查了 27.6% 的資料集，發現至少 59.4% 的受檢題目有實質缺陷。
- 這些缺陷可分成 narrow tests、wide tests 與其他雜項問題；比例分別是 35.5%、18.8% 與 5.1%。
- OpenAI 也用 red-teaming 驗證 contamination，發現 GPT‑5.2、Claude Opus 4.5 與 Gemini 3 Flash Preview 都可能回憶出金標補丁。
- 結論是：之後應該改看 SWE-bench Pro，並建立更乾淨的新評測。

<div class="sep">· · ·</div>

自從 OpenAI 在 2024 年 8 月公布 SWE-bench Verified 之後，這個 benchmark 很快變成業界衡量自治軟體工程進展的標準之一。它也被納入 OpenAI 的 Preparedness Framework，用來追蹤和預測這類能力的演進。當初建立 Verified 的目的，是修補原始 SWE-bench 裡那些讓某些題目根本不可能解完的問題。

但在前幾輪進展之後，SWE-bench Verified 的提升明顯放慢：過去 6 個月只從 74.9% 漲到 80.9%。這也逼出一個關鍵問題：剩下的失敗，究竟是模型真的不行，還是資料集本身有問題？

OpenAI 的新分析指出，Verified 已經不再適合拿來衡量今天前沿模型的自主軟體工程能力，原因有兩個。

第一，測試會把正確解法刷掉。OpenAI 抽查了資料集裡模型常常答不出的 27.6% 子集，發現至少 59.4% 的題目存在有問題的測試案例，會把功能正確的提交判成錯誤。

第二，訓練污染。因為大型前沿模型很可能在訓練階段看過這些開源 repo、問題描述，甚至參考答案，所以它們在題目上表現好，不一定代表真的更會寫程式；也可能只是看過考卷。

這兩個問題加在一起，就讓 SWE-bench Verified 的分數越來越不像真實世界能力提升，而越來越像「模型有多大機會在訓練時見過這份 benchmark」。因此 OpenAI 停止報告 SWE-bench Verified 分數，也建議其他模型開發者跟進。

他們目前正在建立新的、未污染的評測來追蹤 coding 能力，並建議在此之前先報告 SWE-bench Pro。

原始 SWE-bench 在 2023 年發布。每道題都來自 12 個開源 Python repository 裡的一個已解決 GitHub issue，並對應到相關 pull request。模型只能看到原始 issue 文字與修補前的程式庫狀態，不能直接看到測試。要算通過，必須讓所有測試都通過。

當初的設計就已經有幾個難點：

- 有些 unit tests 太具體，或和任務描述不一致，導致正確修補也會被判失敗。
- 有些題目描述過於模糊，存在多種合理解讀，但測試只覆蓋其中一種。
- 不同環境設定（例如 Linux / Windows，或不同 Python 版本）也可能讓測試莫名其妙失敗。

OpenAI 在 2024 年做了 SWE-bench Verified，就是想處理這些問題。他們請 1,699 道題目給專家軟體工程師審查，並把有問題的題目濾掉。每題都由 3 位專家獨立審查，最後得到一個 500 題的 curated set。

但 Verified 雖然比原版強很多，殘留問題還是很明顯。OpenAI 進一步抽查了 138 道問題：這些題目是 OpenAI o3 在 64 次獨立跑分裡無法穩定解出的案例。每題至少由 6 位有經驗的工程師獨立審查；若有專家判定有問題，還會再交給另一組人複核。

最後結果是：這 138 題裡有 59.4% 存在實質性的測試設計或題目描述問題，嚴重到就算是最強模型，甚至人類，也很難穩定解開。

這些問題大致分成三類：

- 35.5% 屬於 narrow test cases：測試卡得太死，強迫特定實作細節。
- 18.8% 屬於 wide test cases：測試檢查了題目根本沒寫清楚的額外功能。
- 其餘 5.1% 屬於其他沒有好好歸類的雜項問題。

文中舉的第一個例子是 `pylint-dev__pylint-4551`。那個 PR 會新增一個 `get_annotation` 函式，但題目描述根本沒提到它；只是測試直接 import 這個名字。某些模型也許會直覺地寫出來，但其實要解這題並不一定非得用這個函式名。結果就是，很多合理解法會因為 import error 被刷掉。

另一個例子是 `sympy__sympy-18199`。這題來自一個修補 `nthroot_mod` 的 PR，而那個 PR 同時處理了 3 個不同 issue：`#17373`、`#17377` 與 `#18212`。但 SWE-bench Verified 的描述只寫了最後那個 `#18212`，測試卻把前面 3 個 issue 全都覆蓋進去。結果是，模型就算正確修好題目描述中那一項，還是可能被其他兩項的測試打掉。

由於 Verified 和其來源 repository、release notes 都是開源且廣泛流通，模型開發者幾乎不可能完全避開污染。OpenAI 自己也先在模型上看到跡象：例如 GPT‑5.2 解出 31 題他們原本認為幾乎不可能解的題目。像 `django__django-14725` 這題，測試要求一個題目描述沒明講的新參數 `edit_only`；GPT‑5.2 在推理過程中還顯示它知道相關 release notes，並正確指出這個參數是 Django 4.1 引入的。

為了更系統性地衡量污染，OpenAI 做了一套自動 red-teaming。對每一題 SWE-bench Verified，他們讓 GPT‑5 去探測 GPT‑5.2‑Chat、Claude Opus 4.5 與 Gemini 3 Flash Preview 是否暴露污染資訊。選這些模型，是為了排除 reasoning models；但 OpenAI 也承認，這樣仍可能存在不小的能力差距。

探測流程是這樣：GPT‑5 會拿到題目 ID、描述、gold patch 和 PR tests，接著在 15 回合內，嘗試不同的 system / developer prompt、user prompt、assistant prefill 與誘導策略。每一回合後，judge model 會標記出現了多少新的題目專屬資訊，並把污染程度從「none」到「strong」分類。GPT‑5 還可以根據前幾輪結果調整策略，逐步把題目細節挖出來。

下面就是幾個 strong contamination 的例子：

- 給 GPT‑5.2 一小段題目描述，它就能吐出完整的 gold patch，包含正確的 class、method 名稱，以及新增的早退條件 `if username is None or password is None`。
- Claude Opus 4.5 不只記得 PR 的 4 行功能修改，還能說出它改到的檔名、method，甚至原本放在 diff 裡的 inline comment。
- Gemini 3 Flash 在只拿到 task ID、沒有其他額外資訊時，也能說出題目描述與 gold patch 的具體內容，包括 `username` 驗證的 regex 公式和正確的行號。

OpenAI 從這次 audit 提了兩個更大的教訓。

第一，公開資料做 benchmark，天然就有污染風險。只要題目或答案曾經被公開抓取進訓練集，分數就可能悄悄膨脹。若真的要用公開資料做題庫，就得加上更嚴格的污染測試、密碼保護、canary strings 之類的防線。

第二，自動評分本來就很難。真正好的測試案例，不只要驗證正確功能，還要盡量不受不重要的實作細節干擾，也要能擋住投機取巧的解法。這類問題本來就複雜，OpenAI 這次為了抓出它們，還做了多輪人工作業。

因此，OpenAI 現在轉向報告 public split 的 SWE-Bench Pro，並建議其他模型開發者也這麼做。SWE-bench Pro 當然也不是完美的，但實務上看起來比較不容易被污染；OpenAI 的 contamination pipeline 雖然還是抓到一些案例，但遠比 SWE-bench Verified 少，而且沒有任何模型能完整重現 verbatim gold patch。

他們最後強調，接下來會持續投資原創、私下撰寫的 benchmark，也希望業界和學界一起做。像 GDPVal 這種由領域專家私下撰寫、降低暴露風險，並由受訓評審整體打分的方式，雖然成本高，但在今天看來越來越必要。

<div class="sep">· · ·</div>

## 延伸評論：真正該被淘汰的，不是分數，而是「看起來很科學」的錯誤感

這篇最有價值的地方，不是它宣布某個 benchmark 失效，而是它把一個常見幻覺拆開了：分數很高，不代表能力真的更好；有時只是題庫被訓練集污染得更徹底。對 coding eval 來說，這很致命，因為它會讓整個產業把記憶誤認成推理，把碰巧見過題目誤認成進步。

OpenAI 這次其實也順手指出另一個現實：越接近前沿，越不能只靠公開、靜態、可複製的測試。未來的評測大概會更像私有考卷、持續更新的題庫，甚至是由人工審查支撐的真實工作流。這不酷，但很誠實。
