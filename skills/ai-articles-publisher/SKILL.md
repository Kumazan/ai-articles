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

   文章固定結構，順序不可變：

   ```
   ![](OG_IMAGE_PATH)            ← OG image 同時作為文章 header 圖（Step 8 完成後插入）

   ## 摘要                        ← 需要 ## 標題
   （5–7 個重點 bullet）

   <div class="sep">· · ·</div>

   完整翻譯                       ← 不需要額外標題，直接從正文段落開始

   <div class="sep">· · ·</div>

   ## 延伸評論標題（自訂）         ← 需要 ## 標題
   （評論段落）
   ```

   其他規則：
   - frontmatter 必含 `description`：一句話摘要（繁中，60-100 字），用於社群分享預覽與 SEO；絕對不可省略
   - frontmatter 可選加 `image`：OG image 路徑，**必須包含完整路徑前綴 `/ai-articles/`**，格式 `/ai-articles/YYYY-MM-DD/og-{slug}.png`，供 head-custom.html 的 `page.image` 讀取
   - frontmatter `author` 欄位填原文作者或來源名稱（如 `author: OpenAI Cookbook`）
   - 模板中的 `{{PLACEHOLDER}}` 語法僅作為欄位指引，實際文章直接填入，不需保留大括號語法
   - 檔案格式以 `.md` 為主
   - ⚠️ **禁止在 body 寫 `# 標題`（H1）**：Jekyll theme 已從 frontmatter `title` 自動渲染頁面標題，再加 H1 會造成標題重複出現兩次。body 從 `<div class="hero-badge">` 開始，接著是 `![](og-image)` header 圖（Step 8 完成後插入），然後 `**原文連結：**`，然後 `## 摘要`

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

7. **OG Image**（選擇性但建議）
   - 用 `image_generate` 呼叫 Gemini 生成 3 張圖
   - Prompt 模板（Editorial 風格，純插畫無文字）：
     ```
     Aspect ratio 1200x630 (wide landscape).
     Editorial magazine illustration.
     Warm cream paper background (#FAF8F5).
     [文章主題的 ink-style line art 描述] with terracotta red (#c44b2b) accent highlights.
     [視覺元素描述].
     Minimal, sophisticated, no 3D rendering.
     Muted warm tones with selective red accents only.
     No blue, no cyan, no neon, no glow effects, no lens flare, no light leaks.
     No text, no title, no words, no letters, no watermarks — pure illustration only.
     ```
   - 選最佳一張存為 `YYYY-MM-DD/og-{slug}.png`
   - 3 張備選存為 `og-{slug}-a.png / -b.png / -c.png`
   - 更新文章 frontmatter 加 `image: /YYYY-MM-DD/og-{slug}.png`
   - 在文章 body 的 hero-badge 後、原文連結前插入 `![](/ai-articles/YYYY-MM-DD/og-{slug}.png)`，同時作為文章 header 圖（路徑必須包含 `/ai-articles/` 前綴）
   - commit & push
   - **注意：image_generate 只能在主 session 跑，不能在 subagent 中呼叫**

8. **校稿（必須執行，不可跳過）**
   - OG image 插入並 push 後，**必須**直接在當前 session 內執行 `ai-articles-reviewer` skill 的校稿流程（不要 spawn subagent）。
   - 此時文章已包含 header 圖，reviewer 能完整檢查結構。
   - 這一步是品質閘門，即使時間緊迫也不可省略。
   - 若 reviewer 回報 FAIL → 根據問題清單修正後重新 commit & push。
   - 若 reviewer 回報 WARN → 評估是否需要修正，修正後重新 push。
   - 若 reviewer 回報全 PASS → 繼續下一步。

## 參考檔案

- Repo 路徑與格式規範：`references/repo.md`
- 文章模板：`assets/post-template.md`
