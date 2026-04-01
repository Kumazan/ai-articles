# Server vs Client Composition Patterns

## Pattern 1: Server data → Client interactivity

```tsx
// app/products/page.tsx (Server)
export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductFilter products={products} />
}

// components/product-filter.tsx (Client)
'use client'
export function ProductFilter({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState('')
  const filtered = products.filter(p => p.name.includes(filter))
  return (
    <>
      <input onChange={e => setFilter(e.target.value)} />
      {filtered.map(p => <ProductCard key={p.id} product={p} />)}
    </>
  )
}
```

## Pattern 2: Children as Server Components

```tsx
// components/client-wrapper.tsx
'use client'
export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && children}
    </div>
  )
}

// app/page.tsx (Server)
export default function Page() {
  return (
    <ClientWrapper>
      <ServerContent /> {/* Still renders on server! */}
    </ClientWrapper>
  )
}
```

## Pattern 3: Providers at the boundary

```tsx
// app/providers.tsx
'use client'
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system">
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
```

## Shared Data with `cache()`

```tsx
import { cache } from 'react'

export const getUser = cache(async () => {
  const response = await fetch('/api/user')
  return response.json()
})

// Both layout and page call getUser() — only one fetch happens
```
