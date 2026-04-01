---
summary: "Gateway 服務、生命週期與營運維護指南"
read_when:
  - 執行或對 Gateway 程序進行除錯時
title: "Gateway 營運維護指南"
---

# Gateway 營運維護指南

本頁面適用於 Gateway 服務的初始啟動與後續營運維護。

<CardGroup cols={2}>
  <Card title="深度疑難排解" icon="siren" href="/gateway/troubleshooting">
    以症狀為導向的診斷，包含確確的指令步驟與日誌特徵。
  </Card>
  <Card title="設定" icon="sliders" href="/gateway/configuration">
    以任務為導向的設定指南 + 完整的設定參考。
  </Card>
</CardGroup>

## 五分鐘快速本機啟動

<Steps>
  <Step title="啟動 Gateway">

```bash
openclaw gateway --port 18789
# 將除錯/追蹤資訊鏡射到標準輸出
openclaw gateway --port 18789 --verbose
# 強制關閉所選連接埠上的監聽程式，然後啟動
openclaw gateway --force
```

  </Step>

  <Step title="驗證服務運作狀態">

```bash
openclaw gateway status
openclaw status
openclaw logs --follow
```

正常運作基準：`Runtime: running` 且 `RPC probe: ok`。

  </Step>

  <Step title="驗證頻道就緒狀態">

```bash
openclaw channels status --probe
```

  </Step>
</Steps>

<Note>
Gateway 設定重新載入會監控使用中的設定檔案路徑（由設定檔/狀態預設值解析，或在設定時由 `OPENCLAW_CONFIG_PATH` 解析）。
預設模式為 `gateway.reload.mode="hybrid"`。
</Note>

## 執行階段模型

- 一個用於路由、控制平面和頻道連線的常駐程序。
- 單一多工連接埠，用於：
  - WebSocket 控制/RPC
  - HTTP API（相容於 OpenAI、回應、工具調用）
  - 控制 UI 與 Hook
- 預設綁定模式：`loopback`。
- 預設需要驗證（`gateway.auth.token` / `gateway.auth.password`，或 `OPENCLAW
