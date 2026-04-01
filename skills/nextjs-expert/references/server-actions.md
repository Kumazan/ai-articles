# Server Actions

## Defining Actions

```tsx
// app/actions.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const schema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10),
})

export async function createPost(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const parsed = schema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  })

  if (!parsed.success) return { error: parsed.error.flatten() }

  const post = await db.post.create({
    data: { ...parsed.data, authorId: session.user.id },
  })

  revalidatePath('/posts')
  redirect(`/posts/${post.slug}`)
}
```

## Form with useFormState and useFormStatus

```tsx
// components/submit-button.tsx
'use client'
import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}

// components/create-post-form.tsx
'use client'
import { useFormState } from 'react-dom'
import { createPost } from '@/app/actions'

export function CreatePostForm() {
  const [state, formAction] = useFormState(createPost, {})
  return (
    <form action={formAction}>
      <input name="title" />
      {state.error?.title && <p className="text-red-500">{state.error.title[0]}</p>}
      <textarea name="content" />
      <SubmitButton />
    </form>
  )
}
```

## Optimistic Updates

```tsx
'use client'
import { useOptimistic, useTransition } from 'react'

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [isPending, startTransition] = useTransition()
  const [optimisticTodos, addOptimistic] = useOptimistic(
    initialTodos,
    (state, newTodo: string) => [...state, { id: 'temp', title: newTodo, completed: false }]
  )

  async function handleSubmit(formData: FormData) {
    const title = formData.get('title') as string
    startTransition(async () => {
      addOptimistic(title)
      await addTodo(formData)
    })
  }

  return (
    <>
      <form action={handleSubmit}>
        <input name="title" />
        <button>Add</button>
      </form>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id} className={todo.id === 'temp' ? 'opacity-50' : ''}>{todo.title}</li>
        ))}
      </ul>
    </>
  )
}
```

## Auth Check in Server Action

```tsx
'use server'
import { auth } from '@/auth'

export async function deletePost(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const post = await db.post.findUnique({ where: { id } })
  if (post?.authorId !== session.user.id) throw new Error('Forbidden')

  await db.post.delete({ where: { id } })
  revalidatePath('/posts')
}
```
