---
title: "OpenAI 的 Symphony：把 Linear 變成 coding agents 的控制平面"
description: "OpenAI 透過 Symphony 把 issue tracker 變成代理控制平面，讓每個開放任務自動分配 agent、持續執行、失敗重試，並在大規模 monorepo 裡把人從 context switching 中解放出來。"
date: 2026-04-27
author: "Alex Kotliarskyi, Victor Zhu, Zach Brock"
layout: post
permalink: /2026-04-27/openai-symphony-codex-orchestration.html
image: /2026-04-27/og-openai-symphony-codex-orchestration.png
---

<div class="hero-badge">AI News · 2026-04-27</div>

![](/ai-articles/2026-04-27/og-openai-symphony-codex-orchestration.png)

**原文連結：** [An open-source spec for Codex orchestration: Symphony.](https://openai.com/index/open-source-codex-orchestration-symphony/)

## 摘要

- OpenAI 把 Linear 之類的 issue tracker 直接當成 coding agent 的控制平面。
- 他們想解掉的不是模型速度，而是人類注意力與 context switching 的瓶頸。
- Symphony 讓每個 open task 自動對應到一個 agent workspace，持續跑到任務結束。
- 在部分團隊上，landed PR 數量三週內提升了 500%。
- PM 和設計師也能直接丟需求進來，agent 會回傳 review packet，甚至包含實機影片。
- 這套做法的代價，是人類中途微調少了，所以 guardrails、tests 和 workflow 設計變得更重要。
- 這篇最值得抄的不是某個技巧，而是：真正的難題在 orchestration，不在單一模型。

<div class="sep">· · ·</div>

OpenAI 這篇文章的起點很直接：他們先把整個 repo 變成「不能有人工寫的 code」的環境，再把 Codex 當成真正的 teammate。結果問題很快就不是「模型能不能做事」，而是「人到底能同時盯幾個 session」。

他們發現，一個工程師舒適的上限大概只有三到五個 sessions。再多就會開始忘記哪個 session 在做什麼、一直在 terminal 之間跳來跳去、還要手動把 agent 拉回正軌。換句話說，agent 很快，但人腦不是無限分頁。

<div class="sep">· · ·</div>

## 互動式 coding agents 的天花板

OpenAI 的判斷是：原本大家都在優化 session 與 merged PR，但這兩者其實只是手段，不是目的。真正的工作單位是 issue、task、ticket、milestone。

於是 Symphony 的想法就出現了：不要再把 agent 當成要人盯著的互動工具，而是讓它們直接從工作板上拉任務。只要有 open task，就應該有 agent 接手；如果 agent 掛掉或卡住，就重新啟動；如果新工作出現，就把它納入排程。

這裡最關鍵的轉變，是把「工作」從 session 與 PR 中解耦。某些 issue 會產生多個 PR，有些甚至只是研究或分析，不一定會碰到 codebase。當任務被抽象成 ticket，工作單位就不再是某次對話，而是可以被拆解、依賴、重試、排隊的流程。

<div class="sep">· · ·</div>

## 把 issue tracker 變成控制平面

Symphony 的設計很像一個寫成規格書的 supervisor：Linear 變成控制平面，每個 issue 都對應一個獨立 workspace，agent 會在裡面持續執行。

這樣做的效果有幾個：

- 任務可以自然地形成 DAG，先解 blocker，再跑被依賴的工作。
- agent 看到流程外的改進時，可以自己開新 issue。
- 當團隊在大 monorepo 裡跑長任務時，系統還能持續監看 CI、rebase、處理 conflict、重跑 flaky checks。
- PM 和設計師不需要先學會怎麼開一個 Codex session，只要描述需求，就能收到 review packet。

OpenAI 甚至提到，有工程師在 Wi‑Fi 很爛的山屋裡，直接用手機對 Linear 丟了三個重要變更。這種場景很能說明 Symphony 想解的問題：不是把 agent 做得更像聊天機器人，而是把它變成可遠端操作的工作系統。

<div class="sep">· · ·</div>

## 代價與限制

這種工作方式不是白送的。

當人類不再在每一步都能即時 micro-manage agent，很多中途修正的空間就消失了。OpenAI 的做法不是把結果手動補好，而是反過來補 workflow：加 guardrails、補技能、加測試、改善文件，讓下一次 agent 自己成功。

他們也承認，不是所有任務都適合 Symphony。某些問題還是需要工程師直接跟 interactive Codex session 一起做，尤其是高度模糊、需要判斷力的工作。只是 Symphony 會把大量 routine work 吃掉，讓人類把注意力留給真正難的題目。

另一個重要轉折是：最後他們不再把 agent 當成嚴格 state machine 裡的一個個節點，而是給它們 objectives。這點很關鍵，因為模型變強之後，框死它反而浪費能力。

<div class="sep">· · ·</div>

## 用 Symphony 來建 Symphony

這篇最有趣的地方，是 OpenAI 沒有把 Symphony 寫成一個炫目的大平台，而是把它定義成一份 `SPEC.md`。

那份規格大致涵蓋了幾件事：

- 問題陳述：長時間運作的 automation service，要持續讀 issue tracker、建立 workspace、啟動 agent。
- 目標與非目標：重點是排程、重試、reconciliation、可觀測性，不是做一個華麗 UI。
- 系統組成：workflow loader、config layer、issue tracker client、orchestrator、workspace manager、agent runner、logging。
- 工作流程契約：`WORKFLOW.md` 怎麼寫、怎麼解析、怎麼把 prompt 與 config 分開。
- orchestration：state machine、polling、retry/backoff、active run reconciliation。
- safety：workspace 隔離、hooks、secret handling、trust boundary。
- agent integration：怎麼啟動 coding agent、怎麼串流事件、怎麼處理 timeout 和 error。
- observability：structured logs、status surface、token accounting、human-readable summaries。

這份 spec 的意思其實很明白：真正難的不是「叫 agent 做一件事」，而是把整條鏈路設計成可長跑、可恢復、可觀測，而且不會把人拖進無止境的 context switching。

<div class="sep">· · ·</div>

## 給做 agent 系統的人一個提醒

Symphony 不是在炫耀「我們也能做 agent」。它在提醒一件更現實的事：當 agent 開始真的能做工作，瓶頸就會從模型能力轉移到 workflow 設計。

對實際在做 agent 的團隊來說，這篇最值得抄的不是某個 prompt，而是這個架構觀：

- 用 ticket 定義工作，而不是用聊天回合定義工作。
- 用狀態機管理長流程，而不是靠人手動盯著。
- 用 guardrails 與 tests 兜住失敗，而不是幻想 agent 不會失敗。
- 讓人類做判斷與審核，讓 agent 做大量重複勞動。

如果把這條線拉到底，Symphony 說穿了就是一句話：把 issue tracker 變成工作操作系統。