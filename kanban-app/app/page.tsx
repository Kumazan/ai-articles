import { KanbanBoard } from '@/components/kanban-board'
import { TelegramGate } from '@/components/telegram-gate'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <TelegramGate>
      <KanbanBoard />
    </TelegramGate>
  )
}
