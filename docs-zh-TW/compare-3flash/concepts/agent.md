---
summary: "智慧代理執行期（嵌入式 pi-mono）、工作區契約與工作階段引導"
read_when:
  - 變更智慧代理執行期、工作區引導或工作階段行為時
title: "智慧代理執行期"
---

# 智慧代理執行期 🤖

OpenClaw 執行單一嵌入式智慧代理執行期，該執行期衍生自 **pi-mono**。

## 工作區（必填）

OpenClaw 使用單一智慧代理工作區目錄（`agents.defaults.workspace`）作為智慧代理在工具與上下文中的**唯一**工作目錄（`cwd`）。

建議：若缺少相關檔案，請使用 `openclaw setup` 來建立 `~/.openclaw/openclaw.json` 並初始化工作區檔案。

完整工作區佈局 + 備份指南：[智慧代理工作區](/concepts/agent-workspace)

若啟用了 `agents.defaults.sandbox`（沙箱隔離），非主工作階段可以在 `agents.defaults.sandbox.workspaceRoot` 下，透過各別工作階段的工作區來覆蓋此設定（請參閱 [Gateway 設定](/gateway/configuration)）。

## 引導檔案（插入）

在 `agents.defaults.workspace` 中，OpenClaw 預期包含以下使用者可編輯的檔案：

- `AGENTS.md` — 操作指令 + 「記憶體」
- `SOUL.md` — 人格特質、界線、語氣
- `TOOLS.md` — 使用者維護的工具筆記（例如 `imsg`、`sag`、慣例）
- `BOOTSTRAP.md` — 一次性的首次執行儀式（完成後刪除）
- `IDENTITY.md` — 智慧代理名稱/風格/表情符號
- `USER.md` — 使用者個人資料 + 偏好稱呼

在新工作階段的第一輪，OpenClaw 會將這些檔案的內容直接插入智慧代理上下文中。

空白檔案會被跳過。大型檔案會被修剪並標記截斷，以保持提示詞（prompt）精簡（請讀取檔案以獲取完整內容）。

若檔案遺失，OpenClaw 會插入一行「遺失檔案」標記（且 `openclaw setup` 會建立安全的預設範本）。

`BOOTSTRAP.md` 僅會為**全新工作區**建立（即不存在其他引導檔案時）。若您在完成儀式後刪除它，之後重新啟動時不應再重新建立。

若要完全停用引導檔案建立（用於預先填充的工作區），請設定：

```json5
{ agent: { skipBootstrap: true } }
```

## 內建工具

核心工具（read/exec/edit/write 以及相關系統工具）始終可用，受工具策略限制。`apply_patch` 是選用的，並受 `tools.exec.applyPatch` 控管。`TOOLS.md` **不**控制存在哪些工具；它是針對*您*希望如何使用它們的指引。

## Skills

OpenClaw 從三個位置載入 Skills（發生名稱衝突時以工作區為準）：

- 內建（隨安裝程式提供）
- 受管/本地：`~/.openclaw/skills`
- 工作區：`<workspace>/skills`

Skills 可以透過設定/環境變數控管（請參閱 [Gateway 設定](/gateway/configuration) 中的 `skills`）。

## pi-mono 整合

OpenClaw 重用了 pi-mono 程式碼庫的部分內容（模型/工具），但**工作階段管理、裝置探索和工具連接則由 OpenClaw 負責**。

- 無 pi-coding 智慧代理執行期。
- 不會參考 `~/.pi/agent` 或 `<workspace>/.pi` 的設定。

## 工作階段

工作階段對話紀錄以 JSONL 格式儲存在：

- `~/.openclaw/agents/<agentId>/sessions/<SessionId>.jsonl`

工作階段 ID 是穩定的，由 OpenClaw 選擇。
**不會**讀取舊有的 Pi/Tau 工作階段資料夾。

## 串流時的引導

當佇列模式為 `steer` 時，傳入的訊息會被插入到當前執行中。
**每次工具呼叫後**都會檢查佇列；若存在佇列訊息，則當前助手訊息中剩餘的工具呼叫將被跳過（工具結果會顯示錯誤資訊：「因佇列中的使用者訊息而跳過。」），接著在下一次助手回應前插入該佇列訊息。

當佇列模式為 `followup` 或 `collect` 時，傳入的訊息會被保留直到當前輪次結束，然後以佇列的承載內容（payload）開始新的智慧代理輪次。請參閱 [佇列](/concepts/queue) 以了解模式 + 防抖（debounce）/上限行為。

區塊串流傳輸會在助手區塊完成時立即傳送；其**預設為關閉**（`agents.defaults.blockStreamingDefault: "off"`）。
透過 `agents.defaults.blockStreamingBreak` 調整邊界（`text_end` vs `message_end`；預設為 `text_end`）。
使用 `agents.defaults.blockStreamingChunk` 控制軟區塊切分（預設為 800–1200 字元；優先考慮段落分隔，其次是換行，最後是句子）。
使用 `agents.defaults.blockStreamingCoalesce` 合併串流片段，以減少單行洗版（在傳送前基於閒置時間進行合併）。非 Telegram 頻道需要明確設定 `*.blockStreaming: true` 以啟用區塊回覆。
詳細的工具摘要會在工具啟動時發出（不進行防抖）；當可用時，控制介面會透過智慧代理事件串流傳輸工具輸出。
更多詳情：[串流傳輸 + 區塊切分](/concepts/streaming)。

## 模型參考

設定中的模型參考（例如 `agents.defaults.model` 和 `agents.defaults.models`）是透過在**第一個** `/` 處進行分割來解析的。

- 設定模型時，請使用 `供應商/模型`。
- 若模型 ID 本身包含 `/`（OpenRouter 風格），請包含供應商前綴（例如：`openrouter/moonshotai/kimi-k2`）。
- 若省略供應商，OpenClaw 會將輸入視為**預設供應商**的別名或模型（僅在模型 ID 中沒有 `/` 時有效）。

## 設定（最低限度）

至少需設定：

- `agents.defaults.workspace`
- `channels.whatsapp.allowFrom`（強烈建議）

---

_下一頁：[群組聊天](/channels/group-messages)_ 🦞
