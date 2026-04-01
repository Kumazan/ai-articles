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

   文章固定三段結構，順序不可變：

   ```
   ## 摘要                        ← 需要 ## 標題
   （5–7 個重點 bullet）

   <div class="sep">· · ·</div>

   完整翻譯                       ← 不需要額外標題，直接從正文段落開始

   <div class="sep">· · ·</div>

   ## 延伸評論標題（自訂）         ← 需要 ## 標題
   （評論段落）
   ```

   其他規則：
   - frontmatter 必含 `description`：一句話摘要（繁中，50-80 字），用於 Discord 預覽卡片與 SEO；絕對不可省略
   - frontmatter `author` 欄位填原文作者或來源名稱（如 `author: OpenAI Cookbook`）
   - 模板中的 `{{PLACEHOLDER}}` 語法僅作為欄位指引，實際文章直接填入，不需保留大括號語法
   - 檔案格式以 `.md` 為主
   - ⚠️ **禁止在 body 寫 `# 標題`（H1）**：Jekyll theme 已從 frontmatter `title` 自動渲染頁面標題，再加 H1 會造成標題重複出現兩次。body 從 `<div class="hero-badge">` 開始，接著直接是 `**原文連結：**`，然後 `## 摘要`

   **延伸評論硬規則：**
   - 文章是公開發佈的，寫給所有讀者看
   - **禁止**第一人稱（「我覺得」、「我自己」）
   - **禁止**任何個人名稱（如 Kuma）
   - 使用通稱：「對開發者來說」、「真的在做 agent 的人」等

5. **更新索引**
   - `index.md` 中：
     - H2：文章列表
     - H3：日期
     - H4：條目（bullet + 連結）
   - 新文章依日期排序（新→舊）。

6. **提交與發佈**
   - `git add/commit/push` 到 `Kumazan/ai-articles`。
   - Git push 需要已設定好的認證方式（SSH key 或 GitHub token）。若 push 失敗，提示使用者確認 git remote 的認證設定。

## 參考檔案

- Repo 路徑與格式規範：`references/repo.md`
- 文章模板：`assets/post-template.md`
