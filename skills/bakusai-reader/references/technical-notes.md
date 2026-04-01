# Bakusai Reader — 技術說明

## 會員牆（MEMBERS_ONLY）

- 爆サイ內容直接內嵌在 HTML 的 `<span data-tipso='...'>` 屬性中，不需要 JS 渲染
- **非會員限制**：只能看前 ~50 篇（分 2 頁），第 3 頁起內容變為 `MEMBERS_ONLY`
- 若腳本輸出 `MEMBERS_ONLY`：需要會員登入
  - 解決方式：在瀏覽器登入 bakusai.com，取出 cookie，加入 fetch_thread.py 的 headers

---

## 分頁邏輯

| 參數 | 說明 |
|------|------|
| page 1（預設） | 最新 50 帖 |
| page 2, 3... | 往舊的方向 |
| `--from-start` | 從第 1 帖開始（chronological，由舊到新） |
| 自動開新串 | 滿 1000 帖自動開新串（須取得新 tid） |

---

## gzip 壓縮說明

- 爆サイ伺服器使用 **gzip 壓縮**回應
- Python `urllib` 不會自動解壓，必須手動處理
- `fetch_thread.py` 已用 `gzip.decompress()` 處理此問題

### 手動處理範例

```python
import urllib.request
import gzip

req = urllib.request.Request(url, headers={"Accept-Encoding": "gzip"})
response = urllib.request.urlopen(req)
if response.info().get("Content-Encoding") == "gzip":
    html = gzip.decompress(response.read()).decode("utf-8")
else:
    html = response.read().decode("utf-8")
```

---

## 資料擷取原理

爆サイ留言存放位置：
```html
<span data-tipso='{"content":"留言內容..."}' ...>
```

用 regex 或 BeautifulSoup 抓 `data-tipso` 屬性即可取得留言，無需執行 JavaScript。
