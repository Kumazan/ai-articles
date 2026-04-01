# Chirp — 疑難排解

| 問題 | 原因 | 解決方式 |
|------|------|---------|
| `browser` 工具不可用 | Xvfb 未啟動 / DISPLAY 未設定 | 確認 `DISPLAY=:99`，重啟 Xvfb，重啟 OpenClaw Gateway |
| 無法登入 / 停在 login 頁面 | Session 過期或未登入 | 導航到 `https://x.com/login`，請使用者手動登入 |
| `button "Post"` 是 disabled | 輸入框可能是空的 | 先 click 輸入框，再 type，再 snapshot 確認 |
| Rate limit / 429 | 操作太頻繁 | 稍等 30–60 秒後重試 |
| snapshot ref 找不到 | 頁面未完全載入 | 再跑一次 snapshot，或先 `action=open` 重新載入 |
| 發文按鈕消失 | X UI 改版 | 換用 `https://x.com/compose/tweet` 直接打開發文視窗 |
| 圖片上傳失敗 | browser tool 暫不支援上傳 | 目前只能純文字推文 |
| 帳號被鎖定 | 短時間大量操作 | 通知使用者至 x.com 手動解鎖 |
