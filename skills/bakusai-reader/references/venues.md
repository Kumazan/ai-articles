# Bakusai Reader — 常用場所 URL

## 已知串直連

| 場所 | URL |
|------|-----|
| 池袋 JINYA（東京ハッテン場） | `https://bakusai.com/thr_res/acode=3/ctgid=149/bid=2716/tid={tid}` |
| 東京ハッテン場總覽 | `https://bakusai.com/thr_tl/acode=3/ctgid=149/bid=2716/` |
| JINYA 串列表 | `https://bakusai.com/sch_all/acode=3/word=池袋%20JINYA` |
| 24 会館新宿 | 搜尋 `24会館 新宿 爆サイ` 取得最新串號 |

## 搜尋場所串

```
https://bakusai.com/sch_all/acode=3/word={場所名}
```

範例：
```
https://bakusai.com/sch_all/acode=3/word=池袋%20JINYA
https://bakusai.com/sch_all/acode=3/word=新宿%2024会館
```

從搜尋結果取出 `tid=XXXXX` 即為串號，代入上方串列直連 URL。

## 取得最新串號流程

1. 用 `web_fetch` 抓搜尋頁
2. 從 HTML 找 `tid=XXXXX`（最新結果）
3. 組合串 URL：`https://bakusai.com/thr_res/acode=3/ctgid=149/bid=2716/tid=XXXXX`
