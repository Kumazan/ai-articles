import { NextResponse } from 'next/server'
import { readKanban, writeKanban } from '@/lib/kanban-store'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates = await request.json()
    const data = readKanban()

    for (const column of data.columns) {
      const cardIndex = column.cards.findIndex(c => c.id === id)
      if (cardIndex !== -1) {
        column.cards[cardIndex] = {
          ...column.cards[cardIndex],
          ...updates,
          id,
          updatedAt: new Date().toISOString(),
        }
        writeKanban(data)
        return NextResponse.json(column.cards[cardIndex])
      }
    }

    return NextResponse.json({ error: 'Card not found' }, { status: 404 })
  } catch {
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = readKanban()

    for (const column of data.columns) {
      const cardIndex = column.cards.findIndex(c => c.id === id)
      if (cardIndex !== -1) {
        column.cards.splice(cardIndex, 1)
        writeKanban(data)
        return NextResponse.json({ ok: true })
      }
    }

    return NextResponse.json({ error: 'Card not found' }, { status: 404 })
  } catch {
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 })
  }
}
