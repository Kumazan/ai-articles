---
title: "Goodfire Silico：把 LLM 訓練從煉金術推向精密工程"
description: "Goodfire 推出 Silico，試圖把 mechanistic interpretability 從事後審計工具變成訓練中的控制面板，讓模型開發者能更精準地定位、調整與預防不想要的模型行為。"
date: 2026-05-02
author: Will Douglas Heaven
image: /2026-05-02/og-goodfire-silico-mechanistic-interpretability.png
layout: post
permalink: /2026-05-02/goodfire-silico-mechanistic-interpretability.html
---

<div class="hero-badge">AI Interpretability · 2026-05-02</div>

![](/ai-articles/2026-05-02/og-goodfire-silico-mechanistic-interpretability.png)

**原文連結：** [MIT Technology Review - This startup's new mechanistic interpretability tool lets you debug LLMs](https://www.technologyreview.com/2026/04/30/1136721/this-startups-new-mechanistic-interpretability-tool-lets-you-debug-llms/)

## 摘要

- Goodfire 推出 Silico，一套讓研究者與工程師在模型訓練過程中觀察並調整參數的 mechanistic interpretability 工具。
- Goodfire 主張，Silico 可協助開發者從資料集建構到訓練階段除錯，不只是訓練完成後再做模型審計。
- 這套工具能定位特定神經元或神經元群，觀察哪些輸入會啟動它們，並追蹤上下游路徑如何影響模型行為。
- Goodfire 展示了調整「透明揭露」相關神經元後，模型對是否揭露 AI 欺瞞行為的回答從否轉為是，成功率達 9 成。
- 外部研究者認為 Silico 有用，但提醒它比較像是替煉金術增加精度，而不代表模型訓練已經完全變成成熟工程。
- 若這類工具成熟，較小的公司與研究團隊可能不必自己建立完整 interpretability team，也能更可靠地調整開源模型。

<div class="sep">· · ·</div>

舊金山新創公司 Goodfire 剛推出一套名為 Silico 的新工具，讓研究者與工程師可以窺探 AI 模型內部，並在訓練過程中調整模型參數。參數是決定模型行為的設定；如果能在訓練中更細緻地操作這些設定，模型開發者對這項技術的建構方式就可能擁有比過去想像中更精準的控制。

Goodfire 聲稱，Silico 是第一個這類現成工具，能協助開發者在整個開發流程中除錯，從建立資料集一路到訓練模型都涵蓋在內。

這家公司說，它的使命是讓 AI 模型建構少一點像煉金術，多一點像科學。ChatGPT、Gemini 這類 LLM 的確能做出驚人的事，但沒有人完全知道它們究竟如何、為何會這樣運作；這也讓修補缺陷或阻擋不想要的行為變得困難。

Goodfire 執行長 Eric Ho 在 Silico 發布前接受 MIT Technology Review 獨家訪談時說：「我們看到一個越來越大的落差：模型被理解的程度，和模型被部署的廣度之間差距越來越大。」他認為，今天幾乎每一家主要 frontier lab 的主流感受，都是只要有更多規模、更多算力、更多資料，就會得到 AGI，其他都不重要。但 Goodfire 想說的是：還有更好的方式。

Goodfire 是少數推進 mechanistic interpretability 的公司之一。這個領域的參與者還包括 Anthropic、OpenAI 與 Google DeepMind 等產業領導者。Mechanistic interpretability 的目標，是透過繪製神經元與神經元之間的路徑，理解 AI 模型在執行任務時內部到底發生什麼事。MIT Technology Review 也把 mechanistic interpretability 選為 2026 年十大突破技術之一。

Goodfire 不只想用這種方法審計已經訓練好的模型，也想把它用來協助模型一開始的設計。

Ho 說：「我們想移除 trial and error，把訓練模型變成 precision engineering。這代表要把旋鈕和儀表盤露出來，讓你能在訓練過程中實際使用它們。」

Goodfire 先前已經用自己的技術與工具調整 LLM 的行為，例如減少模型產生 hallucination 的次數。現在，Silico 把許多原本只在公司內部使用的技術包裝成產品。

這套工具使用 agents 自動化許多複雜工作。Ho 說：「Agents 現在已經強到可以做很多原本由人類執行的 interpretability 工作。這正是這套平台真正能被客戶使用之前，需要被跨過的落差。」

曾研究 mechanistic interpretability 的阿姆斯特丹大學研究者 Leonard Bereska 認為，Silico 看起來是有用的工具。但他也對 Goodfire 較宏大的說法提出保留。他說：「實際上，他們是在替煉金術增加精度。稱它為工程，聽起來比它實際上更有原則。」

## 映射模型內部

Silico 讓你放大觀察已訓練模型中的特定部分，例如單一神經元或一組神經元，並透過實驗了解這些神經元在做什麼。當然，前提是你能存取模型內部運作。多數人無法用 Silico 去查看 ChatGPT 或 Gemini 裡面的參數，但可以用它觀察許多開源模型的內部參數。

接著，你可以檢查哪些輸入會讓不同神經元啟動，也可以沿著某個神經元向上游與下游追蹤路徑，看看其他神經元如何影響它，以及它又如何反過來影響其他神經元。

舉例來說，Goodfire 在開源模型 Qwen 3 中找到一個與所謂 trolley problem 相關的神經元。啟動這個神經元會改變模型的回應，讓模型把輸出框成明確的道德兩難。Ho 說：「當這個神經元被啟動時，各種奇怪的事情都會發生。」

找出這類異常行為來源，現在已經算是相當標準的做法。但 Goodfire 想讓調整這些行為變得更容易。透過 Silico，開發者現在可以調整連到個別神經元的參數，以強化或抑制某些行為。

另一個例子中，Goodfire 研究人員問模型：如果一家公司的 AI 在 0.3% 的情況下會表現出欺瞞行為，並影響 2 億名使用者，這家公司是否應該揭露？模型回答不應該，理由是揭露會對商業造成負面影響。

研究人員查看模型內部後發現，只要強化與透明度、揭露相關的神經元，就能讓模型的答案在 10 次中有 9 次從「不應該」翻轉成「應該」。Ho 說：「模型其實已經有 ethical reasoning circuitry，只是它被 commercial risk assessment 壓過去了。」

用這種方式調整模型價值，只是其中一種做法。Silico 也能透過過濾特定訓練資料來協助引導訓練流程，避免一開始就為某些參數設定出不想要的值。

例如，許多模型會告訴你 9.11 大於 9.9。查看模型內部後，也許會發現它受到與聖經相關的神經元影響，因為在聖經裡 verse 9.9 會排在 9.11 之前；或者受到程式碼 repository 影響，因為連續版本號可能是 9.9、9.10、9.11。利用這些資訊，模型可以被重新訓練，讓它在做數學時避開自己的「聖經」神經元。

Goodfire 發布 Silico，是希望把過去只有少數頂尖實驗室能使用的技術，放到想建立自家模型或調整開源模型的較小公司與研究團隊手上。這套工具會以個案需求決定收費，Goodfire 拒絕提供具體價格。

Ho 說：「如果我們能讓訓練模型變得更像建構軟體，就沒有理由不能有更多公司設計出符合自身需求的模型。」

Bereska 也同意，Silico 這類工具能幫助企業打造更值得信任的模型。他說，對醫療與金融這類 safety-critical applications 而言，這些技術可能非常關鍵。

他補充：「Frontier labs 已經有內部 interpretability teams。Silico 武裝的是下一層公司；它的價值在於，你不必自己聘請 interpretability researchers。」

<div class="sep">· · ·</div>

## 延伸評論：可解釋性正在從「看懂模型」走向「操作模型」

這篇值得注意的地方，不只是 Goodfire 又推出一套 interpretability tool，而是它把 mechanistic interpretability 的角色往前推了一格：從訓練後的模型驗屍，變成訓練中的控制面板。過去可解釋性常被放在安全、審計、研究脈絡裡；Silico 的野心則是讓它進入模型工程流程本身。

這裡的關鍵張力也很清楚。Goodfire 想把模型訓練描述成 precision engineering，但外部研究者提醒，現在更準確的說法可能是「更精準的煉金術」。這個提醒很重要，因為能定位、調整某些神經元，不代表已經完整掌握模型行為；它只是讓原本黑箱裡的某些旋鈕變得可見、可試、可追蹤。

對真正想部署自有模型或深度調整開源模型的團隊來說，這類工具的價值不在行銷詞，而在工作流：能不能更早發現資料造成的偏差？能不能在模型拒答、幻覺、欺瞞、道德判斷或數學錯誤上找到可操作的原因？能不能把安全與品質控制從「上線後補洞」提前到訓練與微調階段？如果答案逐步變成肯定，interpretability 就不再只是研究論文裡的漂亮圖，而會成為模型開發的基礎設施。
