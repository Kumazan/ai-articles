# DEVELOPMENT.md - AI-Friendly Development Architecture

本文件定義 Kuma 專案的開發原則與架構規範。所有 AI coding agent 與協作者應遵循。

## 核心原則

### 1. 小而自足的模組

- 每個檔案/模組職責單一，context 小到 AI 一次讀完就能改
- 避免 god files（超過 300 行就該考慮拆分）
- 一個功能 = 一個資料夾，內含自己的 types、tests、README

### 2. Convention over Configuration

- 使用 Tailwind 取代散亂的 CSS 檔案
- 統一命名規則與檔案結構，讓 AI 靠 pattern matching 快速理解
- 偏好 file-based routing（如 Next.js App Router）——結構即邏輯

### 3. 強型別 + Schema-first

- TypeScript strict mode 必開
- 使用 Zod schema 定義資料合約；Prisma 管理資料庫 schema
- 型別系統是 AI 的安全網——改 code 時自動擋住大部分錯誤

### 4. 可獨立跑的測試

- 每個模組有自己的 unit test，改完馬上驗證
- 測試可精準執行（`npm test -- --filter=xxx`），不用等整個 suite
- 目標：AI 改 → 跑 test → 看結果 → 再改，整個 loop < 3 分鐘

### 5. 文件即 Context

- 每個目錄放 `README.md`，說明這個資料夾在幹嘛
- 專案根目錄放 `AGENTS.md`，給 AI agent 的行為指引
- API routes 加上 JSDoc 或 OpenAPI spec
- 重要決策記錄在 `DECISIONS.md` 或 ADR（Architecture Decision Records）

### 6. 縮小 Blast Radius

- Monorepo 裡做好 package 切分，或採用 microservices
- AI 改壞一個模組不該炸掉整個 app
- 使用 Feature flags 讓 AI 產出的 code 安全上線、可觀察、可回滾

## 專案結構範例

```
src/
  features/
    checkout/
      README.md            ← AI 讀這個就懂 context
      schema.ts            ← Zod schema = 合約
      action.ts            ← Server Action / business logic
      page.tsx             ← UI component
      checkout.test.ts     ← 獨立可跑的測試
    auth/
      README.md
      schema.ts
      ...
  shared/
    ui/                    ← 共用 UI components
    lib/                   ← 共用 utilities（每個檔案 < 150 行）
```

## Feedback Loop 是一切的關鍵

AI-friendly architecture 的本質：

> **低耦合 + 強型別 + 快速 feedback loop + 好的 context 文件**

這不是什麼新概念——就是好的軟體工程。AI 時代只是給了我們更強的動機去真正做到。

實驗週期短 = 學習速度快 = 競爭優勢。如果對手的 cycle 是 3 天而你是 8 週，一年下來他們的實驗量是你的 13 倍。經過 compound，這種 learning gap 無法逾越。

## 技術選型偏好

| 類別 | 偏好 | 原因 |
|------|------|------|
| Framework | Next.js (App Router) | file-based routing, Server Components |
| Styling | Tailwind CSS | 無散亂 CSS，AI 好讀好改 |
| Validation | Zod | Schema-first，型別自動推導 |
| ORM | Prisma | Schema 即文件，migration 好管理 |
| Testing | Vitest / Jest | 快速、可 filter |
| Language | TypeScript (strict) | 型別 = AI 的安全網 |

---

_Inspired by [charles_tychen's thread](https://threads.net) on AI-friendly codebase architecture (2026-02)._
_Last updated: 2026-02-13._
