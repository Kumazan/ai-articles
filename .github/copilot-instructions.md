# Copilot Instructions

## 專案簡介

`ai-articles` 是 Kuma 的 AI 文章翻譯整理倉庫，將英文 AI 相關文章翻譯成**繁體中文**並發布到 GitHub Pages。

- **線上網站**：https://kumazan.github.io/ai-articles/
- **語言**：所有內容與翻譯使用**繁體中文（zh-tw）**

## 技術棧

- **Jekyll** — 靜態網站生成器（GitHub Pages 原生支援）
- **Theme**：`jekyll-theme-minimal`（在 `_config.yml` 設定）
- **自訂樣式**：`assets/css/style.scss`（覆蓋 theme 預設，定義設計系統）
- **字型**：Noto Serif TC（標題）、Noto Sans TC（正文）、JetBrains Mono（code）
- **部署**：Push to `main` → GitHub Pages 自動建置

## 內容結構

```
index.md                          # 首頁文章列表
YYYY-MM-DD/article-slug.md        # 文章本體（Markdown）
YYYY-MM-DD/article-slug.html      # 部分文章為 HTML（含自訂樣式）
assets/css/style.scss             # 全域樣式
_config.yml                       # Jekyll 設定
_includes/head-custom.html        # 自訂 <head>（字型、viewport fix）
```

## 文章 Frontmatter 規範

每篇 `.md` 文章必須包含以下 frontmatter：

```yaml
---
title: "文章標題（繁體中文）"
date: YYYY-MM-DD
layout: post
permalink: /YYYY-MM-DD/article-slug.html
---
```

選填欄位：
- `author: 原作者名稱`

## 文章格式慣例

文章正文依序包含：

1. **Hero badge**（分類標籤）：
   ```html
   <div class="hero-badge">AI News · YYYY-MM-DD</div>
   ```

2. **原文連結**：
   ```markdown
   **原文連結：** [標題或來源說明](URL)
   ```

3. **分隔線**：
   ```html
   <div class="sep">· · ·</div>
   ```

4. **正文內容**（摘要 + 段落）

## 設計系統（CSS 變數）

| 變數 | 值 | 用途 |
|------|----|------|
| `--bg` | `#FAF8F5` | 頁面背景 |
| `--fg` | `#1a1a1a` | 主要文字 |
| `--accent` | `#c44b2b` | 強調色（紅磚） |
| `--accent-soft` | `#f3e0d8` | 強調色背景 |
| `--serif` | Noto Serif TC | 標題字型 |
| `--sans` | Noto Sans TC | 正文字型 |
| `--mono` | JetBrains Mono | code 字型 |

## 新增文章流程

1. 建立日期資料夾：`YYYY-MM-DD/`
2. 新增文章檔案：`YYYY-MM-DD/your-slug.md`
3. 填寫 frontmatter + 正文（依上述格式）
4. 更新 `index.md`，在對應日期區段加入文章連結
5. `git add . && git commit && git push`

## PR Review 注意事項

- 確認 frontmatter 欄位完整（title / date / layout / permalink）
- 翻譯需忠實反映原文，不可捏造或誇大內容
- 不要洩露任何 API keys 或個人敏感資訊
- 不要修改 `assets/css/style.scss` 中的 `--accent` 或字型定義（統一品牌設計）
- 未經原作者授權，禁止轉載全文用於商業目的

## 不要做的事

- ❌ 不要加入 JavaScript 框架（純 Jekyll + Markdown）
- ❌ 不要修改 `_config.yml` 中的 theme 設定（除非明確討論）
- ❌ 不要刪除 `_includes/head-custom.html` 的 viewport JS fix（修復 iOS 縮放 bug）
- ❌ 不要在 index.md 以外的位置維護文章索引
