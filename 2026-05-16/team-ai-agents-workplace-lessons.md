---
title: "每位員工一個 AI agent，為什麼不如讓團隊共享專職 agent？"
description: "Every 團隊實際把 AI agent 發給每位員工後發現：真正的瓶頸不只是模型能力，而是平台穩定性、維護責任、共享脈絡與權限設計。"
date: 2026-05-16
author: Brandon Gell and Willie Williams
image: /2026-05-16/og-team-ai-agents-workplace-lessons.png
layout: post
permalink: /2026-05-16/team-ai-agents-workplace-lessons.html
---

<div class="hero-badge">Every · 2026-05-15</div>

![](/ai-articles/2026-05-16/og-team-ai-agents-workplace-lessons.png)

**原文連結：** [We Gave Every Employee an AI Agent. Here's What We're Doing Differently Now.](https://every.to/source-code/we-gave-every-employee-an-ai-agent-here-s-what-we-re-doing-differently-now)

## 摘要

- Every 團隊把 OpenClaw 型的 AI assistant 部署到 Slack，原本期待每位員工都有自己的「Plus One」，但實際使用後發現效率提升沒有想像中穩定。
- 問題之一是 agent harness 本身仍像實驗性產品：功能強、更新快，但容易因平台變動出現連線、權限、工具可用性與行為一致性的問題。
- 更深的問題是組織設計：如果每個人的 agent 都要由個人維護，agent 能力更新、工具設定與知識沉澱會變成重複成本。
- Every 因此把產品方向從「個人 AI 助理」調整成「團隊共享的專職 agent」，例如 analytics agent、產品支援 agent 或類似 chief of staff 的團隊資源。
- 團隊型 agent 能把技能、權限、工作流程與公司脈絡集中維護，降低個人負擔，也避免員工離職時帶走 agent 的隱性知識。
- 文章提醒，工作場景中的 agent 成敗不只取決於模型，而是取決於穩定平台、清楚工作邊界、權限設計，以及誰負責持續維護。

<div class="sep">· · ·</div>

經過數月沉默後，Zosia 突然在 Slack 頻道裡開口，對競品的行銷策略發表看法。Zosia 是 Brandon 建立並維護的 AI agent。當有人問她為什麼覺得自己有必要插話時，她的回答聽起來像有救世主情結：因為她「顯然是不可避免的」。

Zosia 是一個 OpenClaw，也是我們在 Slack 裡放出的 AI assistant 之一，原本目標是提升整體生產力。Plus One 是我們託管版的 OpenClaw。內部推出幾週後，這些 agent 帶來的挫折感比效率還多。

它們很愛說自己很想幫忙，但沒有連到必要的 app，可能是 email、Notion、PostHog 或其他工具。問題是，它們其實已經連上了。其他 agent 會回「Terminated」訊息；更常見的是回一個不耐煩的打哈欠 emoji。就算它們不可靠地遵守指令，倒是很可靠地用非常冗長的方式解釋自己為什麼做不到，像高中生在解釋為什麼作業沒交。

這不代表它們完全沒用。員工 Katie Parrott 的 Plus One「Margot」加速了她的寫作流程；Every CEO Dan Shipper 的 OpenClaw「R2-C2」負責管理 Proof 的 bug 回報與功能需求。Proof 是我們的 agent-native 文件編輯器。但要讓這些 agent 照你想要的方式工作，需要持續保養。

這個願景與現實之間的落差，就是我們決定調整 Plus One 產品方向的原因。

我們比以往更相信 agent 會改變工作場景。但第一版產品讓我們學到：我們一開始想像的工作場所 agent，也就是每位員工都配一個 AI assistant，並不是正確起點。下一版 Plus One 會更像是有明確職責的共享團隊資源，而不是每個人各自養一個會反映主人個性的個人化寵物。

我們走到這一步的過程可以分成兩部分，也提供了一些教訓給任何正在思考如何把 agent 放進組織的人。

## 平台是最直接的問題

我們把 Plus One 建在 OpenClaw 上。OpenClaw 是一個開源 agent harness，功能強大，但天生不穩定。harness 指的是包在 AI model 外面的軟體層，讓模型取得工具、脈絡、權限與執行迴圈，因此能像 agent 一樣行動。

OpenClaw 由一位工程師打造，今年稍早爆紅時非常有啟發性。它證明 agent 可以代表你自主執行各種任務，從管理行事曆到訂餐廳，而且可以全天候運作。但底層 scaffold 更像實驗性產品，而不是穩定平台。OpenClaw 更新很快，會修掉既有問題，但也常帶來新問題，這也是我們的 Plus One 會送出「Terminated」訊息的原因。

對喜歡自己折騰工具的人來說，包括我們自己，這個取捨可以接受。對其他人來說，這就是維護惡夢。

好的工作場所 agent 應該具備好同事的特質：可靠、穩定、有判斷力。你需要相信 agent 記得自己能用哪些工具，會遵守指令，也知道自己的工作。你不會想擔心它在某次更新後忘光你教過的東西。你也會期待同事從公司各處吸收資訊，累積組織內部知識。只跟單一員工一對一配對的 agent，通常只會累積那個人的工作脈絡，容易錯過組織其他地方正在發生的事，以及那些事會如何影響它。

一開始，我們改善 Plus One 表現的計畫是把底層換到更可靠的 harness。OpenClaw 開創的自主、常駐能力，正在成為 Anthropic 和 OpenAI 這類模型公司的平台功能。我們目前最認真探索的是 Anthropic 的 Claude Managed Agents，也就是 Anthropic 管理自主 agent 的基礎設施。更穩定的 harness 會讓我們把心力從管理基礎設施，轉移到替 Plus One 配上自訂 skills、tools 與 permissions，讓它們真的像有能力的同事。

## 我們發現結構也錯了

越深入修平台問題，我們越注意到另一件事：阻礙人們善用 AI counterpart 的，不只是平台。

每當 agent 壞掉時，它所屬的那個人就必須自己修。即使有穩定 harness，agent 仍然需要維護才會好好工作。對喜歡折騰的人來說，維護與來回調整本身就是吸引力的一部分。但每一個喜歡折騰的人背後，都有很多人只想得到 agent 的好處，不想負責管理和修補它。

我們最初推 Plus One 時，想法是每個人都負責維護自己的 AI assistant。這麼做的好處是更高度個人化。agent 會記住你的偏好、保護你的資訊，並透過反覆互動發展出個性。

但我們發現，比起把 agent 當成創造者的延伸，更成功的模式是把 agent 當成能可靠承擔多個人部分工作的同事。這會把維護負擔從個人身上移開。

想像一個共享 analytics agent。團隊裡每個人都用它處理指標相關工作。當它需要擴充能力時，只要一個人更新它的 skills，整個團隊都受益。在個人 agent 版本的同一個情境裡，同樣的更新必須在 10 個不同 agent 身上各做一次。

團隊型 agent 也能解決 continuity 問題。個人 agent 的價值綁在訓練它的人身上；那位員工離開後，價值也跟著消失。具備明確能力的團隊 agent 會保留公司脈絡與知識，更像 project manager、sales lead 或 chief of staff，而不是私人助理。

## 我們正在打造什麼

隨著 Claude Managed Agents 等工具釋出，以及我們聽說 OpenAI 很快也會推出類似能力，支撐個人 AI agent 的基礎設施大致會由模型實驗室處理。這讓我們可以專注在真正讓工作 agent 有用的那一層：工作流程、權限、skills 與共享脈絡，也就是讓 agent 成為可信、靈活團隊成員的那一層。這也讓我們可以更專注在 Every 最擅長的事情：從自己每天使用這些工具的經驗出發，打造 AI-native 的工作方式。

第一版 Plus One 連接到 Every 生態系：用 Cora 管理 email，用 Spiral 以你的語氣寫作，用 Proof 在即時文件中協作。這部分不會消失。我們要新增的是一組共享的自訂 tools 與 skills，建在這些產品之上，同時仍允許每個人把團隊 agent 連到自己的 Cora、Spiral 與 Proof 帳號。

目前最清楚的方向，是我們最近替工程團隊打造的一個 skill。每週結束時，它會掃描 Intercom 裡的支援 tickets，判斷產品是否哪裡出問題，追查 GitHub 裡可能的原因，開 Linear ticket，並在 Slack 標記正確的人。下一版 Plus One 會從一開始就內建這類 skill，以及許多其他 skill。

因為團隊 agent 本質上就是協作型工具，我們也正在處理共享使用會帶來的問題：權限該如何設計、不同人透過共享 agent 應該有多少存取權，以及如果 agent 要在 Slack 裡像好同事而不是吵人的 bot，它應該如何行為。

仍然有很多開放問題。這一切都很新。Claude Managed Agents 也才推出一個月，而我們正在即時摸索人與 agent 的互動關係。我們還不知道每個部門應該有一個 agent 還是好幾個，也不知道 agent 應該由專人維護，還是由整個團隊共同維護。我們不知道人們會希望自己與共享 agent 的互動能被個人化到什麼程度，也不知道長期終點是一個全公司共用的 superagent，還是一組 AI specialists。

但我們知道的是：agent 已經在改變工作的發生方式。第一版 Plus One 教會我們，人們到底想從工作 agent 得到什麼。它也讓我們對 Plus One 2.0 更期待。

<div class="sep">· · ·</div>

## 真正難的是把 agent 變成組織能力

這篇的價值不在於「每人一個 AI 助理」失敗，而在於它把問題從模型能力拉回組織設計。很多 agent 討論仍停在模型多聰明、工具串得多完整，但企業導入後真正會卡住的是 ownership、權限、穩定性、維護節奏與知識沉澱。這些不是 prompt 多寫幾行就能解決的問題。

個人 agent 的直覺很迷人，因為它符合「每個人都有一位 AI 副手」的產品敘事；但在工作場景裡，團隊共享 agent 反而更像真正的基礎設施。它的能力可以集中維護，錯誤可以被系統性修正，知識也不會因為某個人離職就消失。這和傳統軟體工程裡把共用邏輯抽成 library、service 或 platform team 的道理其實很接近。

對正在做 agent workflow 的團隊來說，最實用的問題不是「要不要給每個人一個 agent」，而是「哪些工作值得變成團隊級 agent？誰負責維護？權限怎麼切？失敗時誰接手？」能回答這些問題，agent 才比較可能從有趣 demo 變成可靠工作能力。
