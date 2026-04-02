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
4. **多樣性** — 同一天內不得選同一事件/主題的多篇文章。即使角度不同（事件報導 vs 深度分析 vs 評論），同一核心事件當天只取一篇。檢查 index.md 中**當天日期下已有的文章**，若核心事件重疊則跳過

**品質門檻（硬性規則，不得妥協）：**

1. **每日上限 1 篇**（cron 模式）。若 Kuma 手動要求多篇，最多 2 篇且必須主題不同
2. **來源必須有具名作者和 byline**。單則 Twitter/X 推文、匿名留言板貼文、無法辨識作者的內容農場：直接排除
3. **AI 必須是主題本身**。「AI 工具被供應鏈攻擊」→ 這是資安文章；「AI 供應鏈安全的系統性問題」→ 這才是 AI 文章
4. **受眾廣度測試**：問自己「10,000 個 AI 從業者中，超過 1,000 人會覺得這篇值得讀嗎？」若答案是否，跳過
5. 如果所有候選文章都不符合上述門檻，**安靜跳過，不發任何通知**

### 4. 翻譯發佈

以選定文章的 URL 執行 `ai-articles-publisher` skill（包含翻譯、發佈、校稿的完整流程）。
所有翻譯格式規範由 publisher 統一維護，此處不重複。

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
