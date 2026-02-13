'use client'

import { useDroppable } from '@dnd-kit/core'
import type { Column, Card } from '@/types/kanban'
import { KanbanCard } from './kanban-card'

const accentColors: Record<string, string> = {
  todo: 'bg-gray-400',
  ongoing: 'bg-blue-500',
  review: 'bg-amber-500',
  done: 'bg-green-500',
  archive: 'bg-slate-500',
}

interface Props {
  column: Column
  collapsed: boolean
  isFocused: boolean
  focusedCardIndex: number
  onToggleCollapse: () => void
  onAddCard: () => void
  onEditCard: (card: Card) => void
  filterCard?: (card: Card) => boolean
  labelColors?: Record<string, string>
  batchMode?: boolean
  selectedCardIds?: Set<string>
  onToggleBatchSelect?: (cardId: string) => void
}

export function KanbanColumn({ column, collapsed, isFocused, focusedCardIndex, onToggleCollapse, onAddCard, onEditCard, filterCard, labelColors, batchMode, selectedCardIds, onToggleBatchSelect }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const accent = accentColors[column.id] || 'bg-gray-400'

  if (collapsed) {
    return (
      <div className="shrink-0 w-8 sm:w-10 border-r border-border bg-surface-alt flex flex-col items-center pt-3 cursor-pointer hover:bg-surface-hover transition-colors snap-start"
        onClick={onToggleCollapse}>
        <span className="text-xs text-text-secondary [writing-mode:vertical-lr] tracking-wider">
          {column.title} ({column.cards.length})
        </span>
      </div>
    )
  }

  return (
    <div className={`shrink-0 w-[85vw] sm:w-72 md:w-64 lg:w-80 border-r border-border flex flex-col bg-surface-alt/50 last:border-r-0 snap-start transition-all duration-200`}>
      {/* Accent bar */}
      <div className={`h-1 ${accent} ${isFocused ? 'opacity-100' : 'opacity-40'} transition-opacity duration-200`} />

      {/* Column header */}
      <div className={`px-4 py-2.5 sm:px-3 sm:py-2 flex items-center justify-between border-b border-border transition-colors duration-200 ${isFocused ? 'bg-surface-hover' : 'bg-surface-alt'}`}>
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <span className="text-base sm:text-sm font-medium">{column.title}</span>
          <span className="text-sm sm:text-xs text-text-secondary bg-surface-hover rounded-full px-2 py-0.5 tabular-nums">
            {column.cards.length}
          </span>
        </button>
        <button
          onClick={onAddCard}
          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-surface-hover active:scale-90 text-text-secondary hover:text-text transition-all text-2xl sm:text-lg leading-none"
          title="新增卡片"
        >
          +
        </button>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto px-3 py-3 sm:p-2 space-y-3 sm:space-y-1.5 transition-colors ${isOver ? 'bg-surface-hover/50' : ''}`}
      >
        {(() => {
          const filtered = filterCard ? column.cards.filter(filterCard) : column.cards
          return (
            <>
              {filtered.map((card, idx) => (
                <KanbanCard
                  key={card.id}
                  card={card}
                  onEdit={onEditCard}
                  isKeyboardFocused={isFocused && focusedCardIndex === idx}
                  labelColors={labelColors}
                  batchMode={batchMode}
                  isSelected={selectedCardIds?.has(card.id)}
                  onToggleBatchSelect={onToggleBatchSelect}
                />
              ))}
              {filtered.length === 0 && column.cards.length > 0 && filterCard && (
                <div className="text-center text-xs text-text-secondary/50 py-8">
                  無符合條件的卡片
                </div>
              )}
              {column.cards.length === 0 && (
                <div className="text-center text-xs text-text-secondary/50 py-8">
                  拖曳卡片到此處
                </div>
              )}
            </>
          )
        })()}
      </div>
    </div>
  )
}
