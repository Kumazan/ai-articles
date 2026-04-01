# Route Handlers (API Routes)

## Basic CRUD

```tsx
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '10')

  const [posts, total] = await Promise.all([
    db.post.findMany({ skip: (page - 1) * limit, take: limit }),
    db.post.count(),
  ])

  return NextResponse.json({ data: posts, pagination: { page, limit, total } })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const post = await db.post.create({ data: body })
  return NextResponse.json(post, { status: 201 })
}
```

## Dynamic Route Handler

```tsx
// app/api/posts/[id]/route.ts
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await db.post.findUnique({ where: { id } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.post.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
```

## Streaming / SSE

```tsx
export async function GET() {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ count: i })}\n\n`))
        await new Promise(r => setTimeout(r, 1000))
      }
      controller.close()
    },
  })
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  })
}
```
