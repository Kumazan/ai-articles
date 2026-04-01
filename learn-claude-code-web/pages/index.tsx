import Head from 'next/head';
import styles from '../styles/source.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Claude Code 原始碼解析 — Leak Analysis 2026</title>
        <meta name="description" content="Claude Code 原始碼外洩完整解析：架構、隱藏功能、技術細節，全部從 512,000 行 TypeScript 原始碼中挖出來的。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦐</text></svg>" />
      </Head>

      {/* HEADER */}
      <header className="header">
        <span className="header-logo">// CLAUDE_CODE_LEAK_2026</span>
        <span className="header-badge">src/ · 1,906 files · 512K lines</span>
      </header>

      <main>

        {/* HERO */}
        <section className="hero">
          <div className="hero-eyebrow">March 31, 2026 · Anthropic npm packaging failure</div>
          <h1 className="hero-title">
            Claude Code<br /><em>原始碼</em><br />完整解析
          </h1>
          <p className="hero-subtitle">
            59.8MB source map → 1,900 個 TypeScript 檔案 → 512,000 行程式碼。
            一個 misconfigured .npmignore，讓全世界看到了 Anthropic 最值錢產品的內部架構。
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num accent">512K</span>
              <span className="hero-stat-label">行 TypeScript</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num green">1,906</span>
              <span className="hero-stat-label">原始檔案</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num yellow">44</span>
              <span className="hero-stat-label">隱藏 feature flags</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num blue">$2.5B</span>
              <span className="hero-stat-label">Claude Code ARR</span>
            </div>
          </div>
          <div className="hero-date">
            Source: npm source map · R2 bucket · Anthropic internal build v2.1.88
          </div>
        </section>

        <div className="divider" />

        {/* WHAT HAPPENED */}
        <section className="section">
          <p className="section-label">01 · 事故經過</p>
          <h2 className="section-title">59.8MB 原始碼如何流出的</h2>
          <p className="section-desc">
            一切始於一個 .npmignore 設定失誤，加上 Anthropic 收購的 Bun 有一個已知的 bug。
            然後是 R2 bucket 權限設定錯誤。三層失效同時發生。
          </p>

          <div className="arch-flow">
{`  npm install @anthropic-ai/claude-code
   ↓
  main.js.map (59.8 MB)  ← 不該出現在 production 的 source map
   ↓
  .map 指向 src.zip URL
   ↓
  Anthropic R2 bucket（公開、無認證）
   ↓
  任何人下載 → 512,000 行 TypeScript 原始碼`}
          </div>

          <div className="two-col" style={{ marginTop: 32 }}>
            <div className="card">
              <p className="card-label">Root Cause</p>
              <p className="card-title accent">Missing .npmignore entry</p>
              <p className="card-desc">
                Claude Code 的 .npmignore 漏掉了 <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--bg-2)', padding: '2px 6px', borderRadius: 4 }}>*.map</code> 和 <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--bg-2)', padding: '2px 6px', borderRadius: 4 }}>dist/*.map</code>。
                npm 打包時沒排除 source map，直接連同產品一起發布。
              </p>
            </div>
            <div className="card">
              <p className="card-label">Bun Factor</p>
              <p className="card-title yellow">Known Bug #28001</p>
              <p className="card-desc">
                Anthropic 在 2025 年底收購了 Bun。Bug #28001 在事故前 20 天就有人回報，但從未被標記為高風險。
                自家的工具鏈，貢獻了自家產品的原始碼外洩。
              </p>
            </div>
          </div>

          <div className="callout yellow" style={{ marginTop: 32 }}>
            <strong>Hacker News 金句：</strong>
            「Your .npmignore is load-bearing. Treat it like a security boundary.」
          </div>
        </section>

        {/* TIMELINE */}
        <section className="section">
          <p className="section-label">02 · 事件時間線</p>
          <h2 className="section-title">48 小時內發生了什麼</h2>

          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-time">00:21 UTC · March 31</div>
              <div className="timeline-event">axios RAT supply chain attack</div>
              <div className="timeline-detail">Malicious axios 1.14.1 / 0.30.4 上架 npm，含有木馬。與 Anthropic 無關，但時機糟糕透頂。</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-time">~04:00 UTC</div>
              <div className="timeline-event">Claude Code v2.1.88 上架 npm</div>
              <div className="timeline-detail">59.8MB source map 連同產品一同發布。R2 bucket 正式公開。</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-time">04:23 UTC</div>
              <div className="timeline-event">Chaofan Shou (@Fried_rice) 發推</div>
              <div className="timeline-detail">直接附上 R2 bucket 下載連結。16 million views in hours。GitHub repo 2 小時內 50,000 stars。</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-time">08:00 UTC</div>
              <div className="timeline-event">Anthropic 下架 + 發聲明</div>
              <div className="timeline-detail">從 npm registry 移除 v2.1.88。發「human error, not a security breach」聲明。</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-time">Same day</div>
              <div className="timeline-event">Python clean-room rewrite 出現</div>
              <div className="timeline-detail">DMCA-proof：用 Python 從零重寫，聲稱不侵犯任何版權。</div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ARCHITECTURE */}
        <section className="section">
          <p className="section-label">03 · 核心架構</p>
          <h2 className="section-title">Claude Code 不是聊天 wrapper，是 Plugin 架構</h2>
          <p className="section-desc">
            每個能力都是獨立的、權限控管的 plugin tool。底層是 Query Engine，處理所有 LLM API call。
            三層 Memory Architecture 是對抗「context entropy」的答案。
          </p>

          <div className="three-col">
            <div className="card">
              <p className="card-label">Tool System</p>
              <p className="card-stat accent">~40 tools</p>
              <p className="card-stat" style={{ fontSize: 18, color: 'var(--text-muted)' }}>~29,000 lines</p>
              <p className="card-desc" style={{ marginTop: 12 }}>
                BashTool, FileReadTool, FileEditTool, FileWriteTool, WebFetchTool, GlobTool, GrepTool, TodoWriteTool, TaskTool, NotebookEditTool...
                每個 tool 有獨立的權限模型、驗證邏輯、輸出格式。
              </p>
            </div>
            <div className="card">
              <p className="card-label">Query Engine</p>
              <p className="card-stat green">46,000 lines</p>
              <p className="card-desc" style={{ marginTop: 12 }}>
                被稱為「the brain of the operation」。處理所有 LLM API call + response streaming、token 快取、context 管理、multi-agent orchestration、retry logic。
              </p>
            </div>
            <div className="card">
              <p className="card-label">Memory Architecture</p>
              <p className="card-stat blue">3 layers</p>
              <p className="card-desc" style={{ marginTop: 12 }}>
                三層對抗 context entropy：指針索引 → 主題檔案 → 原始 transcript。Strict Write Discipline：只能寫入成功後的狀態。
              </p>
            </div>
          </div>

          <div className="code-block" style={{ marginTop: 32 }}>
{`  Three-Layer Memory Architecture
  ==============================

  Layer 1: MEMORY.md
    → 輕量指標索引（每個 entry ~150 chars）
    → 永遠載入 context
    → 只存位置，不存資料

  Layer 2: Topic Files
    → 實際專案知識，按需 fetch
    → 不同時完全放進 context

  Layer 3: Raw Transcripts
    → 從不完整重讀
    → 只用 grep 抓特定 identifier

  Key: Strict Write Discipline
    → agent 只在 confirmed successful file write 後才更新 memory index
    → 防止失敗的嘗試污染 context`}
          </div>
        </section>

        {/* TOOLS ANALYSIS */}
        <section className="section pattern-section">
          <p className="section-label">04 · 從原始碼學 Agent 設計</p>
          <h2 className="section-title">MinusX 的工程師實際攔截分析</h2>
          <p className="section-desc">
            MinusX 的工程師 Sreejith 寫了一個 logger，攔截並分析每一次網路請求。
            發現了很多「為什麼 Claude Code 做起來這麼順」的答案。
          </p>

          <div className="lesson-list">
            <div className="lesson-item">
              <div className="lesson-num">01</div>
              <div>
                <div className="lesson-title">一個主迴圈 + 最多一個分支</div>
                <div className="lesson-desc">
                  Claude Code 維護一個 flat message list。複雜任務時，agent 會 clone 自己（但限制不能繼續 spawn subagent）。max-1-branch 確保能看到最終目標，subagent 結果當 tool response 放回 main history。
                </div>
              </div>
              <div className="lesson-tag">Control Loop</div>
            </div>
            <div className="lesson-item">
              <div className="lesson-num">02</div>
              <div>
                <div className="lesson-title">50%+ 的 LLM call 是 Haiku，不是 Sonnet/Opus</div>
                <div className="lesson-desc">
                  Haiku 處理：讀大檔案、解析網頁、處理 git history、summarize 長對話。每一個 keystroke 的 one-word processing label 也是 Haiku。小模型便宜 70-80%，用起來毫不心疼。
                </div>
              </div>
              <div className="lesson-tag">Cost Optimization</div>
            </div>
            <div className="lesson-item">
              <div className="lesson-num">03</div>
              <div>
                <div className="lesson-title">System prompt ~2,800 tokens · Tools ~9,400 tokens</div>
                <div className="lesson-desc">
                  System prompt 包含：tone、style、proactiveness、task management、tool usage policy。Tools 的描述極度詳細，充滿 heuristics 和 examples。CC 還會傳 claude.md（1,000-2,000 tokens）。
                </div>
              </div>
              <div className="lesson-tag">Prompts</div>
            </div>
            <div className="lesson-item">
              <div className="lesson-num">04</div>
              <div>
                <div className="lesson-title">LLM search &gt;&gt;&gt; RAG</div>
                <div className="lesson-desc">
                  Claude Code 拒絕 RAG。用 ripgrep、jq、find 搜尋 code 跟你自己搜的方式完全一樣。LLM 理解 code，用 regex 找到幾乎任何 block。需要時用小模型讀完整檔案。RAG 帶來 hidden failure modes。
                </div>
              </div>
              <div className="lesson-tag">Search</div>
            </div>
            <div className="lesson-item">
              <div className="lesson-num">05</div>
              <div>
                <div className="lesson-title">Agent 自己維護 todo list</div>
                <div className="lesson-desc">
                  不是「一個 model 生成 todo、另一個執行」的 multi-agent handoff（已知是壞設計）。CC 用 model 自行維護 explicit todo，並被 heavily prompted 要時常參照。model 有彈性在中間插入或 reject item。
                </div>
              </div>
              <div className="lesson-tag">Planning</div>
            </div>
            <div className="lesson-item">
              <div className="lesson-num">06</div>
              <div>
                <div className="lesson-title">Tone + Style sections，控制美學行為</div>
                <div className="lesson-desc">
                  CC 在 system prompt 有專門章節控制 tone、style、proactiveness，全是 instructions + examples。這就是為什麼 CC「感覺」有品味、有度。推薦直接複製進自己的 app。
                </div>
              </div>
              <div className="lesson-tag">UX</div>
            </div>
          </div>

          <div className="callout" style={{ marginTop: 32 }}>
            <strong>關鍵啟發：</strong>「Keep Things Simple, Dummy.」LLM 已經夠難 debug 了，任何多餘的複雜度（multi-agent、agent handoffs、複雜 RAG）只會讓問題困難 10 倍。CC 在每個架構決策都選擇簡單。
          </div>
        </section>

        {/* HIDDEN FEATURES */}
        <section className="section">
          <p className="section-label">05 · 隱藏功能</p>
          <h2 className="section-title">44 個未發布的 Feature Flags</h2>
          <p className="section-desc">
            原始碼中充滿 feature flags，藏在 <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--bg-2)', padding: '2px 6px', borderRadius: 4 }}>feature('FLAG_NAME')</code> dead-code-elimination block 裡。
            Bun 的 bundler 會在正式 build 把這些 block 拔掉，但原始碼全部可見。
          </p>

          <div className="feature-grid">
            <div className="feature-card">
              <span className="feature-card-icon">🧠</span>
              <div className="feature-card-name">KAIROS</div>
              <h3>Always-On Autonomous Agent</h3>
              <p>
                150+ 處參照。是一個 autonomous background daemon mode，在 user idle 時執行 background sessions。執行 <code>autoDream</code> 進行夜間 memory consolidation，合併 observation、移除邏輯矛盾、將模糊洞察轉化為驗證過的事實。還有特殊的 Brief output mode。
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-card-icon">⚡</span>
              <div className="feature-card-name">ULTRAPLAN</div>
              <h3>30-Minute Remote Planning</h3>
              <p>
                將複雜規劃任務 offload 到遠端 Cloud Container Runtime（CCR）session，給它最多 30 分鐘思考，然後讓你從手機或瀏覽器 approve 結果。通過特殊 sentinel value <code>__ULTRAPLAN_TELEPORT_LOCAL__</code> 把結果帶回本地 terminal。
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-card-icon">👥</span>
              <div className="feature-card-name">COORDINATOR_MODE</div>
              <h3>Multi-Agent Orchestration</h3>
              <p>
                一個 Claude 調度 + 管理多個 worker Claude agents 平行執行。Coordinator 負責 task distribution、result aggregation、conflict resolution。Worker agents 之間有 async mailbox 溝通。
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-card-icon">🎮</span>
              <div className="feature-card-name">BUDDY</div>
              <h3>Tamagotchi-Style AI Pet</h3>
              <p>
                藏在 <code>buddy/companion.ts</code> 裡。18 種生物（duck, dragon, axolotl, capybara...），用 <code>String.fromCharCode()</code> 隱藏名稱。5 種屬性：DEBUGGING / PATCIENCE / CHAOS / WISDOM / SNARK。1% 閃亮機率。計畫上線日：April 1-7, 2026。
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-card-icon">🛡️</span>
              <div className="feature-card-name">ANTI_DISTILLATION</div>
              <h3>Anti-Distillation Defense</h3>
              <p>
                <code>claude.ts</code> 有 <code>ANTI_DISTILLATION_CC</code> flag。開啟後在 API request 裡發送 <code>anti_distillation: ['fake_tools']</code>，在 system prompt 注入 decoy tool definitions，污染競爭對手的訓練資料。
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-card-icon">📝</span>
              <div className="feature-card-name">UNDERCOVER MODE</div>
              <h3>Concealing Internal Codenames</h3>
              <p>
                <code>undercover.ts</code> 模組指示 CC 永不提及內部 codename（如「Capybara」或「Tengu」）。NO force-OFF：可以 force turn on，但無法 force turn off。外部 build 時 function 整個被拔掉。
              </p>
            </div>
          </div>
        </section>

        {/* PATTERNS FROM CLAUDE'S OWN ANALYSIS */}
        <section className="section pattern-section">
          <div className="pattern-header">
            <span className="pattern-num">06</span>
            <span className="pattern-label">Claude's Own Analysis · Pattern Implementation</span>
          </div>
          <h2 className="pattern-name">Claude 自己寫的實作</h2>
          <p className="pattern-desc">
            有趣的是，dreadhead.io 部落格的作者就是 Claude 自己。它分析了原始碼後，動手實作了三個模式。
            以下是完整 Python 實作：
          </p>

          <div className="card" style={{ marginTop: 32 }}>
            <p className="card-label">Pattern 1 · Cron-Scheduled Agents</p>
            <p className="card-title green">CronCreateTool 再現</p>
            <p className="card-desc">
              Claude Code 原始碼有 <code>CronCreateTool</code>、<code>CronDeleteTool</code>、<code>CronListTool</code>。
              Agent 可以自己決定「我應該每天早上檢查這個 repo」，寫下一個 cron entry。
              用 Claude Code 的 <code>--print</code> flag（單次 headless turn）+ system cron 就可以做到相同效果。
            </p>
            <div className="code-block">
{`#!/usr/bin/env python3
# claude-cron.py — 排程 Claude agents
# Usage: python claude-cron.py add "0 9 * * 1-5" \\
#   "Look at git log --since=yesterday. Write to ~/standup.md"

import json, subprocess
from pathlib import Path
from crontab import CronTab

STORE = Path.home() / ".claude-cron" / "tasks.json"

def add_task(schedule: str, prompt: str, cwd: str = "."):
    tasks = json.loads(STORE.read_text()) if STORE.exists() else []
    tasks.append({"id": len(tasks)+1, "schedule": schedule, "prompt": prompt, "cwd": cwd})
    STORE.parent.mkdir(exist_ok=True)
    STORE.write_text(json.dumps(tasks, indent=2))

    cron = CronTab(user=True)
    job = cron.new(
        command=f'claude -p "{prompt}" --output-format json >> ~/.claude-cron/log-{len(tasks)}.jsonl 2>&1',
        comment=f"claude-cron-{len(tasks)}"
    )
    job.setall(schedule)
    cron.write()
    print(f"Scheduled: {schedule} → {prompt[:40]}...")

# 每個工作日 9am：總結 overnight issues
add_task("0 9 * * 1-5", "Summarise open PRs. Write 5-bullet standup to ~/standup.md")

# 每小時：檢查 CI 是否有 flaky tests
add_task("0 * * * *", "Check .github/workflows/ for recent failures. If test failed 3+ times, open a draft issue.")`}
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <p className="card-label">Pattern 2 · Multi-Agent Swarms</p>
            <p className="card-title yellow">TeamCreateTool 再現</p>
            <p className="card-desc">
              原始碼的 swarm architecture 用 <code>TeamCreateTool</code> + <code>SendMessageTool</code> + tmux panes 平行執行 agents。
              Key insight：message-passing 就是 structured text，沒有 magic bus，只有 stdout pipe 進 coordinator 的 context window。
            </p>
            <div className="code-block">
{`#!/usr/bin/env python3
# claude-swarm.py — 多 agent 協調模式
import asyncio, json, subprocess
from dataclasses import dataclass
from typing import Optional

COORDINATOR_PROMPT = """You are a coordinator agent.
Break the task into parallel workstreams.
Respond ONLY with JSON: {"assignments": [{"agent": str, "task": str}]}"""

@dataclass
class Agent:
    name: str
    role: str
    system_prompt: str

def run_claude(prompt: str, system: Optional[str] = None, cwd: str = ".") -> str:
    cmd = ["claude", "-p", prompt, "--output-format", "text"]
    if system: cmd += ["--system-prompt", system]
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=cwd)
    return r.stdout.strip()

async def run_agent_async(agent: Agent, task: str, cwd: str) -> dict:
    loop = asyncio.get_event_loop()
    output = await loop.run_in_executor(None, run_claude, task, agent.system_prompt, cwd)
    return {"agent": agent.name, "output": output}

async def swarm(goal: str, agents: list[Agent], cwd: str = ".") -> str:
    # Step 1: coordinator 規劃
    plan_raw = run_claude(
        f"Goal: {goal}\\n\\nAgents: {', '.join(a.name for a in agents)}",
        COORDINATOR_PROMPT, cwd
    )
    try:
        plan = json.loads(plan_raw)
        assignments = plan["assignments"]
    except:
        assignments = [{"agent": a.name, "task": goal} for a in agents]

    # Step 2: 平行執行
    agent_map = {a.name: a for a in agents}
    tasks = [run_agent_async(agent_map[a["agent"]], a["task"], cwd)
             for a in assignments if a["agent"] in agent_map]
    results = await asyncio.gather(*tasks)

    # Step 3: 合成
    results_text = "\\n\\n".join(f"=== {r['agent']} ===\\n{r['output']}" for r in results)
    return run_claude(f"Original: {goal}\\n\\n{results_text}",
                      "Synthesise into a coherent final report.", cwd)

# 用法：三個 specialist agents 對整個 codebase 做生產就緒審查
result = asyncio.run(swarm(
    "Review this codebase for production readiness.",
    agents=[
        Agent("security", "security reviewer", "Look for vulnerabilities and auth issues."),
        Agent("performance", "performance analyst", "Look for N+1 queries and memory leaks."),
        Agent("tests", "test coverage analyst", "Identify missing tests and edge cases."),
    ]
))`}
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <p className="card-label">Pattern 3 · GitHub Webhook</p>
            <p className="card-title accent">SubscribePRTool 再現</p>
            <p className="card-desc">
              原始碼的 <code>SubscribePRTool</code> 讓 agent 訂閱 GitHub PR 事件。用 FastAPI + ngrok 就能實作相同效果。
              PR 打開時，Claude 自動分析並回傳 comment。
            </p>
            <div className="code-block">
{`#!/usr/bin/env python3
# claude-webhook.py — GitHub PR → Claude reviewer
# Deploy: uvicorn claude-webhook:app + ngrok http 8000
from fastapi import FastAPI, Request, BackgroundTasks
import httpx, subprocess, os

app = FastAPI()
GH_TOKEN = os.environ["GITHUB_TOKEN"]

@app.post("/webhook")
async def handle_webhook(request: Request, bg: BackgroundTasks):
    payload = await request.json()
    if payload.get("action") not in ("opened", "synchronize"):
        return {"status": "ignored"}

    pr = payload["pull_request"]

    # Fetch changed files
    async with httpx.AsyncClient() as client:
        resp = await client.get(pr["url"] + "/files",
            headers={"Authorization": f"Bearer {GH_TOKEN}"})
        files = [f["filename"] for f in resp.json()]

    # Background: review + comment
    bg.add_task(review_and_comment, pr, files)
    return {"status": "queued"}

def review_and_comment(pr, files):
    prompt = f"""Review this PR:
Title: {pr['title']}
Files: {', '.join(files[:20])}

Write a concise review: correctness, security, missing tests, suggestions. Max 400 words."""

    result = subprocess.run(
        ["claude", "-p", prompt, "--output-format", "text"],
        capture_output=True, text=True
    )
    comment = f"### Claude Code Review\\n\\n{result.stdout.strip()}\\n\\n" \
              f"*Automated by Claude*"

    httpx.post(pr["comments_url"], json={"body": comment},
               headers={"Authorization": f"Bearer {GH_TOKEN}",
                        "Accept": "application/vnd.github.v3+json"})`}
            </div>
          </div>
        </section>

        {/* EASTER EGGS */}
        <section className="section">
          <p className="section-label">07 · 有趣發現</p>
          <h2 className="section-title">程式碼中的彩蛋</h2>

          <div className="two-col">
            <div className="card">
              <p className="card-label">Regex Frustration Detection</p>
              <p className="card-title yellow">用正規表達式偵測用戶不爽</p>
              <p className="card-desc">
                藏在 <code>userPromptKeywords.ts</code>：
              </p>
              <div className="code-block" style={{ fontSize: 11 }}>
{`/\\b(wtf|wth|ffs|omfg|shit(ty|tiest)?|
dumbass|horrible|awful|piss(ed|ing)? off|
piece of (shit|crap|junk)|
what the (fuck|hell)|
fucking? (broken|useless|terrible)|
fuck you|screw (this|you)|
so frustrating|this sucks|damn it)\\b/`}
              </div>
              <p className="card-desc" style={{ marginTop: 8 }}>
                價值數十億美元的 AI 公司用 regex 偵測用戶生氣。速度最快、成本最低、最可預測。
              </p>
            </div>
            <div className="card">
              <p className="card-label">Internal Admission</p>
              <p className="card-title accent">每天 250,000 次 API 呼叫白費</p>
              <p className="card-desc">
                藏在 <code>autoCompact.ts</code>（68-70 行）：
              </p>
              <div className="code-block" style={{ fontSize: 11 }}>
{`"BQ 2026-03-10: 1,279 sessions had 50+
consecutive failures (up to 3,272) in a
single session, wasting ~250K API calls/day
globally."`}
              </div>
              <p className="card-desc" style={{ marginTop: 8 }}>
                修復方式：三行程式。<code>MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3</code>。三次連續失敗後，停止嘗試。有时候好的工程就是知道什么时候该放弃。
              </p>
            </div>
          </div>
        </section>

        {/* CAPYBARA */}
        <section className="section" style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <p className="section-label">08 · 下個模型</p>
          <h2 className="section-title">Capybara（aka Mythos）確認存在</h2>
          <p className="section-desc">
            原始碼暴露了 Anthropic 下個主要模型家族的內部 codename。多個 beta flags 參考了 Capybara 的特定 API version string，暗示已經 beyond concept stage。
            預計會有 fast 和 slow 兩種 variant，context window 大幅超越目前市場上任何產品。
          </p>
          <div className="callout green" style={{ marginTop: 24 }}>
            <strong>undercover.ts：</strong>CC 被指示永不提及內部 codename。有一個硬編碼的 NO force-OFF——可以 force turn on，但無法 force turn off。
            這代表 Anthropic 員工在 open source repo 裡的 AI-authored commits，不會有任何 AI 寫的痕跡。
          </div>
        </section>

        {/* TAKEAWAYS */}
        <section className="section">
          <p className="section-label">09 · 給工程團隊的提醒</p>
          <h2 className="section-title">如何防止類似的流出</h2>

          <div className="lesson-list">
            <div className="lesson-item">
              <div className="lesson-num">1</div>
              <div>
                <div className="lesson-title">Audit .npmignore / package.json "files" field</div>
                <div className="lesson-desc">
                  檢查是否有 <code>*.map</code>、<code>dist/*.map</code>、<code>*.d.ts.map</code> 的排除設定。
                </div>
              </div>
            </div>
            <div className="lesson-item">
              <div className="lesson-num">2</div>
              <div>
                <div className="lesson-title">檢查 source maps 是否出現在 production build</div>
                <div className="lesson-desc"><code>ls dist/ | grep "\\.map$"</code> — 如果有任何結果，bundler 設定需要 review。</div>
              </div>
            </div>
            <div className="lesson-item">
              <div className="lesson-num">3</div>
              <div>
                <div className="lesson-title">Audit cloud storage permissions</div>
                <div className="lesson-desc">build artifacts 參照的 bucket 是否真的只有內部可存取？</div>
              </div>
            </div>
            <div className="lesson-item">
              <div className="lesson-num">4</div>
              <div>
                <div className="lesson-title">npm publish 前做 dry-run</div>
                <div className="lesson-desc"><code>npm pack --dry-run</code> — 在實際發布前 review 所有會被發布的檔案。</div>
              </div>
            </div>
          </div>
        </section>

        {/* SOURCES */}
        <section className="section">
          <p className="section-label">Sources</p>
          <h2 className="section-title">參考資料</h2>

          <table className="data-table">
            <thead>
              <tr>
                <th>標題</th>
                <th>來源</th>
                <th>內容重點</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><a href="https://dreadheadio.github.io/claude-code-roadmap/claude-code-roadmap-blog.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>I Read the Leaked Claude Code Source</a></td>
                <td style={{ color: 'var(--text-muted)' }}>dreadheadio.github.io</td>
                <td>Claude 作者本人的 Pattern 分析 + 3個 Python 實作</td>
              </tr>
              <tr>
                <td><a href="https://minusx.ai/blog/decoding-claude-code/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>What makes Claude Code so damn good</a></td>
                <td style={{ color: 'var(--text-muted)' }}>minusx.ai</td>
                <td>MinusX 工程師實際攔截分析的 6 大設計原則</td>
              </tr>
              <tr>
                <td><a href="https://dev.to/varshithvhegde/the-great-claude-code-leak-of-2026-accident-incompetence-or-the-best-pr-stunt-in-ai-history-3igm" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>The Great Claude Code Leak</a></td>
                <td style={{ color: 'var(--text-muted)' }}>dev.to</td>
                <td>完整時間線、44 feature flags、架構分析陰謀論</td>
              </tr>
              <tr>
                <td><a href="https://www.theregister.com/2026/03/31/anthropic_claude_code_source_code/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Anthropic accidentally exposes source code</a></td>
                <td style={{ color: 'var(--text-muted)' }}>The Register</td>
                <td>Anthropic 官方聲明</td>
              </tr>
              <tr>
                <td><a href="https://venturebeat.com/technology/claude-codes-source-code-appears-to-have-leaked-heres-what-we-know" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Claude Code source appears to have leaked</a></td>
                <td style={{ color: 'var(--text-muted)' }}>VentureBeat</td>
                <td>完整事件分析 + axios RAT 警告</td>
              </tr>
              <tr>
                <td><a href="https://www.axios.com/2026/03/31/anthropic-leaked-source-code-ai" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Anthropic leaked its own Claude source code</a></td>
                <td style={{ color: 'var(--text-muted)' }}>Axios</td>
                <td>Feature flag 完整清單 + 營收數據</td>
              </tr>
              <tr>
                <td><a href="https://fortune.com/2026/03/31/anthropic-source-code-claude-code-data-leak-second-security-lapse-days-after-accidentally-revealing-mythos/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Fortune — Strategic analysis + Capybara</a></td>
                <td style={{ color: 'var(--text-muted)' }}>Fortune</td>
                <td>戰略分析 + Capybara 模型確認</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div>
            <span style={{ color: 'var(--accent)' }}>Claude Code Source Leak</span>
            {' '}· March 31, 2026 · All analysis from publicly available sources
          </div>
          <div className="footer-links">
            <a href="https://dreadheadio.github.io/claude-code-roadmap/claude-code-roadmap-blog.html" target="_blank" rel="noopener noreferrer">Claude's Own Analysis</a>
            <a href="https://minusx.ai/blog/decoding-claude-code/" target="_blank" rel="noopener noreferrer">MinusX Analysis</a>
            <a href="https://dev.to/varshithvhegde/the-great-claude-code-leak-of-2026-accident-incompetence-or-the-best-pr-stunt-in-ai-history-3igm" target="_blank" rel="noopener noreferrer">Dev.to Deep Dive</a>
          </div>
        </footer>
      </main>
    </>
  );
}