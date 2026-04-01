---
name: discord-admin
description: 用 Discord API 管理 Server：建立/移動/刪除 channel、更新 topic、列出 categories、管理 roles 權限。觸發關鍵字：建立頻道、移動頻道、discord channel、discord server 管理、修改 topic、discord API。需要 Bot token 且 Bot 具備 Manage Channels 權限（Administrator 涵蓋）。
---

# Discord Admin Skill

## 重要注意事項

- **Token**：優先從環境變數 `DISCORD_BOT_TOKEN` 讀取；fallback 為 `~/.openclaw/openclaw.json` 的 `channels.discord.token`
- **Guild ID**：Kuma's server = `1385879900031942766`（詳見 `references/server-ids.md`）
- **API base**：`https://discord.com/api/v10`
- **必帶 User-Agent**：`DiscordBot (https://openclaw.ai, 1.0)`，缺少會回 403

## 常用操作

| 操作 | 指令（scripts/discord_api.py） |
|------|-------------------------------|
| 列出所有頻道 | `--action list` |
| 建立文字頻道 | `--action create --name <名稱> [--category-id <id>] [--topic <說明>]` |
| 移動頻道到分類 | `--action move --channel-id <id> --category-id <id>` |
| 更新名稱/Topic | `--action update --channel-id <id> [--name <新名稱>] [--topic <新說明>]` |
| 刪除頻道 | `--action delete --channel-id <id>` |

**範例：**
```bash
python3 skills/discord-admin/scripts/discord_api.py --action list
python3 skills/discord-admin/scripts/discord_api.py --action create --name 新頻道 --category-id 1487568952589815838
```

## 建立 Channel 後必做流程

1. 記錄新建 channel ID（從指令輸出取得）
2. 編輯 `~/.openclaw/openclaw.json`，在 `guilds.<guildId>.channels` 加入新 channel 設定
3. Config 欄位細節見 → `references/openclaw-config.md`
4. 執行 `openclaw gateway restart`

## References

- `references/channel-types.md` — Channel type 數字對照表
- `references/server-ids.md` — Kuma's server 所有 ID 快速參考
- `references/errors.md` — 常見錯誤與排查方法
- `references/openclaw-config.md` — openclaw.json 完整 config 範例與欄位說明
- `scripts/discord_api.py` — 可執行 CLI 腳本（list/create/move/update/delete）
