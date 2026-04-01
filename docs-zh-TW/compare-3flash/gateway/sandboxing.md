---
summary: "OpenClaw 沙箱隔離運作機制：模式、範圍、工作區存取以及映像檔"
title: 沙箱隔離
read_when: "當您想要了解沙箱隔離的詳細說明，或需要調整 agents.defaults.sandbox 時。"
status: active
---

# 沙箱隔離

OpenClaw 可以將 **工具執行於 Docker 容器內**，以減少損害範圍。
這是 **選用** 功能，透過設定 (`agents.defaults.sandbox` 或 `agents.list[].sandbox`) 進行控制。如果關閉沙箱隔離，工具將在主機上執行。Gateway 始終保留在主機上；啟用後，工具執行將在獨立的沙箱中進行。

這並非完美的安全性邊界，但當模型做出愚蠢行為時，它能實質上限制對檔案系統和程序的存取。

## 哪些項目會被沙箱隔離

- 工具執行 (`exec`, `read`, `write`, `edit`, `apply_patch`, `process` 等)。
- 選用的沙箱瀏覽器 (`agents.defaults.sandbox.browser`)。
  - 根據預設，當瀏覽器工具需要時，沙箱瀏覽器會自動啟動（確保 CDP 可連通）。
    透過 `agents.defaults.sandbox.browser.autoStart` 和 `agents.defaults.sandbox.browser.autoStartTimeoutMs` 進行設定。
  - `agents.defaults.sandbox.browser.allowHostControl` 允許沙箱隔離的工作階段明確指定主機瀏覽器為目標。
  - 選用的允許清單可用於過濾 `target: "custom"`：`allowedControlUrls`, `allowedControlHosts`, `allowedControlPorts`。

未被沙箱隔離的項目：

- Gateway 程序本身。
- 任何明確允許在主機上執行的工具（例如 `tools.elevated`）。
  - **高權限執行 (Elevated exec) 在主機上執行並繞過沙箱隔離。**
  - 如果關閉沙箱隔離，`tools.elevated` 不會改變執行方式（原本就在主機上）。參閱 [高權限模式](/tools/elevated)。

## 模式

`agents.defaults.sandbox.mode` 控制 **何時** 使用沙箱隔離：

- `"off"`：不使用沙箱隔離。
- `"non-main"`：僅對 **非主要 (non-main)** 的工作階段進行沙箱隔離（如果您希望在主機上進行正常對話，請使用此預設值）。
- `"all"`：每個工作階段都在沙箱中執行。
  注意：`"non-main"` 是基於 `session.mainKey`（預設為 `"main"`），而非智慧代理 ID。群組/頻道工作階段使用自己的金鑰，因此它們被視為非主要工作階段並會被沙箱隔離。

## 範圍

`agents.defaults.sandbox.scope` 控制 **建立多少個容器**：

- `"session"`（預設）：每個工作階段一個容器。
- `"agent"`：每個智慧代理一個容器。
- `"shared"`：所有沙箱隔離的工作階段共用一個容器。

## 工作區存取

`agents.defaults.sandbox.workspaceAccess` 控制 **沙箱可以看見哪些內容**：

- `"none"`（預設）：工具在 `~/.openclaw/sandboxes` 下看到一個沙箱工作區。
- `"ro"`：以唯讀方式將智慧代理工作區掛載於 `/agent`（停用 `write`/`edit`/`apply_patch`）。
- `"rw"`：以讀寫方式將智慧代理工作區掛載於 `/workspace`。

傳入的媒體會被複製到作用中的沙箱工作區 (`media/inbound/*`)。
Skills 說明：`read` 工具是以沙箱為根目錄的。在 `workspaceAccess: "none"` 的情況下，OpenClaw 會將符合條件的 Skills 鏡像到沙箱工作區 (`.../skills`) 以便讀取。在 `"rw"` 情況下，工作區的 Skills 可從 `/workspace/skills` 讀取。

## 自訂掛載點 (Bind Mounts)

`agents.defaults.sandbox.docker.binds` 將額外的主機目錄掛載到容器中。
格式：`主機:容器:模式`（例如：`"/home/user/source:/source:rw"`）。

全域與各別智慧代理的掛載點會進行 **合併**（而非取代）。在 `scope: "shared"` 下，各別智慧代理的掛載點將被忽略。

範例（唯讀原始碼 + docker socket）：

```json5
{
  agents: {
    defaults: {
      sandbox: {
        docker: {
          binds: ["/home/user/source:/source:ro", "/var/run/docker.sock:/var/run/docker.sock"],
        },
      },
    },
    list: [
      {
        id: "build",
        sandbox: {
          docker: {
            binds: ["/mnt/cache:/cache:rw"],
          },
        },
      },
    ],
  },
}
```

安全性注意事項：

- 掛載點會繞過沙箱檔案系統：它們會根據您設定的模式（`:ro` 或 `:rw`）公開主機路徑。
- 敏感掛載（例如 `docker.sock`、秘密資訊、SSH 金鑰）除非絕對必要，否則應設為 `:ro`。
- 如果您只需要對工作區進行讀取存取，請結合 `workspaceAccess: "ro"`；掛載模式保持獨立。
- 參閱 [沙箱 vs 工具策略 vs 高權限](/gateway/sandbox-vs-tool-policy-vs-elevated) 了解掛載點如何與工具策略及高權限執行互動。

## 映像檔與安裝

預設映像檔：`openclaw-sandbox:bookworm-slim`

執行一次建置：

```bash
scripts/sandbox-setup.sh
```

注意：預設映像檔 **不** 包含 Node。如果某個 Skill 需要 Node（或其他執行環境），可以製作自訂映像檔，或透過 `sandbox.docker.setupCommand` 進行安裝（需要網路流出 + 具備寫入權限的根目錄 + root 使用者）。

沙箱瀏覽器映像檔：

```bash
scripts/sandbox-browser-setup.sh
```

根據預設，沙箱容器執行時 **沒有網路**。
使用 `agents.defaults.sandbox.docker.network` 進行覆寫。

Docker 安裝與容器化 Gateway 位於此處：
[Docker](/install/docker)

## setupCommand (容器單次設定)

`setupCommand` 在沙箱容器建立後執行 **一次**（而非每次執行都執行）。
它透過 `sh -lc` 在容器內執行。

路徑：

- 全域：`agents.defaults.sandbox.docker.setupCommand`
- 各別智慧代理：`agents.list[].sandbox.docker.setupCommand`

常見錯誤：

- 預設 `docker.network` 為 `"none"`（沒有流出流量），因此套件安裝會失敗。
- `readOnlyRoot: true` 會阻止寫入；請將其設為 `readOnlyRoot: false` 或製作自訂映像檔。
- 安裝套件時 `user` 必須為 root（省略 `user` 或設定 `user: "0:0"`）。
- 沙箱執行 **不會** 繼承主機的 `process.env`。針對 Skill API 金鑰，請使用 `agents.defaults.sandbox.docker.env`（或自訂映像檔）。

## 工具策略與逃生門 (Escape Hatches)

工具允許/拒絕策略仍優先於沙箱規則。如果工具在全域或各別智慧代理中被拒絕，沙箱隔離也無法將其恢復。

`tools.elevated` 是一個明確的逃生門，可在主機上執行 `exec`。
`/exec` 指令僅適用於授權傳送者並在每個工作階段中持續有效；若要硬性停用 `exec`，請使用工具策略拒絕（參閱 [沙箱 vs 工具策略 vs 高權限](/gateway/sandbox-vs-tool-policy-vs-elevated)）。

偵錯：

- 使用 `openclaw sandbox explain` 檢查有效的沙箱模式、工具策略與修正設定鍵名。
- 參閱 [沙箱 vs 工具策略 vs 高權限](/gateway/sandbox-vs-tool-policy-vs-elevated) 了解「為什麼這被封鎖了？」的心理模型。保持鎖定狀態。

## 多重智慧代理覆寫

每個智慧代理都可以覆寫沙箱與工具：
`agents.list[].sandbox` 和 `agents.list[].tools`（以及用於沙箱工具策略的 `agents.list[].tools.sandbox.tools`）。
參閱 [多重智慧代理沙箱與工具](/tools/multi-agent-sandbox-tools) 了解優先順序。

## 最低限度的啟用範例

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main",
        scope: "session",
        workspaceAccess: "none",
      },
    },
  },
}
```

## 相關文件

- [沙箱設定](/gateway/configuration#agentsdefaults-sandbox)
- [多重智慧代理沙箱與工具](/tools/multi-agent-sandbox-tools)
- [安全性](/gateway/security)
