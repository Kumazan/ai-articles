---
name: ai-articles-daily
description: "每日自動搜尋 AI 熱門文章，挑選一篇翻譯發佈到 ai-articles repo。用於 cron job 自動觸發。"
---

# AI 文章每日自動翻譯

自動搜尋、挑選、翻譯並發佈一篇最值得看的 AI 熱門文章。

## 步驟

### 1. 讀取已翻文章清單（去重用）

讀取 `/Users/kumax/.openclaw/workspace/ai-articles/index.md`，記下所有已翻譯的文章標題和日期，用於後續去重。

### 2. 搜集候選文章

從以下來源搜集過去 24 小時內的 AI 相關文章：

**固定來源巡邏（依序搜尋）：**
1. Hacker News — 用 web search 搜尋 `site:news.ycombinator.com AI OR LLM OR GPT OR Claude`，找高分貼文
2. Anthropic Blog — 用 web fetch 檢查 `https://www.anthropic.com/news`
3. OpenAI Blog — 用 web fetch 檢查 `https://openai.com/blog`
4. Google DeepMind Blog — 用 web fetch 檢查 `https://deepmind.google/discover/blog/`
5. Simon Willison's blog — 用 web fetch 檢查 `https://simonwillison.net/`
6. Latent Space — 用 web search 搜尋 `site:latent.space` 最新文章

**補充搜尋：**
- 用 web search 搜尋 `AI LLM 最新突破 OR 發布 OR 開源` 過去 24 小時

### 3. 選文

從候選清單中挑選一篇：

**優先順序：**
1. **影響力** — HN 分數高、社群討論量大的優先
2. **新鮮度** — 24 小時內發布（基本門檻）
3. **去重** — 排除與 index.md 中已翻文章相同主題的內容

**品質門檻：**
- 如果所有候選文章都是低品質（純公告、無實質內容、已翻過類似主題），則跳過本時段
- 跳過時不發送任何通知，安靜結束

### 4. 翻譯發佈

選定文章後，按照 `ai-articles-publisher` skill 的完整流程執行：

1. 用 `web_fetch` 抓取原文全文
2. 翻譯成繁體中文 + 產出 5~7 行摘要
3. 建立檔案 `ai-articles/YYYY-MM-DD/<slug>.md`，格式依 `workspace/skills/ai-articles-publisher/assets/post-template.md`
   - frontmatter 必須包含 `description` 欄位（50-80 字繁中，用於 Discord 預覽）
   - **文章必須有完整三段結構，缺一不可：**
     1. `## 摘要`（5-7 個 bullet points）
     2. `<div class="sep">· · ·</div>` 分隔線
     3. 完整翻譯（不需額外標題，保留原文 h2/h3）
     4. `<div class="sep">· · ·</div>` 分隔線
     5. `## {延伸評論標題}`（自訂標題，寫觀點分析，禁止第一人稱和個人名稱）
4. 更新 `ai-articles/index.md`（新文章加在對應日期下，新→舊排序）
5. `git add && git commit && git push` 到 `Kumazan/ai-articles`

### 5. 發送通知

翻譯發佈完成後，用 message tool 發送通知到雙頻道：

**Telegram：**
- target: `1085354433`（Kuma DM）

**Discord：**
- channel: `1487491685238833354`（#digest-摘要）

**Discord 通知格式（最高優先，所有 cron 必須一致）：**
```
📰 **{文章標題}**

・{摘要 1}
・{摘要 2}
・{摘要 3}
（必要時可到 4-5 點，但維持精煉）

🔗 {GitHub Pages 連結}
📎 原文：{原文連結}
```

**硬規則：**
- 標題一律用 `📰 **{文章標題}**`
- **禁止** 再寫 `AI 文章翻譯：`
- 摘要用條列點，不要整段散文
- 連結行固定為 `🔗` 與 `📎 原文：`
- Discord 不要把 Kuma 視角直接接在同一則主文後面

GitHub Pages 連結格式：`https://kumazan.github.io/ai-articles/YYYY-MM-DD/slug.html`
