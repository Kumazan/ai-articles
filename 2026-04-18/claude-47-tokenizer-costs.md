---
title: "Claude 4.7 換了 tokenizer，代價到底有多大？"
description: "Claude Opus 4.7 的新 tokenizer 讓英語與程式碼內容平均膨脹 1.3 到 1.45 倍，換來約 5 個百分點的嚴格指令遵循提升，但每次 Claude Code 對話的實際成本與額度消耗也同步上升。"
date: 2026-04-18
author: Claude Code Camp
layout: post
permalink: /2026-04-18/claude-47-tokenizer-costs.html
image: /2026-04-18/og-claude-47-tokenizer-costs.png
---

<div class="hero-badge">AI News · 2026-04-18</div>

![](/ai-articles/2026-04-18/og-claude-47-tokenizer-costs.png)

**原文連結：** [I Measured Claude 4.7's New Tokenizer. Here's What It Costs You.](https://www.claudecodecamp.com/p/i-measured-claude-4-7-s-new-tokenizer-here-s-what-it-costs-you)

## 摘要

- Claude Opus 4.7 的新 tokenizer 不是小改版，英文與程式碼內容常常會吃掉 1.3 到 1.45 倍的 tokens
- 這代表同樣的文字，Max 額度、prompt cache 和 rate limit 都會更快被耗光
- 在嚴格指令遵循測試裡，4.7 比 4.6 多拿了約 5 個百分點，但幅度不大
- 對 Claude Code 這種長對話工作流來說，單次 session 成本大約會上升 20% 到 30%
- 真正的問題不是「新 tokenizer 好不好」，而是「這個提升值不值得多付這些 tokens」
- 這篇把模型升級從「能力進步」拉回到「經濟可用性」來看，很有參考價值

<div class="sep">· · ·</div>

Anthropic 的 Claude Opus 4.7 migration guide 說，新 tokenizer 大約會比 4.6 多出 1.0 到 1.35 倍的 tokens。作者實測後發現，在技術文件上甚至到 1.47 倍；在真實的 `CLAUDE.md` 檔案上也有 1.45 倍。

也就是說，Anthropic 沒有漲標價、沒有改 quota，但同樣一段內容，實際會被切成更多 token。這會讓 Max 方案更快燒完，prompt cache 的成本更高，每次 turn 也更快碰到 rate limit。

所以問題就變成了：Anthropic 這樣換 tokenizer，到底換到了什麼？值不值得？

作者做了兩組實驗。第一組看成本，第二組看 Anthropic 說你會得到什麼回報。

## 這要花多少？

作者用 `POST /v1/messages/count_tokens`，這是 Anthropic 免費、沒有推論成本的 token 計數器。相同內容、相同模型，只看 tokenizer 的差異。

他準備了兩批樣本：

- 第一批是 Claude Code 使用者真的會送出的內容，共 7 筆，包括 `CLAUDE.md`、使用者 prompt、部落格段落、git log、終端輸出、stack trace、code diff
- 第二批是 12 筆合成樣本，涵蓋英文、程式碼、結構化資料、中文、日文、emoji、數學符號，看看比例會怎麼變

核心程式其實只有三行：

```python
from anthropic import Anthropic
client = Anthropic()

for model in ["claude-opus-4-6", "claude-opus-4-7"]:
    r = client.messages.count_tokens(
        model=model,
        messages=[{"role": "user", "content": sample_text}],
    )
    print(f"{model}: {r.input_tokens} tokens")
```

### 真實的 Claude Code 內容

作者從實際會出現在 Claude Code 工作流裡的內容抽了 7 筆樣本：

| 內容類型 | 字元數 | 4.6 tokens | 4.7 tokens | 比例 |
|---|---:|---:|---:|---:|
| `CLAUDE.md`（真實檔案，5KB） | 5,000 | 1,399 | 2,021 | 1.445 |
| 使用者 prompt（典型 Claude Code 任務） | 4,405 | 1,122 | 1,541 | 1.373 |
| 部落格段落（Markdown） | 5,000 | 1,209 | 1,654 | 1.368 |
| Git commit log | 2,853 | 910 | 1,223 | 1.344 |
| 終端輸出（pytest 執行結果） | 2,210 | 652 | 842 | 1.291 |
| Python stack trace | 5,255 | 1,736 | 2,170 | 1.250 |
| code diff | 4,540 | 1,226 | 1,486 | 1.212 |

七筆樣本加權後的平均比例是 **1.325x**，也就是 8,254 tokens 變成 10,937 tokens。

### 以內容類型區分的基準樣本

再看 12 筆合成樣本：

| 內容類型 | 字元數 | 4.6 | 4.7 | 比例 |
|---|---:|---:|---:|---:|
| 技術文件（英文） | 2,541 | 478 | 704 | 1.47 |
| Shell script | 2,632 | 1,033 | 1,436 | 1.39 |
| TypeScript code | 4,418 | 1,208 | 1,640 | 1.36 |
| 西班牙文散文 | 2,529 | 733 | 986 | 1.35 |
| Markdown + code blocks | 2,378 | 604 | 812 | 1.34 |
| Python code | 3,182 | 864 | 1,112 | 1.29 |
| 英文散文 | 2,202 | 508 | 611 | 1.20 |
| JSON（密集資料） | 48,067 | 13,939 | 15,706 | 1.13 |
| Tool definitions（JSON Schema） | 2,521 | 738 | 826 | 1.12 |
| CSV（數字資料） | 9,546 | 5,044 | 5,414 | 1.07 |
| 日文散文 | 993 | 856 | 866 | 1.01 |
| 中文散文 | 750 | 779 | 789 | 1.01 |

英文與程式碼的加權平均是 **1.345x**；CJK 則幾乎沒變，都是 **1.01x** 左右。

## tokenizer 真的改了什麼？

作者從數據裡看出三個特徵：

- CJK、emoji、符號類內容只變動 1.005 到 1.07 倍，表示不是整包 vocabulary 大翻新
- 英文與程式碼則明顯變大，落在 1.20 到 1.47 倍
- 程式碼比純文字更容易被放大，因為它有更多重複的高頻字串，例如 keyword、import、identifier

換句話說，4.7 很可能用更細的切分方式來表示英文與程式碼。這不是證明 tokenizer 的內部設計，但足以解釋 token 數怎麼膨脹。

作者也順手算了 chars-per-token：

- 英文從 4.33 掉到 3.60
- TypeScript 從 3.66 掉到 2.69

同樣的文字，被切成更細的小片段了。

## 為什麼要做一個吃更多 tokens 的 tokenizer？

Anthropic 的說法是：**更嚴格的指令遵循，尤其在較低 effort level 下更穩。**

更小的 token 會讓模型更注意單字與局部結構，這對精準遵守格式、字符級任務、tool call 精度都可能有幫助。合作夥伴的回饋也提到，長流程裡的工具錯誤變少了。

但作者也強調，這只是可能原因之一。weights 和 post-training 也一起變了，不能只把改善全部算到 tokenizer 上。

## 4.7 真的更會照指令嗎？

這裡作者做了直接測試，使用 IFEval benchmark。

IFEval 共有 541 題，題目像是「剛好輸出 N 個字」、「把某個字出現兩次」、「不能有逗號」、「全大寫」這種可機器驗證的約束。

作者固定抽 20 題，讓 4.6 與 4.7 各跑一次，再用 IFEval 的 checker 評分。

結果如下：

| 指標 | 4.6 | 4.7 | 差異 |
|---|---:|---:|---:|
| Strict, prompt-level（全部 constraint 都過） | 17/20（85%） | 18/20（90%） | +5pp |
| Strict, instruction-level | 25/29（86%） | 26/29（90%） | +4pp |
| Loose, prompt-level | 18/20（90%） | 18/20（90%） | 0 |
| Loose, instruction-level | 26/29（90%） | 26/29（90%） | 0 |

也就是說，4.7 在嚴格模式下確實有一點進步，但幅度不大。作者也提醒，樣本只有 20 題，不能拿來下很大的結論。

## 一個 Claude Code session 到底會貴多少？

作者接著把焦點拉回 Claude Code 的長對話情境。

假設有一個 80 turns 的長 session，用來修 bug 或重構：

- 靜態前綴：`CLAUDE.md` 2K + tool definitions 4K，共 6K tokens
- conversation history：每 turn 大約增加 2K tokens，80 turn 後到 160K
- user input：每 turn 約 500 tokens
- output：每 turn 約 1,500 tokens
- cache hit rate：95%

### 4.6 的 session 成本

| 項目 | 算式 | 成本 |
|---|---|---:|
| 第 1 turn cache-write | 8K × $6.25/MTok | $0.05 |
| 第 2 到 80 turn cache reads | 79 × 86K × $0.50/MTok | $3.40 |
| 新的 user input | 79 × 500 × $5/MTok | $0.20 |
| output | 80 × 1,500 × $25/MTok | $3.00 |
| 合計 |  | **約 $6.65** |

### 4.7 的 session 成本

因為每個 token 都變長了，prefix 也一起放大：

- `CLAUDE.md` 1.445x → 2K 變成 2.9K
- tool defs 1.12x → 4K 變成 4.5K
- conversation history 1.325x → 160K 變成 212K，平均約 106K
- user input 1.325x → 500 變成約 660

| 項目 | 算式 | 成本 |
|---|---|---:|
| 第 1 turn cache-write | 10K × $6.25/MTok | $0.06 |
| 第 2 到 80 turn cache reads | 79 × 115K × $0.50/MTok | $4.54 |
| 新的 user input | 79 × 660 × $5/MTok | $0.26 |
| output | 80 × 1,500–1,950 × $25/MTok | $3.00–$3.90 |
| 合計 |  | **約 $7.86–$8.76** |

### 差多少？

大約是 **$6.65 → $7.86–$8.76**，也就是 **多 20% 到 30%**。

重點是，單 token 價格沒變，但單 session 的實際價格變了，因為同樣的 session 被切成更多 token。

對 Max 方案使用者來說，這也代表 5 小時視窗會更早耗完，幅度大概和成本膨脹差不多。

## prompt cache 會怎麼受影響？

Claude Code 本來就很依賴 prompt caching。4.7 的 tokenizer 變更會在三個地方放大影響：

- 第一次切到 4.7 時，cache 會整個冷掉，因為不同 model 之間的 cache 是分開的
- cache volume 會跟 token 比例一起長大，讀寫都變貴
- 同樣一段 transcript，在 4.6 與 4.7 下會得到不同 token 數，觀測與計費基準都會出現跳點

## 反對意見

### 「大部分 input 都是 cache read，單 token 價格沒差多少。」

這說法合理。steady state 下，input 很大一部分是 cache read，成本本來就打折。

但 Max 方案算的是 token 額度，不只是美元。再加上 cache bust、模型切換、`CLAUDE.md` 變更、compaction 事件，都可能把你拉回 full price 區間。

### 「Anthropic 說的 1.0 到 1.35 倍只是範圍，不是硬上限。」

沒錯，而且作者的加權平均 1.325x 其實已經很接近上緣。`CLAUDE.md` 與技術文件甚至超過 1.4x。

所以真正該怎麼預估，不是看平均值，而是看上緣。

## 結論

這篇文章的結論很直接：

- Claude 4.7 的新 tokenizer，對英文與程式碼內容真的會吃掉更多 tokens
- 這換來的是一點點可測量的 strict instruction-following 改善
- 但代價不是抽象的，而是每個 session 的實際成本與額度消耗都上升了
- 對 Claude Code 使用者來說，4.7 不是單純的「更聰明」，而是「更細、更貴，但也更守規矩」

<div class="sep">· · ·</div>

## 延伸評論：進步不一定免費

這篇最值得記下來的，不是 tokenizer 變了，而是 **模型能力的提升，可能是用更高的使用成本換來的**。當大家只看 benchmark、只看 strict mode 的分數，會很容易忽略一件事，模型若要更會照指令、更少犯格式錯，背後可能只是把字切得更碎，然後讓每次互動都多燒一點。

對真正要把 agent 放進工作流的人來說，這是很現實的提醒。能力曲線和經濟曲線不是同一條線。demo 很漂亮，不代表 production 便宜。
