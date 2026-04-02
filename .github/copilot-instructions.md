# Copilot Instructions

## 專案簡介

`ai-articles` 是 Kuma 的 AI 文章翻譯整理倉庫，將英文 AI 相關文章翻譯成**繁體中文**並發布到 GitHub Pages。

- **線上網站**：https://kumazan.github.io/ai-articles/
- **語言**：所有內容與翻譯使用**繁體中文（zh-tw）**，技術名詞保持英文

## 技術棧

- **Jekyll** — 靜態網站生成器（GitHub Pages 原生支援）
- **Theme**：`jekyll-theme-minimal`（在 `_config.yml` 設定）
- **自訂樣式**：`assets/css/style.scss`（覆蓋 theme 預設，定義設計系統）
- **共用元件**：`assets/css/components.css`（dropcap、data-grid、callout、timeline、checklist）
- **字型**：Noto Serif TC（標題）、Noto Sans TC（正文）、JetBrains Mono（code）
- **部署**：Push to `main` → GitHub Pages 自動建置（~30 秒）

## 內容結構

```
index.md                          # 首頁文章列表（新→舊排序）
YYYY-MM-DD/article-slug.md        # 文章本體（Markdown，使用 post layout）
YYYY-MM-DD/article-slug.html      # 部分文章為 HTML 特輯（獨立完整頁面）
YYYY-MM-DD/og-article-slug.png    # OG image（選填）
assets/css/style.scss             # 全域樣式
assets/css/components.css         # 共用元件
_config.yml                       # Jekyll 設定
_includes/head-custom.html        # 自訂 <head>（OG tags、字型、TOC JS）
assets/js/scale.fix.js            # 空檔（覆蓋 theme 有害的觸控縮放腳本，勿刪除）
```

## 文章 Frontmatter 規範

每篇 `.md` 文章**必須**包含以下 frontmatter：

```yaml
---
title: "文章標題（繁體中文）"
date: YYYY-MM-DD
author: 原作者名稱
description: "60-100 字繁中摘要，用於社群分享預覽（OG description）"
layout: post
permalink: /YYYY-MM-DD/article-slug.html
---
```

選填欄位：
- `image: /YYYY-MM-DD/og-article-slug.png`（OG image，供 `head-custom.html` 的 `page.image` 讀取）

## 文章 Body 結構（必須依序包含，缺一不可）

⚠️ **禁止在 body 寫 `# 標題`（H1）**：`post` layout 會從 frontmatter `title` 自動渲染頁面標題，再加 H1 會造成標題重複。

```markdown
<div class="hero-badge">AI News · YYYY-MM-DD</div>

**原文連結：** [標題或來源說明](URL)

## 摘要

- 重點 1
- 重點 2
- 重點 3（共 5-7 個 bullet points）

<div class="sep">· · ·</div>

完整翻譯正文（直接使用原文的 h2/h3，不需要「## 內文」標題）

<div class="sep">· · ·</div>

## 延伸評論標題（自訂）

評論段落（有具體觀點，禁止第一人稱和個人名稱）
```

## 設計系統（CSS 變數）

| 變數 | 值 | 用途 |
|------|----|------|
| `--bg` | `#FAF8F5` | 頁面背景（暖色紙質） |
| `--fg` | `#1a1a1a` | 主要文字 |
| `--accent` | `#c44b2b` | 強調色（赤陶紅） |
| `--accent-soft` | `#f3e0d8` | 強調色背景 |
| `--muted` | `#6b6560` | 次要文字 |
| `--faint` | `#c4bfb8` | 分隔線、淡色元素 |
| `--serif` | Noto Serif TC | 標題字型 |
| `--sans` | Noto Sans TC | 正文字型 |
| `--mono` | JetBrains Mono | code 字型 |

## 新增文章流程

1. 建立日期資料夾：`YYYY-MM-DD/`
2. 新增文章檔案：`YYYY-MM-DD/your-slug.md`
3. 填寫 frontmatter（6 個必填欄位）+ body（依上述結構）
4. 更新 `index.md`，在對應日期區段加入文章連結（新文章放最上面）
5. `git add . && git commit && git push`

## PR Review 檢查清單（對齊 ai-articles-reviewer 8 維度）

1. **數據完整性** — 原文中的數字、成本、時間、比例，翻譯中必須全數出現且一致
2. **未翻段落偵測** — 不得有整段英文保留未翻（程式碼、URL、專有名詞除外）
3. **專有名詞保留** — 技術術語、產品名、品牌名、人名一律不得意譯（如 `Playwright` 不可譯為「劇作家」）
4. **一般名詞誤譯** — 對照原文確認關鍵名詞翻譯正確
5. **翻譯品質** — 讀起來像中文母語者寫的文章，無機翻感、無過度被動語態
6. **延伸評論品質** — 有批判角度或具體洞察，非泛泛好評
7. **Frontmatter 格式** — 6 個必填欄位齊全（title / date / author / description / layout / permalink）
8. **Body 結構完整性** — hero-badge → 原文連結 → 摘要 → sep → 正文 → sep → 延伸評論，無 H1

## 不要做的事

- ❌ 不要在 body 寫 `# ` H1 標題（會造成標題重複）
- ❌ 不要加入 JavaScript 框架（純 Jekyll + Markdown）
- ❌ 不要修改 `_config.yml` 中的 theme 設定（除非明確討論）
- ❌ 不要刪除 `assets/js/scale.fix.js`（空檔，覆蓋 theme 有害腳本）
- ❌ 不要在 body 設 `overflow-y: scroll`（破壞 iOS Safari 原生捲動）
- ❌ 不要在 index.md 以外的位置維護文章索引
- ❌ 不要修改 `assets/css/style.scss` 中的 `--accent` 或字型定義（統一品牌設計）
