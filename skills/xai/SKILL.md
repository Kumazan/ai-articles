---
name: xai
description: Chat, image generation, and X/Twitter search via xAI Grok models.
homepage: https://docs.x.ai
triggers:
  - grok
  - xai
  - ask grok
metadata:
  clawdbot:
    emoji: "🤖"
---

# xAI / Grok

Chat, image generation/editing, and real-time X/Twitter search via xAI API.

## Setup

```bash
# Environment variable (recommended)
export XAI_API_KEY="xai-YOUR-KEY"

# Or OpenClaw config
openclaw config set skills.entries.xai.apiKey "xai-YOUR-KEY"
```

API key 查找順序：`XAI_API_KEY` env → `.secrets/xai.env`（image.js）→ OpenClaw config

Get your API key at: https://console.x.ai

## Commands

### Chat with Grok
```bash
node {baseDir}/scripts/chat.js "What is the meaning of life?"
node {baseDir}/scripts/chat.js --model grok-4.20-0309-reasoning "Solve this step by step"
```

### Vision (analyze images)
All chat models natively support vision — no need to specify a separate model.
```bash
node {baseDir}/scripts/chat.js --image /path/to/image.jpg "What's in this image?"
```

### Image generation
```bash
node {baseDir}/scripts/image.js --prompt "A sunset over mountains" --out sunset.jpg
node {baseDir}/scripts/image.js --prompt "A sunset over mountains" --aspect_ratio 16:9 --out wide.jpg
```

### Image editing
```bash
node {baseDir}/scripts/image.js --prompt "Make the sky purple" --image input.jpg --out edited.jpg
```

### Search X/Twitter (real-time)
Uses xAI Responses API with `x_search` tool for real X posts with citations.
```bash
node {baseDir}/scripts/search-x.js "Remotion video framework"
node {baseDir}/scripts/search-x.js --days 7 "Claude AI tips"
node {baseDir}/scripts/search-x.js --handles @remotion_dev,@jonnyburger "updates"
```

### List available models
```bash
node {baseDir}/scripts/models.js
```

## Available Models

### Chat (all support vision)
| Model ID | 特色 |
|----------|------|
| `grok-4.20-0309-reasoning` | 旗艦級，2M context，reasoning |
| `grok-4.20-0309-non-reasoning` | 旗艦級，不帶 reasoning |
| `grok-4.20-multi-agent-0309` | 多 agent 版本 |
| `grok-4-1-fast-reasoning` | 速度優化，reasoning |
| `grok-4-1-fast-non-reasoning` | 速度優化，無 reasoning（chat.js 預設） |

### Image / Video
| Model ID | 功能 |
|----------|------|
| `grok-imagine-image` | 文字/圖片 → 圖片（image.js 預設） |
| `grok-imagine-image-pro` | Pro 版圖片生成 |
| `grok-imagine-video` | 文字/圖片 → 影片 |

### Search
| Model ID | 功能 |
|----------|------|
| `grok-4-1-fast` | X/Twitter 搜尋（search-x.js 預設） |

## Scripts

| 腳本 | 預設模型 | 用途 |
|------|----------|------|
| `chat.js` | `grok-4-1-fast-non-reasoning` | 文字對話 + 圖片分析 |
| `image.js` | `grok-imagine-image` | 圖片生成/編輯 |
| `search-x.js` | `grok-4-1-fast` | 即時搜尋 X/Twitter |
| `models.js` | — | 列出可用模型 |

## Environment Variables

- `XAI_API_KEY` — xAI API key (required)
- `XAI_MODEL` — Override default chat model (optional)

## API Reference

- Docs: https://docs.x.ai/api
- Models & Pricing: https://docs.x.ai/developers/models
