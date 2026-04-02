# Plan: OG Image 全覆盖

## 目標

為 ai-articles 站所有 35 篇文章補上 OG image，確保每篇都有社交分享卡圖。

## 現況

- 35 篇中 26 篇缺 OG image（`image` frontmatter 空白）
- 9 篇已有 OG image
- OG image 存放位置：`/YYYY-MM-DD/og-{slug}.png`
- 文章內 header 圖插入位置：hero-badge 後、原文連結前

## OG Image 規格

（現有風格，保持一致）

```
Aspect ratio 1200x630 (wide landscape)
Editorial magazine illustration
Warm cream paper background (#FAF8F5)
[文章主題的 ink-style line art 描述] with terracotta red (#c44b2b) accent highlights
[視覺元素描述]
Minimal, sophisticated, no 3D rendering
Muted warm tones with selective red accents only
No blue, no cyan, no neon, no glow effects, no lens flare, no light leaks
No text, no title, no words, no letters, no watermarks — pure illustration only
```

## 執行順序（按品質分數）

| 順序 | 分數 | 文章 |
|------|------|------|
| 1 | 40 | deepmind-measuring-agi-cognitive-framework |
| 2 | 37 | simon-willison-victorian-era-llm |
| 3 | 37 | vllm-2026-open-source-llm-inference-engine |
| 4 | 36 | openai-monitoring-coding-agents |
| 5 | 35 | stanford-ai-sycophancy |
| 6 | 35 | lessons-building-claude-code-prompt-caching |
| 7 | 34 | mistral-voxtral-tts |
| 8 | 34 | deepmind-measuring-agi |
| 9 | 33 | openai-acquires-astral |
| 10 | 33 | anthropic-claude-mythos-capybara-leak |
| 11 | 33 | bonsai-1bit-llm |
| 12 | 33 | evaluation-flywheel |
| 13 | 33 | claude-code-underrated-features |
| 14 | 32 | latent-space-agent-harness |
| 15 | 32 | perplexity-realtime-voice |
| 16 | 32 | claude-dispatch-power |
| 17 | 31 | ai-agents-free-software |
| 18 | 31 | cognitive-dark-forest |
| 19 | 31 | anthropic-81000 |
| 20 | 30 | block-from-hierarchy |
| 21 | 30 | anthropic-claude-mythos |
| 22 | 29 | openai-122b-funding |
| 23 | 28 | china-llm-landscape |
| 24 | 28 | march-2026-llm-releases |
| 25 | 27 | claude-code-source-leak |
| 26 | 23 | google-turboquant |

## 每篇流程

1. 讀文章內容，提取主題關鍵字
2. 產出 OG image prompt（Editorial 風格，見規格）
3. `image_generate` 生 3 張
4. 選最佳 → `og-{slug}.png`；備選 → `og-{slug}-a.png / -b.png / -c.png`
5. 更新 frontmatter：`image: /YYYY-MM-DD/og-{slug}.png`
6. 在 body hero-badge 後插入 `![](/YYYY-MM-DD/og-{slug}.png)`
7. `git add / commit / push`
8. 下一篇

## 已有的 9 篇（跳過）

- anthropic-81000-people-want-from-ai ✅
- block-from-hierarchy-to-intelligence ✅
- claude-code-source-leak-2026 ✅
- harness-design-long-running-apps ✅
- microsoft-copilot-multi-ai-critique ✅
- runway-launches-10m ✅
- vllm-2026-open-source-llm-inference-engine-sonnet ✅
- prismml-bonsai-1bit-llm-edge-ai ✅
- ai-models-april-2026 ❌ (已下架)

## 工具限制

- `image_generate` 只能在主 session 跑，不可放 subagent
- 每篇約 2-3 分鐘（生圖 + 選圖 + commit）
- 26 篇總計約 60-90 分鐘

## 失敗處理

- 某篇 image_generate 失敗 → 跳過該篇，繼續下一篇，最後統一補送失敗清單
- git push 失敗 → 等 10 秒重試，3 次失敗則放棄並通知

##產出

- 26 篇全部完成 → DONE
- 部分完成 → 失敗清單 + 進度記錄
