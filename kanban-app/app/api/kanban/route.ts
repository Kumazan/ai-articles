import { NextResponse } from 'next/server'
import { readKanban, writeKanban } from '@/lib/kanban-store'
import type { KanbanData } from '@/types/kanban'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const boardId = new URL(request.url).searchParams.get('boardId') || undefined
    const data = readKanban(boardId)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to read kanban data' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const boardId = new URL(request.url).searchParams.get('boardId') || undefined
    const data: KanbanData = await request.json()
    writeKanban(data, boardId)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to write kanban data' }, { status: 500 })
  }
}
