'use client'

import { useEffect, useState } from 'react'
import { isTelegramContext } from '@/lib/telegram'

export function TelegramGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'denied'>('loading')

  useEffect(() => {
    // Give Telegram SDK a moment to initialize
    const check = () => {
      if (isTelegramContext()) {
        // Tell Telegram we're ready
        window.Telegram?.WebApp?.ready()
        window.Telegram?.WebApp?.expand()
        setStatus('ok')
      } else {
        setStatus('denied')
      }
    }
    // Small delay for SDK initialization
    setTimeout(check, 100)
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-surface text-text">
        <div className="text-center">
          <div className="text-4xl mb-4">🦐</div>
          <p className="text-muted">載入中...</p>
        </div>
      </div>
    )
  }

  if (status === 'denied') {
    return (
      <div className="flex items-center justify-center h-screen bg-surface text-text">
        <div className="text-center max-w-xs px-6">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-xl font-bold mb-2">請從 Telegram 開啟</h1>
          <p className="text-muted text-sm">
            此看板僅限透過 Telegram Mini App 存取。
          </p>
          <p className="text-muted text-sm mt-2">
            請在 Telegram 中開啟{' '}
            <a
              href="https://t.me/kuma_openclaw_bot/kanban"
              className="text-blue-400 underline"
            >
              t.me/kuma_openclaw_bot/kanban
            </a>
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
