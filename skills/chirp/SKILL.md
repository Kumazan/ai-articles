---
name: chirp
description: "使用 OpenClaw browser 工具操作 X/Twitter：讀 timeline、發文、按讚、轉推、回覆、搜尋。適合無法安裝 bird CLI 的環境。"
homepage: https://github.com/zizi-cat/chirp
metadata: {"clawdhub":{"emoji":"🐦"}}
---

# Chirp

使用 OpenClaw browser 工具操作 X/Twitter。bird CLI 的瀏覽器版替代方案。

## 前置需求

- OpenClaw 已啟用 browser tool，profile 為 `openclaw`
- 無頭伺服器需啟動 Xvfb（`DISPLAY=:99`）
- X/Twitter 帳號已登入（首次需手動登入）：
  ```
  browser action=open profile=openclaw targetUrl="https://x.com/login"
  ```

## 支援操作

| 操作 | 說明 |
|------|------|
| 讀 Timeline | 打開 `x.com/home`，snapshot 即可看到所有推文 |
| 發文 | 在首頁找輸入框，輸入後點 Post 按鈕 |
| 按讚 | 找 `button "Like"` 的 ref，click |
| 轉推 | 找 `button "Repost"` → click → 確認選單 |
| 回覆 | 從 timeline 或推文頁面找回覆框 |
| 搜尋 | 直接開 `x.com/search?q=關鍵字` |
| 看個人頁面 | 開 `x.com/username` |
| 追蹤 | 在個人頁找 `button "Follow"`，click |

→ 每個操作的詳細步驟見 `references/operations.md`

## 核心操作原則

1. **先 snapshot 再操作** — 每次操作前確認目前狀態
2. **ref 每次不同** — 每次 snapshot 都要重新找 ref，不可重用
3. **用 compact=true** — 節省 token
4. **發文前確認** — 務必讓使用者確認推文內容再送出
5. **Post 按鈕 disabled？** — 確認已正確 click + type 輸入框

## References

- `references/operations.md` — 各操作完整步驟
- `references/troubleshooting.md` — 疑難排解 table
- `references/comparison.md` — Bird CLI vs Chirp 比較
