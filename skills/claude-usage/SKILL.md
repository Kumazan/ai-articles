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
  - **注意**：此 Org ID 是寫死的。若組織變更（例如換帳號或加入其他 org），需手動更新。
  - 取得方式：登入 claude.ai，進入 Settings 頁面，從瀏覽器網址列的 URL 中擷取 `/organizations/{ORG_ID}/` 部分，或在 Settings > Usage 頁面開啟 DevTools (Network tab) 觀察 API 請求中的 org ID。

## 疑難排解

| 狀況 | 可能原因與解法 |
|------|----------------|
| `openclaw browser start` 失敗 | browser 未安裝或程序已佔用。確認 `openclaw` 已正確安裝，並檢查是否有其他 browser instance 正在執行。 |
| API 回傳 401 / 403 | 登入已過期。在 browser 中手動重新登入 claude.ai 後再試。 |
| API 回傳 404 或空結果 | Org ID 可能已變更，或 claude.ai 的 API 端點路徑已更新。檢查 Network tab 確認最新的 usage API 路徑與 Org ID。 |
| 回傳值全部為 `null` / `undefined` | API 回應結構可能已改變（例如欄位名稱從 `five_hour` 變為其他）。用 DevTools 檢查實際回應 JSON 並對照 evaluate 中的欄位名稱。 |
| 頁面載入過慢導致 fetch 失敗 | 增加步驟 3 的等待秒數，或在 evaluate 中加入重試邏輯。 |
