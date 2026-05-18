---
title: "AI bug hunter 正在把 Linux security list 變成重複回報地獄"
description: "Linus Torvalds 指出，AI 找 bug 工具讓 Linux security mailing list 充滿重複回報；真正有價值的不是丟出報告，而是理解問題、補上 patch。"
date: 2026-05-19
author: Simon Sharwood
layout: post
permalink: /2026-05-19/linux-ai-bug-hunters-security-list.html
---

<div class="hero-badge">Simon Sharwood · 2026-05-18</div>

**原文連結：** [Linus Torvalds says AI-powered bug hunters have made Linux security mailing list ‘almost entirely unmanageable’](https://www.theregister.com/security/2026/05/18/linus-torvalds-says-ai-powered-bug-hunters-have-made-linux-security-mailing-list-almost-entirely-unmanageable/5241633)

## 摘要

- Linus Torvalds 表示，Linux security mailing list 因為大量 AI 輔助找 bug 的重複回報，已經變得「幾乎完全無法管理」。
- 問題不在於 AI 工具不能找漏洞，而是許多研究者用同樣工具找到同樣問題，卻各自把重複報告丟進私有清單，製造大量轉寄、查重與回覆成本。
- Torvalds 認為，AI 偵測到的 bug 通常不是祕密；如果只送出隨機報告、沒有理解脈絡，也沒有補上 patch，就是「drive-by」式貢獻。
- 他建議，若 bug 是 AI 工具找到的，回報者應該先讀文件、確認是否已修，並在 AI 結果之外增加真正價值。
- 這件事凸顯 AI security workflow 的核心問題：找出疑似問題越來越便宜，但維護者處理、驗證、分類與修補的成本沒有同步下降。
- 文章也對照 Greg Kroah-Hartman 先前的較樂觀看法：AI 的確逐漸能幫助 FOSS 社群，但前提是用法能降低維護負擔，而不是把負擔外包給維護者。

<div class="sep">· · ·</div>

多位研究者使用相同工具尋找相同 bug，正在製造「不必要的痛苦與無意義的工作」。

Linux kernel 負責人 Linus Torvalds 表示，因為多位研究者使用 AI 找 bug，接著把重複報告塞進清單，Linux 專案的 security mailing list 已經變得「幾乎完全無法管理」。

Torvalds 在每週 kernel 狀態更新中發布 Linux 7.1 的第四個 release candidate，並表示完整版本的進展「相當正常」。接著，他請 kernel 社群注意專案文件中一段「可能值得特別強調」的內容，因為「持續湧入的 AI 報告基本上讓 security list 幾乎完全無法管理；不同人用同樣工具找到同樣東西，造成巨量重複」。

Torvalds 抱怨，人們把時間都花在把報告轉寄給正確對象，或回覆「這個一週或一個月前已經修掉了」，再指向公開討論。

這位 Linux 領導者認為，這種來回全是「完全無意義的 churn」，而且沒有生產力，因為「AI 偵測到的 bug 幾乎按定義就不是祕密；把它們放在某個私有清單上處理，是浪費所有人的時間，而且只會讓重複情況更糟，因為回報者甚至看不到彼此的報告」。

接著，他也提出自己對「如何最好地用 AI 改善軟體安全」的看法。

Torvalds 寫道：「AI 工具很棒，但前提是它們真的有幫上忙，而不是造成不必要的痛苦與無意義的假裝工作。你可以使用它們，但要用在有生產力、能讓體驗變得更好的方式上。」

他又補了一句：「文件可能比我客氣一點，但核心意思就是這樣。」

「所以再講清楚一點：如果你用 AI 工具找到一個 bug，那很可能別人也找到了。如果你真的想增加價值，去讀文件、也做出 patch，然後在 AI 做到的事情之上補上真正價值。不要當那種 drive-by 的人，只丟一份隨機報告，卻對問題沒有真正理解。OK？」

Torvalds 的說法，和另一位 kernel maintainer Greg Kroah-Hartman 近期的評論形成對照。Kroah-Hartman 先前告訴 The Register，AI 對 FOSS 社群來說，已經逐漸變成越來越有用的工具。

<div class="sep">· · ·</div>

## 問題不是 AI 找到 bug，而是誰承擔驗證成本

這篇文章真正點出的，不是「AI security 工具沒用」，而是 AI 把系統瓶頸往後推了。當找出疑似 bug 的邊際成本下降，維護者要付出的查重、重現、脈絡判讀與修補成本反而會暴露得更明顯。

對開源專案來說，這是很實際的治理問題。過去一份漏洞回報通常帶著某種人類投入：研究者知道自己看了什麼、為什麼覺得可疑、和既有討論有何差異。AI 工具讓「疑似問題」更容易量產後，回報本身就不再稀缺；稀缺的是能把疑似問題變成可合併 patch 的人。

因此，AI security workflow 的好壞不該只用「找到多少可能漏洞」衡量，而要看它是否降低維護者負擔。更合理的標準包括：是否自動查重、是否連到已知修補、是否提供可重現測試、是否附上最小 patch、是否清楚標示信心與限制。沒有這些配套，AI 找 bug 只是在把雜訊包裝成貢獻。

這也是所有 agentic tooling 都會碰到的問題：產出變多不等於價值變多。真正好的 AI 工具，應該把成本從人類維護者身上拿走，而不是用更快的速度把未完成工作推到他們面前。
