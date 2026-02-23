# Heartbeat checklist
- Quick scan: anything urgent in inboxes?
- If it's daytime, do a lightweight check-in if nothing else is pending.
- If a task is blocked, write down _what is missing_ and ask me next time.
- During daytime (09:00–23:00 Taipei): remind Kuma to drink water & get up to stretch/walk/go to the bathroom 🚶‍♂️💧

## 📧 信箱巡邏（每次心跳，需 gog auth 完成後啟用）
- `gog gmail list --unread --max 100`
- 有未讀且重要的（特定寄件者 or 標題含「urgent」「緊急」「invoice」「付款」）→ 通知 Kuma
- 普通未讀 → 不用通知，記錄到 heartbeat-state.json 的 lastEmailCheck

## 📅 行事曆提醒（每次心跳，需 gog auth 完成後啟用）
- `gog cal list --days 2`
- 未來 2 小時內有事件 → 提醒 Kuma（含時間、地點、標題）
- 未來 24h 有重要事件（會議、航班、訂位）→ 摘要通知

## 看板巡邏（每次心跳都掃）
- GET http://localhost:3099/api/kanban 掃一輪
- 「進行中」卡片超過 24h 沒更新 → 提醒 Kuma 或自己處理
- 「待辦」有小蝦能直接做的 → 自動開工
- 過期卡片（dueDate < today）→ 通知 Kuma

## 曼谷需求看板回覆巡邏（每次心跳都掃）
- 抓所有需求：`curl -s 'https://trip.kumax.dev/api/feature-requests?list=1'`
- 對每個需求抓留言：`curl -s 'https://trip.kumax.dev/api/feature-request-comments?requestId={id}'`
- 檢查是否有**未回覆的留言**（最後一則留言 author 不是「小蝦」且內容包含 `@小蝦` 或是問句）
- 如果有需要回覆的 → 用 `curl -X POST` 以 `author: "小蝦"` 回覆（不需 PIN）
- 回覆要有實質內容：查資料、給建議、回答問題，不要敷衍
- 如果留言不需要回覆（例如測試、純通知）→ 跳過

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
