# App Router Conventions

## Route Files

| File | Purpose |
|------|---------|
| `page.tsx` | Unique UI for a route, makes it publicly accessible |
| `layout.tsx` | Shared UI wrapper, preserves state across navigations |
| `loading.tsx` | Loading UI using React Suspense |
| `error.tsx` | Error boundary for route segment (must be `'use client'`) |
| `not-found.tsx` | UI for 404 responses |
| `template.tsx` | Like layout but re-renders on navigation |
| `default.tsx` | Fallback for parallel routes |
| `route.ts` | API endpoint (Route Handler) |

## Folder Conventions

| Pattern | Purpose | Example |
|---------|---------|---------|
| `folder/` | Route segment | `app/blog/` → `/blog` |
| `[folder]/` | Dynamic segment | `app/blog/[slug]/` → `/blog/:slug` |
| `[...folder]/` | Catch-all segment | `app/docs/[...slug]/` → `/docs/*` |
| `[[...folder]]/` | Optional catch-all | `app/shop/[[...slug]]/` → `/shop` or `/shop/*` |
| `(folder)/` | Route group (no URL) | `app/(marketing)/about/` → `/about` |
| `@folder/` | Named slot (parallel routes) | `app/@modal/login/` |
| `_folder/` | Private folder (excluded) | `app/_components/` |

## File Hierarchy (render order)

1. `layout.tsx` → 2. `template.tsx` → 3. `error.tsx` (boundary) → 4. `loading.tsx` (boundary) → 5. `not-found.tsx` (boundary) → 6. `page.tsx`

## Route Segment Config

```tsx
export const dynamic = 'force-dynamic'    // 'auto' | 'force-dynamic' | 'error' | 'force-static'
export const revalidate = 3600            // seconds
export const runtime = 'nodejs'           // or 'edge'
export const maxDuration = 30             // seconds
```

## Basic Page Examples

```tsx
// app/about/page.tsx (Server Component)
export default function AboutPage() {
  return (
    <main>
      <h1>About Us</h1>
      <p>Welcome to our company.</p>
    </main>
  )
}
```

```tsx
// app/blog/[slug]/page.tsx (Dynamic Route)
interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)
  return <article>{post.content}</article>
}
```

```tsx
// app/search/page.tsx (Search Params)
interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, page } = await searchParams
  const results = await search(q, parseInt(page || '1'))
  return <SearchResults results={results} />
}
```

```tsx
// Static Generation
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export const dynamicParams = true
```

## Layouts

```tsx
// app/layout.tsx (Root Layout — Required)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

```tsx
// app/dashboard/layout.tsx (Nested Layout with Data Fetching)
import { getUser } from '@/lib/get-user'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  return (
    <div className="flex">
      <Sidebar user={user} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
```

```
# Route Groups for Multiple Root Layouts
app/
├── (marketing)/
│   ├── layout.tsx          # Marketing layout with <html>/<body>
│   └── about/page.tsx
└── (app)/
    ├── layout.tsx          # App layout with <html>/<body>
    └── dashboard/page.tsx
```

## Metadata

```tsx
// Static
export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our company',
}

// Dynamic
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  return {
    title: post.title,
    openGraph: { title: post.title, images: [post.coverImage] },
  }
}

// Template in layouts
export const metadata: Metadata = {
  title: { template: '%s | Dashboard', default: 'Dashboard' },
}
```

## Loading and Error States

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  )
}
```

```tsx
// app/dashboard/error.tsx
'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <h2 className="text-red-800 font-bold">Something went wrong!</h2>
      <p className="text-red-600">{error.message}</p>
      <button onClick={reset} className="mt-2 px-4 py-2 bg-red-600 text-white rounded">
        Try again
      </button>
    </div>
  )
}
```

```tsx
// app/posts/[slug]/page.tsx — Not Found
import { notFound } from 'next/navigation'

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  return <article>{post.content}</article>
}
```
