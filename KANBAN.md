# KANBAN.md — 小蝦看板工作流程

## API Base
`http://localhost:3099/api/kanban`

## 欄位流程
💡 Backlog → 📋 待辦 → 🔨 進行中 → 👀 審查 → ✅ 完成 → 📦 封存

## 策略一：任務生命週期自動化

每次收到任務時，按照以下流程操作：

### 1. 建卡（收到任務時）
```bash
curl -s -X POST http://localhost:3099/api/kanban/cards \
  -H 'Content-Type: application/json' \
  -d '{"title":"...", "description":"...", "priority":"P0-P3", "labels":["..."], "columnId":"todo", "assignee":"小蝦"}'
```
- 明確任務 → `todo`
- 模糊想法 → `backlog`
- Priority 判斷：P0=緊急、P1=重要、P2=一般、P3=低優

### 2. 開工（開始做時）
```bash
curl -s -X POST http://localhost:3099/api/kanban/cards/{id}/move \
  -H 'Content-Type: application/json' -d '{"targetColumnId":"ongoing"}'
```

### 3. 留言（過程中記錄）
```bash
curl -s -X POST http://localhost:3099/api/kanban/cards/{id}/comments \
  -H 'Content-Type: application/json' -d '{"author":"小蝦", "text":"..."}'
```
記錄：做了什麼、改了哪些檔案、遇到什麼問題

### 4. 完成（做完時）
```bash
curl -s -X POST http://localhost:3099/api/kanban/cards/{id}/move \
  -H 'Content-Type: application/json' -d '{"targetColumnId":"done"}'
```
附留言總結成果

## 策略二：Heartbeat 看板巡邏

在 HEARTBEAT.md 加入看板巡邏項目：
- 掃「進行中」：超過 24h 沒更新的卡 → 提醒 Kuma 或自己處理
- 掃「待辦」：有沒有我能直接開工的
- 掃過期卡片 → 通知

## 策略三：對話意圖偵測

判斷規則：
- Kuma 提到「做一下」「研究」「加個」「改一下」「幫我」等 → 可能是任務
- 有明確動作 + 對象 → 建卡到 todo
- 模糊想法 → 建卡到 backlog
- 不確定時 → 問 Kuma「要建卡追蹤嗎？」

**不要過度建卡** — 閒聊、討論、問問題不需要建卡。
