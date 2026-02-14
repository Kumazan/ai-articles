# Heartbeat checklist
- Quick scan: anything urgent in inboxes?
- If it's daytime, do a lightweight check-in if nothing else is pending.
- If a task is blocked, write down _what is missing_ and ask me next time.
- During daytime (09:00–23:00 Taipei): remind Kuma to drink water & get up to stretch/walk/go to the bathroom 🚶‍♂️💧

## 看板巡邏（每次心跳都掃）
- GET http://localhost:3099/api/kanban 掃一輪
- 「進行中」卡片超過 24h 沒更新 → 提醒 Kuma 或自己處理
- 「待辦」有小蝦能直接做的 → 自動開工
- 過期卡片（dueDate < today）→ 通知 Kuma

## Weather Oracle & Paper Trading 巡邏
- GET http://localhost:9100/api/weather 檢查天氣預言機狀態
- 確認 bot 程序還活著：`ps aux | grep polymarket-bot-v0-ts | grep -v grep`
- 確認 dashboard 還活著：`ps aux | grep uvicorn | grep 9100`
- 確認 cloudflared tunnel 還活著：`ps aux | grep "cloudflared tunnel run" | grep -v grep`
- Paper Trading 摘要：回報持倉數、現金、總價值、勝率
- 如果 bot 掛了 → 自動重啟並通知 Kuma
- 如果有新的結算（settled positions）→ 回報結果（城市、勝/敗、P&L）
- 如果 forecast shift ≥2° 被偵測到 → 特別提醒
