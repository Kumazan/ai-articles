import { NextResponse } from 'next/server'
import { readKanban, writeKanban } from '@/lib/kanban-store'
import { v4 as uuidv4 } from 'uuid'
import type { Card } from '@/types/kanban'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { columnId, title, description, priority, labels } = body

    const data = readKanban()
    const column = data.columns.find(c => c.id === columnId)
    if (!column) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 })
    }

    const now = new Date().toISOString()
    const card: Card = {
      id: uuidv4(),
      title: title || '',
      description: description || '',
      priority: priority || 'P3',
      labels: labels || [],
      createdAt: now,
      updatedAt: now,
    }

    column.cards.push(card)
    writeKanban(data)
    return NextResponse.json(card, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 })
  }
}
