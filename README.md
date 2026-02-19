# ai-articles

Kuma 的 AI 文章翻譯與整理倉庫（繁體中文）。

## 網站（GitHub Pages）

- https://kumazan.github.io/ai-articles/

## 內容結構

- `index.md`：首頁文章列表（依日期分區）
- `YYYY-MM-DD/*.md`：文章本體（每天一個資料夾）
- `assets/`：樣式與靜態資源
- `_config.yml`：Jekyll 設定

## 文章格式（摘要）

每篇文章需包含：

1. Frontmatter
2. Hero badge
3. 原文連結
4. 分隔線（`<div class="sep">· · ·</div>`）
5. 正文內容

範例 frontmatter：

```yaml
---
title: "文章標題"
date: 2026-02-19
layout: post
permalink: /2026-02-19/article-slug.html
---
```

## 新增文章流程

1. 建立日期資料夾：`YYYY-MM-DD/`
2. 新增文章：`YYYY-MM-DD/your-slug.md`
3. 依既有風格完成文章內容
4. 更新 `index.md`（新增該日期與文章連結）
5. `git add` / `git commit` / `git push`

## 授權

內容與翻譯權利屬原作者與 Kuma，請勿未經授權轉載商用。
