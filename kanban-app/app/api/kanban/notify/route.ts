import { NextResponse } from 'next/server'
import { notify } from '@/lib/notify'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cardTitle, status, dueDate, eventType } = body

    if (!cardTitle && !eventType) {
      return NextResponse.json({ error: '至少需要 cardTitle 或 eventType' }, { status: 400 })
    }

    // 組合通知訊息
    const lines = ['🔔 看板通知']
    if (eventType) lines.push(`事件：${eventType}`)
    if (cardTitle) lines.push(`卡片：${cardTitle}`)
    if (status) lines.push(`狀態：${status}`)
    if (dueDate) lines.push(`到期日：${dueDate}`)

    const message = lines.join('\n')

    // 等待通知送出以取得可靠的 delivered 狀態
    const delivered = await notify({ message })

    return NextResponse.json({ ok: true, delivered })
  } catch {
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
