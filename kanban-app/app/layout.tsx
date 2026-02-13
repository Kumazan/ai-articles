import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '看板',
  description: 'Kanban board — Telegram Mini App',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <script src="https://telegram.org/js/telegram-web-app.js" defer />
      </head>
      <body className="bg-surface text-text">
        {children}
      </body>
    </html>
  )
}
