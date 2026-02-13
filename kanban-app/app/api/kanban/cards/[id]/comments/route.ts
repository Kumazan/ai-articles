import { NextResponse } from 'next/server'
import { readKanban, writeKanban } from '@/lib/kanban-store'
import { v4 as uuidv4 } from 'uuid'
import type { Comment } from '@/types/kanban'

export const dynamic = 'force-dynamic'

// POST /api/kanban/cards/[id]/comments
// Body: { author: string, text: string, isSystem?: boolean }
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { author, text, isSystem } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    const data = readKanban()

    for (const column of data.columns) {
      const card = column.cards.find(c => c.id === id)
      if (card) {
        const comment: Comment = {
          id: uuidv4(),
          author: author || '🦐 小蝦',
          text,
          createdAt: new Date().toISOString(),
          ...(isSystem && { isSystem: true }),
        }
        if (!card.comments) card.comments = []
        card.comments.push(comment)
        card.updatedAt = new Date().toISOString()
        writeKanban(data)
        return NextResponse.json(comment, { status: 201 })
      }
    }

    return NextResponse.json({ error: 'Card not found' }, { status: 404 })
  } catch {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}
