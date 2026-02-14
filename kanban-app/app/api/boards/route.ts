import { NextResponse } from 'next/server'
import { readBoards, createBoard } from '@/lib/kanban-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return NextResponse.json(readBoards())
  } catch {
    return NextResponse.json({ error: 'Failed to read boards' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { id, name, emoji } = await request.json()
    if (!id || !name) return NextResponse.json({ error: 'id and name required' }, { status: 400 })
    createBoard(id, name, emoji || '📋')
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
