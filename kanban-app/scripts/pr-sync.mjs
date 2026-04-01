#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const WORKSPACE = '/Users/kumax/.openclaw/workspace'
const BOARDS_JSON = path.join(WORKSPACE, 'boards.json')
const BOARDS_DIR = path.join(WORKSPACE, 'boards')
const API_BASE = 'http://localhost:3099/api/kanban'

const REPOS = [
  'kanban-app',
  'trip-bangkok',
  'polymarket-bot-v0-ts',
  'polymarket-strategies',
  'sdd-learn',
]

const STATUS_LABEL = '[PR_STATUS]'
const LINK_LABEL = '[PR_LINK]'

const normalizeTitle = (text = '') =>
  text
    .toLowerCase()
    .replace(/^(feat|fix|docs|chore|refactor|perf|test|style|build|ci|revert)(\([^)]*\))?:\s*/i, '')
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, ' ')
    .trim()

const readJson = filePath => JSON.parse(fs.readFileSync(filePath, 'utf8'))

const loadBoards = () => {
  if (!fs.existsSync(BOARDS_JSON)) return []
  const data = readJson(BOARDS_JSON)
  return data.boards || []
}

const loadKanban = boardId => {
  const filePath = path.join(BOARDS_DIR, boardId, 'kanban.json')
  if (!fs.existsSync(filePath)) return null
  return readJson(filePath)
}

const fetchPRs = repo => {
  const cmd = `gh pr list --repo Kumazan/${repo} --state all --limit 200 --json number,title,url,state,isDraft,mergedAt,closedAt,reviewDecision`
  try {
    const out = execSync(cmd, { encoding: 'utf8' }).trim()
    return out ? JSON.parse(out) : []
  } catch (err) {
    console.error(`Failed to fetch PRs for ${repo}:`, err.message)
    return []
  }
}

const getRepoLabel = labels => REPOS.find(r => labels.includes(r))

const findPRForCard = (card, repoPRs) => {
  if (!repoPRs?.length) return null
  if (card.prUrl) {
    return repoPRs.find(pr => pr.url === card.prUrl) || null
  }

  const cardTitle = normalizeTitle(card.title)
  return (
    repoPRs.find(pr => {
      const prTitle = normalizeTitle(pr.title)
      return prTitle && (cardTitle.includes(prTitle) || prTitle.includes(cardTitle))
    }) || null
  )
}

const desiredColumnId = pr => {
  if (pr.mergedAt) return 'done'
  if (pr.state === 'CLOSED') return 'archive'
  if (pr.isDraft) return 'ongoing'
  return 'review'
}

const getLastStatus = card => {
  const comments = card.comments || []
  for (let i = comments.length - 1; i >= 0; i -= 1) {
    const text = comments[i]?.text || ''
    if (text.includes(STATUS_LABEL)) {
      const match = text.match(/\[PR_STATUS\]\s*(.+)$/)
      return match?.[1]?.trim() || null
    }
  }
  return null
}

const getLastLink = card => {
  const comments = card.comments || []
  for (let i = comments.length - 1; i >= 0; i -= 1) {
    const text = comments[i]?.text || ''
    if (text.includes(LINK_LABEL)) return text
  }
  return null
}

const apiFetch = async (url, options) => {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`${res.status} ${res.statusText}: ${body}`)
  }
  return res.json()
}

const addComment = async (cardId, boardId, text) => {
  const url = `${API_BASE}/cards/${cardId}/comments?boardId=${boardId}`
  await apiFetch(url, {
    method: 'POST',
    body: JSON.stringify({ author: '系統', text, isSystem: true }),
  })
}

const moveCard = async (cardId, boardId, targetColumnId) => {
  const url = `${API_BASE}/cards/${cardId}/move?boardId=${boardId}`
  await apiFetch(url, {
    method: 'POST',
    body: JSON.stringify({ targetColumnId }),
  })
}

const patchCard = async (cardId, boardId, updates) => {
  const url = `${API_BASE}/cards/${cardId}?boardId=${boardId}`
  await apiFetch(url, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

const statusText = pr => {
  if (pr.mergedAt) return 'merged'
  if (pr.state === 'CLOSED') return 'closed'
  if (pr.isDraft) return 'draft'
  if (pr.reviewDecision === 'CHANGES_REQUESTED') return 'changes_requested'
  if (pr.reviewDecision === 'APPROVED') return 'approved'
  if (pr.reviewDecision === 'REVIEW_REQUIRED') return 'review_required'
  return 'open'
}

const run = async () => {
  const boards = loadBoards()
  if (!boards.length) return

  const prCache = Object.fromEntries(REPOS.map(repo => [repo, fetchPRs(repo)]))
  const prByUrl = new Map()
  for (const repo of REPOS) {
    for (const pr of prCache[repo]) {
      prByUrl.set(pr.url, pr)
    }
  }

  for (const board of boards) {
    const data = loadKanban(board.id)
    if (!data) continue

    for (const column of data.columns) {
      for (const card of column.cards) {
        const repo = getRepoLabel(card.labels || [])
        if (!repo) continue

        const repoPRs = prCache[repo]
        const pr = card.prUrl ? prByUrl.get(card.prUrl) : findPRForCard(card, repoPRs)
        if (!pr) continue

        if (!card.prUrl) {
          const lastLink = getLastLink(card)
          await patchCard(card.id, board.id, { prUrl: pr.url })
          if (!lastLink) {
            await addComment(card.id, board.id, `${LINK_LABEL} 已連結 PR：${pr.url}`)
          }
        }

        const nextStatus = statusText(pr)
        const lastStatus = getLastStatus(card)
        if (nextStatus !== lastStatus) {
          await addComment(card.id, board.id, `${STATUS_LABEL} ${nextStatus}`)
        }

        const targetColumnId = desiredColumnId(pr)
        if (targetColumnId && targetColumnId !== column.id) {
          await moveCard(card.id, board.id, targetColumnId)
          await addComment(card.id, board.id, `PR 狀態更新 → 自動移動到「${targetColumnId}」`)
        }
      }
    }
  }
}

run().catch(err => {
  console.error('PR sync failed:', err)
  process.exit(1)
})
