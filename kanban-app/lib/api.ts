import type { KanbanData, Card } from '@/types/kanban'

const BASE = '/api/kanban'

export async function fetchKanban(): Promise<KanbanData> {
  const res = await fetch(BASE, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export async function saveKanban(data: KanbanData): Promise<void> {
  const res = await fetch(BASE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to save')
}

export async function createCard(
  columnId: string,
  card: Partial<Card>
): Promise<Card> {
  const res = await fetch(`${BASE}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ columnId, ...card }),
  })
  if (!res.ok) throw new Error('Failed to create')
  return res.json()
}

export async function updateCard(
  id: string,
  updates: Partial<Card>
): Promise<Card> {
  const res = await fetch(`${BASE}/cards/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error('Failed to update')
  return res.json()
}

export async function deleteCard(id: string): Promise<void> {
  const res = await fetch(`${BASE}/cards/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete')
}
