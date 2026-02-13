'use client'

import { useEffect, useRef } from 'react'
import { useDraggable } from '@dnd-kit/core'
import type { Card } from '@/types/kanban'

const priorityStyles: Record<string, string> = {
  P0: 'bg-p0/15 text-p0 border-p0/30',
  P1: 'bg-p1/15 text-p1 border-p1/30',
  P2: 'bg-p2/15 text-p2 border-p2/30',
  P3: 'bg-p3/15 text-p3 border-p3/30',
}

const priorityDot: Record<string, string> = {
  P0: 'bg-p0',
  P1: 'bg-p1',
  P2: 'bg-p2',
  P3: 'bg-p3',
}

const DEFAULT_LABEL_COLORS: Record<string, string> = {
  '前端': '#3b82f6', '後端': '#10b981', 'UI': '#a855f7',
  'Bug': '#ef4444', '功能': '#f59e0b', '優化': '#06b6d4',
}

interface Props {
  card: Card
  onEdit: (card: Card) => void
  isKeyboardFocused?: boolean
  labelColors?: Record<string, string>
}

export function KanbanCard({ card, onEdit, isKeyboardFocused, labelColors }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  })
  const elRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isKeyboardFocused && elRef.current) {
      elRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [isKeyboardFocused])

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined

  return (
    <div
      ref={(node) => { setNodeRef(node); (elRef as React.MutableRefObject<HTMLDivElement | null>).current = node }}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onEdit(card)}
      className={`
        group bg-surface rounded-xl sm:rounded-lg border px-5 py-5 sm:px-3 sm:py-2.5 cursor-grab active:cursor-grabbing
        transition-all duration-150 animate-card-in
        ${isDragging ? 'opacity-30 scale-95' : 'hover:shadow-md hover:-translate-y-0.5'}
        ${isKeyboardFocused
          ? 'border-p2 ring-2 ring-p2/40 shadow-md'
          : 'border-border hover:border-text-secondary/30'}
      `}
    >
      {/* Top row: priority + title */}
      <div className="flex items-start gap-3 sm:gap-2">
        <div className={`shrink-0 w-2.5 h-2.5 sm:w-1.5 sm:h-1.5 rounded-full mt-1.5 ${priorityDot[card.priority]}`} />
        <span className="text-base sm:text-sm font-medium leading-snug line-clamp-2 flex-1">{card.title}</span>
      </div>

      {/* Labels + priority badge + due date */}
      <div className="flex items-center gap-2.5 sm:gap-1.5 mt-3.5 sm:mt-2 flex-wrap">
        <span className={`text-xs sm:text-[10px] font-mono font-semibold px-2 py-1 sm:px-1.5 sm:py-0.5 rounded border ${priorityStyles[card.priority]}`}>
          {card.priority}
        </span>
        {card.dueDate && (() => {
          const now = new Date()
          now.setHours(0,0,0,0)
          const due = new Date(card.dueDate + 'T00:00:00')
          const diff = (due.getTime() - now.getTime()) / (1000*60*60*24)
          const style = diff < 0 ? 'bg-p0/15 text-p0 border-p0/30' : diff <= 3 ? 'bg-p1/15 text-p1 border-p1/30' : 'bg-surface-hover text-text-secondary border-border'
          const label = diff < 0 ? '已過期' : diff === 0 ? '今天' : diff <= 3 ? `${Math.ceil(diff)}天內` : card.dueDate
          return <span className={`text-xs sm:text-[10px] px-2 py-1 sm:px-1.5 sm:py-0.5 rounded border ${style}`}>📅 {label}</span>
        })()}
        {card.labels.map(label => {
          const colors = { ...DEFAULT_LABEL_COLORS, ...labelColors }
          const color = colors[label] || '#6b7280'
          return (
            <span key={label} className="text-xs sm:text-[10px] text-text-secondary bg-surface-hover rounded px-2 py-1 sm:px-1.5 sm:py-0.5 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
