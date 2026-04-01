# Parallel Routes + Intercepting Routes

## File Structure

```
app/
├── @modal/
│   ├── (.)photo/[id]/page.tsx   # Intercepted route (modal)
│   └── default.tsx
├── photo/[id]/page.tsx          # Full page route
├── layout.tsx
└── page.tsx
```

## Layout with Named Slot

```tsx
// app/layout.tsx
export default function Layout({ children, modal }: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return <>{children}{modal}</>
}
```

## Modal Component (used in intercepted route)

```tsx
'use client'
import { useRouter } from 'next/navigation'

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center"
         onClick={() => router.back()}>
      <div className="bg-white rounded-lg p-6 max-w-2xl" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
```

## Default Fallback (required for slots)

```tsx
// app/@modal/default.tsx
export default function Default() {
  return null
}
```

## Intercepting Route Conventions

| Pattern | Intercepts |
|---------|-----------|
| `(.)folder` | Same level segment |
| `(..)folder` | One level up segment |
| `(..)(..)folder` | Two levels up segment |
| `(...)folder` | From root |
