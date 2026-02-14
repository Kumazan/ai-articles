type HapticStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
type NotificationType = 'error' | 'success' | 'warning'

function getTg() {
  try {
    return (window as unknown as { Telegram?: { WebApp?: { HapticFeedback?: { impactOccurred: (s: HapticStyle) => void; notificationOccurred: (t: NotificationType) => void; selectionChanged: () => void } } } }).Telegram?.WebApp?.HapticFeedback
  } catch { return undefined }
}

export function hapticImpact(style: HapticStyle = 'medium') {
  getTg()?.impactOccurred(style)
}

export function hapticNotification(type: NotificationType) {
  getTg()?.notificationOccurred(type)
}

export function hapticSelection() {
  getTg()?.selectionChanged()
}
