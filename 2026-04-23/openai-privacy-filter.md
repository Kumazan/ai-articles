---
title: "OpenAI 發布 Privacy Filter：可本機執行的 PII 偵測與遮罩模型"
description: "OpenAI 推出可在本機執行的 Privacy Filter，專門偵測並遮罩個資與秘密資訊，讓訓練、索引、日誌與審查流程更容易內建隱私防護。"
date: 2026-04-23
author: OpenAI
layout: post
permalink: /2026-04-23/openai-privacy-filter.html
image: /2026-04-23/og-openai-privacy-filter.png
---

<div class="hero-badge">AI News · 2026-04-23</div>

![](/ai-articles/2026-04-23/og-openai-privacy-filter.png)

**原文連結：** [Introducing OpenAI Privacy Filter](https://openai.com/index/introducing-openai-privacy-filter/)

## 摘要

- OpenAI 開源了一個新的隱私模型 Privacy Filter，目標是偵測並遮罩文字中的個人識別資訊（PII）。
- 這個模型可在本機執行，讓資料在送出裝置前就先完成遮罩，降低外洩風險。
- 官方強調它不只靠規則比對，而是結合語言理解與隱私專用標籤系統。
- 模型支援最長 128,000 tokens，總參數 15 億，啟用參數 5,000 萬。
- 在 PII-Masking-300k 基準上，F1 可達 96%；校正標註問題後可到 97.43%。
- 它能辨識八類資訊，包括私人姓名、地址、email、電話、網址、日期、帳號與 secret。
- OpenAI 將它定位為 privacy-by-design 的一塊拼圖，不是合規認證或萬能匿名化工具。

<div class="sep">· · ·</div>

OpenAI 今天釋出 OpenAI Privacy Filter，這是一個開放權重模型，用來偵測並遮罩文字中的個人識別資訊（PII）。這次發布也屬於 OpenAI 更大的方向：提供開發者更實用的基礎設施，讓大家在安全前提下建立 AI 應用，包括能強化隱私與資安防護的工具與模型。

Privacy Filter 是一個小型模型，但在個資偵測上有前沿等級的能力。它適合高吞吐量的隱私工作流，能以具脈絡感知的方式處理非結構化文字中的 PII。它也可以在本機執行，因此個資能在離開裝置前就先被遮罩或移除，降低暴露風險。因為它能有效處理長輸入，所以能在單次掃描中快速完成遮罩決策。

OpenAI 表示，他們自己也在隱私保護流程中使用這個模型的微調版本。之所以開發 Privacy Filter，是因為他們認為，憑藉最新 AI 能力，隱私保護的標準可以比市面上現有做法再往上拉一級。這次釋出的版本在 PII-Masking-300k 基準上達到最佳表現；若把評測中發現的標註問題修正後，表現更進一步。

開放這個模型後，開發者可以在自己的環境中執行 Privacy Filter，針對特定情境微調，並把更強的隱私防護內建到訓練、索引、日誌與審查流程裡。

現代 AI 系統的隱私保護，靠的遠不只是 pattern matching。傳統的 PII 偵測工具通常依賴固定規則，例如電話號碼或 email 格式。這類方法在狹窄案例上有用，但常常會漏掉更細微的個資，也很難處理上下文。

Privacy Filter 則加入更深層的語言與脈絡理解，因此在更複雜的情境下表現更好。它把強大的語言理解能力，結合專為隱私設計的標註系統，能從非結構化文字中找出更廣泛的 PII，甚至包含需要看上下文才能判斷的案例。它也能更清楚區分哪些資訊因為屬於公開內容而應被保留，哪些資訊因為牽涉私人個體而應被遮罩或移除。

結果就是：這是一個有足夠能力支撐前沿級隱私過濾的模型。同時它又夠小，可以在本地運行——也就是說，尚未過濾的資料可以留在裝置上，不必先送到伺服器做去識別化處理，風險更低。

Privacy Filter 是一個雙向 token-classification 模型，搭配 span decoding。它從一個自回歸預訓練 checkpoint 出發，再轉成一個針對固定隱私標籤分類法的 token classifier。它不是逐 token 生成文字，而是一次對整段輸入打標，再用 constrained Viterbi procedure 解出連續片段。

這個架構帶來幾個對實務很有用的特性：

- 快且有效：所有 token 都在單次 forward pass 中標註。
- 脈絡感知：語言先驗能讓系統根據前後文判斷 PII span。
- 長上下文：釋出模型支援最多 128,000 tokens。
- 可調整：開發者可依工作流在 recall 與 precision 之間調整 operating point。

這個釋出的模型總參數為 1.5B，其中 5,000 萬參數會在推論時啟用。

Privacy Filter 會在八類資訊上預測 span：

- private_person
- private_address
- private_email
- private_phone
- private_url
- private_date
- account_number
- secret

其中 account_number 類別可遮罩多種帳號資訊，包括信用卡號與銀行帳號；secret 則可遮罩密碼與 API key 之類的內容。

這些標籤會用 BIOES span tags 解碼，讓遮罩邊界更乾淨、更完整。

OpenAI 是分幾個階段開發 Privacy Filter 的。第一步是建立一套隱私 taxonomy，定義模型應該辨識的 span 類型，包括個人識別、聯絡資訊、地址、私人日期、多種帳號資訊，以及像 API keys 和密碼這類 secret。

第二步是把一個預訓練語言模型改造成雙向 token classifier：把 language modeling head 換成 token-classification head，然後用監督式分類目標進行後訓練。

第三步則使用公開資料與合成資料的混合訓練集，讓模型同時學到真實語境與棘手的隱私模式。對於部分標註不完整的公開資料，團隊用模型輔助標註與人工審查補強覆蓋率，也加入合成範例以增加格式、情境與隱私子類型的多樣性。

在推論時，模型的 token-level 預測會透過 constrained sequence decoding 解出連續 span。這樣既保留了預訓練模型對語言的廣泛理解，也能把能力專門收斂到隱私偵測。

OpenAI 用標準基準與額外的合成／對話式評測來檢驗 Privacy Filter，特別測試更困難、也更依賴上下文的案例。

在 [PII-Masking-300k](https://huggingface.co/datasets/ai4privacy/pii-masking-300k) 基準上，Privacy Filter 的 F1 為 96%（precision 94.04%，recall 98.04%）。在修正過資料集標註問題的版本上，F1 提升到 97.43%（precision 96.79%，recall 98.08%）。

他們也發現這個模型能被有效微調。只要少量資料，針對特定領域的準確率就能快速提升，F1 從 54% 拉到 96%，而且在他們測試的 domain-adaptation 基準上接近飽和。

除了 benchmark 成績，Privacy Filter 也被設計成能處理真實世界裡雜訊很多的文字，包括長文件、含糊指涉、混合格式字串，以及和軟體相關的 secret。其 [model card](https://cdn.openai.com/pdf/c66281ed-b638-456a-8ce1-97e9f5264a90/OpenAI-Privacy-Filter-Model-Card.pdf) 也提到：它特別測試了 codebase 裡的 secret detection，以及多語、對抗式與依賴上下文的壓力測試。

OpenAI 也提醒，Privacy Filter 不是匿名化工具、不是合規認證，也不是高風險情境下的 policy review 替代品。它只是更大的 privacy-by-design 系統中的一個元件。

它的行為反映的是訓練時使用的標籤分類與決策邊界。不同組織可能需要不同的偵測或遮罩政策，而那些政策可能還需要領域內評估或進一步微調。模型在不同語言、不同腳本、不同命名慣例，以及與訓練分布不同的領域上，表現也可能有所差異。

和所有模型一樣，Privacy Filter 也會犯錯。它可能漏掉少見的識別資訊，或在上下文不足、特別是短序列時，對私人實體過度或不足遮罩。在法律、醫療、金融這類高敏感領域，人工審查與領域專屬評估／微調仍然很重要。

OpenAI 表示，發布 Privacy Filter 的目的，是希望整個生態系的隱私防護能更強。

這個模型今天已經以 Apache 2.0 授權釋出，可在 [Hugging Face](https://huggingface.co/openai/privacy-filter) 和 [Github](https://github.com/openai/privacy-filter) 取得。它適合實驗、客製化與商業部署，也能針對不同資料分布與隱私政策進一步微調。

除了模型本身，OpenAI 也同步提供文件，涵蓋模型架構、標籤 taxonomy、解碼控制、預期用途、評估方式與已知限制，讓團隊能理解模型擅長什麼、又該在哪裡小心使用。

AI 系統的隱私保護，是研究、產品設計、評估與部署之間持續往返的工作。

Privacy Filter 代表了一條重要方向：針對真實 AI 系統裡那些狹義但關鍵的任務，打造小而高效、但能力前沿的模型。之所以釋出它，是因為隱私保護基礎設施應該更容易被檢視、執行、調整與改進。

模型應該學會世界，而不是學會私人個體。Privacy Filter 正是在幫忙把這件事做對。

這次先釋出的是 preview 版本，OpenAI 希望能收到研究與隱私社群的回饋，持續改進模型表現。

<div class="sep">· · ·</div>

## 延伸評論：把隱私檢測做成獨立模型，比把規則塞進管線更像正解

這篇最值得注意的不是「有一個新模型」，而是 OpenAI 明確把 PII 偵測從雜亂的規則系統，拉成一個可獨立部署、可微調、可評估的元件。這比較接近真正的基礎設施，而不是功能點綴。

對實際團隊來說，這種設計很有吸引力：訓練、索引、日誌、審查這幾條管線都會碰到敏感資料，只靠 regex 通常撐不住。可本機執行、可調 precision/recall、又能針對不同 domain 微調，才比較符合真實場景。

但它也把責任說得很清楚：模型不是合規保證書。真正麻煩的地方，往往不是能不能抓到 email，而是上下文裡哪些名字、日期、帳號在不同語境下應不應該被視為 private。這種邊界問題，最後還是要靠資料治理與人工審查收尾。