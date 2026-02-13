# Telegram 通知整合 Spec
- API route: POST `/api/kanban/notify`
- 接收 `{ cardTitle, status, dueDate, eventType }`
- 目前 console.log 骨架，預留 Telegram Bot API 整合
- 前端在卡片狀態變更時觸發 sendNotify()
