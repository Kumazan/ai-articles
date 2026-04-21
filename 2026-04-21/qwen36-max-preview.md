---
title: "Qwen3.6-Max-Preview：更聰明、更銳利，還在持續進化"
description: "Qwen3.6-Max-Preview 以早期預覽版登場，主打更強的代理式 coding、世界知識與指令遵循，並在多項基準上明顯超越 Qwen3.6-Plus。"
date: 2026-04-21
author: Qwen Team
layout: post
permalink: /2026-04-21/qwen36-max-preview.html
image: /2026-04-21/og-qwen36-max-preview.png
---

<div class="hero-badge">AI News · 2026-04-21</div>

![](/ai-articles/2026-04-21/og-qwen36-max-preview.png)

**原文連結：** [Qwen3.6-Max-Preview: Smarter, Sharper, Still Evolving](https://qwenlm.github.io/blog/qwen3.6-max-preview/)

## 摘要

- Qwen3.6-Max-Preview 是 Qwen3.6-Plus 之後的早期預覽版，主打代理式 coding、世界知識與指令遵循。
- 官方強調，這版在多項 benchmark 上都比前代更強，尤其是長流程 coding 與工具呼叫。
- 在 SkillsBench、SciCode、NL2Repo、Terminal-Bench 2.0 等指標上都有明顯提升。
- 在知識與多語能力上，SuperGPQA 與 QwenChineseBench 也同步進步。
- 這版目前可在 Qwen Studio 試用，API 名稱是 `qwen3.6-max-preview`。
- 對做 agent 的團隊來說，`preserve_thinking` 這種能力很實用，因為它能保留前一輪的思考內容。

<div class="sep">· · ·</div>

在發表 Qwen3.6-Plus 之後，Qwen 這次又先端出下一個專有模型的早期預覽版：Qwen3.6-Max-Preview。相較於 Qwen3.6-Plus，這次預覽版在世界知識、指令遵循，以及一整排代理式 coding 基準上都有明顯升級。官方也明講，這還是在積極開發中的版本，後續還會持續迭代。

Qwen 把它定位成由阿里雲 Model Studio 托管的專有模型，重點是更好的代理式 coding、更強的世界知識，以及更穩的真實世界 agent 與知識可靠性。

## 性能

官方列出的評估顯示，Qwen3.6-Max-Preview 相較於 Qwen3.6-Plus，在代理式 coding 上有顯著進步，例如 SkillsBench +9.9、SciCode +6.3、NL2Repo +5.0、Terminal-Bench 2.0 +3.8。

在世界知識方面，SuperGPQA +2.3、QwenChineseBench +5.3 也都有提升；在指令遵循上，ToolcallFormatIFBench +2.8 同樣進步明顯。

官方也強調，這版在六個主要 coding benchmark 上拿到最高分，包含 SWE-bench Pro、Terminal-Bench 2.0、SkillsBench、QwenClawBench、QwenWebBench 與 SciCode。

## 如何使用 Qwen3.6-Max-Preview

Qwen3.6-Max-Preview 目前可透過 Alibaba Cloud Model Studio API 使用，模型名稱是 `qwen3.6-max-preview`。也可以直接在 Qwen Studio 先試用。

### API 用法

這次釋出支援 `preserve_thinking` 功能，會保留前面所有輪次的思考內容，對 agent 類任務特別有用。

Alibaba Cloud Model Studio 也支援業界標準協定，包括相容 OpenAI 規格的 chat completions 與 responses API，另外也提供相容 Anthropic 的 API 介面。

文末還附了 Chat Completions API 的範例程式，以及進一步文件連結。

```python
"""
Environment variables (per official docs):
DASHSCOPE_API_KEY: Your API Key from https://modelstudio.console.alibabacloud.com
DASHSCOPE_BASE_URL: (optional) Base URL for compatible-mode API.
- Beijing: https://dashscope.aliyuncs.com/compatible-mode/v1
- Singapore: https://dashscope-intl.aliyuncs.com/compatible-mode/v1
- US (Virginia): https://dashscope-us.aliyuncs.com/compatible-mode/v1
DASHSCOPE_MODEL: (optional) Model name; override for different models.
"""
from openai import OpenAI
import os

api_key = os.environ.get("DASHSCOPE_API_KEY")
if not api_key:
    raise ValueError("DASHSCOPE_API_KEY is required. Set it via: export DASHSCOPE_API_KEY='your-api-key'")

client = OpenAI(
    api_key=api_key,
    base_url=os.environ.get("DASHSCOPE_BASE_URL", "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"),
)

messages = [{"role": "user", "content": "Introduce vibe coding."}]
model = os.environ.get("DASHSCOPE_MODEL", "qwen3.6-max-preview")
completion = client.chat.completions.create(
    model=model,
    messages=messages,
    extra_body={"enable_thinking": True},
    stream=True,
)

reasoning_content = ""
answer_content = ""
is_answering = False

for chunk in completion:
    if not chunk.choices:
        print("Usage:")
        print(chunk.usage)
        continue
    delta = chunk.choices[0].delta
    if hasattr(delta, "reasoning_content") and delta.reasoning_content is not None:
        if not is_answering:
            print(delta.reasoning_content, end="", flush=True)
            reasoning_content += delta.reasoning_content
    if hasattr(delta, "content") and delta.content:
        if not is_answering:
            print("\n====================Answer====================\n")
            is_answering = True
        print(delta.content, end="", flush=True)
        answer_content += delta.content
```

## 原文結語

Qwen3.6-Max-Preview 是下一代專有模型的早期預覽版，在代理式 coding、世界知識與指令遵循上都比 Qwen3.6-Plus 更強。它在 SWE-bench Pro、Terminal-Bench 2.0、SkillsBench、QwenClawBench、QwenWebBench 與 SciCode 等多個 coding benchmark 上拿到頂尖成績，也在 SuperGPQA、QwenChineseBench 與 ToolcallFormatIFBench 上展現更好的知識與指令遵循能力。

作為預覽版，這個模型仍在持續開發中。團隊會繼續調整，預期後續版本還會再往上推，也歡迎社群回饋與實作成果。

## 延伸評論：代理式 coding 的門檻又往上抬

這篇最值得注意的，不只是又一個模型發布，而是它把「能不能長時間穩定做事」繼續往前推。現在的競爭已經不只是在單輪回答誰比較漂亮，而是誰更能在真實任務裡維持上下文、呼叫工具、修正錯誤，最後把事情收尾。

對真的在做 agent 或 coding workflow 的團隊來說，這類 release 的意義很直接，模型不只是回答器，而是工作流的一部分。下一輪差距，可能會落在誰能更少中斷、更少重試，並且更可靠地把長鏈任務做完。

## 引用

```text
@misc {
qwen36_max_preview,
  title = {Qwen3.6-Max-Preview: Smarter, Sharper, Still Evolving},
  url = {https://qwen.ai/blog?id=qwen3.6-max-preview},
  author = {Qwen Team},
  month = {April},
  year = {2026}
}
```
