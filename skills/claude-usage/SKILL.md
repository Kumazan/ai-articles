---
name: claude-usage
description: 查詢 claude.ai 目前的用量（session / weekly），包含重置時間。
user-invocable: true
metadata: {"openclaw":{"emoji":"📊","requires":{"bins":["openclaw"]}}}
---

# claude-usage

用途：查詢 claude.ai 帳號的用量狀態。

## 執行方式

當 user 執行 `/claude_usage` 時，依序執行：

1. 確保 browser 在跑：`openclaw browser start`
2. 導航到設定頁：`openclaw browser navigate "https://claude.ai/settings/usage"`
3. 等待 3 秒
4. 用 browser 在頁面內呼叫 usage API：

```bash
openclaw browser evaluate --fn "() =>
  fetch('/api/organizations/2a787fc1-efab-4f58-a163-f39103fa29ac/usage')
    .then(r=>r.json())
    .then(d => {
      const fmt = (iso) => {
        if (!iso) return 'N/A';
        const dt = new Date(iso);
        return dt.toLocaleString('zh-TW', {timeZone:'Asia/Taipei', month:'numeric', day:'numeric', weekday:'short', hour:'2-digit', minute:'2-digit', hour12: false});
      };
      return JSON.stringify({
        session_pct: d.five_hour?.utilization,
        session_reset: fmt(d.five_hour?.resets_at),
        weekly_pct: d.seven_day?.utilization,
        weekly_reset: fmt(d.seven_day?.resets_at),
        sonnet_pct: d.seven_day_sonnet?.utilization,
        sonnet_reset: fmt(d.seven_day_sonnet?.resets_at),
      });
    })
"
```

5. 將結果整理成易讀格式回覆：

```
📊 Claude.ai Usage

⏱ Current session (5h)
  已用：{session_pct}%
  重置：{session_reset}

📅 Weekly（全模型）
  已用：{weekly_pct}%
  重置：{weekly_reset}

📅 Weekly（Sonnet）
  已用：{sonnet_pct}%
  重置：{sonnet_reset}
```

## 注意

- 此查詢不消耗 claude.ai usage，因為是在 browser profile 裡執行 fetch
- 若 browser 未登入 claude.ai，結果可能為空或錯誤
- Org ID `2a787fc1-efab-4f58-a163-f39103fa29ac` 是 Kuma 的 Max plan org
