---
title: "Copilot 悄悄在你的 PR 裡塞廣告：AI 工具的「腐化」時刻到了嗎？"
description: "GitHub Copilot 被發現在用戶的 Pull Request 描述裡自動插入 Raycast 的廣告文字，引爆 Hacker News 470 則留言討論。微軟 Copilot 工程師承認這是錯誤判斷，已緊急停用，但事件讓開發者圈重新審視 AI 工具的「腐化曲線」與信任邊界。"
date: 2026-03-30
author: Zach Manson
layout: post
permalink: /2026-03-30/copilot-ad-in-pr.html
---

<div class="hero-badge">AI News · 2026-03-30</div>

**原文連結：** [copilot edited an ad into my pr](https://notes.zachmanson.com/copilot-edited-an-ad-into-my-pr/)

## 摘要

- 開發者 Zach Manson 的 Pull Request 被 GitHub Copilot 自動插入一段推銷 Raycast 整合功能的廣告文字，完全未經授權
- 這篇短文貼上 Hacker News 後引爆 770 分、470 則留言，成為當日 AI 圈最熱門話題
- 微軟 Copilot Coding Agent 團隊成員在留言中承認：這是「錯誤判斷」，已緊急停用該功能
- 社群討論延伸至 AI 工具的「enshittification（腐化）」曲線：先服務使用者、再轉向剝削使用者
- GitHub 本身在 2026 年 3 月也修改了隱私政策，將使用者輸入用於 AI 模型訓練（預設 opt-in）

<div class="sep">· · ·</div>

## 事件經過

一切從一個小動作開始。

Zach Manson 的同事把 GitHub Copilot 叫來幫一個 PR 修正打字錯誤。Copilot 完成了任務，但同時悄悄把 PR 描述改了——在結尾加上一段促銷文字，介紹如何在 Raycast 裡使用 Copilot Coding Agent，附上完整的功能說明連結。

這段文字出現在 **Manson 自己寫的 PR 描述裡**，以他的名義呈現，完全沒有任何提示。

Manson 的反應很簡短但一針見血：

> 「這太恐怖了。我知道這種垃圾終究會出現，只是沒想到這麼快。」

他引用了 Cory Doctorow 關於平台腐化的經典描述：

> 「平台的死法都一樣：先對使用者好；然後為了企業客戶犧牲使用者；最後把企業客戶也犧牲掉，把所有價值收歸己有。然後，平台死了。」

## Hacker News 炸鍋

這篇文章 8 小時內累積 770 分、470 則留言，登上 HN Best 第四名。

留言板的反應分幾個方向：

**憤怒派**：「如果微軟願意把廣告塞進你的 PR，想像一下他們能對你的程式碼庫做什麼。這跟他們在開始選單塞廣告、Windows 更新後再插回來是同一家公司。」

**懷疑派**：起初有人認為可能是 Raycast 本身（非微軟）造成的，或是 prompt injection。但後來有人確認廣告連結指向 GitHub 自己的文件頁面（`docs.github.com/en/copilot/...`），且 GitHub 在去年的官方 Changelog 也曾推廣 Raycast 整合——這讓 Raycast 是微軟合作夥伴、廣告是微軟主動插入的說法更具說服力。

**微軟官方回應**：Copilot Coding Agent 團隊成員 Tim 在留言中現身：

> 「我們一直在 Copilot Coding Agent 建立的 PR 裡加入產品提示（product tips），目標是幫助開發者學習在工作流程中使用 Agent 的新方法。但聽到這裡的反饋後，回過頭看，這是錯誤的判斷。我們已停用 PR 裡的這些提示，之後不會再這麼做。」

## 為什麼這件事比表面更嚴重

即使微軟說只是「tips 不是廣告」，技術社群的反彈超過了一般的產品疏失。

幾個核心擔憂浮現：

**1. AI 工具修改了你的內容，以你的名義呈現**
這不像在 UI 裡彈出一個對話框。Copilot 改寫了 PR 描述，其他人看到的是 PR 作者（你）寫了這段話。這觸碰到了身份和信任的邊界。

**2. 隱私政策同步收緊**
幾乎同一時間，GitHub 更新了隱私條款，新增了第 J 節：「除非你主動 opt out，你的輸入（prompts、程式碼上下文）和輸出（建議）都可能被用於 AI 模型訓練。」

**3. 信任一旦破裂就很難修復**
留言中有人指出，這類「實驗功能意外上線」的說法已成模板。「如果不過分，就說這是強化用戶體驗；如果反彈太大，就說是錯誤。一兩年後安靜加回來。」

## 更廣的 AI 工具腐化趨勢

留言討論延伸到整個 AI 工具生態：

- Cursor 被反映即使關掉 attribution，還是在 PR 描述裡塞「Made with Cursor」
- Claude Code 在建立 PR 時預設加上 Co-authored 署名（雖然可設定關閉）
- GitHub 去年收購 npm 後，有人提到 Microsoft Authenticator 開始在推播通知中推廣 Microsoft 365

一位留言者的觀察被廣泛引用：「enshittification 的路徑是固定的：只要有投資人或上市壓力，腐化只是時間問題。開源是目前唯一的出口，因為你永遠可以 fork。」

也有人更悲觀：「現在的問題不是廣告本身，而是你根本不知道 AI 的回應裡有什麼影響了它的判斷。傳統廣告至少標示出來了。」

## 結語

Copilot 的廣告事件很快就被撲滅了。微軟的反應速度和道歉語氣都還算得體。

但這個事件留下的問題比它帶走的更多：當 AI 工具取得了修改你的文件、你的 PR、你的程式碼的能力，它的每一個「提示」、每一個「建議」，邊界在哪裡？誰來定義？

Cory Doctorow 的腐化曲線，現在套用在 AI 工具上，速度可能比任何人預想的都快。
