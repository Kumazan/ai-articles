---
name: bakusai-reader
description: 抓取爆サイ（bakusai.com）討論串留言，翻譯成繁體中文並整理輸出。適合用於日本同志發展場 / 三溫暖串的情報查詢。使用時機：用戶貼上爆サイ URL 並要求翻譯留言時。
---

# Bakusai Reader

## 使用流程

**Step 1：取得串 URL**
- 使用者直接提供 → 直接進入 Step 2
- 不知道串號 → 用搜尋 URL 找（見 `references/venues.md`）
  ```
  web_fetch https://bakusai.com/sch_all/acode=3/word={場所名}
  ```
  從結果取出 `tid=XXXXX`，組合串 URL

**Step 2：抓取內容**
- 有 `fetch_thread.py` → 執行腳本（見 `scripts/fetch_thread.md`）
- 無腳本 → 直接 `web_fetch` 串 URL（限非會員可見的前 2 頁）

**Step 3：翻譯輸出**
- 使用者要「整理近期風向」→ 使用**風向總結格式**（見 `references/output-template.md`）
- 使用者要「逐則翻譯」→ 格式：`#XXX [日期]\n（翻譯）`
- 遇到發展場黑話 → 查 `references/terms.md` 意譯

## 輸出模式

| 模式 | 使用時機 |
|------|---------|
| 風向總結 | 想知道 vibe、值不值得去、整體印象 |
| 逐則翻譯 | 使用者提供特定帖號或需要原文 |

## References

- `references/output-template.md` — 輸出格式 + 寫作原則 + 一句話總結例子
- `references/terms.md` — 發展場術語 + 爆サイ黑話
- `references/venues.md` — 常用場所 URL + 搜尋方式
- `references/technical-notes.md` — 會員牆 / 分頁邏輯 / gzip 說明
- `scripts/fetch_thread.md` — fetch_thread.py 使用方式與範例
