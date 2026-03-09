---
name: session-walkthrough
description: Summarize a recent OpenClaw chat/session into a clear walkthrough report with timeline, user goal, diagnosis path, key commands, decisions, mistakes/turning points, and final outcome. Use when the user asks for a session recap, conversation walkthrough, postmortem, troubleshooting timeline, or wants a Chinese report of what happened in this session.
---

# Session Walkthrough

Create a concise but complete walkthrough of a recent session.

## Workflow

1. Identify the target session with `sessions_list` if the session key is unknown.
2. Read the transcript with `sessions_history`.
3. Extract:
   - user goal
   - initial state / symptoms
   - key hypotheses
   - commands or tool actions that materially changed the outcome
   - dead ends / mistaken assumptions
   - final fix and final state
4. Write the report in the user's language. Prefer Traditional Chinese for Kuma.
5. For troubleshooting sessions, include the exact turning point that unlocked the fix.

## Output shape

Prefer this structure:

- 目標
- 起始狀態
- 時間線 / walkthrough
- 關鍵判斷
- 實際修改 / 指令
- 最終結果
- 後續 SOP / 建議

## Notes

- Keep the report chronological.
- Do not dump raw transcript unless the user asks.
- Compress repeated back-and-forth into one step when it does not change the outcome.
- Explicitly call out wrong turns if they helped narrow the problem.
- If useful, use `references/report-template.md` as a formatting scaffold.
