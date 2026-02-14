/**
 * Get Telegram WebApp initData (only available inside Telegram Mini App).
 */
export function getTelegramInitData(): string {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initData) {
    return window.Telegram.WebApp.initData
  }
  return ''
}

export function isTelegramContext(): boolean {
  return getTelegramInitData().length > 0
}

/**
 * Extend global Window type for Telegram WebApp SDK.
 */
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string
        initDataUnsafe: {
          user?: { id: number; first_name: string; last_name?: string; username?: string }
          auth_date: number
          hash: string
        }
        ready: () => void
        expand: () => void
        close: () => void
        MainButton: {
          text: string
          show: () => void
          hide: () => void
          onClick: (cb: () => void) => void
        }
        themeParams: Record<string, string>
        colorScheme: 'light' | 'dark'
      }
    }
  }
}
