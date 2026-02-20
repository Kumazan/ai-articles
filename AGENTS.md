# AGENTS.md

這份文件給在此 repo 工作的 AI/自動化 agent 使用。

## 目標

將 AI 相關文章整理成繁體中文版本，維持一致格式並可直接發佈到 GitHub Pages。

## 必遵守格式

每篇文章請對齊既有風格：

1. 使用 YAML frontmatter：`title` / `date` / `author` / `layout: post` / `permalink`
2. Frontmatter 後加 hero badge，例如：
   - `<div class="hero-badge">OpenAI Cookbook · 2026-02-19</div>`
3. 主標題使用 `#`
4. 保留原文連結區塊，優先用「短文字 + 超連結」，避免裸露超長網址：
   - `**原文連結：** [OpenAI Cookbook（文章名）](https://...)`
5. 使用分隔線：`<div class="sep">· · ·</div>`
6. 文章放在對應日期資料夾：`YYYY-MM-DD/slug.md`

## 新增文章 SOP

1. 先讀 `index.md` 與最近 1-2 篇文章，確認語氣與格式。
2. 建立日期資料夾（若不存在）。
3. 新增文章 markdown 檔，檔名採英文 slug。
4. 更新 `index.md`：
   - 若該日期不存在，先新增 `### YYYY-MM-DD`
   - 用既有格式新增條目：
     - `#### ・ [文章標題](./YYYY-MM-DD/slug.html)`
5. 本地自檢：
   - 連結是否正確（`.html` 路徑）
   - frontmatter 日期與資料夾一致
   - 標題、hero-badge、原文連結、分隔線是否齊全
6. 提交變更並推送：
   - commit 訊息清楚描述新增內容

## 內容原則

- 使用繁體中文（zh-TW）
- 可讀性優先，不逐字硬翻
- 專有名詞必要時保留英文（首次可中英並列）
- 不杜撰原文沒有的數據或結論

## 備註

- Pages 網址： https://kumazan.github.io/ai-articles/
- 若未來改用自訂網域，請同步更新 README.md 與本檔。
