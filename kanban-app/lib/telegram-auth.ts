import crypto from 'crypto'

/**
 * Validate Telegram Mini App initData.
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateInitData(initData: string, botToken: string): boolean {
  if (!initData || !botToken) return false

  try {
    const params = new URLSearchParams(initData)
    const hash = params.get('hash')
    if (!hash) return false

    // Remove hash from params and sort alphabetically
    params.delete('hash')
    const entries = [...params.entries()].sort(([a], [b]) => a.localeCompare(b))
    const dataCheckString = entries.map(([k, v]) => `${k}=${v}`).join('\n')

    // HMAC-SHA256(secret_key, data_check_string)
    // secret_key = HMAC-SHA256("WebAppData", bot_token)
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest()

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex')

    return computedHash === hash
  } catch {
    return false
  }
}

/**
 * Parse user info from initData.
 */
export function parseInitDataUser(initData: string): { id: number; firstName: string } | null {
  try {
    const params = new URLSearchParams(initData)
    const userJson = params.get('user')
    if (!userJson) return null
    const user = JSON.parse(userJson)
    return { id: user.id, firstName: user.first_name }
  } catch {
    return null
  }
}
