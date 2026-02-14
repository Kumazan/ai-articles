import type { KanbanData, Card, BoardsData } from '@/types/kanban'
import { getTelegramInitData } from './telegram'

const BASE = '/api/kanban'

function qs(boardId?: string) {
  return boardId ? `?boardId=${boardId}` : ''
}

/** Build headers with Telegram auth */
function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { ...extra }
  const initData = getTelegramInitData()
  if (initData) {
    headers['x-telegram-init-data'] = initData
  }
  return headers
}

// ─── Boards ───

export async function fetchBoards(): Promise<BoardsData> {
  const res = await fetch('/api/boards', { cache: 'no-store', headers: authHeaders() })
  if (!res.ok) throw new Error('Failed to fetch boards')
  return res.json()
}

export async function createBoardApi(id: string, name: string, emoji: string): Promise<void> {
  const res = await fetch('/api/boards', {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ id, name, emoji }),
  })
  if (!res.ok) throw new Error('Failed to create board')
}

// ─── Kanban ───

export async function fetchKanban(boardId?: string): Promise<KanbanData> {
  const res = await fetch(`${BASE}${qs(boardId)}`, { cache: 'no-store', headers: authHeaders() })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export async function saveKanban(data: KanbanData, boardId?: string): Promise<void> {
  const res = await fetch(`${BASE}${qs(boardId)}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to save')
}

export async function createCard(
  columnId: string,
  card: Partial<Card>,
  boardId?: string
): Promise<Card> {
  const res = await fetch(`${BASE}/cards${qs(boardId)}`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ columnId, ...card }),
  })
  if (!res.ok) throw new Error('Failed to create')
  return res.json()
}

export async function updateCard(
  id: string,
  updates: Partial<Card>,
  boardId?: string
): Promise<Card> {
  const res = await fetch(`${BASE}/cards/${id}${qs(boardId)}`, {
    method: 'PATCH',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error('Failed to update')
  return res.json()
}

export async function deleteCard(id: string, boardId?: string): Promise<void> {
  const res = await fetch(`${BASE}/cards/${id}${qs(boardId)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to delete')
}

export async function sendNotify(payload: { cardTitle: string; status?: string; dueDate?: string; eventType: string }): Promise<void> {
  fetch(`${BASE}/notify`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  }).catch(() => {})
}
