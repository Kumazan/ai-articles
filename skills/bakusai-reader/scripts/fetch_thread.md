# fetch_thread.py — 使用方式

## 說明

純 HTTP + regex 的爆サイ串抓取腳本，無需 Playwright。
位於 `bakusai-reader/scripts/fetch_thread.py`（若不存在請向使用者確認路徑）。

## 基本用法

```bash
# 最新一頁（預設，顯示最新 50 帖）
python3 fetch_thread.py "<url>"

# 第 2 頁（往舊）
python3 fetch_thread.py "<url>" 2

# 從頭開始（最舊到新）
python3 fetch_thread.py "<url>" 0 --from-start

# 輸出 Markdown 格式
OUTPUT=markdown python3 fetch_thread.py "<url>"
```

## 範例

```bash
# 抓 JINYA 最新一頁
python3 fetch_thread.py "https://bakusai.com/thr_res/acode=3/ctgid=149/bid=2716/tid=13202997"

# 抓第 2 頁（較舊的帖子）
python3 fetch_thread.py "https://bakusai.com/thr_res/acode=3/ctgid=149/bid=2716/tid=13202997" 2
```

## 輸出格式（JSON）

```json
{
  "title": "⛲池袋 JINYA ジンヤ 90 - ...",
  "tid": "13202997",
  "total_posts": 186,
  "view_count": "2676",
  "posts": [
    {"num": "137", "date": "2026/03/30 01:05", "content": ">>117\n正文..."},
    ...
  ],
  "error": null
}
```

## 注意事項

- 非會員只能抓前 2 頁（~50 帖），第 3 頁起出現 `MEMBERS_ONLY`
- 伺服器使用 gzip 壓縮，腳本已自動處理
- 詳細技術說明見 `references/technical-notes.md`
