# 🦐 Kanban App — Telegram Mini App

任務看板，作為 Telegram Mini App 運行。支援多看板、卡片管理、留言、拖拉排序、手機 carousel 瀏覽。

## Features

- **多看板切換**：主看板、曼谷旅行、Polymarket Bot 等
- **卡片管理**：建立、編輯、移動、刪除、優先級、標籤、到期日、指派
- **Kanban 欄位**：💡 Backlog → 📋 待辦 → 🔨 進行中 → 👀 審查 → ✅ 完成 → 📦 封存
- **留言系統**：每張卡片支援留言串與系統活動記錄
- **手機優化**：
  - 長按快速操作（移動欄位、編輯、刪除）
  - 下拉關閉 Modal
  - 左右滑動 carousel 瀏覽卡片（CSS scroll-snap）
  - Telegram Mini App 手勢整合（`disableVerticalSwipes`）
- **桌面支援**：拖拉排序（dnd-kit）、鍵盤快捷鍵、Undo/Redo
- **搜尋 & 篩選**：依關鍵字、優先級、標籤、指派人篩選
- **Dashboard**：卡片統計總覽
- **API 驅動**：RESTful API，支援外部自動化整合（OpenClaw Kanban automation）

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Drag & Drop**: dnd-kit
- **Markdown**: react-markdown
- **Data**: JSON file storage (per-board)

## Getting Started

```bash
npm install
npm run dev -- -p 3099
```

Open http://localhost:3099 (or via Telegram Mini App).

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/boards` | List all boards |
| POST | `/api/boards` | Create a board |
| GET | `/api/kanban?boardId=` | Get board data |
| PUT | `/api/kanban?boardId=` | Update board data |
| POST | `/api/kanban/cards?boardId=` | Create a card |
| PATCH | `/api/kanban/cards/[id]?boardId=` | Update a card |
| DELETE | `/api/kanban/cards/[id]?boardId=` | Delete a card |
| POST | `/api/kanban/cards/[id]/move` | Move card to column |
| POST | `/api/kanban/cards/[id]/comments` | Add comment |

## Data Structure

```
boards/
  main/kanban.json
  bangkok/kanban.json
  polymarket/kanban.json
boards.json          # Board registry
```

## License

Private project.
