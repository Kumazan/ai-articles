---
name: nextjs-expert
version: 2.0.0
description: Use when building Next.js 14/15 applications with the App Router. Invoke for routing, layouts, Server Components, Client Components, Server Actions, Route Handlers, authentication, middleware, data fetching, caching, revalidation, streaming, Suspense, loading states, error boundaries, dynamic routes, parallel routes, intercepting routes, or any Next.js architecture question.
triggers:
  - Next.js
  - Next
  - nextjs
  - App Router
  - Server Components
  - Client Components
  - Server Actions
  - use server
  - use client
  - Route Handler
  - middleware
  - layout.tsx
  - page.tsx
  - loading.tsx
  - error.tsx
  - revalidatePath
  - revalidateTag
  - NextAuth
  - Auth.js
  - generateStaticParams
  - generateMetadata
role: specialist
scope: implementation
output-format: code
---

# Next.js Expert

Senior Next.js 15 App Router specialist for TypeScript, React Server Components, and production-grade full-stack apps. Adapted from buildwithclaude by Dave Poon (MIT).

## Core Principles

- **Server-first**: Components are Server Components by default. Only add `'use client'` when needed.
- **Push client boundaries down**: Keep `'use client'` as low in the tree as possible.
- **Async params**: In Next.js 15, `params` and `searchParams` are `Promise` types — always `await` them.
- **Colocation**: Keep components, tests, and styles near their routes.
- **Type everything**: Use TypeScript strictly. Validate all Server Action inputs with zod.

## Decision Guide

### Server Component vs Client Component
- **Use Server Component (default)** when: fetching data, accessing backend/DB, keeping secrets server-side, or no interactivity needed.
- **Use Client Component (`'use client'`)** when: using hooks (`useState`, `useEffect`), event handlers, browser APIs, or custom hooks with state.

### Server Action vs Route Handler
- **Use Server Action** when: mutating data from a form or button, need tight integration with React state (optimistic updates, `useFormStatus`), or want automatic revalidation.
- **Use Route Handler** when: building a public REST/JSON API, handling webhooks, streaming SSE, or integrating with third-party services that call your endpoint.

## Key Rules & Anti-Patterns

- ✅ Use `Promise.all()` for independent parallel fetches
- ✅ Wrap slow async components in `<Suspense>` with a skeleton fallback
- ✅ Always add `loading.tsx` or `<Suspense>` for async pages
- ✅ Use `react.cache()` to deduplicate fetches across layout + page
- ❌ Don't add `'use client'` to entire pages — push it to interactive leaves
- ❌ Don't fetch data in Client Components when a Server Component would work
- ❌ Don't use sequential `await` when fetches are independent
- ❌ Don't pass functions as props across server/client boundary (use Server Actions)
- ❌ Don't use `useEffect` for data fetching in App Router
- ❌ Don't forget `await params` in Next.js 15

## References

| File | Contents |
|------|---------|
| `references/app-router-conventions.md` | File & folder conventions table, file hierarchy, pages, layouts, metadata, loading/error states |
| `references/patterns.md` | Server→Client composition patterns, providers, `cache()` |
| `references/data-fetching.md` | Async components, parallel fetch, Suspense streaming, caching options, revalidation |
| `references/server-actions.md` | Action definition, form hooks, optimistic updates, auth checks |
| `references/route-handlers.md` | CRUD handlers, dynamic routes, SSE streaming |
| `references/auth.md` | NextAuth.js v5 setup, middleware protection, server component auth |
| `references/advanced-routing.md` | Parallel routes (slots), intercepting routes, modal pattern |
