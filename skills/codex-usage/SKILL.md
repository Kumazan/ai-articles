---
name: codex-usage
description: 查詢 OpenAI Codex（ChatGPT）目前的用量配額，包含每小時/每週使用量與重置時間。
user-invocable: true
metadata: {"openclaw":{"emoji":"🤖","requires":{"bins":["openclaw"]}}}
---

# codex-usage

用途：查詢 OpenAI Codex（ChatGPT Plus）的用量狀態。

## 執行方式

當 user 執行 `/codex_usage` 時，執行：

```bash
openclaw models status 2>&1 | grep "openai-codex usage"
```

## 輸出格式

直接顯示 Codex 的 usage 資訊，格式如：

```
openai-codex usage: 5h 97% left ⏱4h 55m · Week 65% left ⏱4d 3h
```

### 欄位說明

| 欄位 | 意義 |
|------|------|
| `5h` | 每小時配額上限（5 小時） |
| `97% left` | 這小時已用 3%，剩 97% |
| `⏱4h 55m` | 小時配額重置時間 |
| `Week 65% left` | 本週已用 35%，剩 65% |
| `⏱4d 3h` | 週配額重置時間 |

## 注意

- 此查詢**會消耗配額**（因為需要實際打 OpenAI API）
- OAuth token 還有約 9 天過期（`openai-codex:bear24ice@gmail.com`）
- 若配額用完，會觸發 fallback 模型（`claude-sonnet-4-6` 等）
