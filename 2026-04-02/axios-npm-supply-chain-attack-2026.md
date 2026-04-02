---
title: "101 億週下載的代價：Axios npm 供應鏈攻擊完整解析"
date: 2026-04-02
author: Socket Research Team
description: "全球最大 HTTP 客戶端 Axios 遭供應鏈攻擊，兩個版本被植入惡意依賴 plain-crypto-js，竊取機器過 npm install 的開發者憑證，並在 macOS/Windows/Linux 三平台植入遠端木馬。"
layout: post
permalink: /2026-04-02/axios-npm-supply-chain-attack-2026.html
---

<div class="hero-badge">AI News · 2026-04-02</div>

**原文連結：** [Supply Chain Attack on Axios Pulls Malicious Dependency from npm](https://socket.dev/blog/axios-npm-package-compromised)

## 摘要

- Axios——全球每週超過 1 億次下載的 JavaScript HTTP 客戶端——在 3/31 遭到供應鏈攻擊，axios@1.14.1 與 @0.30.4 兩個版本被悄悄植入惡意依賴 `plain-crypto-js@4.2.1`
- 惡意套件透過 `postinstall` 鉤子自動執行，解碼後釋出三平台（木馬、PowerShell 指令稿、Python 指令稿）payload，並在 macOS 上偽裝成 Apple 系統服務 `com.apple.act.mond`
- 攻擊者濫用 npm long-lived token，繞過正常發布流程——受害版本在 Axios 官方 GitHub 找不到對應 tag，且距離上一個乾淨版本僅 39 分鐘
- 自我毀滅機制驚人：安裝後會刪除惡意腳本、置換 package.json，讓 `node_modules/` 裡看起來完全正常，幾乎不留痕跡
- Socket 同步發現兩支 AI 工具（`@shadanai/openclaw`、`@qqbrowser/openclaw-qbot`）被汙染，印證 AI 自動構建流程正在加速供應鏈病毒的傳播速度
- Axios 官方正在討論採用「Trusted Publishing」——讓只有 GitHub Actions 才能發布 npm，徹底杜絕 long-lived token 外洩風險

<div class="sep">· · ·</div>

## 攻擊時序

**March 30, 23:59 UTC** — 攻擊者發布乾淨的 `plain-crypto-js@4.2.0`（`nrwise@proton.me` 帳號），作為埋伏的前哨

**March 31, 00:39 UTC** — 惡意版 `axios@1.14.1` 與 `axios@0.30.4` 先後上架 npm，距上一個乾淨版本（`v1.14.0`）僅 39 分鐘，遠短於正常開發節奏

**March 31, 00:05 UTC** — Socket 自動化靜態掃描在 6 分鐘內標記 `plain-crypto-js@4.2.1` 為惡意——但此時已有專案中招

**March 31, 稍後** — Axios 維護者在 GitHub Issue 坦承：攻擊者的帳號權限竟高於他們自己，無法撤銷

```
axios@1.14.1  ──►  plain-crypto-js@4.2.1  ──►  postinstall hook  ──►  setup.js（4209 bytes）
```

## 惡意程式如何運作

`plain-crypto-js@4.2.1` 的 `setup.js` 透過兩層自創編碼（反轉 Base64 + XOR 密碼 `OrDeR_7077`）隱藏所有字串，包含模組名、C2 網址、殼層指令。靜態解開後的 18 個字串分為四類：

**Node.js 模組：** `child_process`、`os`、`fs`

**C2 基礎設施：** `http://sfrclak[.]com:8000/`（注意：並非真正的 npm registry，網域屬於美國國家牧師樂手協會，自 1997 年持有至今）

**平台識別：** `win32`、`darwin`、`linux`（各觸發不同 payload）

**清理指令：** 刪除 setup.js、刪除含 postinstall 的 package.json、將乾淨的 package.md 改名為 package.json——三步完成「正常安裝」的假象

### macOS

```
osascript → 下載 Mach-O RAT → 寫入 /Library/Caches/com.apple.act.mond
                         → 偽裝 Apple 系統服務命名躲過 GUI 通知
                         → 每 60 秒 beacon 到 C2，回傳機器指紋
```

木馬會列舉 `/Applications`、`~/Library`、`~/Application Support` 目錄內容，並服從 C2 的指令：`peinject`（注入執行任意 binary）、`runscript`（執行 shell 或 AppleScript）、`rundir`（枚舉目錄）、`kill`（自毀）。

### Windows

```
powershell.exe → 複製到 %PROGRAMDATA%\wt.exe（偽裝成 Windows Terminal）
             → VBScript launcher（隱藏視窗）→ 下載執行 %TEMP%\6202033.ps1
             → 自刪 VBS
```

### Linux

最簡單：下載 `/tmp/ld.py` 並以 `nohup python3` 後台執行。

## 為何沒有第一時間發現

惡意 payload 完全自毀——執行完後，`node_modules/plain-crypto-js/` 裡只剩下看來正常的 `crypto-js` 複製，沒有任何 `postinstall` 痕跡。這讓傳統的「事後稽核 node_modules」方法完全失效。

更根本的問題在於：**npm 生態從未要求發布者對應 GitHub 提交**。任何人只要拿到 npm token，就能直接 `npm publish`，繞過原始碼管理。這與 PyPI 的 Trusted Publishing（要求 GitHub Actions 才能發布）形成鮮明對比。

## 兩支 OpenClaw 相關套件遭殃

Socket 額外發現兩支在 npm 上被汙染的 AI 工具鏈：

- **`@shadanai/openclaw`**（OpenClaw AI gateway 分叉）：版本 `2026.3.31-1`、`2026.3.31-2` 的深層 node_modules 含相同 `setup.js`
- **`@qqbrowser/openclaw-qbot`**：直接將篡改過的 `axios@1.14.1`（含 `plain-crypto-js`）打包進自身 node_modules

這些很可能是在攻擊發生當下，AI 自動發布流程剛好跑完「發布含 axios 新版」的工作——相當諷刺：加速開發的工具，現在也在加速病毒傳播。

## 緩解措施

**立即檢查專案：**

```
npm ls axios
# 若顯示 axios@1.14.1 或 axios@0.30.4，立即：
npm uninstall axios && npm install axios@1.14.0  # 或 1.13.x
```

**在 package-lock.json 裡搜尋 `plain-crypto-js`**，即使從未主動安裝過。

**若使用 Socket、Dependabot、Snyk 等工具，已自動封鎖惡意版本。**

**長期解法：** Axios 官方正在評估 Trusted Publishing，讓 npm 發布權完全綁定 GitHub Actions，移除人為持有 long-lived token 的風險。

<div class="sep">· · ·</div>

## 延伸評論：npm 生態的信任危機，才剛開始

Axios 不是孤例。LiteLLM、Telnyx SDK、Trivy——過去一個月，光是 Socket 公告過的重大供應鏈事件就足以讓任何理智的開發者暫停所有非必要的 `npm install`。問題的結構性根源在於：npm 的「只要你拿到 token 就能發布」模式，與 GitHub 對「所有 commit 必須來自 Actions」的 Trusted Publishing 相比，幾乎是把金庫鑰匙放在每個開發者的口袋裡。

短期解法是依賴像 Socket 這類自動化工具做即時封鎖；但長期而言，整個生態需要的不是更多掃描器，而是一次根本性的信任模型重構——PyPI 已經邁出第一步，npm 的落後不只是技術問題，更是激勵結構的問題：平台從數十億次週下載中獲利，卻把安全責任外包給社群。

對於使用 AI 工具自動建構、測試、發布流程的團隊而言，這次事件敲響了另一記警鐘：當你的 CI/CD pipeline 能在幾分鐘內完成「程式碼 commit → 套件發布」的全鏈路，惡意行為者同樣享有這個速度優勢。AI 在加速開發的同時，也在加速病毒傳播。
