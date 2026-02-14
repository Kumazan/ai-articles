'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useDraggable } from '@dnd-kit/core'
import type { Card } from '@/types/kanban'
import { hapticImpact } from '@/lib/haptic'

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

interface Column {
  id: string
  title: string
  cards: Card[]
}

interface Props {
  card: Card
  onEdit: (card: Card) => void
  onQuickMove?: (card: Card, targetColumnId: string) => void
  onDelete?: (cardId: string) => void
  columns?: Column[]
  currentColumnId?: string
  isKeyboardFocused?: boolean
  labelColors?: Record<string, string>
  batchMode?: boolean
  isSelected?: boolean
  onToggleBatchSelect?: (cardId: string) => void
  isMobile?: boolean
}

export function KanbanCard({ card, onEdit, onQuickMove, onDelete, columns, currentColumnId, isKeyboardFocused, labelColors, batchMode, isSelected, onToggleBatchSelect, isMobile }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    disabled: !!isMobile, // Disable drag on mobile
  })
  const elRef = useRef<HTMLDivElement>(null)
  const [showQuickMenu, setShowQuickMenu] = useState(false)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchMoved = useRef(false)

  useEffect(() => {
    if (isKeyboardFocused && elRef.current) {
      elRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [isKeyboardFocused])

  // Long press for mobile quick move
  const handleTouchStart = useCallback(() => {
    touchMoved.current = false
    longPressTimer.current = setTimeout(() => {
      if (!touchMoved.current) {
        setShowQuickMenu(true)
        hapticImpact('heavy')
      }
    }, 500)
  }, [])

  const handleTouchMove = useCallback(() => {
    touchMoved.current = true
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined

  // Desktop: use drag listeners. Mobile: use touch handlers for long press
  const interactionProps = isMobile
    ? { onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd }
    : { ...listeners, ...attributes }

  return (
    <>
      <div
        ref={(node) => { setNodeRef(node); (elRef as React.MutableRefObject<HTMLDivElement | null>).current = node }}
        style={style}
        {...interactionProps}
        onClick={(e) => {
          if (showQuickMenu) return
          if (batchMode || e.ctrlKey || e.metaKey) {
            e.preventDefault()
            e.stopPropagation()
            onToggleBatchSelect?.(card.id)
          } else {
            onEdit(card)
          }
        }}
        className={`
          group relative bg-surface rounded-xl border px-4 py-3 sm:px-3 sm:py-2.5
          ${isMobile ? '' : 'cursor-grab active:cursor-grabbing'}
          transition-all duration-150 animate-card-in select-none
          ${isDragging ? 'opacity-30 scale-95' : 'hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97] active:shadow-sm'}
          ${isSelected ? 'border-p2 ring-2 ring-p2/40 bg-p2/5' : ''}
          ${isKeyboardFocused
            ? 'border-p2 ring-2 ring-p2/40 shadow-md'
            : !isSelected ? 'border-border hover:border-text-secondary/30' : ''}
        `}
      >
        {/* Top row: priority + title */}
        <div className="flex items-start gap-2">
          <div className={`shrink-0 w-2 h-2 rounded-full mt-1.5 ${priorityDot[card.priority]}`} />
          <span className="text-[15px] sm:text-sm font-medium leading-snug line-clamp-2 flex-1">{card.title}</span>
        </div>

        {/* Batch checkbox */}
        {batchMode && (
          <div className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${isSelected ? 'bg-p2 border-p2 text-white' : 'border-border bg-surface'}`}>
            {isSelected && '✓'}
          </div>
        )}

        {/* Assignee avatar */}
        {card.assignee && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-p2 text-white text-xs flex items-center justify-center font-semibold">
            {card.assignee[0]}
          </div>
        )}

        {/* Labels + priority badge + due date */}
        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
          <span className={`text-xs font-mono font-semibold px-1.5 py-0.5 rounded border ${priorityStyles[card.priority]}`}>
            {card.priority}
          </span>
          {card.dueDate && (() => {
            const now = new Date()
            now.setHours(0,0,0,0)
            const due = new Date(card.dueDate + 'T00:00:00')
            const diff = (due.getTime() - now.getTime()) / (1000*60*60*24)
            const style = diff < 0 ? 'bg-p0/15 text-p0 border-p0/30' : diff <= 3 ? 'bg-p1/15 text-p1 border-p1/30' : 'bg-surface-hover text-text-secondary border-border'
            const label = diff < 0 ? '已過期' : diff === 0 ? '今天' : diff <= 3 ? `${Math.ceil(diff)}天內` : card.dueDate
            return <span className={`text-xs px-1.5 py-0.5 rounded border ${style}`}>📅 {label}</span>
          })()}
          {!!((card as unknown as Record<string, unknown>).prUrl) && (
            <a href={String((card as unknown as Record<string, unknown>).prUrl)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-xs text-p2 bg-p2/10 rounded px-1.5 py-0.5 hover:bg-p2/20 transition-colors">🔗 PR</a>
          )}
          {card.labels.map(label => {
            const colors = { ...DEFAULT_LABEL_COLORS, ...labelColors }
            const color = colors[label] || '#6b7280'
            return (
              <span key={label} className="text-xs text-text-secondary bg-surface-hover rounded px-1.5 py-0.5 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                {label}
              </span>
            )
          })}
        </div>
      </div>

      {/* Combined quick action sheet (mobile long press) */}
      {showQuickMenu && (
        <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in" onClick={() => setShowQuickMenu(false)}>
          <div className="absolute inset-0 bg-overlay" />
          <div className="relative bg-surface rounded-t-2xl border-t border-border shadow-2xl w-full max-w-lg animate-modal-in pb-[max(1.5rem,env(safe-area-inset-bottom))]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1.5 rounded-full bg-border" />
            </div>
            <div className="px-5 pb-3">
              <p className="text-lg font-semibold line-clamp-1">{card.title}</p>
              <p className="text-sm text-text-secondary mt-1">移動到...</p>
            </div>
            <div className="px-4 space-y-1.5">
              {columns?.map(col => {
                const isCurrent = col.id === currentColumnId
                return (
                  <button
                    key={col.id}
                    onClick={() => {
                      if (!isCurrent && onQuickMove) {
                        onQuickMove(card, col.id)
                      }
                      setShowQuickMenu(false)
                    }}
                    disabled={isCurrent}
                    className={`w-full text-left text-sm px-4 py-3 rounded-xl transition-colors flex items-center justify-between ${
                      isCurrent
                        ? 'bg-p2/10 text-p2 font-medium'
                        : 'bg-surface-hover hover:bg-p2/10 hover:text-p2'
                    }`}
                  >
                    <span>{col.title}</span>
                    {isCurrent && <span className="text-xs">← 目前</span>}
                  </button>
                )
              })}
            </div>
            <div className="px-4 mt-3 pt-3 border-t border-border space-y-1.5">
              <button
                onClick={() => { setShowQuickMenu(false); onEdit(card) }}
                className="w-full text-left text-sm px-4 py-3 rounded-xl bg-surface-hover hover:bg-surface-alt transition-colors flex items-center gap-2"
              >
                ✏️ 查看 / 編輯
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false)
                  if (onDelete && confirm('確定要刪除這張卡片嗎？')) {
                    onDelete(card.id)
                  }
                }}
                className="w-full text-left text-sm px-4 py-3 rounded-xl text-p0 hover:bg-p0/10 transition-colors flex items-center gap-2"
              >
                🗑️ 刪除卡片
              </button>
            </div>
            <button
              onClick={() => setShowQuickMenu(false)}
              className="w-full text-center text-sm text-text-secondary mt-2 py-3 hover:bg-surface-hover transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </>
  )
}
