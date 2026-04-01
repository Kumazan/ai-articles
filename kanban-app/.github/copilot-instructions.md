# Copilot Instructions

## 專案簡介

Next.js Kanban 看板應用程式，支援 Telegram Mini App 整合，使用 JSON 檔案作為後端儲存。

## 技術棧

- Next.js 15（App Router）
- React 19
- TypeScript 5（strict mode）
- Tailwind CSS v4
- @dnd-kit（拖放功能）
- Telegram Web App SDK（@twa-dev/sdk）
- JSON file backend（API Routes）

## 程式碼風格偏好

- 所有註解使用**繁體中文**
- TypeScript strict mode，避免 `any`
- 元件使用函式元件 + hooks
- 檔案命名使用 kebab-case（如 `kanban-board.tsx`）
- 優先使用 Server Components，僅在需要互動時使用 `'use client'`

## 重要的架構/檔案說明

- `app/` — Next.js App Router 頁面與 API routes
- `components/` — React 元件（kanban-board, kanban-card, card-modal 等）
- `lib/` — 工具函式（API client, kanban store, Telegram auth）
- `types/kanban.ts` — 所有 Kanban 相關型別定義
- `middleware.ts` — Next.js middleware（Telegram 認證）

## PR Review 注意事項

- 確認型別安全，不允許 `any` 型別
- 拖放相關變更需測試各種邊界情況
- Telegram Mini App 相關變更需在 Telegram 環境中測試
- 確認 JSON 資料讀寫的 race condition 處理

## 不要做的事

- ❌ 不要洩露 `.env.local` 中的 secrets
- ❌ 不要直接修改 JSON 資料檔案，應透過 API 操作
- ❌ 不要移除 Telegram 認證 middleware
- ❌ 不要降級 TypeScript strict 設定
