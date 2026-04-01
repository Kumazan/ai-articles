# Authentication (NextAuth.js v5 / Auth.js)

## Setup

```tsx
// auth.ts
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }),
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const user = await getUserByEmail(credentials.email as string)
        if (!user || !await verifyPassword(credentials.password as string, user.password)) return null
        return user
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => { if (user) { token.id = user.id; token.role = user.role } return token },
    session: ({ session, token }) => { session.user.id = token.id as string; session.user.role = token.role as string; return session },
  },
})

// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth'
export const { GET, POST } = handlers
```

## Middleware Protection

```tsx
// middleware.ts
export { auth as middleware } from '@/auth'

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
}
```

## Server Component Auth Check

```tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')
  return <h1>Welcome, {session.user?.name}</h1>
}
```
