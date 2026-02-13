import { NextResponse } from 'next/server'
import { readKanban, writeKanban } from '@/lib/kanban-store'
import type { KanbanData } from '@/types/kanban'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = readKanban()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to read kanban data' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data: KanbanData = await request.json()
    writeKanban(data)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to write kanban data' }, { status: 500 })
  }
}
