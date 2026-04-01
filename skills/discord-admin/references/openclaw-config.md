# 建立 Channel 後的 OpenClaw Config 設定

建立新 Discord channel 後，Bot 不會自動回應訊息。**必須手動加到 `~/.openclaw/openclaw.json`** 並 restart gateway。

## 完整 JSON 路徑結構

```json
{
  "channels": {
    "discord": {
      "guilds": {
        "1385879900031942766": {
          "channels": {
            "<new_channel_id>": {
              "allow": true,
              "requireMention": false,
              "autoThread": true,
              "autoThreadName": "generated"
            }
          }
        }
      }
    }
  }
}
```

## 欄位說明

| 欄位 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `allow` | boolean | — | **必填**。`true` 才會讓 gateway 處理這個 channel，缺少此欄位則完全忽略 |
| `requireMention` | boolean | `false` | `false` = 所有訊息都觸發回應；`true` = 需要 @小蝦 才回應 |
| `autoThread` | boolean | `false` | `true` = 每條訊息自動建立 thread，保持頻道整潔 |
| `autoThreadName` | string | — | thread 名稱來源：`"generated"` = LLM 自動命名；省略 = 訊息第一行 |

## 常見設定組合

### 普通頻道（需 @mention）
```json
{
  "allow": true,
  "requireMention": true
}
```

### 專用頻道（直接回應，自動 thread）
```json
{
  "allow": true,
  "requireMention": false,
  "autoThread": true,
  "autoThreadName": "generated"
}
```

### 只讀取不回應（如 log 頻道）
不加 config 或設 `"allow": false`

## 重啟 Gateway

```bash
openclaw gateway restart
```
