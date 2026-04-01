# Bird CLI vs Chirp 比較

| 功能 / 特性 | bird CLI | chirp (browser) |
|-------------|---------|-----------------|
| 安裝方式 | `brew install bird` | 只要 OpenClaw + Xvfb |
| 認證方式 | 抽取瀏覽器 cookies | 使用 `openclaw` browser profile session |
| 穩定性 | API 層，不受 UI 改版影響 | UI 改版可能導致 selector 失效 |
| 速度 | 快（~700 ms） | 較慢（~3000 ms） |
| 發文 | ✅ | ✅ |
| 回覆 | ✅ | ✅ |
| 搜尋 | ✅ | ✅ |
| 按讚 | ❌（不直接支援） | ✅ |
| 轉推 | ❌（不直接支援） | ✅ |
| 追蹤 / 取消追蹤 | ❌ | ✅ |
| 讀取 Timeline | ✅ | ✅ |
| 上傳圖片 | ✅ | ❌（目前不支援） |
| 無頭伺服器 | ✅（不需要 GUI） | 需要 Xvfb 虛擬顯示 |
| **建議使用場景** | 一般自動化、速度優先 | 無法安裝 bird 或需要 UI 互動操作 |
