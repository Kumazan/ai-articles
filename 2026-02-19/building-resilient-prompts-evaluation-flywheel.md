---
title: "用 Evaluation Flywheel 打造更穩健的 Prompt"
date: 2026-02-19
layout: post
permalink: /2026-02-19/building-resilient-prompts-evaluation-flywheel.html
---

<div class="hero-badge">OpenAI Cookbook · 2026-02-19</div>

**原文連結：** https://developers.openai.com/cookbook/examples/evaluation/building_resilient_prompts_using_an_evaluation_flywheel

<div class="sep">· · ·</div>

## 摘要

- 這篇文章提出一個可持續迭代的方法：**Evaluation Flywheel**。
- 核心不是「改 prompt 靠感覺」，而是三步循環：**Analyze（分析）→ Measure（量測）→ Improve（改進）**。
- 先用人工標註找出失敗模式，再用 grader 自動化評測，最後有依據地優化 prompt。
- 當舊問題改善後，通常會出現更細的新問題，於是再跑下一輪 flywheel。

<div class="sep">· · ·</div>

## 內文（繁中翻譯）

## Overview

### 這篇 Cookbook 的目的

本篇提供一套實務流程，教你如何在 OpenAI 平台上更容易地打造**具韌性的 prompt**。

所謂有韌性的 prompt，是指在各種不同輸入情境下，都能穩定輸出高品質結果。

如果少了這個特性，AI 應用上線後常會遇到：
- 邊界案例輸出失控
- 一般案例品質不穩
- 整體產品效果被拖垮

為了系統化提升 prompt 的穩定性，文章推薦使用 **evaluation flywheel**：一個可量測、可持續優化的迭代方法。

### 適合讀者

- 領域專家（SME）
- 解決方案架構師
- 資料科學家
- AI 工程師

特別適合想提升 prompt 一致性與品質，或要處理特定 edge cases 的團隊。

## 什麼是 Evaluation Flywheel

AI 應用常常很脆弱：今天看似有效的 prompt，明天可能因輸入微小變化就出現意外輸出。

Flywheel 的觀念是把「猜測式調 prompt（prompt-and-pray）」改成工程化流程。

三個階段如下：

1. **Analyze（分析）**
   - 透過質化檢視理解「怎麼壞、為什麼壞」
   - 人工閱讀錯誤案例並標註重複失敗模式

2. **Measure（量測）**
   - 把失敗模式轉成可量化指標，建立 baseline
   - 建立測試資料集與自動評分器（graders）

3. **Improve（改進）**
   - 針對性調整：重寫 prompt、補例子、修系統元件
   - 每次改動後立即看指標變化，持續迭代到可接受水準

這是持續循環：舊問題修好後，新問題會浮現，再進入下一輪。

## 範例情境：租屋助理

文中以一個已上線的租屋助理為例。它會回答潛在租客問題，例如：
- 公寓多大？
- 什麼時段可以看房？

流程上，先把 prompt 與實際輸入/輸出資料上傳到 Dataset，接著分析 prompt 表現。

## 如何分析 Prompt 成效

要改進系統，先搞懂它如何失敗。

自動化指標能追蹤進度，但無法告訴你「失敗原因」。因此最關鍵的是人工分析輸出。

文章建議用兩段式標註法：**Open Coding + Axial Coding**。

### 1) Open Coding：先發現失敗模式

先抽一批失敗案例（建議約 50 筆），逐筆加上描述性標籤。

這階段先不追求完美分類，重點是探索。

租屋助理的開放式標註例子：
- 建議了不可用的看房時段
- 設施清單輸出成一整塊文字
- 改約時沒有取消舊預約
- 格局圖連結壞掉

### 2) Axial Coding：把洞察結構化

把 open codes 聚合成較高層的類別，建立可操作的分類法。

例如：
- **看房排程/改期問題**
  - 建議不可用時段
  - 改期沒取消舊預約
- **輸出格式問題**
  - 設施清單可讀性差
  - 格局圖連結錯誤

有了這層分類後，你就能看到問題分佈（如排程問題 35%、格式問題 10%），知道資源該先砸在哪。

## 用自動 Graders 增加穩健性

有了 taxonomy 與資料集後，就可以把 flywheel 自動化。

文中提到 OpenAI 平台可用多種 graders（Python grader、LLM grader 等）批次評測。

範例 grader：
- **Formatting grader**：評估輸出格式是否符合規範
- **Availability accuracy grader**：比對模型給的時段是否符合資料集中的真值

當 graders 建好後，不管你是改 prompt、改參數或加入新 edge cases，都可快速得到可比對的評測結果。

## 優化 Prompt

完成錯誤分類與 grader 之後，就可進入 prompt 優化。

除了手動調整外，文章提到可用 Prompt Optimizer，利用：
- 模型輸出
- 自訂標註欄位
- grader 結果

自動產生更好的 prompt。

接著可以持續重跑：
- 重新標註新輸出
- 擴充或微調 grader
- 再優化 prompt

並且在不同分頁比較不同模型與參數設定的表現。

## 進階技巧

### 1) 用合成資料擴充測試集

當 production logs 不夠時，合成資料很有用，尤其是：
- 產品尚未上線
- 想深入測特定失敗模式
- 有懷疑點但缺真實案例

重點不是直接叫模型「生 N 筆資料」，那通常太同質。

建議做法是先定義維度，再用組合（tuples）生成：
- Channel：Voice / Chat / Text
- Intent：Tour Scheduling / Maintenance / General Info
- Persona：Prospective Resident / Agency

例如組合 `(Text, Tour Scheduling, Prospective Resident)`，可產生更有覆蓋率的測例。

再加擾動（perturbation）提高難度：
- 加入無關資訊
- 引入錯字或誤植
- 換不同口語/俚語

### 2) 校準你的 LLM Judge

LLM judge 只有在「判斷可信」時才有價值。

做法是拿它對比人類 SME 的黃金標準資料集。

文章提醒：測試集常嚴重不平衡（pass 遠多於 fail），只看 accuracy 會誤導。

應該同時關注：
- **TPR**（True Positive Rate）：抓到真正 fail 的能力
- **TNR**（True Negative Rate）：正確放行 pass 的能力

資料分割建議：
- **Train（約 20%）**：挑少量清楚案例做 few-shot
- **Validation（約 40%）**：迭代調 judge prompt，提升 TPR/TNR
- **Test（約 40%）**：最後一次驗收，避免 overfit

## 下一步建議

文章最後強調：flywheel 不只跑一次。

要把它變成工程常態，可做兩件事：
- 把 graders 接進 CI/CD
- 監控線上資料，持續發現新失敗模式

同時，實務上還會碰到更難題目（例如如何評估多輪對話、RAG、agentic system），需要持續深化 eval 策略。

<div class="sep">· · ·</div>

## 可直接套用的實作骨架

如果你要落地到團隊流程，可先用這版：

1. 每週固定抽樣失敗案例（至少 50 筆）
2. 做 open coding（失敗描述）
3. 做 axial coding（高層分類）
4. 依分類建立/更新 grader
5. 先跑 baseline，再改 prompt
6. 每次改動都回跑 grader 並記錄分數
7. 若高頻問題仍高於門檻，繼續下一輪
8. 新模型或新功能上線前，先過同一套 grader gate

這樣你就有一套「可追蹤、可擴充、可交接」的 prompt 品質飛輪。