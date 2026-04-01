---
name: kuma-perspective
description: 在 AI 文章翻譯完成後，附上「🧠 Kuma 個人視角」分析區塊，包含批判性分析、與 Kuma 現況的連結、以及具體可採取的行動建議。此區塊只出現在 Discord 通知，不上傳到 repo。Use after ai-articles-daily skill completes translation, or when Kuma wants personalized analysis of any AI article.
---

# Kuma 個人視角

在文章翻譯摘要之後，附上以下區塊。**此分析只出現在 Discord 通知訊息中，不寫入 repo 的 markdown 檔案。**

## 輸出格式

**只出現在 Discord，而且必須獨立成 thread 的第二則訊息。**

```
✨ 值得一讀的亮點
{這篇最有價值的 1-2 個核心洞察，用白話說清楚}

🔍 批判性分析
{這篇論點最有趣或最值得質疑的地方，1-3 點，有觀點，不要泛泛}

🎯 跟你的現況
{這篇內容跟 Kuma 目前在做的事有什麼關聯或啟發}

🛠️ 可以做的事
{基於這篇文章，Kuma 可以直接採取的 1-2 個具體行動，要夠具體}
```

**硬規則：**
- 不要再寫 `🧠 Kuma 個人視角` 標題
- 不要加 `---`
- 不要跟主文合併成同一則訊息
- 第二則直接從 `✨ 值得一讀的亮點` 開始
- 四段標題固定格式：`✨ 值得一讀的亮點` / `🔍 批判性分析` / `🎯 跟你的現況` / `🛠️ 可以做的事`
- 整體仍需保有批判性與個人化，不可退化成泛泛短評

## Kuma 背景（用於產生個人化分析）

- 正在經營 `ai-articles`：把 AI 熱門文章翻成繁中公開分享，自己也是「餵養森林」的參與者
- 用 OpenClaw 建個人 AI 工作流：heartbeat 定時任務、cron jobs、skill 系統
- 做 `pokopia-zh`：寶可夢 Pokopia 中文整理站（Cloudflare Pages）
- 偏好「實用技巧 / 踩坑修法」> 純新功能公告
- 備賽 HYROX（4/18 比賽），注重訓練與體能管理
- 習慣：先想架構再實作、task tracking 用 GitHub Issues、偏好 squash merge

## 分析原則

- **批判性分析**：找論點的盲點、過度悲觀或過度樂觀的地方、有趣的矛盾。不是拍手叫好。
- **跟你的現況**：從 Kuma 背景裡找最相關的 1-2 個連結點，不要全部列出來。
- **可以做的事**：要夠具體。「研究看看」不算，「在 SOUL.md 加一條 X」才算。
