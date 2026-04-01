/**
 * 通知抽象層。
 * 目前支援：Telegram Bot API。
 * 環境變數未設定時優雅降級為 console.log。
 */

const TELEGRAM_MAX_LENGTH = 4096
const FETCH_TIMEOUT_MS = 5000

interface NotifyOptions {
  message: string
  /** Telegram parse mode */
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2'
}

/**
 * 截斷超長訊息以符合 Telegram 4096 字元限制。
 */
function truncateMessage(text: string, max = TELEGRAM_MAX_LENGTH): string {
  if (text.length <= max) return text
  return text.slice(0, max - 20) + '\n\n⋯（訊息過長，已截斷）'
}

async function sendTelegram(opts: NotifyOptions): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.log('[Notify] Telegram 未設定（缺少 TELEGRAM_BOT_TOKEN 或 TELEGRAM_CHAT_ID），降級為 console 輸出')
    console.log('[Notify]', opts.message)
    return false
  }

  const text = truncateMessage(opts.message)

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      ...(opts.parseMode ? { parse_mode: opts.parseMode } : {}),
    }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[Notify] Telegram API 錯誤:', res.status, err)
    return false
  }

  return true
}

/**
 * 發送通知。永不 throw，可安全呼叫。
 * 回傳 true 表示成功送達 Telegram；false 表示未送達
 * （包含 console 降級、環境變數缺失、API 錯誤、timeout、或 fetch 失敗）。
 */
export async function notify(opts: NotifyOptions): Promise<boolean> {
  try {
    return await sendTelegram(opts)
  } catch (err) {
    console.error('[Notify] 非預期錯誤:', err)
    return false
  }
}
