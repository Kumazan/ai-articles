# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Jekyll 靜態站，用 GitHub Pages 部署，把英文 AI 文章翻譯成繁體中文發佈。Theme: `jekyll-theme-minimal`。

## Build & Deploy

沒有本地 build 流程。Push 到 `main` 後 GitHub Pages 自動部署（~30 秒）。

```bash
# 確認部署狀態
gh api repos/Kumazan/ai-articles/pages/builds/latest --jq '.status'
```

## Architecture

```
_config.yml              # Jekyll config (theme: jekyll-theme-minimal)
_includes/head-custom.html  # 自訂 <head>：字型、TOC 生成 JS、footer 搬移 JS
assets/css/style.scss    # 主樣式（覆蓋 theme 預設）
assets/css/components.css # 共用元件（dropcap、data-grid、callout、timeline、checklist）
assets/js/scale.fix.js   # 空檔，覆蓋 theme 有害的觸控縮放腳本（勿刪除）
index.md                 # 首頁文章列表
YYYY-MM-DD/*.md          # 文章（每天一個資料夾）
```

兩種文章格式：**Markdown**（一般文章，使用 `post` layout）和 **HTML**（特輯，獨立完整頁面如 `2026-03-13/`）。

## 文章格式

Frontmatter 必要欄位：

```yaml
---
title: "文章標題"
date: 2026-03-29
author: 原作者名
description: "60-100 字繁中摘要，用於社群分享預覽（OG description）"
layout: post
permalink: /2026-03-29/slug.html
---
```

文章結構（按順序）：
1. `<div class="hero-badge">AI News · 2026-03-29</div>`
2. `**原文連結：** [標題](URL)`
3. `## 摘要` + bullet points
4. `<div class="sep">· · ·</div>`
5. 正文（直接用原文的 h2/h3）

規則：
- `post` layout 會從 frontmatter `title` 自動渲染 H1，**文章內不要再寫 `# 標題`**
- 原文連結用 markdown link，不放裸 URL
- 分隔線放在摘要和正文之間
- 不需要 `## 內文（繁中翻譯）` 標題
- 更新 `index.md` 時新文章放最上面（新→舊排序）

## iOS Mobile 注意事項

這些是踩過坑後的硬規則：

- **`assets/js/scale.fix.js` 必須保留為空檔** — theme 原版會在每次 touchstart 動態允許 zoom，破壞 iOS 滾動
- **body 不可設 `overflow-y: scroll`** — iOS Safari 會把 body 當 scroll container，失去原生捲動。水平裁切用 `overflow-x: clip`（不建立 scroll container）
- **`touch-action: manipulation` 必須套在 `html`** — 全域消除 double-tap-to-zoom 延遲

## Git

- `gh pr create` 必須加 `--reviewer @copilot`

## Language

所有溝通使用**繁體中文**，技術名詞保持英文。
