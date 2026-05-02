---
title: "訂閱越來越貴？本機 AI coding agents 開始有實戰價值了"
description: "The Register 實測用 Qwen3.6-27B、Llama.cpp 與多種 agent harness 跑本機 coding agents，降低雲端 token 成本並保留控制權。"
date: 2026-05-03
author: Tobias Mann and Thomas Claburn
image: /2026-05-03/og-local-ai-coding-agents.png
layout: post
permalink: /2026-05-03/local-ai-coding-agents.html
---

<div class="hero-badge">The Register · 2026-05-02</div>

![](/ai-articles/2026-05-03/og-local-ai-coding-agents.png)

**原文連結：** [The Register - How to roll your own local AI coding agents](https://www.theregister.com/2026/05/02/local_ai_coding_agents/)

## 摘要

- 隨著 Anthropic、Microsoft 等工具開始收緊額度或轉向 usage-based pricing，本機 coding agents 重新變得值得考慮。
- Alibaba 的 Qwen3.6-27B 主打「旗艦級 coding power」，大小足以在 32GB M-series Mac 或 24GB GPU 上運行。
- 文章示範用 Llama.cpp 啟動 Qwen3.6-27B，並搭配 Claude Code、Pi Coding Agent 或 Cline 作為 agentic coding harness。
- 本機模型需要調整 temperature、top_p、top_k、context window、KV cache precision 與 prefix caching，否則很容易產出壞 code。
- Qwen3.6-27B 不能取代 Opus 4.7 或 GPT-5.5，但已能處理小型 script、簡單 web app 與聚焦的 bug fix。
- 安全性仍是關鍵：Claude Code 與 Cline 預設有人類確認，Pi Coding Agent 則偏 YOLO，最好放進 VM、container 或專用環境。

<div class="sep">· · ·</div>

隨著模型開發商推動更嚴格的 rate limits、提高價格，甚至放棄訂閱制改走 usage-based pricing，那些靠 vibe coding 做出來的興趣專案，很快就會變得更貴。不過，想省錢的人也不是完全沒有選項。

過去幾週，Anthropic 曾試探性地把 Claude Code 從最便宜的方案中拿掉；Microsoft 則更直接，把 GitHub Copilot 轉向純 usage-based 模型。這讓人不得不問：真的每次都需要 Anthropic 或 OpenAI 的頂級模型嗎？還是某些任務其實可以交給比較小的本機模型？

本機模型當然可能比較慢、能力較弱，也更容易讓人挫折。但如果硬體已經在手上，免費這件事仍然很有吸引力。

剛好 Alibaba 最近釋出了 Qwen3.6-27B。官方宣稱，這個模型把「旗艦級 coding power」塞進一個足以在 32GB M-series Mac 或 24GB GPU 上運行的大小。

### 這次和以前哪裡不同

這不是 The Register 第一次研究本機 code assistants。先前他們曾經用 Continue 的 VS Code extension 來做程式補全與生成。當時模型和軟體堆疊都還不成熟，雖然能用，但離大型前沿模型還有明顯差距。

現在狀況不同了。模型架構和 agent harness 都進步很多：reasoning 能力讓小模型可以用更長的思考時間彌補尺寸限制；Mixture-of-Experts 讓互動體驗不一定需要每秒數 TB 的記憶體頻寬；function calling 和 tool calling 也成熟到讓模型能實際操作 codebase、shell environment 和 web。

換句話說，本機 coding agent 不再只是「離線 autocomplete」。它開始能進入開發流程，只是能力邊界還需要看清楚。

### 沒有 rate limit 的 vibe coding

這篇實測的重點，是部署並設定像 Qwen3.6-27B 這類本機模型，讓它在自己的電腦上協助 coding，並比較幾個可搭配的 agent frameworks。

硬體門檻仍然存在。文章建議使用至少 24GB VRAM 的 Nvidia、AMD 或 Intel GPU；如果是較新的 Mx-Max 系列 Mac，則建議至少 32GB unified memory。記憶體不足時，可以研究如何把系統記憶體與 GPU 記憶體合併使用。

推論端則以 Llama.cpp 為例。LM Studio、Ollama 或 MLX 也能做類似設定。需要注意的是，較舊的 M-series Mac 可能會被 agentic coding 所需的長 context 壓垮；這時 oMLX 這類更能利用 Apple hardware accelerators 的 inference engine，也許會有幫助，但效果仍要實測。

### 啟動模型前要先調參

現在要在本機跑 LLM 已經很簡單：安裝 inference engine、下載模型，然後透過 API 連上應用程式即可。

但 coding assistant 對參數很敏感。如果沒有調對，模型很容易輸出垃圾或壞掉的程式碼。Qwen3.6-27B 也不例外。Alibaba 建議 vibe coding 使用以下設定：

- `temperature=0.6`
- `top_p=0.95`
- `top_k=20`
- `min_p=0.0`
- `presence_penalty=0.0`
- `repetition_penalty=1.0`

context window 也要盡可能拉大。大型 codebase 加上 agent framework 的 system prompt，很快就會吃掉大量 tokens。Qwen3.6-27B 支援 262,144-token context window，但除非有高階 Mac 或 workstation GPU，否則很難在 16-bit precision 下完整吃滿。

好消息是，負責追蹤模型狀態的 key-value cache 不一定要用 16-bit 儲存。把 KV cache 壓到 8-bit，通常可以在效能和品質之間取得可接受的折衷。prefix caching 也應該打開，因為 agent 工作流常會反覆處理相同的 system prompt 或 codebase context；快取後可以避免每次都重算。

文章用 24GB Nvidia RTX 3090 Ti 示範的 Llama.cpp 啟動指令如下：

```bash
llama-server \
  --hf-repo unsloth/Qwen3.6-27B-GGUF:Q4_K_M \
  --ctx-size 65536 \
  -ngl 999 \
  --flash-attn on \
  --cache-prompt \
  --cache-type-k q8_0 \
  --cache-type-v q8_0 \
  --temp 0.6 \
  --top-p 0.95 \
  --top-k 20 \
  --min-p 0.0 \
  --presence-penalty 0.0 \
  --repeat-penalty 1.0 \
  --port 8080
```

如果想讓同一個區網裡的其他機器存取 Llama.cpp，還可以加上 `--host 0.0.0.0`。但這會把服務暴露到區網，因此在 VPC 或較開放環境中一定要先設定 firewall rules。

### 選一個 agent framework

模型啟動後，下一步是接上 agentic coding harness。模型本身會生成程式碼，但如果沒有開發環境，它無法實作、測試或除錯。vibe coding 之所以能起飛，很大一部分原因是 code 可以驗證：它不是能跑、能編譯，就是不能。

文章比較三個選項：Claude Code、Pi Coding Agent 和 Cline。

### Claude Code：不一定只能用 Claude

第一個選項是 Claude Code。雖然名字叫 Claude Code，但它不一定只能搭配 Anthropic 的模型；只要資源足夠，也可以連到本機模型。

安裝 Claude Code 後，可以透過環境變數讓它連向本機服務，而不是 Claude 帳號或 Anthropic API：

```bash
export ANTHROPIC_BASE_URL="http://localhost:8001"
export ANTHROPIC_API_KEY='none'
claude
```

這些環境變數每次開新 shell session 都需要重新設定。設定完成後，Claude Code 仍會像平常一樣運作，只是背後用的是本機模型。

### Pi Coding Agent：輕量，但預設更冒險

如果不只想用本機模型，也想用 open source harness，Pi Coding Agent 是另一個選項。它和 Claude Code 一樣不太挑模型。

Pi Coding Agent 的吸引力在於輕量。長 input 對低階或舊 GPU 壓力很大，而 Claude Code 與 Cline 的 system prompt 都可能讓硬體吃緊。相比之下，Pi Coding Agent 的預設 system prompt 短很多，搭配 prompt caching 時會更順。

代價是 guardrails 與 safety features 比較少。文章建議最好把它放進 VM、container，甚至 Raspberry Pi 這種專用環境裡跑。

設定方式是建立模型設定檔，告訴 agent harness 本機模型在哪裡：

```json
"providers": {
    "llama.cpp": {
      "baseUrl": "http://localhost:8080/v1",
      "api": "openai-completions",
      "apiKey": "none",
      "models": [
        { "id": "unsloth/Qwen3.6-27B-GGUF:Q4_K_M" }
      ]
    }
  }
}
```

接著在工作目錄啟動：

```bash
pi --model unsloth/Qwen3.6-27B-GGUF:Q4_K_M
```

### Cline：IDE 裡的折衷選項

第三個選項是 Cline。它是 open source，也能作為 VS Code 等 IDE 的 extension 使用。安裝後，只要把 Cline 指向 Llama.cpp server，再設定 model ID、context window size 和 temperature 即可。

文章使用的設定是：

- Base URL：`http://localhost:8080/v1`
- Model ID：`unsloth/Qwen3.6-27B-GGUF:Q4_K_M`
- Context Window Size：`65536`
- Temperature：`0.6`

Cline 的一個實用功能，是可以在純 planning mode 和 action mode 之間切換。如果使用者只是想討論問題，不希望 agent 立刻把每個問題都當成行動指令，這個分流會很有幫助。

### 本機模型終於夠好了嗎？

Qwen3.6-27B 能取代 Opus 4.7 或 GPT-5.5 嗎？答案是否定的。27B 模型不會突然變成多兆參數級前沿模型。

但它能做到的事已經比很多人想像得多。The Register 的測試中，Qwen3.6-27B 搭配 Cline 能一次生成互動式太陽系 web app，也能在既有 codebase 中準確找出並修補 bug。

當然，這些都是相對簡單的專案。為了更貼近實務，作者 Tobias Mann 也把模型交給同事 Thomas Claburn，請他拿自己最近使用 Claude Code 的經驗來比較。

Claburn 的結論是，他用 Pi Coding Agent 搭配 OMLX 作為 model server，雖然 token rate 慢很多，但至少在小型 scripts 上，Qwen 的表現讓他滿意。例如他要求模型寫一個依指定寬度調整圖片尺寸的 Python script，模型花了約 5 分鐘、經過幾次人工批准後完成。

有趣的是，Claude Code 對 Qwen 輸出的評價比他預期更正面，甚至稱那份 script 整體是「strong, production-quality script」。Claude 仍提出一些改進建議，例如 `get_save_format` 把所有非 PNG 都默默當成 JPEG，若未來支援 WebP 等格式可能會出錯；但那些不是立即必要的修正。

Claburn 因此認為，本機 agents 已經可以用在聚焦、離散的小型 code changes、scripts 和 minimal web projects。至於更大的專案，可能仍會有太多地方需要人工修正。最好的判斷方式，還是拿自己的任務實測；同時記得準備足夠記憶體，並先備份資料。

### 這些 agent 安全嗎？

安全性仍然不能輕忽。所幸，文中提到的大多數 frameworks 預設自主性有限。Claude Code 和 Cline 通常需要 human-in-the-loop 批准 code changes 與 shell commands。

只要沒有把大量命令白名單化，也沒有不看內容就一路按 enter，blast radius 通常還算可控。話雖如此，使用者仍需要理解程式語言和常見 CLI commands。如果模型突然要求對 working directory 之外的檔案或資料夾執行 `rm -rf`，就應該立刻警覺。

Pi Coding Agent 則不同。它預設比較接近 YOLO mode，可以自由讀寫它有權限存取的東西。在專用開發環境裡，這也許是可接受風險；否則就應該把它放進真正的 sandbox。

最簡單的方式之一是 containerization。可以啟動 Docker container，並只把工作目錄掛進去：

```bash
docker run -it --name vibe_container -v working_dir:/working_dir ubuntu /bin/bash
```

這樣變更會被限制在該資料夾或 container 內。對本機 agent 來說，這種隔離不是加分項，而是基本安全帶。

<div class="sep">· · ·</div>

## 延伸評論：本機 agent 的價值不是便宜，而是可控

這篇文章表面上是在教人省 token 費，但真正值得注意的是「控制權」重新被拿回使用者手上。當雲端 coding agents 開始改價格、收緊額度，或把能力綁進特定訂閱方案，本機模型就不只是窮人版替代品，而是一條可以實驗、隔離、客製化與長時間運行的路線。

不過，本機 agent 不能被浪漫化。Qwen3.6-27B 這類模型能處理小型任務，不代表它能穩定接手大型 repo、複雜遷移或高風險 production 變更。真正務實的用法，是把它放在低風險、可驗證、可重跑的工作上：小腳本、局部重構、測試補齊、demo app、文件轉換、重複性修補。只要任務邊界清楚，本機 agent 的低邊際成本就會很有吸引力。

更重要的是安全與工作流設計。雲端 frontier agent 的風險在於能力太強、權限太廣；本機 agent 的風險則常常是 guardrails 太薄、使用者太容易把整台電腦交出去。可用的本機 coding agent workflow 應該預設放在 container、VM 或專用 worktree 裡，並把 git diff、tests、shell approval 和備份變成固定儀式。省錢不是重點；能不能在出事時把損害限制住，才是本機 agent 是否值得導入的分水嶺。
