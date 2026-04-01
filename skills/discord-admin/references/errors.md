# Discord API 常見錯誤

| HTTP 狀態碼 | 錯誤訊息 | 原因 | 解法 |
|------------|---------|------|------|
| 400 Bad Request | `INVALID_FORM_BODY` | payload 格式錯誤（type 用字串而非數字等） | 確認 JSON encode 正確，`type` 必須是整數 |
| 401 Unauthorized | `401: Unauthorized` | Token 無效或過期 | 重新確認 `DISCORD_BOT_TOKEN` 環境變數或 openclaw.json 中的 token |
| 403 Forbidden | `Missing Permissions` | Bot 缺少 Manage Channels 等必要權限 | 確認 Bot 有 Administrator 或至少 Manage Channels 權限 |
| 403 Forbidden | `(空內容)` | 缺少 `User-Agent` header | 加上 `User-Agent: DiscordBot (https://openclaw.ai, 1.0)` |
| 404 Not Found | `Unknown Channel` | Channel ID 錯誤或頻道已刪除 | 重新執行 `--action list` 確認正確 ID |
| 404 Not Found | `Unknown Guild` | Guild ID 錯誤 | 確認使用 `1385879900031942766` |
| 429 Too Many Requests | `You are being rate limited` | 短時間內 API 請求過多 | 等待 `retry_after` 秒後重試 |

## 排查流程

1. 先確認 Token → `echo $DISCORD_BOT_TOKEN | head -c 20`
2. 確認 Bot 在 Server → Discord Server 設定 > 整合 > 機器人
3. 確認 Bot 有 Administrator 權限
4. 確認 User-Agent header 有帶
