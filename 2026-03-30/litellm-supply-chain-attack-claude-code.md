---
title: "分分秒秒：我用 Claude Code 即時破解 LiteLLM PyPI 供應鏈攻擊"
description: "LiteLLM 1.82.8 被植入惡意程式，46 分鐘近 47,000 次下載。作者與 Claude Code 即時對話實錄，記錄從發現到公開揭露的過程。"
date: 2026-03-30
author: Callum McMahon / FutureSearch
layout: post
permalink: /2026-03-30/litellm-supply-chain-attack-claude-code.html
image: /ai-articles/2026-03-30/og-litellm-supply-chain-attack-claude-code.png
---

<div class="hero-badge">AI News · 2026-03-30</div>

![](/ai-articles/2026-03-30/og-litellm-supply-chain-attack-claude-code.png)

**原文連結：** [My minute-by-minute response to the LiteLLM malware attack](https://futuresearch.ai/blog/litellm-attack-transcript/)

## 摘要

- 2026 年 3 月 24 日，LiteLLM 1.82.8 在 PyPI 上發布僅 46 分鐘，就感染了近 47,000 次下載
- 惡意程式藏在 `litellm_init.pth` 中，一個 Python 啟動就自動執行的持久化機制
- 攻擊目標：SSH 金鑰、AWS/GCP/K8s 憑證、`.env` 檔案、加密貨幣錢包、shell 歷史記錄
- 作者 Callum McMahon 全程透過 Claude Code 協助分析惡意程式、確認漏洞、聯絡 PyPI 舉報
- 這篇文章是第一視角的完整 Claude Code 對話實錄，展示了 AI 工具在資安事件中的真實威力

<div class="sep">· · ·</div>

## 故事開始：一台凍結的筆電

這一切起源於一個讓系統跑出 11,000 個 Python 行程的怪異現象。

2026 年 3 月 24 日，Callum McMahon 的筆電突然爬滿了以下模式的行程：

```
python -c "exec(base64.b64decode('aW1wb3J0IHN1YnByb2Nlc3MK...'))"
```

系統被迫關機重啟。他打開 Claude Code，把問題丟給它：「我 htop 出現 11k 個奇怪的 Python 行程，可以幫我查一下發生了什麼？」

這個問題，開啟了一場從 11:13 到 12:04 UTC、不到一小時的緊急事件應變。

---

## 時間軸：從懷疑到公開揭露

### 第一階段：系統偵測（11:13 — 11:40）

Claude Code 開始分析日誌。起初，它的判斷是「這只是 Claude Code 本身在跑 python -c 包裝腳本」——因為 Claude Code 本身確實會用 base64 傳遞程式碼片段。

作者懷疑但 Claude Code 保持謹慎。直到它看到了從手機拍攝 htop 螢幕截圖中識別出的 base64 前幾個字元：

```
aW1wb3J0IHN1YnByb2Nlc3MKaW1wb3J0IHRlbXBmaWxl
```

解碼後：

```python
import subprocess
import tempfile
```

這可能只是普通工具腳本。但 Claude Code 繼續深挖。

### 第二階段：確認惡意程式（11:40 — 11:58）

關鍵突破發生了。Claude Code 的背景任務找到了 `litellm_init.pth` 這個檔案：

```
import os, subprocess, sys; subprocess.Popen([sys.executable, "-c", "import base64; exec(base64.b64decode('aW1wb3J0IHN1YnByb2Nlc3MK...'))"])
```

**.pth 檔案是 Python 的定時炸彈**：放在 site-packages 目錄的 .pth 檔案，每次 Python 啟動都會自動執行。這就是為什麼會有 11,000 個行程——每個 Python 子行程啟動時，都再次觸發這個惡意程式，形成指數級的「分叉炸彈」。

Claude Code 在隔離的 Docker 容器中親自驗證：

```
正在檢查：litellm-1.82.8-py3-none-any.whl
找到：litellm_init.pth
大小：34,628 bytes
```

確認。這是 PyPI 上正在流通的官方 wheel 包。

### 惡意程式完整功能

解碼後的攻擊腳本具備三個核心能力：

**1. 憑證收割（B64_SCRIPT）**
目標包括：
- `~/.ssh/` — SSH 私鑰
- `~/.aws/`, `~/.gcp/`, `~/.kube/config` — 雲端憑證
- `~/.env` 及所有環境變數
- 加密貨幣錢包（Bitcoin、Ethereum、Monero 等）
- `.bash_history`, `.zsh_history` — 命令歷史
- `~/.npmrc`, `~/.docker/config.json`

**2. RSA 加密外洩**
所有竊取的資料以 RSA 公鑰加密，POST 到 `https://models.litellm.cloud/`（偽裝成官方端點的惡意域名）。

**3. 持久化與 Kubernetes 橫向移動**
在 `~/.config/sysmon/sysmon.py` 安裝 systemd 服務，並嘗試在 K8s 叢集的每個節點建立特權 Alpine 容器進行擴散。

幸運的是，作者的強制重啟在惡意程式安裝持久化的前兩分鐘打斷了它。`sysmon.py` 是個空白的 0 bytes 檔案。

### 第三階段：公開揭露（11:58 — 12:04）

確認漏洞存在後，Callum 立即採取行動：

- **11:58** 寄信給 `security@pypi.org` 要求下架 litellm 1.82.8
- **12:00** 聯絡 LiteLLM 維護者
- **12:02** 公開揭露貼文發布
- **12:04** 分享到相關社群

PyPI 在收到通報後迅速將 litellm 套件設為「隔離中」狀態。整個攻擊視窗僅有約 46 分鐘，但已有 46,996 次下載——橫跨 litellm 1.82.7 和 1.82.8 兩個被污染版本。

---

## 攻擊路徑還原

事後分析顯示，這是一條多層次的供應鏈攻擊：

1. **起點**：Trivy（安全掃描工具）被駭，LiteLLM 在 CI 中使用 Trivy，導致 PyPI 發布憑證外洩
2. **入侵**：攻擊者用竊取的憑證直接上傳 litellm 1.82.8 到 PyPI（沒有對應的 GitHub tag）
3. **觸發**：Cursor 在更新時透過 `futuresearch-mcp-legacy` 間接安裝了 litellm
4. **爆炸**：.pth 自動執行 + 遞迴 subprocess 觸發分叉炸彈

---

## 這件事說明了什麼

Simon Willison 在報導此事時寫道：

> 不具備資安研究背景的開發者，現在可以以前所未有的速度發出警報。AI 工具不只加快了惡意程式的創作，也加快了它的偵測。

Callum 在整個過程中從未手動跑過 shell 腳本分析惡意程式——Claude Code 全程代勞，包括建立隔離的 Docker 容器驗證、解碼 base64 payload、追蹤行程樹，以及最終起草給 PyPI 的報告。

---

## 你現在該做什麼

如果你的環境中有 `litellm`：

```bash
# 確認版本
pip show litellm

# 如果是 1.82.7 或 1.82.8，立即更新
pip install --upgrade litellm

# 清除 uv 快取
rm -rf ~/.cache/uv

# 如果有安裝過這兩個版本，旋轉所有憑證
# SSH 金鑰、AWS/GCP/K8s、.env 中的所有 API keys
```

此外，考慮在你的套件管理工具中啟用 `minimum-release-age`（pip 26.0、uv 0.9.17、npm 11.10.0 均已支援），讓新版本套件先「冷卻」幾天再安裝。

<div class="sep">· · ·</div>

## 這篇最該被記住的不是惡意程式分析，而是 AI 工具在資安事件中的角色轉變

LiteLLM 供應鏈攻擊本身的手法——.pth 自動執行、base64 混淆、RSA 加密外洩、K8s 橫向移動——對資安研究者來說不算特別新穎。但這篇文章真正值得關注的，是事件應變的過程。

**一個不具備資安研究背景的開發者，靠 Claude Code 在不到一小時內完成了從發現到公開揭露的完整流程。** 這包括：解碼 base64 payload、追蹤行程樹、建立隔離 Docker 容器驗證、確認惡意 wheel 包的來源、起草給 PyPI 的報告。過去這種等級的分析，通常需要一個有經驗的資安工程師花半天到一天，或者一個團隊分工處理。

Simon Willison 的評論精準地點出了這件事的意義：AI 工具不只加快了惡意程式的創作，也加快了它的偵測。這是一種對稱性的回復——攻擊者可以用 AI 生成更精巧的 payload，但防守者也可以用 AI 更快速地分析和應變。

不過有幾個不能忽略的風險。

**第一，Claude Code 一開始判斷錯誤。** 它最初認為那些 base64 行程只是 Claude Code 自己的包裝腳本。如果作者在那個時刻就接受了這個判斷，整個攻擊可能會被延誤發現更長時間。AI 工具在資安場景中的可靠度，取決於使用者有沒有足夠的判斷力去質疑 AI 的初步結論。換句話說，AI 降低了分析門檻，但沒有消除判斷門檻。

**第二，46 分鐘 47,000 次下載。** 這個數字揭示的是 Python 生態系供應鏈的脆弱程度。很多 CI/CD pipeline 設定為自動拉取最新版本，沒有任何冷卻期。`minimum-release-age` 這個功能是對的方向，但它需要成為預設值而非 opt-in，才能真正產生規模效果。

**第三，攻擊鏈的起點是 Trivy 被駭。** 一個安全掃描工具本身成為攻擊入口——這種「守門人變成入侵路徑」的模式，在供應鏈安全裡反覆出現。對任何依賴第三方工具的 CI/CD 流程來說，這是一個很直接的提醒：你的安全工具本身，也是攻擊面的一部分。
