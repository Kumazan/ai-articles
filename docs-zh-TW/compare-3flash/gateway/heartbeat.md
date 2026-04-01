---
summary: "Heartbeat 輪詢訊息與通知規則"
read_when:
  - 調整 Heartbeat 頻率或訊息傳遞時
  - 在排程任務中猶豫該使用 Heartbeat 還是 Cron 時
title: "Heartbeat"
---

# Heartbeat (Gateway)

> **Heartbeat 還是 Cron？** 請參閱 [Cron vs Heartbeat](/automation/cron-vs-heartbeat) 以了解兩者的使用建議。

Heartbeat 會在主要工作階段中執行**定期智慧代理輪詢**，讓模型能在不騷擾您的情況下，主動呈現需要注意的事項。

疑難排解：[/automation/troubleshooting](/automation/troubleshooting)

## 快速開始（初學者）

1. 保持 Heartbeat 啟用（預設為 30 分鐘，若使用 Anthropic OAuth/setup-token 則為 1 小時），或自訂您的頻率。
2. 在智慧代理工作空間中建立一個簡短的 `HEARTBEAT.md` 檢查清單（選填但建議執行）。
3. 決定 Heartbeat 訊息的傳送目的地（預設為 `target: "last"`）。
4. 選填：啟用 Heartbeat 推理傳送功能以提高透明度。
5. 選填：將 Heartbeat 限制在活躍時段（當地時間）。

設定範例：

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "last",
        // activeHours: { start: "08:00", end: "24:00" },
        // includeReasoning: true, // 選填：同時發送獨立的 Reasoning: 訊息
      },
    },
  },
}
```

## 預設值

- 間隔：30 分鐘（若偵測到 Anthropic OAuth/setup-token 驗證模式則為 1 小時）。請設定 `agents.defaults.heartbeat.every` 或智慧代理個別的 `agents.list[].heartbeat.every`；使用 `0m` 即可停用。
- 提示詞主體（可透過 `agents.defaults.heartbeat.prompt` 設定）：
  `若 HEARTBEAT.md 存在（工作空間內容），請閱讀並嚴格遵守。請勿推論或重複先前對話中的舊任務。若無需注意之事項，請回覆 HEARTBEAT_OK。`
- Heartbeat 提示詞會以使用者訊息的形式**逐字**發送。系統提示詞包含一個「Heartbeat」區塊，且該次執行會在內部加上標籤。
- 系統會根據設定的時區檢查活躍時段（`heartbeat.activeHours`）。在時段外，Heartbeat 會被跳過，直到進入時段內的下一個排程點。

## Heartbeat 提示詞的用途

預設提示詞的範圍刻意設定得較廣：

- **背景任務**：「考慮未完成的任務」會促使智慧代理檢查後續事項（收件匣、行事曆、提醒事項、排隊工作）並呈現任何緊急內容。
- **人員問候**：「在白天時偶爾關心您的人類朋友」會促使智慧代理偶爾發送輕量級的「有什麼需要幫忙的嗎？」訊息，並透過您設定的本地時區（參見 [/concepts/timezone](/concepts/timezone)）來避免在深夜造成騷擾。

如果您希望 Heartbeat 執行非常具體的操作（例如「檢查 Gmail PubSub 統計數據」或「驗證 Gateway 健康狀態」），請將 `agents.defaults.heartbeat.prompt`（或 `agents.list[].heartbeat.prompt`）設定為自訂內容（將會逐字發送）。

## 回覆協議

- 若無需注意之事項，請回覆 **`HEARTBEAT_OK`**。
- 在執行 Heartbeat 期間，若 `HEARTBEAT_OK` 出現在回覆的**開頭或結尾**，OpenClaw 會將其視為確認（ack）。該標記會被移除，且若剩餘內容字數 **≤ `ackMaxChars`**（預設值：300），則該回覆會被捨棄。
- 若 `HEARTBEAT_OK` 出現在回覆的**中間**，則不會被特殊處理。
- 若要發送警示，**請勿**包含 `HEARTBEAT_OK`；僅需傳回警示文字。

在 Heartbeat 以外的情況下，訊息開頭/結尾出現的 `HEARTBEAT_OK` 會被移除並記錄；若訊息僅包含 `HEARTBEAT_OK`，則會被捨棄。

## 設定

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m", // 預設：30 分鐘（0m 為停用）
        model: "anthropic/claude-opus-4-6",
        includeReasoning: false, // 預設：false（若可用，發送獨立的 Reasoning: 訊息）
        target: "last", // last | none | <頻道 ID>（核心或外掛，例如 "bluebubbles"）
        to: "+15551234567", // 選填：頻道專用的覆寫設定
        accountId: "ops-bot", // 選填：多帳號頻道的 ID
        prompt: "若 HEARTBEAT.md 存在（工作空間內容），請閱讀並嚴格遵守。請勿推論或重複先前對話中的舊任務。若無需注意之事項，請回覆 HEARTBEAT_OK。",
        ackMaxChars: 300, // HEARTBEAT_OK 之後允許的最大字元數
      },
    },
  },
}
```

### 範圍與優先權

- `agents.defaults.heartbeat` 設定全域的 Heartbeat 行為。
- `agents.list[].heartbeat` 會覆蓋在其上；若任何智慧代理具有 `heartbeat` 區塊，則**僅有這些智慧代理**會執行 Heartbeat。
- `channels.defaults.heartbeat` 設定所有頻道的預設可見性。
- `channels.<channel>.heartbeat` 會覆寫頻道的預設值。
- `channels.<channel>.accounts.<id>.heartbeat`（多帳號頻道）會覆寫各頻道的設定。

### 各別智慧代理的 Heartbeat

若任何 `agents.list[]` 項目包含 `heartbeat` 區塊，則**僅有這些智慧代理**會執行 Heartbeat。智慧代理各別的區塊會覆蓋在 `agents.defaults.heartbeat` 之上（因此您可以先設定共用的預設值，再針對各智慧代理進行覆寫）。

範例：兩個智慧代理，僅第二個智慧代理執行 Heartbeat。

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "last",
      },
    },
    list: [
      { id: "main", default: true },
      {
        id: "ops",
        heartbeat: {
          every: "1h",
          target: "whatsapp",
          to: "+15551234567",
          prompt: "若 HEARTBEAT.md 存在（工作空間內容），請閱讀並嚴格遵守。請勿推論或重複先前對話中的舊任務。若無需注意之事項，請回覆 HEARTBEAT_OK。",
        },
      },
    ],
  },
}
```

### 活躍時段範例

將 Heartbeat 限制在特定時區的工作時間內：

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "last",
        activeHours: {
          start: "09:00",
          end: "22:00",
          timezone: "America/New_York", // 選填；若已設定則使用您的 userTimezone，否則使用主機時區
        },
      },
    },
  },
}
```

在此时段外（美東時間上午 9 點前或晚上 10 點後），Heartbeat 會被跳過。進入時段後的下一個排程點將正常執行。

### 多帳號範例

使用 `accountId` 在 Telegram 等多帳號頻道上指定特定帳號：

```json5
{
  agents: {
    list: [
      {
        id: "ops",
        heartbeat: {
          every: "1h",
          target: "telegram",
          to: "12345678",
          accountId: "ops-bot",
        },
      },
    ],
  },
  channels: {
    telegram: {
      accounts: {
        "ops-bot": { botToken: "YOUR_TELEGRAM_BOT_TOKEN" },
      },
    },
  },
}
```

### 欄位說明

- `every`：Heartbeat 間隔（時間長度字串；預設單位為分鐘）。
- `model`：選填，Heartbeat 執行的覆寫模型（供應商/模型）。
- `includeReasoning`：啟用時，若可用則發送獨立的 `Reasoning:` 訊息（形式與 `/reasoning on` 相同）。
- `session`：選填，Heartbeat 執行的工作階段金鑰。
  - `main`（預設）：智慧代理主要工作階段。
  - 明確的工作階段金鑰（從 `openclaw sessions --json` 或 [sessions CLI](/cli/sessions) 複製）。
  - 工作階段金鑰格式：請參閱 [工作階段](/concepts/session) 與 [群組](/channels/groups)。
- `target`：
  - `last`（預設）：傳送到最後使用的外部頻道。
  - 明確的頻道：`whatsapp` / `telegram` / `discord` / `googlechat` / `slack` / `msteams` / `signal` / `imessage`。
  - `none`：執行 Heartbeat 但不發送到外部。
- `to`：選填的接收者覆寫設定（頻道專用的 ID，例如 WhatsApp 的 E.164 格式或 Telegram 的聊天 ID）。
- `accountId`：選填的多帳號頻道帳號 ID。當設定為 `target: "last"` 時，若最後解析出的頻道支援帳號，則套用該帳號 ID；否則會被忽略。若帳號 ID 與解析頻道中設定的帳號不符，則會跳過傳送。
- `prompt`：覆寫預設的提示詞主體（不進行合併）。
- `ackMaxChars`：在傳送前，`HEARTBEAT_OK` 之後允許的最大字元數。
- `activeHours`：將 Heartbeat 執行限制在特定時間範圍內。包含 `start`（包含該時間，HH:MM）、`end`（不包含該時間，HH:MM；可使用 `24:00` 代表當天結束）以及選填 `timezone` 的物件。
  - 省略或設定為 `"user"`：若已設定則使用您的 `agents.defaults.userTimezone`，否則退而使用主機系統時區。
  - `"local"`：一律使用主機系統時區。
  - 任何 IANA 識別碼（例如 `America/New_York`）：直接使用；若無效，則退而執行上述的 `"user"` 行為。
  - 在活躍時段外，Heartbeat 會被跳過，直到進入時段內的下一個排程點。

## 傳送行為

- Heartbeat 預設在智慧代理的主要工作階段中執行（`agent:<id>:<mainKey>`），或當 `session.scope = "global"` 時在 `global` 執行。設定 `session` 可覆寫為特定頻道的工作階段（Discord/WhatsApp 等）。
- `session` 僅影響執行內容；傳送則由 `target` 與 `to` 控制。
- 若要傳送到特定頻道/接收者，請設定 `target` + `to`。若設定為 `target: "last"`，則會使用該工作階段最後使用的外部頻道。
- 若主佇列繁忙，Heartbeat 會被跳過並稍後重試。
- 若 `target` 未解析出任何外部目的地，執行仍會發生，但不會發送外寄訊息。
- 僅包含 Heartbeat 的回覆**不會**讓工作階段保持活躍；系統會還原最後的 `updatedAt`，使閒置過期機制正常運作。

## 可見性控制

預設情況下，`HEARTBEAT_OK` 確認訊息會被隱藏，僅傳送警示內容。您可以針對各頻道或帳號進行調整：

```yaml
channels:
  defaults:
    heartbeat:
      showOk: false # 隱藏 HEARTBEAT_OK（預設）
      showAlerts: true # 顯示警示訊息（預設）
      useIndicator: true # 發送指示器事件（預設）
  telegram:
    heartbeat:
      showOk: true # 在 Telegram 上顯示 OK 確認訊息
  whatsapp:
    accounts:
      work:
        heartbeat:
          showAlerts: false # 停止此帳號的警示傳送
```

優先權：各帳號 → 各頻道 → 頻道預設值 → 內建預設值。

### 各標記的作用

- `showOk`：當模型傳回僅含 OK 的回覆時，發送 `HEARTBEAT_OK` 確認訊息。
- `showAlerts`：當模型傳回非 OK 的回覆時，發送警示內容。
- `useIndicator`：為 UI 狀態介面發送指示器事件。

若**三者皆為** false，OpenClaw 將完全跳過 Heartbeat 執行（不呼叫模型）。

### 各頻道與各帳號範例

```yaml
channels:
  defaults:
    heartbeat:
      showOk: false
      showAlerts: true
      useIndicator: true
  slack:
    heartbeat:
      showOk: true # 所有 Slack 帳號
    accounts:
      ops:
        heartbeat:
          showAlerts: false # 僅針對 ops 帳號隱藏警示
  telegram:
    heartbeat:
      showOk: true
```

### 常見模式

| 目
