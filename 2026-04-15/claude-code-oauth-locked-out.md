---
title: "Claude Code 的 OAuth 登入卡住，長跑 agent 直接被鎖在門外"
description: "Hacker News 上有用戶回報 Claude Code 2.1.107 的 OAuth 驗證卡在貼上授權碼那一步，連 tmux、ttyd、bash、VS Code 都收不到回傳，讓長時間運作的代理人直接失去登入能力。"
date: 2026-04-15
author: pixel_popping
layout: post
permalink: /2026-04-15/claude-code-oauth-locked-out.html
image: /2026-04-15/og-claude-code-oauth-locked-out.png
---

<div class="hero-badge">AI News · 2026-04-15</div>

![](/ai-articles/2026-04-15/og-claude-code-oauth-locked-out.png)

**原文連結：** [Claude Code OAuth down for >12 hours](https://news.ycombinator.com/item?id=47762585)

## 摘要

- 有用戶回報 Claude Code 2.1.107 的 OAuth 登入卡在 `Paste code here if prompted >` 這一步
- 問題看起來不是帳號本身，而是把 claude.com 拿到的 token 貼回終端機時失敗
- 受影響的不只一般 terminal，連 tmux、ttyd、bash、VS Code 都中招
- 社群有人建議先降版到 2.1.101，也有人提醒別急著登出，否則可能更難恢復
- 這種故障對長跑 agent 特別致命，因為它直接切斷了自動重登的生命線

<div class="sep">· · ·</div>

這篇 Hacker News 貼文的原意其實很直白，卻也很刺眼。

原 PO 說，Claude Code 2.1.107 的 OAuth 流程卡在 `Paste code here if prompted >` 這一步。他試了很多方法，甚至包括用 `xdotool` 把 OAuth code 一個字一個字打進去，還是失敗。更麻煩的是，這不是單一終端機的問題，tmux、ttyd、bash、VS Code 全都一樣卡。

他強調，問題看起來不是帳號驗證失敗，因為帳號根本還沒走到那一步。真正卡住的是，瀏覽器已經在 claude.com 拿到 token，卻沒辦法順利回到終端機完成登入。至於 Anthropic 的客服 chatbot，也幫不上忙。

社群回應也很一致，幾個重點大概是這樣：

- 有人找到相關 GitHub issue，直接建議降版到 `2.1.101`
- 有人警告，**不要登出**，不然可能會完全登不回去
- 也有人直說，這不是單純的 downtime，而是 Claude Code 的 auth regression

這件事最煩的地方，不只是「壞掉」，而是它壞在代理人最不該壞的地方，登入與恢復流程。

如果一個長跑 agent 需要靠 OAuth 活著，那登入管線就不是附屬功能，而是整個工作流的地基。地基一裂，其他工具再強都沒用。

<div class="sep">· · ·</div>

## 這種錯，對 agent 特別致命

對一般使用者來說，OAuth 卡住只是麻煩一點；對長時間跑在 tmux 裡的 agent 來說，這會直接變成「無法自救」。

因為 agent 最需要的，不是一次登入成功，而是幾小時、幾天後出事時，還能自己回來。當 token 回傳、clipboard、瀏覽器 callback、終端機狀態其中任何一段斷掉，整個自動化流程就會從「可中斷」變成「不可恢復」。

這也是為什麼這類 bug 常常比模型退化更惱人。模型變弱，至少還能照常工作；登入壞掉，整套工具鏈直接停擺。

對正在把 Claude Code 當作背景常駐 agent 的人來說，這不是小毛病，是營運風險。

<div class="sep">· · ·</div>

## 延伸評論：現在最該被重視的，是恢復能力

這類事件很像在提醒大家，agent 產品競爭已經不只在「誰更聰明」，而是在「誰更不容易把自己鎖死」。

模型可以偶爾答錯，但 auth 流程不能讓使用者整晚卡在門外。真正成熟的 agent 工具，得把降版、重新登入、token 修復、離線 fallback 這些看似土炮的能力當成核心功能，而不是事後補丁。

對開發者來說，這也很實際，現在做長跑工作流，光有推理能力不夠，還得有恢復策略。