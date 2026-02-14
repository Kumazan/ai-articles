'use client'

import type { KanbanData } from '@/types/kanban'

interface Props {
  data: KanbanData
}

export function Dashboard({ data }: Props) {
  const allCards = data.columns.flatMap(c => c.cards)
  const maxCards = Math.max(...data.columns.map(c => c.cards.length), 1)

  const priorityCounts: Record<string, number> = { P0: 0, P1: 0, P2: 0, P3: 0 }
  allCards.forEach(c => { priorityCounts[c.priority] = (priorityCounts[c.priority] || 0) + 1 })
  const maxPriority = Math.max(...Object.values(priorityCounts), 1)

  const priorityColors: Record<string, string> = {
    P0: 'var(--color-p0)', P1: 'var(--color-p1)', P2: 'var(--color-p2)', P3: 'var(--color-p3)',
  }

  // Overdue cards
  const now = new Date(); now.setHours(0,0,0,0)
  const overdueCards = allCards.filter(c => {
    if (!c.dueDate) return false
    const due = new Date(c.dueDate + 'T00:00:00')
    return due.getTime() < now.getTime()
  })

  return (
    <div className="shrink-0 px-4 py-3 border-b border-border bg-surface-alt/50 animate-fade-in">
      {/* Overdue warning */}
      {overdueCards.length > 0 && (
        <div className="mb-3 px-3 py-2 bg-p0/10 border border-p0/20 rounded-lg flex items-center gap-2">
          <span className="text-sm">⚠️</span>
          <span className="text-xs text-p0 font-medium">{overdueCards.length} 張卡片已過期</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
        {/* Column card counts */}
        <div>
          <h3 className="text-xs font-medium text-text-secondary mb-2">各欄卡片數</h3>
          <div className="space-y-1.5">
            {data.columns.filter(c => c.id !== 'archive').map(col => (
              <div key={col.id} className="flex items-center gap-2">
                <span className="text-xs text-text-secondary w-16 truncate">{col.title.replace(/[^\u4e00-\u9fff\w]/g, '')}</span>
                <div className="flex-1 h-4 bg-surface-hover rounded-full overflow-hidden">
                  <div
                    className="h-full bg-p2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(col.cards.length / maxCards) * 100}%`, animationDelay: '0.1s' }}
                  />
                </div>
                <span className="text-xs font-mono text-text-secondary w-6 text-right">{col.cards.length}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority distribution */}
        <div>
          <h3 className="text-xs font-medium text-text-secondary mb-2">優先級分佈</h3>
          <div className="space-y-1.5">
            {(['P0', 'P1', 'P2', 'P3'] as const).map(p => (
              <div key={p} className="flex items-center gap-2">
                <span className="text-xs font-mono text-text-secondary w-6">{p}</span>
                <div className="flex-1 h-4 bg-surface-hover rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(priorityCounts[p] / maxPriority) * 100}%`, backgroundColor: priorityColors[p] }}
                  />
                </div>
                <span className="text-xs font-mono text-text-secondary w-6 text-right">{priorityCounts[p]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-text-secondary text-center">
        共 {allCards.length} 張卡片
      </div>
    </div>
  )
}
