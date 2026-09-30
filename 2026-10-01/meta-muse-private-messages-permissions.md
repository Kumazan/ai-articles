---
title: "Meta 否認 Muse 未經授權讀取使用者私人訊息"
description: "一名記者指出 Meta 的 Muse AI 助理在未開啟完整磁碟取用權限時讀到了私人訊息；Meta 否認此事可能發生，並說明其權限設計。"
date: 2026-10-01
author: Sarah Perez
layout: post
permalink: /2026-10-01/meta-muse-private-messages-permissions.html
---

<div class="hero-badge">AI News · 2026-10-01</div>

**原文連結：** [Meta disputes claim that Muse read a user’s private messages without permission](https://techcrunch.com/2026/09/30/meta-disputes-claim-that-muse-read-a-users-private-messages-without-permission/)

## 摘要

- Meta 否認 Muse AI 助理未經授權讀取私人訊息，並表示 Mac 版 Muse 的訊息整合功能必須由使用者主動開啟。
- 《Inc.》專欄作家 Jason Aten 指稱，Muse 在 macOS「完整磁碟取用」關閉時仍讀取了他的訊息；他認為內容可能是透過裝置通知傳給 AI 助理。
- Meta 超級智慧實驗室主管 David Singleton 表示，啟用訊息存取須經過應用程式與 macOS 的多重權限步驟，且即使應用程式有錯誤也無法繞過系統保護。
- Meta 認為 Aten 描述的情況不可能發生，並稱 Muse 對事件的解釋有誤；雙方對實際發生什麼事仍各執一詞。
- 另一名使用者也稱 Muse 在處理 Facebook Marketplace 任務時外洩了住址。這類事件凸顯，消費者是否信任 AI 助理，將影響產品能否被廣泛採用。

<div class="sep">· · ·</div>

Meta 正反駁一名記者的說法。該記者指稱，Meta 的 AI 助理 Muse 未經許可讀取了他的私人訊息。《Inc.》專欄作家 Jason Aten 先前報導了這起事件；Meta 傳播副總裁 Andy Stone 隨後在 X 上回應，明確表示公司不認為產品曾在未取得使用者同意的情況下讀取訊息。

Stone 回應該報導時在 X 上寫道：「Muse Mac App 的訊息整合功能完全採選擇加入制。你必須同時啟用『完整磁碟取用權限』和『訊息連接器』，Muse 才能讀取你的訊息內容。除非你這麼做，否則它無法讀取訊息。」

儘管 Meta 否認，許多人仍懷疑公司是否說了實話。

這並不令人意外。多年來，這家科技巨頭處理消費者資料的方式屢遭批評，也因此面臨訴訟、遭聯邦貿易委員會（FTC）裁罰，以及其他罰款。例如就在幾天前，新墨西哥州一個陪審團裁定，Meta 在資料處理方式上誤導了使用者；該案源自 2018 年 Cambridge Analytica 資料外洩事件。

使用者是否信任 Muse，將是 Meta 能否在消費型 AI 市場勝出的關鍵。Muse 應用程式目前表現不錯，仍位居 App Store 排名第一；但若類似報導持續出現，不論內容是否屬實，Meta 的聲譽都可能難以挽回。公司至少應直接聯繫該名記者，釐清事情可能如何發生，而不是只否認事件。

Meta 超級智慧實驗室主管 David Singleton 在 Threads 上先行回覆 Aten，接著才有 Stone 代表 Meta 發表正式聲明。Singleton 表示，若要讓 Muse 在 Mac 上讀取訊息，使用者必須完成「三個不同步驟，包括應用程式層級權限與 macOS 內建的系統保護」；即使 Muse 應用程式本身有錯誤，也「無法繞過」這些保護。

這些步驟包括明確授予 Muse「完整磁碟取用權限」，之後使用者還能選擇 Muse 對「訊息」App 的存取等級，例如「無」、「唯讀」或「讀取」。若未啟用「完整磁碟取用權限」，這些選項就會呈現灰色、無法選取。

此外，授予「完整磁碟取用權限」時，系統會開啟 macOS「系統設定」介面，使用者必須再次手動確認自己確實要執行這項操作。Singleton 寫道，完成這個動作後 Muse App 會完整重新啟動，因此使用者不太可能在毫無察覺的情況下意外完成授權。

然而，Aten 的報導聲稱 Muse 讀取訊息時，「完整磁碟取用權限」其實是關閉的。他也表示，詢問 Muse 為何發生此事時，AI 回答說正在同步他的「裝置通知」。Aten 因此認為，Muse 可能把 Mac 上收到的訊息通知橫幅文字傳給了 AI 助理。

Singleton 也否認這種說法，表示 AI 當時搞錯了，給出的解釋並不正確。他接著引用 Meta 關於 Muse 安全架構與漏洞獎勵計畫的說明頁面。

簡言之，Meta 的回應基本上是：Aten 描述的事情並未發生，而且在技術上不可能發生。

這並非 Muse 首度被指控越界，恐怕也不會是最後一次。另一名使用者、YouTuber Matt Robb 最近表示，Muse 在協助他於 Facebook Marketplace 販售物品時處理不當，導致他的住址被分享出去，甚至有買家趁他不在家時找上門。根據 Singleton 在 Threads 上的回覆，Meta 似乎認為至少這起事件可能確實是產品的問題，並表示正在調查。

<div class="sep">· · ·</div>

## AI 助理能否被信任，取決於權限是否清楚且可驗證

這起爭議目前仍是使用者陳述與公司說明互相矛盾，文章沒有提供足以獨立確認訊息究竟如何被讀取的技術證據。Meta 列出多重 macOS 權限，可以說明產品預期的存取流程；但當使用者回報的實際經驗與設計說明不一致時，只說「技術上不可能」還不足以消除疑慮。

對 AI 助理而言，權限不只是安裝時的一次性勾選，而是信任邊界的一部分。產品應讓使用者看得懂每個連接器能讀取什麼、何時正在存取資料，以及如何撤銷授權；開發者也應留下可稽核的存取紀錄，並在權限狀態不明時採取拒絕存取，而不是交由模型猜測或事後編造原因。當助理能代替使用者跨 App 行動，權限範圍、資料流向與錯誤處理都必須可驗證，否則功能越方便，越可能放大使用者不敢交付的風險。
