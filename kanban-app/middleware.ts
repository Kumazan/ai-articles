import { NextRequest, NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const API_KEY = process.env.KANBAN_API_KEY || ''

async function validateInitData(initData: string, botToken: string): Promise<boolean> {
  if (!initData || !botToken) return false
  try {
    const params = new URLSearchParams(initData)
    const hash = params.get('hash')
    if (!hash) return false

    params.delete('hash')
    const entries = [...params.entries()].sort(([a], [b]) => a.localeCompare(b))
    const dataCheckString = entries.map(([k, v]) => `${k}=${v}`).join('\n')

    // Web Crypto API (Edge-compatible)
    const enc = new TextEncoder()
    const secretKeyMaterial = await crypto.subtle.importKey(
      'raw', enc.encode('WebAppData'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    )
    const secretKeyBytes = await crypto.subtle.sign('HMAC', secretKeyMaterial, enc.encode(botToken))
    const signingKey = await crypto.subtle.importKey(
      'raw', secretKeyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    )
    const sig = await crypto.subtle.sign('HMAC', signingKey, enc.encode(dataCheckString))
    const computedHash = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('')
    return computedHash === hash
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow Next.js internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }

  // API routes: check x-telegram-init-data header OR x-api-key
  if (pathname.startsWith('/api/')) {
    const initData = request.headers.get('x-telegram-init-data')
    const apiKey = request.headers.get('x-api-key')

    // Local API key (for bot/heartbeat access)
    if (API_KEY && apiKey === API_KEY) {
      return NextResponse.next()
    }

    // Telegram initData validation
    if (initData && BOT_TOKEN && await validateInitData(initData, BOT_TOKEN)) {
      return NextResponse.next()
    }

    // If BOT_TOKEN is not configured, allow requests with any initData (dev mode)
    if (initData && !BOT_TOKEN) {
      return NextResponse.next()
    }

    // Localhost bypass (for development / bot access when no API key set)
    const forwarded = request.headers.get('x-forwarded-for') || ''
    const host = request.headers.get('host') || ''
    const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1') ||
      forwarded.includes('127.0.0.1') || forwarded.includes('::1')
    if (isLocal) {
      return NextResponse.next()
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Page routes: pass through (client-side will check Telegram context)
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
