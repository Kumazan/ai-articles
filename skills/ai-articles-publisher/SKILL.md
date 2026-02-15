---
name: ai-articles-publisher
description: "Publish AI article translations to the ai-articles GitHub Pages repo. Use when the user provides an AI article or URL and asks to auto-translate to Traditional Chinese, summarize, and publish to the ai-articles repo (including updating the list and links)."
---

# AI Articles Publisher

目的：把使用者提供的 AI 文章（網址或全文）自動翻譯成繁體中文、生成摘要，並發佈到 `ai-articles` GitHub Pages 專案。

## 工作流程

1. **取得來源內容**
   - 使用者提供 URL → 用 `web_fetch` 抓全文（偏好 markdown）。
   - 使用者提供原文 → 直接使用原文內容。

2. **產出摘要 + 翻譯**
   - 先產出 5~7 行重點摘要（繁中）。
   - 將正文翻譯成繁體中文，保留原文段落結構。

3. **產生檔案路徑**
   - 路徑格式：`ai-articles/YYYY-MM-DD/<slug>.md`
   - slug 使用英文關鍵字（lowercase + hyphen）。

4. **寫入文章內容**
   - 依 `assets/post-template.md` 的格式輸出：
     - frontmatter（含 permalink）
     - 文章標題
     - 原文連結
     - 分隔線
     - 摘要
     - 正文翻譯

5. **更新索引**
   - `index.md` 中：
     - H2：文章列表
     - H3：日期
     - H4：條目（bullet + 連結）
   - 新文章依日期排序（新→舊）。

6. **提交與發佈**
   - `git add/commit/push` 到 `Kumazan/ai-articles`。

## 參考檔案

- Repo 路徑與格式規範：`references/repo.md`
- 文章模板：`assets/post-template.md`
