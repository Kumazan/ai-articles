---
name: learn
description: Session 結束前的知識沉澱流程：回顧對話學到的知識，更新 AGENTS.md / TOOLS.md / CLAUDE.md + Obsidian 筆記 + MEMORY.md。Use when finishing a session that produced new learnings, gotchas, configuration changes, or worth-remembering decisions.
metadata: {"clawdbot":{"emoji":"🧠","requires":{"bins":["obsidian-cli"]}}}
---

# Learn — 知識沉澱

Session 結束前的知識沉澱流程，依序執行四個步驟。

## When to Use

- Session 結束前
- 踩到 gotchas 或陷阱
- 發現新的正確指令或設定方式
- 環境配置有重要 quirk
- 任何「下次一定又會忘」的東西

## Step 1: 更新 Workspace 文件

回顧本次 session，找出未來 session 需要的知識。根據知識類別更新對應文件：

| 文件 | 更新什麼 |
|------|----------|
| `AGENTS.md` | Agent 行為規則、protocol 調整、安全規範 |
| `TOOLS.md` | 工具特定設定、環境變數、CLI 用法、本地路徑 |
| `CLAUDE.md` | 給 Claude Code 看的 gotchas、指令用法、環境 quirks |

> `AGENTS.md` 和 `TOOLS.md` 是小蝦每次 session 都會讀的，優先更新。
> `CLAUDE.md` 是給 Claude Code 看的，只有跟 Claude Code 相關的才寫這裡。

**規則：**
- 一行一個概念，保持簡潔
- 只記會重複遇到的問題，不記一次性修復
- 放到對應的 section（如 `## Discord Gotchas`、`## Cron Gotchas`）
- 如果沒有適合的 section 就新增一個
- 不要重複已經記錄的內容

**流程：**
1. 列出本次 session 學到的知識點
2. 對每個知識點說明要加在哪個文件的哪個 section
3. 貼出修改摘要讓 Kuma 過目
4. 直接套用修改（Kuma 說不要的就跳過）

## Step 2: 更新 Obsidian 筆記

搜尋 Obsidian vault（Kuma）中相關的現有筆記，更新或建立。

**規則：**
- 更新對應的現有筆記（如 `OpenClaw/總覽`、`Claude Code/` 下的筆記）
- 新專案或新主題才建新筆記
- 筆記標題用繁體中文
- 用 `[[雙向連結]]` 互相引用

**更新後同步 qmd 索引：**

Obsidian 筆記有任何新增或修改後，執行：

```bash
qmd update
```

確保語義搜尋索引（workspace + obsidian collection）保持最新。

## Step 3: 更新 MEMORY.md

回顧 session，把值得長期記住的決策、觀點、人際脈絡寫入 `MEMORY.md`。

**該記的：**
- 重要決策和背後原因
- Kuma 的偏好或意見（新發現的）
- 人際關係、專案脈絡
- 值得保留的 insight

**不該記的：**
- 已寫進 AGENTS.md / TOOLS.md / CLAUDE.md 的技術細節
- 一次性的操作步驟
- 已過期的臨時資訊

## Step 4: Commit & Push

把本次 learn 的變更 commit 到 git。只 stage 實際修改的文件，不要 `git add -A`。

Commit message 格式：`learn: <簡述本次學到的>`

## 注意事項

- 四個步驟依序執行，每步完成後告知 Kuma
- Step 1 先貼摘要，Kuma 沒異議就直接改
- Step 2、3、4 可直接執行
- 如果 session 沒有值得記錄的新知識，告知 Kuma 並跳過
- 今天的 daily note (`memory/YYYY-MM-DD.md`) 應該已經在 session 中持續更新，這裡不需要重複
