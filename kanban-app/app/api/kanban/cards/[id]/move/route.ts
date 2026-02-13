import { NextResponse } from 'next/server'
import { readKanban, writeKanban } from '@/lib/kanban-store'

export const dynamic = 'force-dynamic'

// POST /api/kanban/cards/[id]/move
// Body: { targetColumnId: string, position?: number }
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { targetColumnId, position } = await request.json()

    if (!targetColumnId) {
      return NextResponse.json({ error: 'targetColumnId is required' }, { status: 400 })
    }

    const data = readKanban()

    // Find and remove card from source column
    let card = null
    let sourceColumnId = null
    for (const column of data.columns) {
      const cardIndex = column.cards.findIndex(c => c.id === id)
      if (cardIndex !== -1) {
        card = column.cards.splice(cardIndex, 1)[0]
        sourceColumnId = column.id
        break
      }
    }

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    // Find target column
    const targetColumn = data.columns.find(c => c.id === targetColumnId)
    if (!targetColumn) {
      return NextResponse.json({ error: 'Target column not found' }, { status: 404 })
    }

    // Insert at position or end
    card.updatedAt = new Date().toISOString()
    if (position !== undefined && position >= 0 && position <= targetColumn.cards.length) {
      targetColumn.cards.splice(position, 0, card)
    } else {
      targetColumn.cards.push(card)
    }

    writeKanban(data)
    return NextResponse.json({
      ok: true,
      card,
      from: sourceColumnId,
      to: targetColumnId,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to move card' }, { status: 500 })
  }
}
