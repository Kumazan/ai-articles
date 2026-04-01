# Kuma's Discord Server 快速參考

## Guild

| 名稱 | ID | 類型 |
|------|-----|------|
| Kuma's Server | `1385879900031942766` | guild |

## Categories

| 名稱 | ID | 類型 |
|------|-----|------|
| 小蝦專區 🦐 | `1487568952589815838` | category |
| 文字頻道 | `1385879901227450521` | category |
| 語音頻道 | `1385879901227450525` | category |
| Private | `1397139247634579569` | category |

## 動態查詢最新 Channel 清單

```bash
python3 ~/.openclaw/workspace-shrimp-sonnet/skills/discord-admin/scripts/discord_api.py \
  --action list \
  --guild-id 1385879900031942766
```

詳細 channel ID（文字/語音/論壇等）請透過上方指令動態查詢，避免 ID 過時。
