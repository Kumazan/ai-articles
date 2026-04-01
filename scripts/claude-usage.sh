#!/bin/bash
# claude-usage.sh — 快速查 claude.ai usage（精確版）
# 用法: bash scripts/claude-usage.sh

ORG_ID="2a787fc1-efab-4f58-a163-f39103fa29ac"

# 確保 browser 在跑並停在 claude.ai
openclaw browser start 2>/dev/null
openclaw browser navigate "https://claude.ai/settings/usage" 2>/dev/null
sleep 3

# 抓 usage API（精確 JSON）
openclaw browser evaluate --fn "() =>
  fetch('/api/organizations/$ORG_ID/usage')
    .then(r=>r.json())
    .then(d => {
      const fmt = (iso) => {
        if (!iso) return 'N/A';
        const d = new Date(iso);
        return d.toLocaleString('zh-TW', {timeZone:'Asia/Taipei', month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit'});
      };
      return [
        '=== Claude.ai Usage ===',
        '',
        '⏱ Current session (5h):',
        '  Used: ' + d.five_hour.utilization + '%',
        '  Reset: ' + fmt(d.five_hour.resets_at),
        '',
        '📅 Weekly (all models):',
        '  Used: ' + d.seven_day.utilization + '%',
        '  Reset: ' + fmt(d.seven_day.resets_at),
        '',
        '📅 Weekly (Sonnet only):',
        '  Used: ' + (d.seven_day_sonnet ? d.seven_day_sonnet.utilization + '%' : 'N/A'),
        '  Reset: ' + fmt(d.seven_day_sonnet?.resets_at),
      ].join('\n');
    })
" 2>/dev/null \
  | grep -v 'Doctor\|warning\|migration\|groupPolicy\|groupAllowFrom\|allowFrom\|Add sender\|╮\|╯\|├\|│\|◇\|gateway\|Gateway\|Source\|Config\|Bind' \
  | tr -d '"' \
  | sed 's/\\n/\n/g'
