# Heartbeat checklist
- Quick scan: anything urgent in inboxes?
- If it's daytime, do a lightweight check-in if nothing else is pending.
- If a task is blocked, write down _what is missing_ and ask me next time.
- During daytime (09:00–23:00 Taipei): health reminder **at most once every 2 hours**; if already reminded within 2h, skip.
- If a reminder was sent recently, avoid repeating similar wording; only ping when there's new urgency.

## 📧 信箱巡邏（每次心跳，需 gws auth 完成後啟用）
- `gws gmail users threads list --params '{"userId":"me","q":"is:unread","maxResults":100}'`
- 有未讀且重要的（特定寄件者 or 標題含「urgent」「緊急」「invoice」「付款」）→ 通知 Kuma
- 普通未讀 → 不用通知，記錄到 heartbeat-state.json 的 lastEmailCheck

## 📅 行事曆提醒（每次心跳，需 gws auth 完成後啟用）
- `gws calendar events list --params '{"calendarId":"primary","timeMin":"<now>","timeMax":"<now+2d>","singleEvents":true,"orderBy":"startTime"}'`
- 未來 2 小時內有事件 → 提醒 Kuma（含時間、地點、標題）
- 未來 24h 有重要事件（會議、航班、訂位）→ 摘要通知

## 📋 GitHub Issues 巡邏（每次心跳都掃）
- 掃 allowlist repos 的 open issues：`gh issue list -R Kumazan/<repo> --state open`
- 標記 `todo` 且小蝦能直接做的 → 自動開工
- 超過 7 天沒更新的 open issue → comment 提醒或通知 Kuma
- 完成的 issue → `gh issue close` + comment 總結

## 📰 新聞/資訊即時掃描（每 2-3 次心跳掃一次，用 heartbeat-state.json 追蹤）
- 用 web_search 搜尋 Kuma 關注的主題：OpenClaw、AI agents、台股重大新聞
- 只在有**真正重要或有趣**的內容時才通知（不要每次都推）
- 記錄上次掃描時間到 heartbeat-state.json，間隔 < 1.5h 就跳過

## 🧠 記憶整理（每 3 天一次，用 heartbeat-state.json 追蹤）
- 檢查 heartbeat-state.json 的 lastMemoryReview，距今 < 3 天就跳過
- 讀近 3 天的 `memory/YYYY-MM-DD.md` 日記
- 找出值得長期保留的：重要決定、教訓、新偏好、專案進展
- 更新 MEMORY.md（新增有價值的、刪除過時的）
- 更新 heartbeat-state.json 的 lastMemoryReview 時間戳
- 這個動作不用通知 Kuma，靜靜做就好
