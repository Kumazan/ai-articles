# Data Fetching / Caching / Revalidation

## Async Server Components

```tsx
export default async function PostsPage() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}
```

## Parallel Data Fetching

```tsx
export default async function DashboardPage() {
  const [user, posts, analytics] = await Promise.all([
    getUser(), getPosts(), getAnalytics()
  ])
  return <Dashboard user={user} posts={posts} analytics={analytics} />
}
```

## Streaming with Suspense

```tsx
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <SlowStats />
      </Suspense>
      <Suspense fallback={<ChartSkeleton />}>
        <SlowChart />
      </Suspense>
    </div>
  )
}
```

## Caching Options

```tsx
// Cache indefinitely (static)
const data = await fetch('https://api.example.com/data')

// Revalidate every hour
const data = await fetch(url, { next: { revalidate: 3600 } })

// No caching (always fresh)
const data = await fetch(url, { cache: 'no-store' })

// Cache with tags
const data = await fetch(url, { next: { tags: ['posts'] } })
```

## Revalidation (from Server Actions)

```tsx
'use server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function updatePost(id: string, formData: FormData) {
  await db.post.update({ where: { id }, data: { ... } })

  revalidateTag(`post-${id}`)          // Invalidate by cache tag
  revalidatePath('/posts')              // Invalidate specific page
  revalidatePath(`/posts/${id}`)        // Invalidate dynamic route
  revalidatePath('/posts', 'layout')    // Invalidate layout + all pages under it
}
```
