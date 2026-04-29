---
title: "LLM 0.32a0：一次向後相容的大改版"
description: "Simon Willison 為 LLM 推出 0.32a0 alpha，改用 messages 與 typed stream parts 重塑 API，讓多模態輸入、工具呼叫與回應序列化更自然。"
image: /2026-04-29/og-llm-032a0-major-backwards-compatible-refactor.png
date: 2026-04-29
author: Simon Willison
layout: post
permalink: /2026-04-29/llm-032a0-major-backwards-compatible-refactor.html
---

<div class="hero-badge">AI News · 2026-04-29</div>

![](/ai-articles/2026-04-29/og-llm-032a0-major-backwards-compatible-refactor.png)

**原文連結：** [Simon Willison — LLM 0.32a0 is a major backwards-compatible refactor](https://simonwillison.net/2026/Apr/29/llm/)

## 摘要

- Simon Willison 釋出 LLM 0.32a0 alpha，把原本以「prompt / response」為核心的抽象，升級成更貼近今日模型現實的「messages / typed parts」。
- 這次重構的重點不是換掉舊功能，而是讓既有 API 能更自然地表達多輪對話、多模態輸入、工具呼叫與不同型別的輸出。
- 新版支援以 `messages=[...]` 直接建立對話序列，也能把既有 response 再接著 reply，對做 chat completions 相容層很實用。
- 串流回應不再只是純文字，而是可以把 text、tool call 名稱與參數等不同事件一起處理，CLI 也因此能把 reasoning 和 final text 分開顯示。
- 0.32a0 也加入 response 的序列化 / 反序列化，讓開發者不必硬綁 SQLite，就能自行保存與還原模型回應。
- Simon 把這版放成 alpha，是因為後面還想重做 SQLite logging，讓更細粒度的模型互動能以圖狀結構保存。

<div class="sep">· · ·</div>

## 從「prompt / response」走向「messages / typed parts」

我在 2023 年 4 月開始做 LLM 這個套件時，世界還很簡單：丟一段文字 prompt 給模型，拿回一段文字 response。那時候這個抽象很合理。

但 2026 年已經不是那個世界了。LLM 現在透過 plugin system 抽象了成千上萬種不同模型；原本只支援文字輸入、文字輸出的接口，已經不足以描述我現在真正需要的東西。

這些年來，LLM 先支援了附件，能處理 image、audio、video；接著又有 schemas 來輸出結構化 JSON；再來是 tools，能執行工具呼叫。與此同時，模型本身也持續演進：推理能力、回傳圖片、甚至更多奇怪又有趣的輸出型態都出現了。

所以 LLM 也得跟著進化，才能更好地處理今天前沿模型的多樣輸入與輸出。

0.32a0 alpha 有兩個關鍵變化：

- 模型輸入可以表示成一串 messages
- 模型回應可以由一串不同型別的 parts 組成

## 把 prompts 當成一連串 messages

LLM 的輸入本質上仍然是文字，但自從 ChatGPT 證明雙向對話介面有價值之後，最常見的使用方式早就不是單次 prompt，而是把它視為一連串對話回合。

第一回合可能長這樣：

```text
user: Capital of France?
assistant:
```

模型接著補完 assistant 的回答。

但第二回合開始，就得把整段對話重播一次，像劇本一樣：

```text
user: Capital of France?
assistant: Paris
user: Germany?
assistant:
```

大多數大型供應商的 JSON API 也都是這種形式。像 OpenAI 的 chat completions API，其他家其實也大多照著學：

```bash
curl https://api.openai.com/v1/chat/completions \
 -H "Authorization: Bearer $OPENAI_API_KEY" \
 -H "Content-Type: application/json" \
 -d '{
 "model": "gpt-5.5",
 "messages": [
 {
 "role": "user",
 "content": "Capital of France?"
 },
 {
 "role": "assistant",
 "content": "Paris"
 },
 {
 "role": "user",
 "content": "Germany?"
 }
 ]
 }'
```

在 0.32 之前，LLM 用 conversation 來建模這件事：

```python
import llm

model = llm.get_model("gpt-5.5")

conversation = model.conversation()
r1 = conversation.prompt("Capital of France?")
print(r1.text())
# Outputs "Paris"

r2 = conversation.prompt("Germany?")
print(r2.text())
# Outputs "Berlin"
```

這樣做在從零開始建立對話時沒問題，但如果你想直接把一段既有對話餵進去，就很難表達。像要做一個 OpenAI chat completions API 的相容層，當時就比應該要困難得多。

LLM CLI 之前靠一個自訂機制，把 conversation 存到 SQLite 再展開，但那從來沒有變成穩定 API；而且有很多地方你會想只用 Python library，卻不想把 SQLite 當成儲存層。

現在新版可以直接這樣寫：

```python
import llm
from llm import user, assistant

model = llm.get_model("gpt-5.5")

response = model.prompt(messages=[
    user("Capital of France?"),
    assistant("Paris"),
    user("Germany?"),
])
print(response.text())
```

`llm.user()` 和 `llm.assistant()` 是新的 builder functions，專門拿來放進 `messages=[]`。

原本的 `prompt=` 參數還是可以用，只是 LLM 會在底下自動把它包成單一訊息的 messages array。

你現在也可以直接 reply 一個 response，而不必先手動組 conversation：

```python
response2 = response.reply("How about Hungary?")
print(response2)  # Default __str__() calls .text()
```

## 串流回應不再只是純文字

另一個大改動在串流輸出。

以前 LLM 的串流大概長這樣：

```python
response = model.prompt("Generate an SVG of a pelican riding a bicycle")
for chunk in response:
    print(chunk, end="")
```

非同步版本也差不多：

```python
import asyncio
import llm

model = llm.get_async_model("gpt-5.5")
response = model.prompt("Generate an SVG of a pelican riding a bicycle")

async def run():
    async for chunk in response:
        print(chunk, end="", flush=True)

asyncio.run(run())
```

但今天很多模型回傳的是混合型內容。像 Claude 可能會先吐 reasoning，再吐文字，再來一個工具呼叫的 JSON request，之後又接更多文字。

有些模型甚至能在伺服器端直接執行工具，例如 OpenAI 的 code interpreter，或 Anthropic 的 web search。這表示模型結果可能混合 text、tool calls、tool outputs，以及其他格式。

多模態輸出也開始出現了，串流裡甚至可能夾著圖片，或像 OpenAI 音訊 API 那樣的音訊片段。

所以新版 LLM 把這些都建模成一串有型別的 message parts。Python API consumer 可以這樣處理：

```python
import asyncio
import llm

model = llm.get_model("gpt-5.5")
prompt = "invent 3 cool dogs, first talk about your motivations"

def describe_dog(name: str, bio: str) -> str:
    """Record the name and biography of a hypothetical dog."""
    return f"{name}: {bio}"

def sync_example():
    response = model.prompt(
        prompt,
        tools=[describe_dog],
    )
    for event in response.stream_events():
        if event.type == "text":
            print(event.chunk, end="", flush=True)
        elif event.type == "tool_call_name":
            print(f"\nTool call: {event.chunk}(", end="", flush=True)
        elif event.type == "tool_call_args":
            print(event.chunk, end="", flush=True)

async def async_example():
    model = llm.get_async_model("gpt-5.5")
    response = model.prompt(
        prompt,
        tools=[describe_dog],
    )
    async for event in response.astream_events():
        if event.type == "text":
            print(event.chunk, end="", flush=True)
        elif event.type == "tool_call_name":
            print(f"\nTool call: {event.chunk}(", end="", flush=True)
        elif event.type == "tool_call_args":
            print(event.chunk, end="", flush=True)

sync_example()
asyncio.run(async_example())
```

用上面 sync 範例跑出來的部分輸出大概會是：

```text
My motivation: create three memorable dogs with distinct “cool” styles—one cinematic, one adventurous, and one charmingly chaotic—so each feels like they could star in their own story.
Tool call: describe_dog({"name": "Nova Jetpaw", "bio": "A sleek silver-gray whippet who wears tiny aviator goggles and loves sprinting along moonlit beaches. Nova is fearless, elegant, and rumored to outrun drones just for fun."}
Tool call: describe_dog({"name": "Mochi Thunderbark", "bio": "A fluffy corgi with a dramatic black-and-gold bandana and the confidence of a rock star. Mochi is short, loud, loyal, and leads a neighborhood 'security patrol' made entirely of squirrels."}
Tool call: describe_dog({"name": "Atlas Snowfang", "bio": "A massive white husky with ice-blue eyes and a backpack full of trail snacks. Atlas is calm, heroic, and always knows the way home—even during blizzards, fog, or confusing camping trips."}
```

回應結束後，你可以呼叫 `response.execute_tool_calls()` 真的把函式跑起來；或者先 `response.reply()` 一次，把工具結果送回模型再接續生成。

這也是為什麼 CLI 現在可以把「thinking」文字用不同顏色顯示，並且把 reasoning text 丟到 stderr，避免污染被 pipe 給其他工具的輸出。

這個例子用的是 Claude Sonnet 4.6，搭配更新過的 streaming event 版本 `llm-anthropic` 插件：

```bash
llm -m claude-sonnet-4.6 'Think about 3 cool dogs then describe them' \
 -o thinking_display 1
```

如果你想把 reasoning tokens 藏起來，也可以用新的 `-R` / `--no-reasoning` flag。意外的是，這居然成了這版唯一一個 CLI 端的變更。

## 可序列化與反序列化的回應

前面提過，LLM 目前在把 conversation 持久化到 SQLite 這件事上，內部寫法還是偏硬綁。0.32a0 新增了一個機制，讓 Python API 使用者可以自己決定怎麼存：

```python
serializable = response.to_dict()
# serializable is a JSON-style dictionary
# store it anywhere you like, then inflate it:
response = Response.from_dict(serializable)
```

這個 dictionary 回傳的是一個 TypedDict，定義在新的 `llm/serialization.py` 模組裡。

## 接下來呢？

我把這版發成 alpha，是因為我還想讓幾個 plugin 先在真實環境裡跑幾天，看看新的設計有沒有問題。我預期穩定版 0.32 會跟這個 alpha 很接近，除非 alpha 測試挖出我目前沒想到的設計缺陷。

還有一個大工作沒做完：我想重做 SQLite logging system，讓它更精準地記錄這種更細碎的互動細節。理想上，我希望把它建成 graph，特別是像 OpenAI 風格的 chat completions API 這種情況：同一段 conversation 會不斷延長、然後每次 prompt 都重播一次。我要能把這些結構存下來，而不要在資料庫裡重複複製。

至於這要放進 0.32，還是留到 0.33，我還沒決定。

<div class="sep">· · ·</div>

## 延伸評論：這次重構真正做對的，是先承認模型世界已經變了

LLM 0.32a0 看起來像 API 重構，但本質上是一次世界觀更新。它承認今天的模型不再只是「一個 prompt 換一段文字」，而是會記錄角色、工具呼叫、推理軌跡與多模態片段的複合系統。

這種抽象一旦做對，價值會很久。因為做 agent、做模型平台、做 provider adapter 的人，最怕的就是 API 把現實壓扁成假簡單的 text in / text out。那種設計早晚會在工具呼叫、串流格式、或 response 儲存上爆炸。

更有意思的是，Simon 沒把 SQLite 當成世界答案。反而是先把 response 變成可序列化物件，讓上層自己決定怎麼存。這種克制很重要：基礎庫應該提供穩定抽象，不該過早把儲存策略綁死。

對真的在做模型整合的人來說，這篇最有啟發的不是某個新功能，而是那種「把舊 API 慢慢拆到能容納新現實」的工程節奏。
