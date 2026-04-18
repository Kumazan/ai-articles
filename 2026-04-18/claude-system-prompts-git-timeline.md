---
title: "Claude 系統提示詞做成 git 時間線"
description: "Simon Willison 把 Anthropic 公開的 Claude system prompts 歷史拆成 git 友善檔案，讓 git log、diff 與 blame 直接成為追蹤提示詞演進的入口。"
date: 2026-04-18
author: Simon Willison
layout: post
permalink: /2026-04-18/claude-system-prompts-git-timeline.html
image: /2026-04-18/og-claude-system-prompts-git-timeline.png
---

<div class="hero-badge">AI News · 2026-04-18</div>

![](/ai-articles/2026-04-18/og-claude-system-prompts-git-timeline.png)

**原文連結：** [Claude system prompts as a git timeline](https://simonwillison.net/2026/Apr/18/extract-system-prompts/)

## 摘要

- Simon Willison 介紹一個研究專案，把 Anthropic 公開的 Claude 系統提示詞歷史拆成 git 友善格式
- 這樣一來，`git log`、`git diff`、`git blame` 就能直接用來追蹤 prompt 演進
- 專案把每個 prompt revision、每個 model、每個 family，和 latest 版本分開管理
- 每個修訂都會用對應日期寫入 commit history，方便永久連結與版本比對
- 原本難以閱讀的一份 monolithic markdown，變成可查、可比、可審計的研究資料庫
- 對想研究 system prompt 如何演化的人，這種結構比單純看文件直覺得多

<div class="sep">· · ·</div>

這是一份 AI 生成的研究報告，裡面的文字與程式碼都由 LLM 產出。這個研究專案的核心想法很簡單，卻很漂亮：把 Anthropic 公開的 Claude system prompts 歷史，從一份難讀的單一 markdown，重新整理成一個 git 友善的資料集。

原始來源是 Anthropic 公開的系統提示詞文件，內容依模型分段，每個模型底下又有一個或多個帶日期的修訂版本。這個資料夾把它拆開，讓 git 本身變成主要介面，研究者可以直接靠 `git log`、`git diff`、`git blame` 追蹤每次變動。

專案還把資料拆成幾種視角：

- `claude-opus.md`，看 Opus 系列怎麼一路演進
- `claude-sonnet.md`，看 Sonnet 系列的變化
- `claude-haiku.md`，看 Haiku 系列的變化
- `latest-prompt.md`，看所有模型最新提示詞的總火力

它也把每個 prompt revision 變成獨立檔案，並用對應日期固定 commit，讓某一版提示詞可以被精準引用。對研究系統行為的人來說，這比一份長 Markdown 更像真的研究基礎設施。

目前這個資料集包含 14 個模型、3 個 family、26 次 prompt revision，以及 104 個 fake-date commits；最早的版本可追溯到 2024-07-12，最新到 2026-04-16。

<div class="sep">· · ·</div>

## 為什麼這種做法有意思？

這不只是把文件整理漂亮而已，而是把「讀提示詞」改造成「像看程式碼一樣看版本」。

對做 agent、prompt 審計、模型回溯的人來說，最有價值的不是文件有多長，而是能不能回答這幾個問題：

- 哪一次改動真的影響了模型行為
- 哪個模型家族的提示詞變化最大
- 某條規則是什麼時候加進去的
- 某個版本之間到底差了什麼

git 化之後，這些問題都能直接沿著歷史往回追。這種資料結構比漂亮摘要更重要，因為它讓研究變得可重現，也讓審計變得可操作。
