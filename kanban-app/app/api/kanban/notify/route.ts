import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cardTitle, status, dueDate, eventType } = body

    // Build notification message
    const lines = [`🔔 看板通知`]
    if (eventType) lines.push(`事件：${eventType}`)
    if (cardTitle) lines.push(`卡片：${cardTitle}`)
    if (status) lines.push(`狀態：${status}`)
    if (dueDate) lines.push(`到期日：${dueDate}`)

    const message = lines.join('\n')

    // TODO: Integrate actual Telegram Bot API push
    // const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    // const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID
    // if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    //   await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
    //   })
    // }

    console.log('[Kanban Notify]', message)

    return NextResponse.json({ ok: true, message })
  } catch {
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
